from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def setup_cors(app: FastAPI, environment: str):
    if environment == "local":
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    elif environment == "production":
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[
                "https://photo-palettes-frontend-bb66abc40c21.herokuapp.com",
                "https://photopalettes.com",
                ],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    else:
        raise ValueError("Invalid environment") 