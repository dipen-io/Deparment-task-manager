const {
  createPermission,
  deletePermission,
  editPermission,
  getPermission,
} = require("../permission/permission.controller");
const validate = require("../../middleware/input-validate");

const {
  addPermissionValidator,
  updatePermissionValidator,
} = require("../permission/permission.validate");
const router = require("express").Router();

router.get("/", getPermission);
router.post("/", addPermissionValidator, validate, createPermission);
router.patch("/:id", updatePermissionValidator, validate, editPermission);
router.delete("/:id", deletePermission);

module.exports = router;
