const router = require("express").Router();
const { getRole, createRole } = require("./role.controller");

router.get("/", getRole);
router.post("/", createRole);


module.exports = router; 
