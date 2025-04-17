# Makefile for backend migration commands

# Docker image and container names
IMAGE_NAME = myapp-image
DB_CONTAINER_NAME = db

# Run alembic migrations inside Docker container
migrate:
	docker-compose run --rm backend alembic upgrade head

# Generate a new alembic migration inside Docker container
make-migration:
	@read -p "Enter migration message: " msg; \
	docker-compose run --rm backend alembic revision --autogenerate -m "$$msg"
