const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.sqlite');

function run(sql) {
  const result = spawnSync('sqlite3', [DB_PATH, sql], { encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.stderr) throw new Error(result.stderr.trim());
  return result.stdout.trim();
}

function query(sql) {
  const result = spawnSync('sqlite3', ['-json', DB_PATH, sql], { encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.stderr) throw new Error(result.stderr.trim());
  const out = result.stdout.trim();
  return out ? JSON.parse(out) : [];
}

function init() {
  if (!fs.existsSync(DB_PATH)) {
    run(
      'CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT, role TEXT);'
    );
  }
}

module.exports = { init, run, query, DB_PATH };
