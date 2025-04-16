.PHONY: setup build up down logs clean help setup-local

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup        - Set up the project with Docker"
	@echo "  make setup-local  - Set up the project locally"
	@echo "  make build        - Build Docker images"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make logs         - View logs from all services"
	@echo "  make clean        - Clean up Docker resources"
	@echo "  make test         - Run all tests"

# Setup project locally
setup-local:
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

# Setup project
setup:
	@echo "Setting up project..."
	@docker compose build

# Build images
build:
	@echo "Building Docker images..."
	@docker compose build

# Start services
up:
	@echo "Starting services..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	@docker compose up

# Start services in background
up-d:
	@echo "Starting services in background..."
	@docker compose up -d

# Stop services
down:
	@echo "Stopping services..."
	@docker compose down

# View logs
logs:
	@docker compose logs -f

# Clean up
clean:
	@echo "Cleaning up Docker resources..."
	@docker compose down -v
	@docker system prune -f

# Run tests
test:
	@echo "Running tests..."
	@docker compose run --rm backend pytest
	@docker compose run --rm frontend npm test 