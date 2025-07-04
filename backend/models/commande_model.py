from pydantic import BaseModel, Field,EmailStr
from typing import List
from datetime import date

class LigneCommande(BaseModel):
    piece_id: str = Field(..., description="ID de la pièce")
    quantite_demandee: int = Field(..., gt=0)

class CommandeRequest(BaseModel):
    client_nom: str = Field(..., min_length=1)
    date_livraison_prevue: date
    lignes: List[LigneCommande]
    email_client: EmailStr  
