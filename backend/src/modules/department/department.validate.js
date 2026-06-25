const { body } = require("express-validator");

const deptValidator = [
    body('name').isString().notEmpty().withMessage("Role Name is required"),
    body('description').isString().notEmpty().withMessage("Description is required"),
    body('manager').isMongoId().notEmpty().withMessage("Role Name is required")
]

module.exports = { deptValidator };
