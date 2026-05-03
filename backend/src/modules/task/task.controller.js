const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const { ROLES } = require("../../constant/roles");
const {
  getTaskByEmployee,
  create,
  remove,
  getAll,
  getOne,
  updateOne,
  assignOne,
  getDeptWiseTask,
} = require("./task.service");
const { HTTP_STATUS } = require("../../constant/httpStatus");

// creat task
const createTask = asyncHandler(async (req, res) => {
  const taskPayoad = {
    ...req.body,
    createdBy: req.user._id,
    assignedTo: req.body.assigneeId,
  };

  const result = await create(taskPayoad);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(201, "Task created successfully", result));
});

// delete task
const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const user = req.user;
  await remove(taskId, user);
  res
    .status(HTTP_STATUS.OK)
    .json(new ApiResponse(200, "Task deleted successfully", null));
});

// get all task by admin
const getAllTasks = asyncHandler(async (req, res) => {
  // Pass req.query so the service can read ?status=... or ?page=...
  const result = await getAll(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, "Tasks retrieved successfully", result));
});

const getSingleTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const user = req.user;

  const task = await getOne(taskId, user);
  const responsePayload = {
    accessedByRole: user.role, // Will be "Admin" or "Employee"
    accessedByName: user.name, // Bonus: literally tells you who!
    taskData: task,
  };
  res
    .status(200)
    .json(new ApiResponse(200, "Task retrieved successfully", responsePayload));
});

const updateTask = asyncHandler(async (req, res) => {
  // Task update by admin only
  // task status update by employee
  const taskId = req.params.id;
  const updatePayload = req.body;
  console.log("body", req.body);
  const assignedTo = req.body.assigneeId;
  const user = req.user;

  // Pass everything to our smart service
  const updatedTask = await updateOne(taskId, updatePayload, user, assignedTo);

  res
    .status(200)
    .json(new ApiResponse(200, "Task updated successfully", updatedTask));
});

const assignTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  console.log("taskId", taskId);
  const { assignedTo } = req.body;
  console.log("assignedTo", assignedTo);

  // Pass them to the service
  const task = await assignOne(taskId, assignedTo);

  res
    .status(200)
    .json(new ApiResponse(200, "Task assigned successfully", task));
});

const getTaskByEmp = asyncHandler(async (req, res) => {
  const id = req.user._id;
  const tasks = await getTaskByEmployee(id);
  const payload = {
    count: tasks.length,
    data: tasks,
  };
  res
    .status(200)
    .json(new ApiResponse(200, "Task by Employee successfully", payload));
});

// get head dept only task
const getDeptSelft = asyncHandler(async (req, res) => {
  const id = req.user._id;
  // if admin then return all tasks
  if (req.user.role === ROLES.ADMIN) {
    const tasks = await getAll(req.query);
    res.status(200).json(new ApiResponse(200, "oh you are admin ", tasks));
  }
  return;
  const tasks = await getDeptWiseTask(id);
  res.status(200).json(new ApiResponse(200, "My All Task", tasks));
});

// view all users by admin / dept wise by dept_head
//TODO;

module.exports = {
  createTask,
  deleteTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  assignTask,
  getTaskByEmp,
  getDeptSelft,
};
