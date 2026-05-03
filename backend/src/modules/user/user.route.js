const router = require("express").Router();
const { protect, authorize } = require("../../middleware/auth");
const { ROLES } = require("../../constant/roles");
const { listEmployees, getAllUsers } = require("../user/user.controller");

// GET All Employees (Strictly Admin Only)
router.get(
  "/employees",
  protect,
  authorize(ROLES.ADMIN, ROLES.DEPT_HEAD),
  listEmployees,
);

// Only Admin and Dept Head are allowed to view user lists
router.get("/users", protect, authorize("org_admin", "dept_head"), getAllUsers);

module.exports = router;
