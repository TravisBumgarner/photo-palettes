help:
	@echo "Available commands:"
	@echo "  make make-migration             - Generate a new Alembic migration locally"
	@echo "  make development-migrate        - Run migrations locally"
	@echo "  make development-downgrade      - Downgrade one step locally"
	@echo "  make production-migrate         - Run migrations on Heroku"
	@echo "  make production-downgrade       - Downgrade one step on Heroku"
	@echo "  make production-backup-create   - Create a backup of the production database"
	@echo "  make production-download-backup - Download the latest production database backup"
	@echo "  make production-backup-status   - Check the status of production database backups"

migration:
	@read -p "Enter migration message: " msg; \
	alembic revision --autogenerate -m "$$msg"

development-migrate:
	alembic upgrade head

development-downgrade:
	alembic downgrade -1

production-migrate:
	@read -p "Are you sure you want to run this on production? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		set -a && source .env.prod && set +a && \
		PYTHONPATH=./backend:./common alembic upgrade head; \
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

production-backup-create:
	@read -p "Are you sure you want to backup production database? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		heroku pg:backups:capture --app photo-palettes-backend; \
	else \
		echo "Backup cancelled"; \
	fi

production-download-backup:
	@read -p "Are you sure you want to download the latest production backup? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		heroku pg:backups:download --app photo-palettes-backend; \
	else \
		echo "Download cancelled"; \
	fi	

production-backup-status:
	heroku pg:backups --app photo-palettes-backend