from pydantic import BaseModel, EmailStr
# Pydantic models
class RegisterUser(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    phone: str
    address: str
    date_naissance: str  # string (YYYY-MM-DD)
    role: str
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str