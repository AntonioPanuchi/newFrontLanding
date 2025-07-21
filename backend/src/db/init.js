import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import db from './db.js'

const migrationsDir = path.join(path.dirname(new URL(import.meta.url).pathname), 'migrations')

export function runMigrations() {
  const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql'))

  for (const file of files) {
    const sql = readFileSync(path.join(migrationsDir, file), 'utf-8')
    db.exec(sql)
    console.log(`✓ Миграция выполнена: ${file}`)
  }
}
