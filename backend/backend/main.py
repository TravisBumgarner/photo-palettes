from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import config

app = FastAPI()
if config.environment == "local":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
elif config.environment == "production":
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["https://photo-palettes-frontend-bb66abc40c21.herokuapp.com"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    raise ValueError("Invalid environment")


@app.get("/")
def read_root():
    return {"Hello": "World!"}


@app.get("/config")
def read_config():
    return config


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

