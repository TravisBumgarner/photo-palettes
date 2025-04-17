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

migrate-prod:
	@read -p "Are you sure you want to run this on production? (y/n): " confirm; \
	if [ "$$confirm" != "y" ]; then \
		echo "Migration cancelled"; \
		exit 1; \
	fi; \
	docker-compose run --rm -e POSTGRES_DATABASE_URL=$$(cat ./.env.prod | grep POSTGRES_DATABASE_URL | cut -d '=' -f2) backend alembic upgrade head
	
check-prod-migration:
	$(shell cat .env.prod) docker-compose run --rm backend alembic current