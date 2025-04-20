.PHONY: setup up help

# Default target
help:
	@echo "Available commands:"
	@echo "  make setup        - Set up the project with Docker"
	@echo "  make up           - Start all services"
	@echo "  make deploy-all   - Deploy all services"
	@echo "  make deploy-backend - Deploy backend"
	@echo "  make deploy-frontend - Deploy frontend"
	@echo "  make nuke-docker - Remove all docker containers, volumes, and images"
setup:
	@chmod +x scripts/bootstrap.sh
	@./scripts/bootstrap.sh

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

nuke-docker:
	@echo "Nuking docker..."
	@docker compose down --volumes --remove-orphans
	@docker compose rm -f
	@docker system prune -a --volumes -f