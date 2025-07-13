const { formatUptime, sleep, createApiResponse } = require('../utils/helpers');
const { logger } = require('../utils/logger');
const ServerService = require('../services/serverService');

class ServerController {
    constructor() {
        this.serverService = new ServerService();
    }

    async getServerStatuses(req, res) {
        try {
            const servers = await this.serverService.getAllServerStatuses();
            
            res.json(createApiResponse(true, {
                servers,
                lastUpdate: new Date().toISOString()
            }));
        } catch (error) {
            logger.error('Error fetching server statuses:', error);
            res.status(500).json(createApiResponse(false, null, 'Ошибка получения статуса серверов'));
        }
    }

    async getHealth(req, res) {
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
}

module.exports = new ServerController(); 