#!/bin/bash

echo "######################### Setting up project locally... #########################"

echo "######################### Setting up root #########################"

echo "Setting up root venv..."

if [ ! -d ".venv-root" ]; then
    echo "Creating root venv..."
    python -m venv .venv-root
fi

echo "Installing root dependencies..."

pip install -r requirements.txt

echo "hooking up precommit hooks..."
source .venv-root/bin/activate && pre-commit install

echo "######################### Setting up backend #########################"

cd backend

if [ ! -d ".venv-backend" ]; then
    echo "Creating backend venv..."
    python -m venv .venv-backend
fi

echo "Installing dependencies..."
source .venv-backend/bin/activate && pip install -r requirements.txt

echo "######################### Setting up frontend #########################"

echo "Installing dependencies..."
cd ../frontend && npm install

echo "######################### Starting up project #########################"

cd ..

docker compose up --build
