from fastapi.middleware.cors import CORSMiddleware


def add_cors_middleware(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True, # Replace "*" with your React app URL in production
        allow_methods=["*"],
        allow_headers=["*"],
    )
