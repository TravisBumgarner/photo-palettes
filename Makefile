.PHONY: setup up help

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup        - Set up the project with Docker"
	@echo "  make up           - Start all services"
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
