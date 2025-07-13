const express = require('express');
const router = express.Router();
const serverController = require('../controllers/serverController');

// GET /api/server-statuses - Получение статуса всех серверов
router.get('/server-statuses', serverController.getServerStatuses);

// GET /api/health - Проверка здоровья сервиса
router.get('/health', serverController.getHealth);

module.exports = router; 