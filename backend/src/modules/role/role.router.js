const router = require("express").Router();
const validate = require("../../middleware/input-validate");
const { getRole, createRole, updateRole } = require("./role.controller");
const {roleValidator} = require("./role.validate");

router.get("/", getRole);
router.post("/", roleValidator,validate ,createRole);
router.patch("/:id", updateRole);

module.exports = router; 
