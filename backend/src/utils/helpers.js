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
 * @param {number} maxAge - Максимальный возраст записи в миллисекундах
 */
function cleanCache(cache, maxAge) {
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

/**
 * Валидирует переменные окружения
 * @param {string[]} requiredVars - Массив обязательных переменных
 * @returns {Object} Результат валидации
 */
function validateEnvironment(requiredVars) {
    const missing = requiredVars.filter(envVar => !process.env[envVar]);
    return {
        isValid: missing.length === 0,
        missing,
        message: missing.length > 0 ? `Missing required environment variables: ${missing.join(', ')}` : null
    };
}

/**
 * Форматирует размер в байтах в читаемый вид
 * @param {number} bytes - Размер в байтах
 * @returns {string} Отформатированный размер
 */
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Генерирует случайный ID
 * @param {number} length - Длина ID
 * @returns {string} Случайный ID
 */
function generateId(length = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Проверяет, является ли объект пустым
 * @param {Object} obj - Объект для проверки
 * @returns {boolean} true если объект пустой
 */
function isEmpty(obj) {
    return obj == null || Object.keys(obj).length === 0;
}

/**
 * Безопасно получает значение из объекта по пути
 * @param {Object} obj - Объект
 * @param {string} path - Путь к значению (например, 'user.name')
 * @param {*} defaultValue - Значение по умолчанию
 * @returns {*} Значение или defaultValue
 */
function get(obj, path, defaultValue = undefined) {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return defaultValue;
        }
        result = result[key];
    }
    
    return result !== undefined ? result : defaultValue;
}

module.exports = {
    formatUptime,
    sleep,
    isValidIP,
    cleanCache,
    createApiResponse,
    validateEnvironment,
    formatBytes,
    generateId,
    isEmpty,
    get
}; 