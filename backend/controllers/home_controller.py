from config.database import mydb

def check_db_connection():
    try:
        cursor = mydb.cursor()
        cursor.execute("SELECT 1")
        result = cursor.fetchone()
        return {"status": "Database connected", "result": result}
    except Exception as e:
        return {"status": "Database connection error", "error": str(e)}
