const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // 1. Production Mode
    if (process.env.NODE_ENV === 'production') {
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!'
            });
        }
    } 
    // 2. Development Mode (Default Fallback)
    else {
        res.status(err.statusCode).json({
            status: err.status,
            errors: err.errors && err.errors.length > 0 ? err.errors : undefined,
            message: err.message,
            stack: err.stack
        });
    }
    
};

module.exports = errorHandler;
