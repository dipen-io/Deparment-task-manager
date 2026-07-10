const router = require("express").Router();
const { protect, authorize } = require("../../middleware/auth");
const { ROLES } = require("../../constant/roles");
const { user_member_head, listEmployees, getAllUsers } = require("../user/user.controller");

// GET All Employees (Strictly Admin Only)
router.get(
  "/employees",
  protect,
  authorize(ROLES.ADMIN, ROLES.DEPT_HEAD),
  listEmployees,
);

router.get('/user_member_head', user_member_head);

// Only Admin and Dept Head are allowed to view user lists
router.get("/users", protect, authorize("admin", "head"), getAllUsers);

module.exports = router;
