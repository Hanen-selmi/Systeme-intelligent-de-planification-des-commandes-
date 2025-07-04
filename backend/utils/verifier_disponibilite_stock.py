from config.database import mydb

def verifier_disponibilite_stock(piece_id: str, quantite_demandee: int) -> str:
    cursor = mydb.cursor(dictionary=True)

    query = "SELECT quantite FROM stock WHERE piece_id = %s"
    cursor.execute(query, (piece_id,))
    stock = cursor.fetchone()

    if stock is None:
        return f"❌ Pièce {piece_id} : non trouvée dans le stock."

    quantite_stock = stock["quantite"]

    if quantite_stock >= quantite_demandee:
        return f"✅ Pièce {piece_id} : Disponible"
    elif quantite_stock == 0:
        return f"❌ Pièce {piece_id} : Rupture de stock"
    else:
        return f"⚠️ Pièce {piece_id} : Quantité demandée non disponible (Stock: {quantite_stock})"
