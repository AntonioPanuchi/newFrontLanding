/**
 * Форматирует время работы в секундах в читаемый вид
 * @param {number} seconds - Время в секундах
 * @returns {string} Отформатированное время
 */
function formatUptime(seconds) {
  if (!seconds || seconds <= 0) return 'N/A';
  
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor(seconds % (3600 * 24) / 3600);
  const m = Math.floor(seconds % 3600 / 60);
  
  let result = '';
  if (d > 0) result += `${d}д `;
  if (h > 0) result += `${h}ч `;
  if (m > 0) result += `${m}м`;
  
  return result.trim() || 'Только что';
}

/**
 * Создает задержку на указанное количество миллисекунд
 * @param {number} ms - Время задержки в миллисекундах
 * @returns {Promise} Promise, который разрешается после задержки
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Валидирует IP адрес
 * @param {string} ip - IP адрес для проверки
 * @returns {boolean} true если IP валидный
 */
function isValidIP(ip) {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

/**
 * Очищает кэш от устаревших записей
 * @param {Object} cache - Объект кэша
 * @param {number} _maxAge - Максимальный возраст записи в миллисекундах
 */
function cleanCache(cache, _maxAge) {
  const now = Date.now();
  Object.keys(cache).forEach(key => {
    if (cache[key].expiresAt && cache[key].expiresAt < now) {
      delete cache[key];
    }
  });
}

/**
 * Создает объект ответа API
 * @param {boolean} success - Успешность операции
 * @param {*} data - Данные ответа
 * @param {string} message - Сообщение
 * @returns {Object} Объект ответа
 */
function createApiResponse(success, data = null, message = '') {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  formatUptime,
  sleep,
  isValidIP,
  cleanCache,
  createApiResponse
}; 