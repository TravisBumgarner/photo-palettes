help:
	@echo "Available commands:"
	@echo "  make make-migration        - Generate a new Alembic migration locally"
	@echo "  make development-migrate   - Run migrations locally"
	@echo "  make development-downgrade - Downgrade one step locally"
	@echo "  make production-migrate    - Run migrations on Heroku"
	@echo "  make production-downgrade  - Downgrade one step on Heroku"

make-migration:
	@read -p "Enter migration message: " msg; \
	alembic revision --autogenerate -m "$$msg"

development-migrate:
	alembic upgrade head

development-downgrade:
	alembic downgrade -1

production-migrate:
	@read -p "Are you sure you want to run this on production? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		heroku run alembic upgrade head --app $(APP); \
	else \
		echo "Migration cancelled"; \
	fi

production-downgrade:
	@read -p "Are you sure you want to downgrade production? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		heroku run alembic downgrade -1 --app $(APP); \
	else \
		echo "Downgrade cancelled"; \
	fi
