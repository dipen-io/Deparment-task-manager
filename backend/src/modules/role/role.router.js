const router = require("express").Router();
const validate = require("../../middleware/input-validate");
const { getRole, createRole, assingRoleToUser, deleteRole, updateRole, currentUserRoles } = require("./role.controller");
const {roleValidator} = require("./role.validate");

router.get("/", getRole);
router.post("/", roleValidator,validate ,createRole);
router.get("/:id", currentUserRoles);
router.patch("/:id", updateRole);
router.put("/:userId", assingRoleToUser);
router.delete("/:id", deleteRole);

module.exports = router; 
