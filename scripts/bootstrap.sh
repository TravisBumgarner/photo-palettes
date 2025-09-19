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
cd ..

echo "######################### Setting up frontend #########################"

echo "Installing dependencies..."
cd frontend && npm install
cd ..

echo "######################### Setting up Common #########################"

cd common

if [ ! -d ".venv-common" ]; then
    echo "Creating common venv..."
    python3 -m venv .venv-common
fi

echo "Installing dependencies..."
source .venv-common/bin/activate
pip install -r requirements.txt
deactivate
cd ..

echo "######################### Setting up Database #########################"

cd common

if [ ! -d ".venv-database" ]; then
    echo "Creating database venv..."
    python3 -m venv .venv-database
fi

echo "Installing dependencies..."
source .venv-database/bin/activate
pip install -r requirements.txt
deactivate
cd ..

echo "######################### Setting up image-worker #########################"

cd common

if [ ! -d ".venv-image-worker" ]; then
    echo "Creating image-worker venv..."
    python3 -m venv .venv-image-worker
fi

echo "Installing dependencies..."
source .venv-image-worker/bin/activate
pip install -r requirements.txt
deactivate
cd ..


echo "######################### Manual Setup #########################"

echo "1. Configure backend/.env and backend/.env.prod with values from Heroku"
echo "2. Configure backend/tests/.env with values from ProtonPass"
echo "3. Run 'make up' to start the services."
echo "4. Run database migrations cd backend && make development-migrate"
echo "5. Login with both test users so their credentials get populated, set the moderator flag in the database."
