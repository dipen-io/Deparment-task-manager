const { body } = require("express-validator");

const registerValidator = [
  body("name").trim().notEmpty().withMessage("Name is requried"),
  body("email").isEmail().withMessage("Email is requried"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character "),
  body("adminSecret").isString().optional(),
  body("role").isIn([ "head", "member" ]).optional(),
  body("department").isMongoId().optional(),
];

const loginValidator = [
  body("email").isEmail().withMessage("Valid email is requried"),
  body("password").isLength({ min: 6 }).withMessage("Password is required"),
];

module.exports = { registerValidator, loginValidator };
