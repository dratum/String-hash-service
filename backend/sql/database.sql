-- Создание таблиц для сервиса хеширования строк

-- Таблица ролей
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица пользователей
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    external_id VARCHAR(255) NOT NULL UNIQUE, -- ID из OAuth провайдера
    provider VARCHAR(50) NOT NULL, -- yandex, vk, etc.
    name VARCHAR(255),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица связи пользователей и ролей
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES roles (id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, role_id)
);

-- Таблица алгоритмов хеширования
CREATE TABLE hash_algorithms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица запросов хеширования (аудит)
CREATE TABLE hash_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
    algorithm_id INTEGER REFERENCES hash_algorithms (id) ON DELETE SET NULL,
    input_string TEXT NOT NULL,
    hash_result TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица логов аутентификации
CREATE TABLE auth_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- login, logout, failed_login
    provider VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка начальных данных
INSERT INTO roles (name) VALUES ('admin'), ('user');

INSERT INTO
    hash_algorithms (name)
VALUES ('md5'),
    ('sha1'),
    ('sha256');

-- Создание индексов для оптимизации
CREATE INDEX idx_users_external_id ON users (external_id);

CREATE INDEX idx_users_provider ON users (provider);

CREATE INDEX idx_hash_requests_user_id ON hash_requests (user_id);

CREATE INDEX idx_hash_requests_created_at ON hash_requests (created_at);

CREATE INDEX idx_auth_logs_user_id ON auth_logs (user_id);

CREATE INDEX idx_auth_logs_created_at ON auth_logs (created_at);