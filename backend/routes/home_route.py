from fastapi import APIRouter
from controllers.home_controller import check_db_connection

router = APIRouter()

@router.get("/")
def read_root():
    return check_db_connection()
