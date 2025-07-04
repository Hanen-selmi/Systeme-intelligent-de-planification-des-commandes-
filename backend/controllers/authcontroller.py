from fastapi import APIRouter, HTTPException, Depends

from config.database import mydb
from config.auth_config import create_access_token
from models.auth_models import RegisterUser,LoginUser
import bcrypt
router = APIRouter()


@router.post("/register")
def register(user: RegisterUser):
    try:
        cursor = mydb.cursor()
        cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
        existing_user = cursor.fetchone()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email déjà utilisé")

        # 🔐 Hachage du mot de passe
        hashed_password = bcrypt.hashpw(user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

        # ✅ Insertion de l'utilisateur avec mot de passe haché
        cursor.execute("""
            INSERT INTO users (
                firstname, lastname, email, phone, address,
                date_naissance, role, password, statue
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user.firstname, user.lastname, user.email, user.phone,
            user.address, user.date_naissance, user.role,
            hashed_password, "bloqué"
        ))
        mydb.commit()

        return {"message": "Utilisateur enregistré avec succès"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")
    finally:
        cursor.close()

@router.post("/login")
def login(user: LoginUser):
    try:
        cursor = mydb.cursor()
        cursor.execute("""
            SELECT id, firstname, lastname, email, password, role, statue 
            FROM users 
            WHERE email = %s
        """, (user.email,))
        db_user = cursor.fetchone()

        if not db_user:
            raise HTTPException(status_code=400, detail="Email incorrect")

        user_id, firstname, lastname, email, db_password, role, statue = db_user

        #  Vérification mot de passe hashé
        if not bcrypt.checkpw(user.password.encode("utf-8"), db_password.encode("utf-8")):
            raise HTTPException(status_code=400, detail="Mot de passe incorrect")

        #  Génération du token
        token = create_access_token(data={
            "sub": email,
            "user_id": user_id,
            "role": role,
            "statue": statue,
            "firstname": firstname,
            "lastname": lastname
        })

        return {"access_token": token, "token_type": "bearer"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur serveur : {e}")
    finally:
        cursor.close()
