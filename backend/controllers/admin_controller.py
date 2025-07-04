from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import bcrypt
from config.database import mydb  
from models.admin_model import User, StatusUpdate
from utils.password import generate_password
from utils.email import envoyer_email

app = FastAPI()


@app.post("/add_user")
def add_user(user: User):
    try:
        email_clean = user.email.strip().lower()
        print(f"Email reçu : '{email_clean}'")

        cursor = mydb.cursor()

       
        cursor.execute("SELECT id FROM users WHERE LOWER(TRIM(email)) = %s", (email_clean,))
        result = cursor.fetchone()
        print("Résultat SELECT :", result)

        if result:
            raise HTTPException(status_code=400, detail="Cet email est déjà utilisé. Veuillez en choisir un autre.")

      
        password = generate_password()
        print("Mot de passe généré :", password)
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

  
        cursor.execute("""
    INSERT INTO users (
        firstname, lastname, email, phone, address,
        date_naissance, role, password, statue
    )
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
""", (
    user.firstname, user.lastname, email_clean, user.phone,
    user.address, user.date_naissance, user.role,
    hashed_password, "bloqué"
))
        mydb.commit()
        print("Utilisateur inséré.")

        #  Envoi d'email
        envoyer_email(
            to_email=email_clean,
            subject="Création de votre compte",
            content_text=f"""
Bonjour {user.firstname},

Votre compte a été créé avec succès.

Votre mot de passe : {password}
Veuillez le changer lors de votre première connexion.
""",
            content_html=f"""
<html>
  <body style="margin:0; padding:0; font-family: Roboto, Arial, sans-serif; background-color: #f4f4f4;">
    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 30px auto; background-color: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 30px;">

          <h2 style="color: #1976d2; font-size: 24px; font-weight: 500; margin-bottom: 16px;">
            Bienvenue {user.firstname} 👋
          </h2>

          <p style="font-size: 16px; color: #333;">
            Votre compte a été <strong>créé avec succès</strong>.
          </p>

          <p style="font-size: 16px; color: #333;">
            Voici votre mot de passe temporaire :
          </p>

          <div style="margin: 20px 0; padding: 15px; background-color: #e3f2fd; border-left: 4px solid #1976d2; font-size: 18px; font-weight: bold; color: #0d47a1;">
            {password}
          </div>

          <p style="font-size: 15px; color: #444;">
            Veuillez le changer lors de votre première connexion pour sécuriser votre compte.
          </p>

          <a href="https://tonsite.com/login" style="display: inline-block; margin-top: 25px; background-color: #1976d2; color: white; padding: 12px 20px; border-radius: 4px; text-decoration: none; font-weight: 500;">
            Se connecter
          </a>

          <p style="font-size: 13px; color: #888; margin-top: 40px;">
            Merci,<br>L'équipe de gestion
          </p>

        </td>
      </tr>
    </table>
  </body>
</html>
"""
        )

        print("Email envoyé.")

        return {"message": "Utilisateur ajouté et email envoyé."}

    except HTTPException as e:
        print("Erreur HTTP:", e.detail)
        raise e
    except Exception as e:
        print("Erreur interne:", str(e))
        mydb.rollback()
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {str(e)}")

@app.get("/fetch_user")
def get_all_users():
    cursor = mydb.cursor()
    cursor.execute("SELECT * FROM users")

    columns = [desc[0] for desc in cursor.description]
    rows = cursor.fetchall()
    users = [dict(zip(columns, row)) for row in rows]

    return users

@app.delete("/delete_user/{user_id}")
def delete_user(user_id: int):
    try:
        cursor = mydb.cursor()
        cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
        mydb.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        return {"message": "Utilisateur supprimé avec succès."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")

    
@app.put("/update_user/{user_id}")

def update_user(user_id: int, user: User):
    print(f"Tentative de suppression de l'utilisateur {user_id}")
    try:
        cursor = mydb.cursor()
        cursor.execute(
            """
            UPDATE users
            SET firstname=%s, lastname=%s, email=%s, phone=%s,
                address=%s, date_naissance=%s, role=%s
            WHERE id=%s
            """,
            (
                user.firstname, user.lastname, user.email,
                user.phone, user.address, user.date_naissance,
                user.role, user_id
            )
        )
        mydb.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        return {"message": "Utilisateur modifié avec succès."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")
    

@app.put("/update_user_status/{user_id}")
def update_user_status(user_id: int, status_update: StatusUpdate):
    statue = status_update
    if not statue:
        raise HTTPException(status_code=400, detail="Le statut est requis")
    
    try:
        cursor = mydb.cursor()
        cursor.execute("UPDATE users SET statue = %s WHERE id = %s", (statue, user_id))
        mydb.commit()
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
        
        return {"message": "Le statut de l'utilisateur a été mis à jour avec succès"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur: {str(e)}")
    
    finally:
        cursor.close()

        