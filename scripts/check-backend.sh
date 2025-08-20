#!/bin/bash


# Exit on error
set -e

cd backend

echo "Activating virtual environment..."
if [ ! -d ".venv-backend" ]; then
    echo "Virtual environment not found. Please create one with 'python -m venv .venv-backend' and try again."
    exit 1
fi

source .venv-backend/bin/activate

echo "Checking backend..."
echo "Running tests..."
docker-compose exec -T backend pytest

