---
name: "ROX VPN — разработка и деплой"
description: "Инструкция для людей и OpenAI Codex: как писать код, запускать тесты, проверять style‑guide и выкатывать релизы."
author: "Antonio Panuchi"
authorUrl: "https://github.com/AntonioPanuchi"
tags:
  - nodejs
  - react
  - vite
  - tailwindcss
  - storybook
  - vpn
lastUpdated: "2025‑07‑20"
---

# Глобальные правила

- **Любые изменения должны**  
  1. проходить `npm run validate` (линт + форматирование)  
  2. проходить все тесты `npm test` (см. секцию «Тесты»)  
  3. оформляться PR c шаблоном `[Feat|Fix] Короткое описание`  

- **Никаких сетевых вызовов** внутри sand‑box Codex — все зависимости уже в repo. Если нужен новый пакет ‑ правьте `package.json`, но не запускайте `npm i`.

- **Code style**  
  - Backend – ESLint + Prettier (конфиг уже в repo)  
  - Frontend – ESLint + Tailwind prettier‑plugin  
  - TypeScript: strict true, никаких `any`, используйте `zod` для runtime‑валидации.  

---

# Быстрый старт

```bash
# backend
cd backend
npm run dev        # локальная разработка
npm run validate   # линт + формат
npm test           # юнит‑тесты

# frontend
cd ../frontend
npm run dev        # vite dev server :5173
npm run validate   # eslint + prettier
npm run storybook  # UI‑дока :6006
