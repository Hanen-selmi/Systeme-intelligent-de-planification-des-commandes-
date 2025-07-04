from controllers.authcontroller import register,login
from models.auth_models import RegisterUser,LoginUser
from fastapi import APIRouter
router = APIRouter()

@router.post("/register")
def register_route(user: RegisterUser):
    return  register(user)

# ✅ Nouvelle route : login
@router.post("/login")
def login_route(user: LoginUser):
    return login(user)
