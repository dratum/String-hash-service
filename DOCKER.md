# Docker для String Hash Service

Этот документ описывает, как запустить проект с помощью Docker.

## Требования

- Docker
- Docker Compose

## Быстрый старт

### 1. Продакшен окружение

```bash
# Собрать и запустить все сервисы
make build
make up

# Или без Makefile:
docker-compose up -d --build
```

### 2. Окружение для разработки

```bash
# Собрать и запустить для разработки
make dev-build
make dev-up

# Или без Makefile:
docker-compose -f docker-compose.dev.yml up -d --build
```

## Доступные сервисы

После запуска будут доступны:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **PostgreSQL**: localhost:5432

## Управление контейнерами

### Основные команды Makefile:

```bash
# Справка
make help

# Продакшен
make build      # Собрать образы
make up         # Запустить
make down       # Остановить
make restart    # Перезапустить
make logs       # Показать логи

# Разработка
make dev-build  # Собрать образы для разработки
make dev-up     # Запустить для разработки
make dev-down   # Остановить разработку
make dev-logs   # Логи разработки

# Дополнительно
make status     # Статус контейнеров
make clean      # Очистить все
make shell-backend   # Войти в контейнер backend
make shell-frontend  # Войти в контейнер frontend
make shell-postgres  # Подключиться к PostgreSQL
```

### Прямые команды Docker Compose:

```bash
# Продакшен
docker-compose up -d
docker-compose down
docker-compose logs -f

# Разработка
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml logs -f
```

## Переменные окружения

### Frontend (.env.local)
Создайте файл `frontend/.env.local`:
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### Backend (.env)
Создайте файл `backend/.env`:
```env
DB_HOST=postgres
DB_PORT=5432
DB_NAME=string_hash_service
DB_USER=postgres
DB_PASSWORD=postgres
PORT=3001
```

## База данных

### Автоматическая инициализация
SQL скрипты из `backend/sql/` автоматически выполняются при первом запуске PostgreSQL.

### Подключение к базе данных
```bash
# Через Docker
make shell-postgres

# Или напрямую
docker exec -it string_hash_postgres psql -U postgres -d string_hash_service
```

### Резервное копирование
```bash
# Создать бэкап
docker exec string_hash_postgres pg_dump -U postgres string_hash_service > backup.sql

# Восстановить из бэкапа
docker exec -i string_hash_postgres psql -U postgres string_hash_service < backup.sql
```


## Мониторинг

### Статус контейнеров
```bash
make status
# или
docker-compose ps
```

### Использование ресурсов
```bash
docker stats
```

### Логи
```bash
# Все логи
make logs

# Конкретный сервис
make backend-logs
```

## Устранение неполадок

### Пересборка образов
```bash
# Очистить и пересобрать
make clean
make build
make up
```

### Сброс базы данных
```bash
# Остановить и удалить volumes
docker-compose down -v
docker-compose up -d
```

### Проверка подключений
```bash
# Проверить backend
curl http://localhost:3001/health

# Проверить frontend
curl http://localhost:3000
```

### Проблемы с портами
Если порты заняты, измените их в `docker-compose.yml`:
```yaml
ports:
  - "3001:3001"  # Измените 3001 на свободный порт
```

## Продакшен

### Переменные окружения
Для продакшена обязательно настройте:
- `NEXTAUTH_SECRET` - секретный ключ
- `YANDEX_CLIENT_ID` и `YANDEX_CLIENT_SECRET` - данные Яндекс.ID
- `DB_PASSWORD` - надежный пароль для базы данных

### Безопасность
- Измените пароли по умолчанию
- Используйте HTTPS в продакшене
- Настройте firewall
- Регулярно обновляйте образы

### Масштабирование
```bash
# Запустить несколько экземпляров backend
docker-compose up -d --scale backend=3
```

## Архитектура

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │    │   Backend   │    │ PostgreSQL  │
│   :3000     │◄──►│   :3001     │◄──►│   :5432     │
└─────────────┘    └─────────────┘    └─────────────┘
```

- **Frontend**: Next.js приложение
- **Backend**: Express API
- **PostgreSQL**: База данных
- **Network**: Изолированная сеть `string_hash_network` 