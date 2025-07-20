function setupGracefulShutdown(server, logger) {
  const shutdown = signal => {
    logger.info(`${signal} received — graceful shutdown`);
    server.close(() => {
      logger.info('Server closed');
      process.exitCode = 0; // no-process-exit compliant
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', err => {
    logger.error('Uncaught Exception:', { error: err.message, stack: err.stack });
    throw err;
  });

  process.on('unhandledRejection', (reason, p) => {
    logger.error('Unhandled Rejection:', { promise: p, reason });
    throw reason instanceof Error ? reason : new Error(String(reason));
  });
}

module.exports = { setupGracefulShutdown };
