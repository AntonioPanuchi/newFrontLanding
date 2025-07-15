function createCorsOptions(logger, nodeEnv = process.env.NODE_ENV) {
    // В dev-режиме разрешаем все Origin
    if (nodeEnv === 'development') {
        logger && logger.info && logger.info('CORS: development mode, allowing all origins');
        return {
            origin: true, // Разрешить все
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
        };
    }
    // В production — строгий whitelist
    return {
        origin(origin, callback) {
            logger && logger.debug && logger.debug(`CORS check for origin: ${origin}`);
            if (!origin) {
                logger && logger.debug && logger.debug('Allowing request without origin');
                return callback(null, true);
            }
            const allowedOrigins = [
                'https://rx-test.ru',
                'https://www.rx-test.ru',
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'http://localhost:3001',
                'http://127.0.0.1:3001',
                'http://localhost:5173' // для Vite dev server
            ];
            logger && logger.debug && logger.debug(`Checking if ${origin} is in allowed origins: ${allowedOrigins.join(', ')}`);
            if (allowedOrigins.indexOf(origin) !== -1) {
                logger && logger.debug && logger.debug(`Origin ${origin} is allowed`);
                callback(null, true);
            } else {
                logger && logger.warn && logger.warn(`Origin ${origin} is not allowed`);
                callback(new Error(`Not allowed by CORS: ${origin}`));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Origin', 'Accept']
    };
}

module.exports = { createCorsOptions }; 