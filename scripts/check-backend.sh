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

pyright

echo "Running tests..."


# I'm so fucking done. This line is bad. I don't know why. I don't care. It works. Fuck it.
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/photo_palettes PYTHONPATH=. pytest

