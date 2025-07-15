# Совместимость Node.js и Fetch API

## 📋 Требования к версиям

### Рекомендуемые версии
- **Node.js**: >= 18.0.0 (рекомендуется 18.x или выше)
- **npm**: >= 8.0.0

### Минимальные версии
- **Node.js**: >= 16.0.0 (с полифиллом)
- **npm**: >= 8.0.0

## 🔧 Fetch API совместимость

### Node.js >= 18
- ✅ **Нативный fetch API** доступен глобально
- ✅ Лучшая производительность
- ✅ Нет дополнительных зависимостей

### Node.js 16-17
- ⚠️ **Требуется полифилл** `node-fetch`
- ✅ Автоматическое подключение полифилла
- ⚠️ Дополнительная зависимость

### Node.js < 16
- ❌ **Не поддерживается**
- ❌ Слишком старые версии

## 🚀 Автоматическое определение

ROX VPN API автоматически определяет версию Node.js и подключает полифилл при необходимости:

```javascript
// Логика из server.js
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0], 10);

if (majorVersion < 18) {
    // Для Node.js < 18 используем node-fetch как полифилл
    const fetch = require('node-fetch');
    global.fetch = fetch;
    console.log(`Node.js ${nodeVersion} detected, using node-fetch polyfill for fetch API`);
} else {
    console.log(`Node.js ${nodeVersion} detected, using native fetch API`);
}
```

## 🧪 Тестирование

### Проверка версии Node.js
```bash
./check-node-version.sh
```

### Тестирование fetch API
```bash
node test-fetch.js
```

## 📦 Установка зависимостей

### Для Node.js >= 18
```bash
cd backend
npm install
```

### Для Node.js 16-17
```bash
cd backend
npm install
# node-fetch будет установлен автоматически
```

## 🔍 Проверка совместимости

### Скрипт проверки
```bash
./check-node-version.sh
```

Вывод для Node.js >= 18:
```
[INFO] Обнаружена версия Node.js: v18.17.0
[SUCCESS] Node.js версии v18.17.0 поддерживает нативный fetch API
```

Вывод для Node.js 16-17:
```
[INFO] Обнаружена версия Node.js: v16.20.0
[WARNING] Node.js версии v16.20.0 ниже рекомендуемой (18.x)
[INFO] Будет использован полифилл node-fetch для совместимости
[SUCCESS] Полифилл node-fetch установлен
```

## 🚨 Возможные проблемы

### Ошибка: "fetch is not defined"
**Причина**: Node.js < 18 без установленного полифилла
**Решение**: 
```bash
cd backend
npm install
```

### Ошибка: "Cannot find module 'node-fetch'"
**Причина**: Полифилл не установлен
**Решение**:
```bash
cd backend
npm install node-fetch@^3.3.2
```

### Медленная работа на Node.js 16-17
**Причина**: Использование полифилла вместо нативного API
**Решение**: Обновите Node.js до версии 18+

## 📈 Производительность

| Node.js версия | Fetch API | Производительность | Рекомендация |
|----------------|-----------|-------------------|--------------|
| >= 18          | Нативный  | 🟢 Отличная       | ✅ Рекомендуется |
| 16-17          | Полифилл  | 🟡 Хорошая        | ⚠️ Приемлемо |
| < 16           | Недоступен| 🔴 Не поддерживается | ❌ Не рекомендуется |

## 🔄 Миграция

### Обновление Node.js
```bash
# Используя nvm (рекомендуется)
nvm install 18
nvm use 18

# Или установка через пакетный менеджер
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# CentOS/RHEL
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### Проверка после обновления
```bash
node --version
./check-node-version.sh
./test-fetch.js
```

## 📚 Дополнительные ресурсы

- [Node.js Download](https://nodejs.org/)
- [node-fetch Documentation](https://github.com/node-fetch/node-fetch)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) 