---
name: "ROX VPN Agent System"
description: "Система взаимодействующих агентов для наблюдения, обучения и помощи пользователю в рамках VPN-инфраструктуры."
category: "Codex + WebSocket AI agents"
author: "Antonio Panuchi"
authorUrl: "https://github.com/AntonioPanuchi"
tags: ["vpn", "codex", "agents", "websocket", "dashboard"]
lastUpdated: "2025-07-20"
languages: ["ru", "en"]
---

# 🧠 Codex-Агенты ROX.VPN

## logWatcher

```yaml
agent:
  id: logWatcher
  name: "Лог-Наблюдатель"
  description: "Следит за входящими логами WebSocket и отбирает события для Codex."
  observe:
    input:
      stream: "ws://localhost:3000/ws/insights"
    filter:
      include:
        - level: "error"
        - label: "backend"
    onMatch:
      trigger: codexTrainer
```

## codexTrainer

```yaml
agent:
  id: codexTrainer
  name: "Codex-Тренер"
  description: "Обучает Codex на основе логов и взаимодействий пользователей."
  autotrain:
    sources:
      - fromAgent: logWatcher
      - filePath: "logs/*.log"
    strategy:
      summarize: true
      chunking: "byLines"
      language: ["en", "ru"]
    destination:
      codexProject: "roxvpn-dashboard"
```

## uiAssistant

```yaml
agent:
  id: uiAssistant
  name: "UI-Помощник"
  description: "Отвечает на вопросы пользователя в интерфейсе learning-insights."
  react:
    mode: "interactive"
    onPage: "/admin/learning-insights"
    inputs:
      - question
    functions:
      - explainLogEntry
      - summarizeRecentErrors
```
