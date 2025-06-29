# String Hash Service

Сервис для хеширования строк с системой аутентификации через Яндекс.ID, админ-панелью для просмотра логов и историей операций.

## Функционал

- 🔐 Аутентификация через Яндекс.ID
- 🔄 Автоматическое создание роли пользователя по умолчанию
- 🔒 Система ролей (admin/user)
- 🔢 Хеширование строк по алгоритмам MD5, SHA1, SHA256
- 📊 Просмотр логов аутентификации для администраторов
- 📈 История хеширования пользователей
- 🎯 Аудит всех операций (IP, User-Agent, время)

## Настройка

### 1. Переменные окружения

#### Frontend (.env.local)
```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
YANDEX_CLIENT_ID=your-yandex-client-id
YANDEX_CLIENT_SECRET=your-yandex-client-secret
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

#### Backend (.env)
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=string_hash_service
DB_PASSWORD=your-password
DB_PORT=5432
```

### 2. База данных

1. Создайте базу данных PostgreSQL
2. Выполните скрипт `backend/sql/database.sql` командой `psql -h localhost -U postgres -d string_hash_service -f backend/sql/database.sql`
3. Добавьте пользователя с ролью админа:
   - Откройте `backend/sql/add_admin.sql`
   - Замените `YOUR_YANDEX_ID` на ваш ID из Яндекс.ID
   - Выполните скрипт

### 3. Получение Яндекс.ID

1. Перейдите на https://oauth.yandex.ru/client/new
2. Создайте приложение
3. Скопируйте Client ID и Client Secret
4. Добавьте в настройки приложения:
   - Callback URL: `http://localhost:3000/api/auth/callback/yandex`

## Запуск

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Использование

### Для пользователей:
1. Откройте http://localhost:3000
2. Войдите через Яндекс.ID
3. При первом входе автоматически создается роль "user"
4. Используйте форму хеширования для создания хешей строк
5. Выберите алгоритм (MD5, SHA1, SHA256)
6. Введите строку и получите результат

### Для администраторов:
1. Убедитесь, что у вас есть роль "admin" в базе данных
2. Нажмите кнопку "Логи и история" на главной странице
3. Просматривайте:
   - **Логи аутентификации** - все попытки входа/выхода
   - **Историю хеширования** - все операции хеширования пользователей

## Система ролей

- **user** - обычный пользователь (создается автоматически при первом входе)
  - Может хешировать строки
  - Видит свою историю хеширования
- **admin** - администратор
  - Все возможности пользователя
  - Просмотр логов аутентификации всех пользователей
  - Просмотр истории хеширования всех пользователей

Роли хранятся в таблице `user_roles` и связывают пользователей с ролями из таблицы `roles`.

## API Endpoints

### Аутентификация
- `POST /api/auth/log` - Логирование входа (создает роль пользователя по умолчанию)
- `GET /api/auth/logs` - Получение логов (только для админов)

### Хеширование
- `POST /api/hash` - Хеширование строки
- `GET /api/hash/history` - Получение истории хеширования пользователя

### Параметры запроса хеширования:
```json
{
  "input": "строка для хеширования",
  "algorithm": "md5|sha1|sha256"
}
```

### Ответ хеширования:
```json
{
  "success": true,
  "result": {
    "algorithm": "md5",
    "input": "строка для хеширования",
    "hash": "хеш_результат",
    "timestamp": "2024-01-01T12:00:00.000Z"
  }
}
```

## База данных

### Основные таблицы:
- `users` - пользователи системы
- `user_roles` - связи пользователей и ролей
- `roles` - роли (admin, user)
- `hash_algorithms` - алгоритмы хеширования
- `hash_requests` - запросы хеширования (аудит)
- `auth_logs` - логи аутентификации

### Аудит операций:
Все операции хеширования и аутентификации записываются в базу данных с указанием:
- IP адреса пользователя
- User-Agent браузера
- Времени выполнения
- Статуса операции
- Деталей ошибок (если есть)

## Структура проекта

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Контроллеры API
│   │   │   ├── authController.ts
│   │   │   └── hashController.ts
│   │   ├── models/         # Модели данных
│   │   │   ├── User.ts
│   │   │   ├── UserRole.ts
│   │   │   ├── AuthLog.ts
│   │   │   └── HashRequest.ts
│   │   ├── middleware/     # Middleware
│   │   │   └── authMiddleware.ts
│   │   ├── routes/         # Маршруты API
│   │   │   ├── authRoutes.ts
│   │   │   └── hashRoutes.ts
│   │   └── config/         # Конфигурация
│   └── sql/               # SQL скрипты
└── frontend/
    └── src/
        └── app/
            ├── actions/    # Server Actions
            │   ├── logs.ts
            │   └── hash.ts
            ├── components/ # React компоненты
            │   ├── LogsModal.tsx
            │   ├── HashForm.tsx
            │   └── HashHistory.tsx
            └── api/        # NextAuth API
```

## Безопасность

- Все API endpoints защищены проверкой авторизации
- Роли проверяются на уровне middleware
- Все операции аудируются
- IP адреса и User-Agent логируются
- Ошибки обрабатываются и логируются

## Технологии

### Backend:
- Node.js + Express
- TypeScript
- PostgreSQL
- Crypto (для хеширования)

### Frontend:
- Next.js 15
- TypeScript
- Tailwind CSS
- NextAuth.js
- Server Actions 