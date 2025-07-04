from pydantic import BaseModel, EmailStr
from datetime import date
# Modèle de données reçu en POST
class User(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    phone: str
    address: str
    date_naissance: date
    role: str
class StatusUpdate(BaseModel):
    statue: str