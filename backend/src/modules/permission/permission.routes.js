const {
  createPermission,
  deletePermission,
  editPermission,
  getPermission,
} = require("../permission/permission.controller");
const router = require("express").Router();

router.get("/", getPermission);
router.post("/", createPermission);
router.patch("/:id", editPermission);
router.delete("/:id", deletePermission);

module.exports = router;
