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
make set-ip

echo "######################### Manual Setup #########################"

echo "1. Set up your environment variables in frontend"
echo "2. Set up your environment variables in backend"
echo "3. Run 'docker compose up --build' to start the services."
echo "4. Run database migrations cd backend && make development-migrate"
echo "5. Grab passwords from Proton pass and populate tests/.env.test then login with both accounts to populate DB and set permission_level in DB to 2 for moderator."
