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
```

---

# Тесты

| Папка      | Запустить | Цель                |
|------------|-----------|---------------------|
| backend    | `npm test`| unit + интеграция   |
| frontend   | `npm run test` (в будущем) | react‑testing‑library |

Codex **обязан** вызвать тесты после каждой модификации — PR без зелёных тестов отклоняется.

---

# CI/CD

- Workflow: `.github/workflows/ci-cd.yml`  
- На push в `main`: build + deploy через `deploy.sh`  
- Ожидаемое время деплоя < 60 сек.  

---

# Правила по папкам

## `/backend`
- Точка входа `server.js`; маршруты в `routes/`.
- Новые сервисы кладём в `services/`; не захламляем `utils/`.
- Перед PR выполните:  
  ```bash
  npm run validate && npm test
  ```

## `/frontend`
- Только **функциональные** компоненты React.
- Стили — Tailwind; общие utility‑классы в `src/styles`.
- Для новых компонентов создаём story в `*.stories.tsx`.

## `/docs`
- Обновляем, если затронуты публичные API или SEO‑мета.  
- Генерация метатегов — компонент `PageHead`.

---

# Шаблон коммита

```
[type] Scope: Краткое описание

Body (опционально) — что изменилось и зачем.
```

---

# Политика безопасности

- Rate‑limit: 3 000 r/min — **не изменять** без согласования.  
- Никогда не логируйте токены; используйте маскирование в Winston.  

---

# Часто задаваемые вопросы (FAQ)

<details>
<summary>Как добавить новый VPN‑сервер?</summary>

1. Добавьте запись в `servers.json`.  
2. Используйте helper `pingService.addServer()` для первичной проверки.  
3. Запустите `npm test` — должны пройти `ping‑integration` кейсы.  
</details>

---

> Документ живой: если вы добавляете новую папку или скрипт — обновите секцию «Правила по папкам».
