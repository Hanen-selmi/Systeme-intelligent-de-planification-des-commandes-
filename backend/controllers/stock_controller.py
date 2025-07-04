from config.database import mydb

def get_all_pieces():
    cursor = mydb.cursor(dictionary=True)  # Pour avoir un dict au lieu d’un tuple
    cursor.execute("SELECT piece_id, nom_piece FROM stock")  # adapte les champs à ta table
    results = cursor.fetchall()
    cursor.close()
    return results

    
        