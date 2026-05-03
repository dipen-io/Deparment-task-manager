const { validationResult } = require("express-validator");
const AppError = require("../utils/AppError");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        
        const extractedErrors = errors.array().map(err => err.msg);

        return next(
            new AppError('Validation Failed', 422, extractedErrors)
        );
    }
    
    next();
};

module.exports = validate;
