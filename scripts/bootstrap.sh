#!/bin/bash

echo "######################### Setting up project locally... #########################"

echo "######################### Setting up root #########################"

echo "Setting up root venv..."

if [ ! -d ".venv-root" ]; then
    echo "Creating root venv..."
    python3 -m venv .venv-root
fi

echo "Installing root dependencies..."

source .venv-root/bin/activate
pip install -r requirements.txt

echo "hooking up precommit hooks..."
pre-commit install
deactivate

echo "######################### Setting up backend #########################"

cd backend

if [ ! -d ".venv-backend" ]; then
    echo "Creating backend venv..."
    python3 -m venv .venv-backend
fi

echo "Installing dependencies..."
source .venv-backend/bin/activate
pip install -r requirements.txt
deactivate

echo "######################### Setting up frontend #########################"

echo "Installing dependencies..."
cd ../frontend && npm install

echo "######################### Starting up project #########################"

cd ..

docker compose up --build
