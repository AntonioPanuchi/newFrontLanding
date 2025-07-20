/* eslint-disable no-sync */
const path = require('path');
const fs = require('fs');
const DB_DIR = path.resolve(__dirname, '../../data');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

/**
 * Простая обёртка над JSON‑файлом как KV‑хранилищем.
 * Для продакшена замените на нормальную БД.
 */
const dbPath = file => path.join(DB_DIR, `${file}.json`);

function read(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(dbPath(file), 'utf8'));
  } catch {
    return fallback;
  }
}

function write(file, data) {
  fs.writeFileSync(dbPath(file), JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { read, write };
/* eslint-enable no-sync */
