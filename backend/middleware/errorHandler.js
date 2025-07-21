export function errorHandler(logger) {
    return (err, req, res, next) => {
        logger?.error?.('Unhandled error:', {
            error: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method,
            status: res.statusCode,
            body: req.body,
            query: req.query,
            headers: req.headers,
            userAgent: req.get('User-Agent'),
            ip: req.ip || req.connection.remoteAddress
        });

        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Something went wrong on our end'
        });
    };
}
