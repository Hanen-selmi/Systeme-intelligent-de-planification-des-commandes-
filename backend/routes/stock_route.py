from fastapi import APIRouter
from controllers.stock_controller import get_all_pieces

router = APIRouter()

@router.get("/pieces")
def get_pieces():
    return get_all_pieces()
