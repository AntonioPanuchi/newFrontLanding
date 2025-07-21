export function createCorsOptions(logger, nodeEnv = process.env.NODE_ENV) {
    if (nodeEnv === 'development') {
        logger?.info?.('CORS: development mode, allowing all origins');
        return {
            origin: true,
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: [
                'Content-Type',
                'Authorization',
                'X-Requested-With',
                'Origin',
                'Accept'
            ]
        };
    }

    return {
        origin(origin, callback) {
            logger?.debug?.(`CORS check for origin: ${origin}`);
            if (!origin) {
                logger?.debug?.('Allowing request without origin');
                return callback(null, true);
            }

            const allowedOrigins = [
                'https://rx-test.ru',
                'https://www.rx-test.ru',
                'http://localhost:3000',
                'http://127.0.0.1:3000',
                'http://localhost:3001',
                'http://127.0.0.1:3001',
                'http://localhost:5173'
            ];

            if (allowedOrigins.includes(origin)) {
                logger?.debug?.(`Origin ${origin} is allowed`);
                callback(null, true);
            } else {
                logger?.warn?.(`Origin ${origin} is not allowed`);
                callback(new Error(`Not allowed by CORS: ${origin}`));
            }
        },
        credentials: true,
        optionsSuccessStatus: 200,
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'Origin',
            'Accept'
        ]
    };
}
