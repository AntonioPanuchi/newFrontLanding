function errorHandler(logger) {
    return (err, req, res, next) => {
        logger && logger.error && logger.error('Unhandled error:', {
            error: err.message,
            stack: err.stack,
            url: req.url,
            method: req.method
        });
        res.status(500).json({
            error: 'Internal Server Error',
            message: 'Something went wrong on our end'
        });
    };
}

module.exports = { errorHandler }; 