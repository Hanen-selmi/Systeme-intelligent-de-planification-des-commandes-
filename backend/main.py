from fastapi import FastAPI, HTTPException
from routes import admin_route, auth_route, stock_route,commande_route
from middleware import add_cors_middleware
from routes import chatbot_route


app = FastAPI()
add_cors_middleware(app)
app.include_router(chatbot_route.router)
app.include_router(admin_route.router)
app.include_router(auth_route.router)
app.include_router(stock_route.router)
app.include_router(commande_route.router)

