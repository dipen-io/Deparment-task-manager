const { body } = require("express-validator");

const deptValidator = [
    body('name').isString().notEmpty().withMessage("Department Name is required"),
    body('description').isString().notEmpty().withMessage("Dept Description is required"),
    body('manager').isMongoId().optional()
]

module.exports = { deptValidator };
