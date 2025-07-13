const express = require('express');
const router = express.Router();
const ServerController = require('../controllers/serverController');

// GET /api/server-statuses - Получение статуса всех серверов
router.get('/server-statuses', ServerController.getServerStatuses);

// GET /api/health - Проверка здоровья сервиса
router.get('/health', ServerController.getHealth);

module.exports = router; 