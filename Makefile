# Personal Finance Tracker - Docker Makefile

.PHONY: help build up down logs clean dev prod test migrate superuser shell backup restore

# Default target
help:
	@echo "Personal Finance Tracker - Docker Commands"
	@echo "=========================================="
	@echo "Development:"
	@echo "  make dev          - Start development environment"
	@echo "  make dev-build    - Build development images"
	@echo "  make dev-logs     - View development logs"
	@echo ""
	@echo "Production:"
	@echo "  make prod         - Start production environment"
	@echo "  make prod-build   - Build production images"
	@echo "  make prod-logs    - View production logs"
	@echo ""
	@echo "Database:"
	@echo "  make migrate      - Run database migrations"
	@echo "  make superuser    - Create Django superuser"
	@echo "  make backup       - Create database backup"
	@echo "  make restore      - Restore database from backup"
	@echo ""
	@echo "Utilities:"
	@echo "  make logs         - View all logs"
	@echo "  make clean        - Clean up containers and volumes"
	@echo "  make test         - Run tests"
	@echo "  make shell        - Access backend shell"

# Development commands
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up

dev-build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

dev-logs:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Production commands
prod:
	docker compose up -d

prod-build:
	docker compose up --build -d

prod-logs:
	docker compose logs -f

# Database commands
migrate:
	docker compose exec backend python manage.py migrate

superuser:
	docker compose exec backend python manage.py createsuperuser

backup:
	docker compose exec db pg_dump -U finance_user finance_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

restore:
	@echo "Usage: make restore BACKUP_FILE=backup_20231201_120000.sql"
	@if [ -z "$(BACKUP_FILE)" ]; then \
		echo "Please specify BACKUP_FILE parameter"; \
		exit 1; \
	fi
	docker compose exec -T db psql -U finance_user -d finance_db < $(BACKUP_FILE)

# Utility commands
logs:
	docker compose logs -f

clean:
	docker compose down -v --remove-orphans
	docker system prune -f

test:
	docker compose exec backend python manage.py test

shell:
	docker compose exec backend python manage.py shell

# Health checks
health:
	@echo "Checking service health..."
	@docker compose exec backend curl -f http://localhost:8000/health/ || echo "Backend health check failed"
	@docker compose exec frontend curl -f http://localhost/health || echo "Frontend health check failed"

# Stop all services
down:
	docker compose down

# Restart services
restart:
	docker compose restart

# Show running containers
ps:
	docker compose ps

# Show resource usage
stats:
	docker stats