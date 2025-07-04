from fastapi import HTTPException
from config.database import mydb
from datetime import datetime, date, timedelta
import uuid
from models.commande_model import CommandeRequest
from utils.email import envoyer_email
import json


def creer_commande_controller(commande: CommandeRequest):
    if not commande.lignes:
        raise HTTPException(status_code=400, detail="La commande doit contenir au moins une pièce.")

    try:
        if isinstance(commande.date_livraison_prevue, str):
            date_livraison = datetime.strptime(commande.date_livraison_prevue, "%Y-%m-%d").date()
        elif isinstance(commande.date_livraison_prevue, date):
            date_livraison = commande.date_livraison_prevue
        else:
            raise ValueError()
    except Exception:
        raise HTTPException(status_code=400, detail="Format de date de livraison invalide, attendu AAAA-MM-JJ.")

    aujourd_hui = date.today()

    if date_livraison < aujourd_hui:
        raise HTTPException(status_code=400, detail="La date de livraison prévue ne peut pas être dans le passé.")
    if date_livraison < aujourd_hui + timedelta(days=3):
        raise HTTPException(status_code=400, detail="La date de livraison doit être au moins à 3 jours à partir d'aujourd'hui.")

    try:
        id_commande = str(uuid.uuid4())
        reference_commande = f"CMD-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        date_commande = aujourd_hui
        statut = "en_attente"

        lignes_details = []

        with mydb.cursor(dictionary=True) as cursor:
            cursor.execute(
                """
                INSERT INTO commande 
                (id_commande, reference_commande, client_nom, email_client, date_commande, date_livraison_prevue, statut, created_at) 
                VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                """,
                (id_commande, reference_commande, commande.client_nom, commande.email_client, date_commande, date_livraison, statut)
            )

            for ligne in commande.lignes:
                cursor.execute(
                    """
                    INSERT INTO ligne_commande (id_commande, pieces, quantite_commandee) 
                    VALUES (%s, %s, %s)
                    """,
                    (id_commande, ligne.piece_id, ligne.quantite_demandee)
                )

                # Récupération du nom de pièce pour email
                cursor.execute("SELECT nom_piece FROM stock WHERE piece_id = %s", (ligne.piece_id,))
                piece_result = cursor.fetchone()
                nom_piece = piece_result["nom_piece"] if piece_result else "Inconnu"

                lignes_details.append({
                    "nom_piece": nom_piece,
                    "quantite": ligne.quantite_demandee
                })

        mydb.commit()

        return {
            "message": "Commande créée avec succès",
            "id_commande": id_commande,
            "reference_commande": reference_commande,
        }

    except Exception as e:
        mydb.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")


def finaliser_commande_controller(id_commande: str, resultat_agents: dict):
    try:
        with mydb.cursor(dictionary=True) as cursor:
            # Récupérer la commande
            cursor.execute("SELECT * FROM commande WHERE id_commande = %s", (id_commande,))
            commande = cursor.fetchone()
            if not commande:
                raise HTTPException(status_code=404, detail="Commande non trouvée")

            # Récupérer les lignes associées
            cursor.execute("""
                SELECT lc.pieces, lc.quantite_commandee, s.nom_piece 
                FROM ligne_commande lc
                LEFT JOIN stock s ON lc.pieces = s.piece_id
                WHERE lc.id_commande = %s
            """, (id_commande,))
            lignes = cursor.fetchall()

            # Mise à jour commande : synthese_resultat + statut
            cursor.execute("""
                UPDATE commande
                SET synthese_resultat = %s, statut = %s
                WHERE id_commande = %s
            """, (json.dumps(resultat_agents), "confirmée", id_commande))

        mydb.commit()

        lignes_html = "".join([
            f"<tr><td>{l['nom_piece']}</td><td>{l['quantite_commandee']}</td></tr>"
            for l in lignes
        ])

        html_content = f"""
        <html>
            <body>
                <h2>Commande confirmée</h2>
                <p>Bonjour <strong>{commande['client_nom']}</strong>,</p>
                <p>Votre commande <strong>{commande['reference_commande']}</strong> a été confirmée.</p>
                <p><strong>Date de livraison prévue :</strong> {commande['date_livraison_prevue'].strftime('%d/%m/%Y')}</p>
                <h3>Détails des pièces :</h3>
                <table border="1" cellpadding="6" cellspacing="0">
                    <tr><th>Nom de la pièce</th><th>Quantité</th></tr>
                    {lignes_html}
                </table>
                <h3>Résultat des agents :</h3>
                <pre>{json.dumps(resultat_agents, indent=2, ensure_ascii=False)}</pre>
                <p>Merci pour votre confiance.</p>
            </body>
        </html>
        """

        text_content = (
            f"Bonjour {commande['client_nom']},\n\n"
            f"Votre commande {commande['reference_commande']} a été confirmée.\n"
            f"Date de livraison prévue : {commande['date_livraison_prevue'].strftime('%d/%m/%Y')}\n\n"
            f"Détails des pièces :\n" +
            "\n".join([f"- {l['nom_piece']}: {l['quantite_commandee']}" for l in lignes]) +
            "\n\nRésultat des agents :\n" + json.dumps(resultat_agents, indent=2, ensure_ascii=False) +
            "\n\nMerci pour votre confiance."
        )

        envoyer_email(
            to_email=commande["email_client"],
            subject=f"Commande confirmée - {commande['reference_commande']}",
            content_text=text_content,
            content_html=html_content
        )

        return {"message": "Commande finalisée et email envoyé avec succès."}

    except Exception as e:
        mydb.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la finalisation : {str(e)}")


def get_commandes_controller():
    try:
        with mydb.cursor(dictionary=True) as cursor:
            cursor.execute("""
                SELECT 
                    c.id_commande,
                    c.reference_commande,
                    c.client_nom,
                    c.date_commande,
                    c.date_livraison_prevue,
                    c.statut,
                    lc.pieces,
                    s.nom_piece,
                    c.synthese_resultat,
                    lc.quantite_commandee
                FROM 
                    commande c
                LEFT JOIN 
                    ligne_commande lc ON c.id_commande = lc.id_commande
                LEFT JOIN
                    stock s ON lc.pieces = s.piece_id
                ORDER BY 
                    c.created_at DESC;
            """)
            rows = cursor.fetchall()

        commandes_map = {}

        for row in rows:
            id_cmd = row['id_commande']
            if id_cmd not in commandes_map:
                commandes_map[id_cmd] = {
                    "id": id_cmd,
                    "reference": row['reference_commande'],
                    "client": row['client_nom'],
                    "date_commande": row['date_commande'].isoformat() if row['date_commande'] else None,
                    "date_livraison": row['date_livraison_prevue'].isoformat() if row['date_livraison_prevue'] else None,
                    "statut": row['statut'],
                    "synthese_resultat": json.loads(row['synthese_resultat']) if row['synthese_resultat'] else None,
                    "lignes": []
                }

            if row['pieces']:
                commandes_map[id_cmd]["lignes"].append({
                    "pieces": row['pieces'],
                    "nom_piece": row['nom_piece'],
                    "quantite_commandee": row['quantite_commandee']
                })

        return list(commandes_map.values())

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération : {str(e)}")
