function requestLogger(logger) {
    return (req, res, next) => {
        const start = Date.now();
        const { method, url, query, headers, body } = req;
        res.on('finish', () => {
            const duration = Date.now() - start;
            logger.info({
                method,
                url,
                status: res.statusCode,
                duration: `${duration}ms`,
                ip: req.ip || req.connection.remoteAddress,
                userAgent: req.get('User-Agent'),
                query,
                body,
                headers,
                responseSize: res.get('Content-Length') || null
            });
        });
        next();
    };
}

module.exports = { requestLogger }; 