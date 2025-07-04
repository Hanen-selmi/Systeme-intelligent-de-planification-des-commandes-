import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from utils.email import envoyer_email

if __name__ == "__main__":
    envoyer_email(
        to_email="tt5828567@gmail.com",
        subject="Test avec .env",
        content="Mail envoyé depuis FastAPI avec mot de passe protégé via .env ✅"
    )
