import json
import os
from crewai import Task, Crew
from agents.agents import agent_stock, agent_production, agent_machine, agent_rh, agent_synthese
from utils.verifier_disponibilite_stock import verifier_disponibilite_stock
from config.database import mydb

def sauvegarder_resultats_agents(commande_id, reponses_agents, chemin_fichier='historique_commandes.json'):
    historique = {}
    if os.path.exists(chemin_fichier):
        try:
            with open(chemin_fichier, 'r', encoding='utf-8') as f:
                contenu = f.read().strip()
                if contenu:
                    historique = json.loads(contenu)
        except json.JSONDecodeError:
            historique = {}

    historique[commande_id] = reponses_agents

    with open(chemin_fichier, 'w', encoding='utf-8') as f:
        json.dump(historique, f, ensure_ascii=False, indent=4)

def extraire_statut(synthese_text):
    # On s'assure que c'est bien un CrewOutput
    if hasattr(synthese_text, "output"):
        synthese_lower = synthese_text.output.lower()
    else:
        synthese_lower = str(synthese_text).lower()

    if "commande réalisable : oui" in synthese_lower:
        return "validée"
    elif "commande réalisable : en production" in synthese_lower:
        return "en_production"
    elif "commande réalisable : en attente" in synthese_lower:
        return "en_attente"
    else:
        return "rejetée"


def run_agent(commande_data):
    lignes_text = ""
    infos_stock = []

    for ligne in commande_data["lignes"]:
        piece_id = ligne["piece_id"]
        quantite = ligne["quantite_demandee"]
        lignes_text += f"- Pièce: {piece_id}, Quantité: {quantite}\n"
        result = verifier_disponibilite_stock(piece_id, quantite)
        infos_stock.append(result)

    stock_report = "\n".join(infos_stock)

    # Agent Stock
    task_stock = Task(
        description=(
            f"Commande ID: {commande_data['id_commande']}\n"
            f"Lignes de commande:\n{lignes_text}\n"
            f"Analyse disponibilité pièces :\n{stock_report}\n\n"
            "Réponds : OUI/NON + justification courte (2 phrases max)."
        ),
        expected_output="Format : Pièce: [ID] - OUI/NON - Justification",
        agent=agent_stock
    )
    crew_stock = Crew(agents=[agent_stock], tasks=[task_stock], verbose=True)
    result_stock = crew_stock.kickoff()

    # Agent Production
    task_production = Task(
        description=(
            f"Résultat du stock :\n{result_stock}\n\n"
            "Peux-tu assurer la production dans les délais avec les ressources actuelles ?\n"
            "Réponds : OUI/NON + justification courte."
        ),
        expected_output="Réponse : OUI/NON\nJustification : ...",
        agent=agent_production
    )
    crew_prod = Crew(agents=[agent_production], tasks=[task_production], verbose=True)
    result_production = crew_prod.kickoff()

    # Agent Machine
    task_machine = Task(
        description=(
            f"Plan de production proposé :\n{result_production}\n\n"
            "Les machines nécessaires sont-elles disponibles et prêtes ?\n"
            "Réponds : OUI/NON + justification courte."
        ),
        expected_output="Réponse : OUI/NON\nJustification : ...",
        agent=agent_machine
    )
    crew_machine = Crew(agents=[agent_machine], tasks=[task_machine], verbose=True)
    result_machine = crew_machine.kickoff()

    # Agent RH
    task_rh = Task(
        description=(
            f"Commande ID: {commande_data['id_commande']}\n"
            f"Date livraison prévue: {commande_data['date_livraison_prevue']}\n"
            f"Lignes :\n{lignes_text}\n\n"
            f"Plan production proposé :\n{result_production}\n\n"
            "Évaluer si ressources humaines suffisantes (employés, compétences, dispo).\n"
            "Réponds : OUI/NON + justification courte."
        ),
        expected_output="Réponse : OUI/NON\nJustification : ...",
        agent=agent_rh
    )
    crew_rh = Crew(agents=[agent_rh], tasks=[task_rh], verbose=True)
    result_rh = crew_rh.kickoff()

    # Agent Synthèse
    task_synthese = Task(
    description=(
        "Voici les résultats des autres agents :\n"
        f"- Stock : {result_stock}\n"
        f"- Production : {result_production}\n"
        f"- Machine : {result_machine}\n"
        f"- RH : {result_rh}\n\n"
        "Fais une synthèse claire en 5 lignes maximum.\n"
        "Conclue impérativement par une phrase sous cette forme (exactement) :\n"
        "\"Commande réalisable : OUI\", \"Commande réalisable : NON\", ou \"Commande réalisable : EN PRODUCTION\".\n"
        "Ajoute une justification courte (1 phrase max) expliquant ta conclusion.\n"
        "Ne réponds que par la synthèse et la conclusion, sans autre texte."
    ),
    expected_output="Synthèse + Conclusion (Commande réalisable : OUI/NON/EN PRODUCTION + justification)",
    agent=agent_synthese
)

    crew_synthese = Crew(agents=[agent_synthese], tasks=[task_synthese], verbose=True)
    result_final = crew_synthese.kickoff()

    reponses_agents = {
        "stock": str(result_stock),
        "production": str(result_production),
        "machine": str(result_machine),
        "rh": str(result_rh),
        "synthese": str(result_final)
    }

    statut = extraire_statut(result_final)
    reponses_agents['statut'] = statut

    # Mise à jour base de données
    with mydb.cursor() as cursor:
        sql = "UPDATE commande SET synthese_resultat = %s, statut = %s WHERE id_commande = %s"
        cursor.execute(sql, (json.dumps(reponses_agents, ensure_ascii=False), statut, commande_data['id_commande']))
        mydb.commit()

    # Sauvegarde dans fichier JSON
    sauvegarder_resultats_agents(commande_data['id_commande'], reponses_agents)

    return result_final
