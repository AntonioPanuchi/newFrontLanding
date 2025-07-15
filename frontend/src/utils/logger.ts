// frontend/src/utils/logger.ts

/**
 * Отправка логов на backend для централизованного хранения
 * level: 'info' | 'warn' | 'error'
 * message: строка
 * meta: любые дополнительные данные (объект)
 */
export function logFrontend(level: 'info' | 'warn' | 'error', message: string, meta: any = {}) {
  fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ level, message, ...meta }),
  }).catch(() => {});
}

/**
 * Логирование ошибок API
 */
export function logApiError(endpoint: string, error: any, meta: any = {}) {
  logFrontend('error', 'API error', { endpoint, error: error?.message || error, ...meta });
}

/**
 * Логирование пользовательских событий (например, клики, действия)
 */
export function logEvent(event: string, meta: any = {}) {
  logFrontend('info', event, meta);
}

// Глобальный обработчик ошибок
if (typeof window !== 'undefined') {
  window.onerror = (msg, url, line, col, error) => {
    logFrontend('error', 'Global JS error', { msg, url, line, col, error: error?.stack || error });
  };
  window.onunhandledrejection = (event) => {
    logFrontend('error', 'Unhandled promise rejection', { reason: event.reason });
  };
} 