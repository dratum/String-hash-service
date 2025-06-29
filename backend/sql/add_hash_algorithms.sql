
INSERT INTO hash_algorithms (name, is_active) 
VALUES ('sha512', true)
ON CONFLICT (name) DO UPDATE SET 
  is_active = EXCLUDED.is_active;

-- Добавление алгоритма SHA-384


-- Комментарии по использованию:
-- 1. Для добавления нового алгоритма просто добавьте новую строку INSERT
-- 2. Используйте ON CONFLICT для безопасного добавления (не будет ошибки если алгоритм уже существует)
-- 3. Установите is_active = false если хотите временно отключить алгоритм
-- 4. После добавления алгоритма нужно обновить код backend и frontend для поддержки нового алгоритма 