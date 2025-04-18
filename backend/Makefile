help:
	@echo "Available commands:"
	@echo "  make development-upgrade - Run alembic migrations inside Docker container (DEVELOPMENT)"
	@echo "  make make-migration - Generate a new alembic migration inside Docker container (DEVELOPMENT)"
	@echo "  make production-upgrade - Run alembic migrations inside Docker container (PRODUCTION)"
	@echo "  make production-check-migration - Check the current migration inside Docker container (PRODUCTION)"

# Generate a new alembic migration inside Docker container
make-migration:
	@read -p "Enter migration message: " msg; \
	docker-compose exec backend alembic revision --autogenerate -m "$$msg"

# Run alembic migrations inside Docker container
development-upgrade:
	docker-compose exec backend alembic upgrade head

production-upgrade:
	@read -p "Are you sure you want to run this on production? (y/n): " confirm; \
	if [ "$$confirm" != "y" ]; then \
		echo "Migration cancelled"; \
		exit 1; \
	fi; \
	docker-compose exec -e POSTGRES_DATABASE_URL=$$(cat ./.env.prod | grep POSTGRES_DATABASE_URL | cut -d '=' -f2) backend alembic upgrade head

development-downgrade:
	@read -p "Are you sure you want to downgrade? (y/n): " confirm; \
	if [ "$$confirm" != "y" ]; then \
		echo "Downgrade cancelled"; \
		exit 1; \
	fi; \
	docker-compose exec backend alembic downgrade -1

production-downgrade:
	@read -p "Are you sure you want to downgrade? (y/n): " confirm; \
	if [ "$$confirm" != "y" ]; then \
		echo "Downgrade cancelled"; \
		exit 1; \
	fi; \
	docker-compose exec -e POSTGRES_DATABASE_URL=$$(cat ./.env.prod | grep POSTGRES_DATABASE_URL | cut -d '=' -f2) backend alembic downgrade -1

production-check-migration:
	$(shell cat .env.prod) docker-compose exec backend alembic current