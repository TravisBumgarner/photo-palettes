.PHONY: setup up help

# Default target
help:
	@echo "Available commands:"
	@echo "  make bootstrap    - Set up the project with Docker"
	@echo "  make up           - Start all services"
	@echo "  make down         - Stop all services"
	@echo "  make deploy-all   - Deploy all services"
	@echo "  make deploy-backend - Deploy backend"
	@echo "  make deploy-frontend - Deploy frontend"
	@echo "  make nuke-docker - Remove all docker containers, volumes, and images"
	@echo "  make set-ip    - Update IP address to the current machine's IP to be used for mobile development particularly."

	
bootstrap:
	@chmod +x scripts/bootstrap.sh
	@./scripts/bootstrap.sh

up:
	@echo "Starting services..."
	@docker compose up --build --watch

down:
	@docker compose down

deploy-all:
	@echo "Deploying all services..."
	@./scripts/deploy-frontend.sh
	@./scripts/deploy-backend.sh

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

set-ip:
	@echo "Setting IP address for mobile development..."
	@chmod +x ./scripts/set-ip.sh
	@./scripts/set-ip.sh