.PHONY: help build up down dev-up dev-down logs clean

# Переменные
COMPOSE_FILE = docker-compose.yml

help: ## Показать справку
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Собрать образы для продакшена
	docker compose -f $(COMPOSE_FILE) build

up: ## Запустить продакшен окружение
	docker compose -f $(COMPOSE_FILE) up -d

down: ## Остановить продакшен окружение
	docker compose -f $(COMPOSE_FILE) down

logs: ## Показать логи продакшена
	docker compose -f $(COMPOSE_FILE) logs -f


backend-logs: ## Показать логи backend
	docker compose -f $(COMPOSE_FILE) logs -f backend

frontend-logs: ## Показать логи frontend
	docker compose -f $(COMPOSE_FILE) logs -f frontend

postgres-logs: ## Показать логи PostgreSQL
	docker compose -f $(COMPOSE_FILE) logs -f postgres

clean: ## Очистить все контейнеры и образы
	docker compose -f $(COMPOSE_FILE) down -v --rmi all
	docker system prune -f

restart: ## Перезапустить продакшен окружение
	docker compose -f $(COMPOSE_FILE) restart


status: ## Показать статус контейнеров
	docker compose -f $(COMPOSE_FILE) ps

shell-backend: ## Войти в контейнер backend
	docker compose -f $(COMPOSE_FILE) exec backend sh

shell-frontend: ## Войти в контейнер frontend
	docker compose -f $(COMPOSE_FILE) exec frontend sh

shell-postgres: ## Войти в контейнер PostgreSQL
	docker compose -f $(COMPOSE_FILE) exec postgres psql -U postgres -d string_hash_service 