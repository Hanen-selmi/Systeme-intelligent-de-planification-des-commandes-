from fastapi import APIRouter, HTTPException, Path
from pydantic import BaseModel
from controllers.admin_controller import get_all_users, add_user, delete_user, update_user, update_user_status
from models.admin_model import User,StatusUpdate
router = APIRouter()

@router.get("/fetch_user")
def read_users():
    return get_all_users()

@router.post("/add_user")
def create_user(user: User):
    return add_user(user)

@router.delete("/delete_user/{user_id}")
def delete_users(user_id: int):
    return delete_user(user_id)

@router.put("/update_user/{user_id}")
def update_users(user_id: int, user: User):
    return update_user(user_id, user)



@router.put("/update_user_status/{user_id}")
def update_status(user_id: int, status_update: StatusUpdate):
    return update_user_status(user_id, status_update.statue)
