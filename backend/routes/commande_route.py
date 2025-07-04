from fastapi import APIRouter, BackgroundTasks
from models.commande_model import CommandeRequest
from controllers.commande_controller import creer_commande_controller,get_commandes_controller
from config.crew_config import run_agent

router = APIRouter()








@router.post("/commande")
def creer_commande(commande: CommandeRequest, background_tasks: BackgroundTasks):
    response = creer_commande_controller(commande)

    if response.get("id_commande"):
        commande_data = {
            "id_commande": response["id_commande"],
            "reference_commande": response["reference_commande"],
            "client_nom": commande.client_nom,
            "date_livraison_prevue": str(commande.date_livraison_prevue),
            "lignes": [ligne.dict() for ligne in commande.lignes],
        }

        # Exécuter les agents en tâche de fond
        background_tasks.add_task(run_agent, commande_data)
        
    return response  # Renvoie directement sans attendre les agents


@router.get("/commandes")
def get_commandes():
    return get_commandes_controller()