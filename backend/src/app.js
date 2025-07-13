const express = require('express');
const cors = require('cors');
const { validateEnvironment } = require('./utils/helpers');
const { logger, requestLogger } = require('./utils/logger');
const { 
    apiLimiter, 
    corsOptions, 
    apiKeyAuth, 
    errorLogger, 
    errorHandler 
} = require('./middleware/security');
const apiRoutes = require('./routes/api');

class App {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    initializeMiddleware() {
        // Доверяем первому прокси-хопу (Nginx / Cloudflare и т.д.)
        this.app.set('trust proxy', 1);
        
        // Парсинг JSON
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
        
        // CORS
        this.app.use(cors(corsOptions));
        
        // Логирование запросов
        this.app.use(requestLogger);
        
        // Rate limiting для API
        this.app.use('/api/', apiLimiter);
        
        // API ключ аутентификация (опционально)
        this.app.use('/api/', apiKeyAuth);
    }

    initializeRoutes() {
        // API роуты
        this.app.use('/api', apiRoutes);
        
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development'
            });
        });
        
        // 404 handler
        this.app.use('*', (req, res) => {
            res.status(404).json({
                error: 'Route not found',
                path: req.originalUrl,
                timestamp: new Date().toISOString()
            });
        });
    }

    initializeErrorHandling() {
        // Логирование ошибок
        this.app.use(errorLogger);
        
        // Обработка ошибок
        this.app.use(errorHandler);
    }

    validateEnvironment() {
        const requiredVars = [
            'GERMANY_API_URL',
            'USA_API_URL', 
            'FINLAND_API_URL',
            'USERNAME',
            'PASSWORD'
        ];

        const validation = validateEnvironment(requiredVars);
        
        if (!validation.isValid) {
            logger.error(validation.message);
            throw new Error(validation.message);
        }
        
        logger.info('Environment validation passed');
    }

    start() {
        this.validateEnvironment();
        
        this.app.listen(this.port, () => {
            logger.info(`Server started on port ${this.port}`, {
                port: this.port,
                environment: process.env.NODE_ENV || 'development',
                version: process.env.npm_package_version || '1.0.0'
            });
        });
    }
}

module.exports = App; 