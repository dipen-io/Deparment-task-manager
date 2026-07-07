const router = require("express").Router();
const { checkPermission } = require("../../middleware/checkPermission");
const {
  protect,
  authorize,
  CheckPermission,
} = require("../../middleware/auth");
const {
  getAdminTask,
  getUserTask,
  getTaskByEmp,
  updateTask,
  assignTask,
  createTask,
  deleteTask,
  getAllTasks,
  getSingleTask,
  getDeptSelft,
  getTaskCount,
  assignAnUserToTask,
  unAssinAnUserToTask,
} = require("./task.controller");
const {
  assignTaskValidator,
  createTaskValidator,
  taskIdValidator,
  updateTaskValidator,
} = require("./task.validate");
const validate = require("../../middleware/input-validate");
const { ROLES } = require("../../constant/roles");

router.post(
  "/create",
  // protect,
  // authorize(ROLES.ADMIN, ROLES.DEPT_HEAD),
  // checkPermission("CREATE_TASK"),
  createTaskValidator,
  validate,
  createTask,
);

// new assing
router.post(
    "/assgn",
    assignAnUserToTask
)

router.get('/get', getUserTask)
router.get('/admin/task', getAdminTask)

// client fetching this for showing task by empl
// EMPLOYEE
router.get(
  "/my-tasks",
  protect,
  authorize(ROLES.ADMIN, ROLES.DEPT_HEAD, ROLES.MEMBER),
  getTaskByEmp,
);

router.get(
  "/count",
  protect,
  authorize(ROLES.ADMIN, ROLES.DEPT_HEAD, ROLES.MEMBER),
  getTaskCount,
);

router.get(
  "/myself-task",
  protect,
  authorize(ROLES.ADMIN, ROLES.DEPT_HEAD),
  getDeptSelft,
);

router.delete("/unassign", unAssinAnUserToTask);

router.delete("/:id", protect, taskIdValidator, validate, deleteTask);
router.get("/", protect, authorize(ROLES.ADMIN, ROLES.DEPT_HEAD), getAllTasks);

// GET Single Task (Admins & Assignees)
router.get("/:id", protect, taskIdValidator, validate, getSingleTask);

// UPDATE Task (Smart Route for both Admins & Employees)
// EMPLOYEE use this route for updating task status
router.patch(
  "/:id",
  protect,
  taskIdValidator,
  updateTaskValidator,
  validate,
  updateTask,
);

// ASSIGN Task (Admin Only)
// in body Employees id
router.patch(
  "/:id/assign",
  protect,
  authorize(ROLES.ADMIN),
  assignTaskValidator,
  validate,
  assignTask,
);

module.exports = router;
