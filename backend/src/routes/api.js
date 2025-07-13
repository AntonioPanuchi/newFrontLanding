const express = require('express');
const router = new express.Router();
const { getServerStatuses, getHealth } = require('../controllers/serverController');

// GET /api/server-statuses - Получение статуса всех серверов
router.get('/server-statuses', getServerStatuses);

// GET /api/health - Проверка здоровья сервиса
router.get('/health', getHealth);

module.exports = router; 