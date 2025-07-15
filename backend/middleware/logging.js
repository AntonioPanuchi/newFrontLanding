function requestLogger(logger) {
    return (req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info({
                method: req.method,
                url: req.url,
                status: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent')
            });
        });
        next();
    };
}

module.exports = { requestLogger }; 