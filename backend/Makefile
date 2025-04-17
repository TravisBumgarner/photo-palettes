help:
	@echo "Available commands:"
	@echo "  make migrate      - Run alembic migrations inside Docker container"
	@echo "  make make-migration - Generate a new alembic migration inside Docker container"

# Run alembic migrations inside Docker container
migrate:
	docker-compose run --rm backend alembic upgrade head

# Generate a new alembic migration inside Docker container
make-migration:
	@read -p "Enter migration message: " msg; \
	docker-compose run --rm backend alembic revision --autogenerate -m "$$msg"
