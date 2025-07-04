from fastapi import APIRouter
from pydantic import BaseModel
from controllers.chatbot_controller import get_chatbot_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat(request: ChatRequest):
    response = get_chatbot_response(request.message)
    return {"response": response}
