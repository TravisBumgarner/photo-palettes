# Exit on error
set -e

echo "Checking everything..."

echo "Activating virtual environment..."
if [ ! -d ".venv" ]; then
    echo "Virtual environment not found. Please create one with 'python -m venv venv' and try again."
    exit 1
fi

source .venv/bin/activate

echo "Checking backend..."
cd backend

echo "Running tests..."
pytest

echo "Checking frontend..."
cd ../frontend

echo "Linting..."
npm run lint


