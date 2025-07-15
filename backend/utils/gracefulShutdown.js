function setupGracefulShutdown(server, logger) {
    process.on('SIGTERM', () => {
        logger.info('SIGTERM received, shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
            process.exit(0);
        });
    });
    process.on('SIGINT', () => {
        logger.info('SIGINT received, shutting down gracefully');
        server.close(() => {
            logger.info('Process terminated');
            process.exit(0);
        });
    });
    process.on('uncaughtException', (error) => {
        logger.error('Uncaught Exception:', {
            error: error.message,
            stack: error.stack
        });
        throw error;
    });
    process.on('unhandledRejection', (reason, promise) => {
        logger.error('Unhandled Rejection at:', {
            promise,
            reason
        });
        throw reason instanceof Error ? reason : new Error(`Unhandled rejection: ${  reason}`);
    });
}

module.exports = { setupGracefulShutdown }; 