#!/usr/bin/env bash
# Пересборка и перезапуск сайта после обновления файлов.
# Запускать на сервере из корня проекта: sudo bash deploy/update.sh
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/blik}"
SERVICE="${SERVICE:-blik}"
OWNER="${OWNER:-www-data:www-data}"

cd "$APP_DIR"

echo "==> Зависимости"
# Полная установка: для сборки нужны devDependencies (tailwind, typescript).
npm ci --no-audit --no-fund || npm install --no-audit --no-fund

echo "==> Сборка"
# .env.production подхватывается автоматически: в нём NEXT_PUBLIC_BASE_PATH и NEXT_PUBLIC_SITE_URL
npm run build

echo "==> Права"
chown -R "$OWNER" "$APP_DIR"

echo "==> Перезапуск"
systemctl restart "$SERVICE"
sleep 2
systemctl --no-pager --lines=5 status "$SERVICE" || true

echo "==> Проверка"
code=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3100/clear || true)
echo "http://127.0.0.1:3100/clear -> $code"
[ "$code" = "200" ] || { echo "ОШИБКА: приложение не отвечает 200"; exit 1; }
echo "Готово."
