#!/bin/bash
set -e

echo "######################### Setting up project locally... #########################"

find_python() {
    for v in 3.13 3.12 3.11 3.14; do
        if command -v "python$v" > /dev/null 2>&1; then
            echo "python$v"
            return 0
        fi
    done
    echo "❌ No Python 3.11+ found in PATH. Install via 'brew install python@3.13'." >&2
    return 1
}

PYTHON=$(find_python)
PYTHON_VERSION=$("$PYTHON" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Using $PYTHON ($PYTHON_VERSION)"

# Create venv at $1 if missing, or recreate if its Python version doesn't match $PYTHON.
ensure_venv() {
    local venv_dir=$1
    if [ -d "$venv_dir" ]; then
        local existing
        existing=$("$venv_dir/bin/python" -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' 2>/dev/null || echo "unknown")
        if [ "$existing" != "$PYTHON_VERSION" ]; then
            echo "Recreating $venv_dir (was Python $existing, want $PYTHON_VERSION)..."
            rm -rf "$venv_dir"
            "$PYTHON" -m venv "$venv_dir"
        fi
    else
        echo "Creating $venv_dir..."
        "$PYTHON" -m venv "$venv_dir"
    fi
}

setup_venv() {
    local dir=$1
    local name=$2

    cd "$dir"
    ensure_venv ".venv-${name}"

    echo "Installing ${name} dependencies..."
    # shellcheck disable=SC1090
    source ".venv-${name}/bin/activate"
    pip install --upgrade pip
    pip install -r requirements.txt
    deactivate
    cd - > /dev/null
}

echo "######################### Setting up root #########################"

ensure_venv .venv-root

echo "Installing root dependencies..."
# shellcheck disable=SC1091
source .venv-root/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "Hooking up pre-commit hooks..."
pre-commit install
deactivate

echo "######################### Setting up backend #########################"
setup_venv backend backend

echo "######################### Setting up frontend #########################"
# Dependencies are managed by docker compose up.
mkdir -p frontend/node_modules

echo "######################### Setting up common #########################"
setup_venv common common

echo "######################### Setting up database #########################"
setup_venv database database

echo "######################### Setting up image-worker #########################"
setup_venv image-worker image-worker

echo "######################### Running database migrations #########################"

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Start Docker Desktop and re-run 'make bootstrap'."
    exit 1
fi

echo "Starting db service..."
docker compose up -d db

echo "Waiting for db to be ready..."
attempts=0
until docker compose exec -T db pg_isready -U postgres > /dev/null 2>&1; do
    attempts=$((attempts + 1))
    if [ "$attempts" -ge 60 ]; then
        echo "❌ db service did not become ready within 60 seconds."
        exit 1
    fi
    sleep 1
done

echo "Running migrations..."
cd database
# shellcheck disable=SC1091
source .venv-database/bin/activate
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/photo_palettes alembic upgrade head
deactivate
cd ..

echo "######################### Manual Setup #########################"

echo "1. Configure backend/.env and backend/.env.prod with values from Heroku"
echo "2. Configure backend/tests/.env with values from ProtonPass"
echo "3. Run 'make up' to start the services."
echo "4. Login with both test users so their credentials get populated, set the moderator flag in the database."
