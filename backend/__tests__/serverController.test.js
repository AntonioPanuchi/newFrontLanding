const request = require('supertest');
const express = require('express');
const serverController = require('../src/controllers/serverController');

// Мокаем зависимости
jest.mock('../src/services/serverService');
jest.mock('../src/utils/logger');

const app = express();
app.use('/api', require('../src/routes/api'));

describe('ServerController', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/server-statuses', () => {
        it('should return server statuses successfully', async () => {
            const mockServers = [
                {
                    name: 'Germany',
                    status: 'online',
                    uptime: '5д 12ч 30м',
                    ping: 45,
                    users: 1250,
                    lastUpdate: '2024-01-15T10:30:00Z'
                }
            ];

            // Мокаем ServerService
            const ServerService = require('../src/services/serverService');
            ServerService.prototype.getAllServerStatuses = jest.fn().mockResolvedValue(mockServers);

            const response = await request(app)
                .get('/api/server-statuses')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.servers).toEqual(mockServers);
            expect(response.body.data.lastUpdate).toBeDefined();
        });

        it('should handle errors gracefully', async () => {
            const ServerService = require('../src/services/serverService');
            ServerService.prototype.getAllServerStatuses = jest.fn().mockRejectedValue(new Error('Service error'));

            const response = await request(app)
                .get('/api/server-statuses')
                .expect(500);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Ошибка получения статуса серверов');
        });
    });

    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);

            expect(response.body.status).toBe('ok');
            expect(response.body.timestamp).toBeDefined();
            expect(response.body.uptime).toBeDefined();
            expect(response.body.version).toBeDefined();
            expect(response.body.environment).toBeDefined();
        });
    });
}); 