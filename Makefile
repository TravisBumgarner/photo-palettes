.PHONY: setup up help

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup        - Set up the project with Docker"
	@echo "  make up           - Start all services"
	@echo "  make deploy-all   - Deploy all services"
	@echo "  make deploy-backend - Deploy backend"
	@echo "  make deploy-frontend - Deploy frontend"
setup:
	@echo "Setting up project locally..."
	@if [ ! -d ".venv" ]; then \
		echo "Creating virtual environment..."; \
		python -m venv .venv; \
	fi
	@echo "Installing backend dependencies..."
	@. .venv/bin/activate && cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	@cd frontend && npm install
	@echo "Local setup complete!"
	@ cd ..
	@docker compose up --build

up:
	@echo "Starting services..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@docker compose up --build

deploy-all:
	@echo "Deploying all services..."
	@./scripts/deploy-all.sh

deploy-backend:
	@echo "Deploying backend..."
	@./scripts/deploy-backend.sh

deploy-frontend:
	@echo "Deploying frontend..."
	@./scripts/deploy-frontend.sh