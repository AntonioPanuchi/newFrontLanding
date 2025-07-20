#!/usr/bin/env node

/**
 * Тестовый скрипт для проверки работы fetch API
 * Демонстрирует работу полифилла для Node.js < 18
 */

// Имитируем логику из server.js
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0], 10);

console.log(`🔍 Тестирование fetch API для Node.js ${nodeVersion}`);

if (majorVersion < 18) {
  console.log("📦 Используем полифилл node-fetch...");
  const fetch = require("node-fetch");
  global.fetch = fetch;
} else {
  console.log("✅ Используем нативный fetch API");
}

// Тестируем fetch
async function testFetch() {
  try {
    console.log("🌐 Тестируем fetch API...");

    const response = await fetch("https://httpbin.org/get");
    const data = await response.json();

    console.log("✅ Fetch API работает корректно!");
    console.log(`📊 Статус ответа: ${response.status}`);
    console.log(`🔗 URL: ${data.url}`);

    return true;
  } catch (error) {
    console.error("❌ Ошибка при тестировании fetch:", error.message);
    return false;
  }
}

// Запускаем тест
testFetch().then((success) => {
  if (success) {
    console.log("\n🎉 Тест завершен успешно!");
    process.exit(0);
  } else {
    console.log("\n💥 Тест завершен с ошибкой!");
    process.exit(1);
  }
});
