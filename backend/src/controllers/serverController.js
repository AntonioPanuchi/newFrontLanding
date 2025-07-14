const { formatUptime, createApiResponse } = require('../utils/helpers');
const { logger } = require('../utils/logger');
const ServerServiceClass = require('../services/serverService');

const serverService = new ServerServiceClass();

async function getServerStatuses(req, res) {
    try {
        const servers = await serverService.getAllServerStatuses();
        
        // Возвращаем массив серверов напрямую, как ожидает frontend
        res.json({
            servers,
            lastUpdate: new Date().toISOString()
          });
    } catch (error) {
        logger.error('Error fetching server statuses:', error);
        res.status(500).json({ error: 'Ошибка получения статуса серверов' });
    }
}

async function getHealth(req, res) {
    try {
        const uptime = process.uptime();
        const health = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: formatUptime(uptime),
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development'
        };
        
        res.json(health);
    } catch (error) {
        logger.error('Health check error:', error);
        res.status(500).json({ status: 'error', message: 'Service unavailable' });
    }
}

module.exports = {
    getServerStatuses,
    getHealth
}; 