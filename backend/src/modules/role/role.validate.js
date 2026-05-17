const {body} = require("express-validator");

const roleValidator = [
    body('roleName').isString().notEmpty().withMessage("Role Name is required"),
    body('permissionId').isMongoId().notEmpty().withMessage("Role Name is required")
]

module.exports = { roleValidator };
