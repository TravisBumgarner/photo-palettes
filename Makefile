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
	@echo "  make deploy-image-worker - Deploy image worker"
	@echo "  make nuke-docker - Remove all docker containers, volumes, and images"

	
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
	@./scripts/is-docker-running.sh
	@./scripts/deploy-frontend.sh
	@./scripts/deploy-backend.sh
	@./scripts/deploy-image-worker.sh

deploy-backend:
	@echo "Deploying backend..."
	@./scripts/is-docker-running.sh
	@./scripts/deploy-backend.sh

deploy-frontend:
	@echo "Deploying frontend..."
	@./scripts/deploy-frontend.sh

deploy-image-worker:
	@echo "Deploying image worker..."
	@./scripts/deploy-image-worker.sh

nuke-docker:
	@echo "Nuking docker..."
	@docker compose down --volumes --remove-orphans
	@docker compose rm -f
	@docker system prune -a --volumes -f

line-count:
	@echo "Counting lines..."
	@bash ./scripts/line-count.sh