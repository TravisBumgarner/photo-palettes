help:
	@echo "Available commands:"
	@echo "  make migrate      - Run alembic migrations inside Docker container"
	@echo "  make make-migration - Generate a new alembic migration inside Docker container"

# Generate a new alembic migration inside Docker container
make-migration:
	@read -p "Enter migration message: " msg; \
	docker-compose run --rm backend alembic revision --autogenerate -m "$$msg"

# Run alembic migrations inside Docker container
development-migrate:
	docker-compose run --rm backend alembic upgrade head

production-migrate:
	@read -p "Are you sure you want to run this on production? (y/n): " confirm; \
	if [ "$$confirm" != "y" ]; then \
		echo "Migration cancelled"; \
		exit 1; \
	fi; \
	docker compose -f ../docker-compose.yml -f ../docker-compose.prod.yml run --rm backend alembic upgrade head

development-downgrade:
	docker-compose run --rm backend alembic downgrade -1

production-downgrade:
	@read -p "Are you sure you want to run this on production? (y/n): " confirm; \
	if [ "$$confirm" != "y" ]; then \
		echo "Downgrade cancelled"; \
		exit 1; \
	fi; \
	docker compose -f ../docker-compose.yml -f ../docker-compose.prod.yml run --rm backend alembic downgrade -1
