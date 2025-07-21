#!/bin/bash

ENV_FILE="backend/.env"
SERVER_FILE="backend/server.js"
PORT=3000
COOKIE_SAMPLE="auth_token=__your_token_here__"

echo "🔍 Проверка .env файла..."
if [ -f "$ENV_FILE" ]; then
  grep -q JWT_SECRET "$ENV_FILE" && echo "✅ JWT_SECRET найден в $ENV_FILE" || echo "❌ JWT_SECRET не найден в $ENV_FILE"
else
  echo "❌ Файл $ENV_FILE не существует"
fi

echo -e "\n🔍 Проверка server.js на наличие dotenv.config..."
grep -q "dotenv.config" "$SERVER_FILE" && echo "✅ dotenv.config найден" || echo "❌ dotenv.config не найден"

echo -e "\n🔍 Проверка, слушает ли backend порт $PORT..."
lsof -iTCP:$PORT -sTCP:LISTEN >/dev/null && echo "✅ Backend слушает порт $PORT" || echo "❌ Backend НЕ слушает порт $PORT"

echo -e "\n🔍 Проверка переменной среды JWT_SECRET..."
if [ -z "$JWT_SECRET" ]; then
  echo "❌ JWT_SECRET не установлен в окружении текущего shell"
else
  echo "✅ JWT_SECRET в окружении: $JWT_SECRET"
fi

echo -e "\n📡 Тест запроса к /api/user/me..."
curl -i -s -X GET "http://localhost:$PORT/api/user/me" \
  --cookie "$COOKIE_SAMPLE" \
  -H "Accept: application/json" | grep -m 1 HTTP

echo -e "\n🧪 Готово. Проверь вывод выше."
