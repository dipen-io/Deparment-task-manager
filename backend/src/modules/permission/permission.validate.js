const { body } = require("express-validator");

const addPermissionValidator = [
  body("name").trim().isString().notEmpty().withMessage("Name is requried"),
  body("desc").trim().isString().optional(),
];

const updatePermissionValidator = [
  body("name").trim().isString().optional().withMessage("Name is requried"),
  body("desc").trim().isString().optional(),
];

module.exports = { addPermissionValidator, updatePermissionValidator };
