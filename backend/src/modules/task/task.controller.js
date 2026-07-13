const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const Task = require("../task/task.model");
const { ROLES } = require("../../constant/roles");
const {
  getTaskForAdminOnly,
  getTaskByEmployee,
  create,
  fetchingTaskforUser,
  remove,
  getAll,
  getOne,
  updateOne,
  assignOne,
  getDeptWiseTask,
  assingTask,
  unAssignTask,
} = require("./task.service");
const { HTTP_STATUS } = require("../../constant/httpStatus");

// creat task
const createTask = asyncHandler(async (req, res) => {
    console.log("req.body: ", req.body);
  const taskPayoad = {
    ...req.body,
    // createdBy: req.user._id,
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
  const id = req.user._id;
  const role = req.user.role;
  // Pass req.query so the service can read ?status=... or ?page=...
  const result = await getAll(role, id, req.query);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        `Tasks retrieved successfully by ${req.user.role}`,
        result,
      ),
    );
});

const getSingleTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const user = req.user;

  const task = await getOne(taskId, user);
  const responsePayload = {
    accessedByRole: user.userType, // Will be "Admin" or "Employee"
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
  const assignedTo = req.body.assignedTo;
  const user = req.user;

  // Pass everything to our smart service
  const updatedTask = await updateOne(taskId, updatePayload, user, assignedTo);

  res
    .status(200)
    .json(new ApiResponse(200, "Task updated successfully", updatedTask));
});

const assignTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { assignedTo } = req.body;

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

// get task count by all
const getTaskCount = asyncHandler(async (req, res) => {
  try {
    const { role, department: userDept, _id: userId } = req.user;
    const { department: targetDept } = req.query;
    let query = {};
    if (role === "org_admin") {
      // if (targetDept) query.department = targetDept;
      query = {};
    } else if (role === "dept_head") {
      // Dept Head: Restricted to their own department only
      // just return all created: id
      query.createdBy = userId;
    } else {
      // Member: Only see count of tasks assigned to them
      query.assignedTo = userId;
    }

    const count = await Task.countDocuments(query);

    res
      .status(200)
      .json(new ApiResponse(200, `Get Task Count by ${role}`, count));
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// assiging an user to an task with whole new model
const assignAnUserToTask = asyncHandler(async (req, res) => {
   // what i need is userId and taskId 

    const task = await assingTask(req.body); 

    res
      .status(200)
      .json(new ApiResponse(200, `Assgined an task to user`, task));
}) 

const unAssinAnUserToTask = asyncHandler(async (req, res) => {
    const { taskId, userId } = req.body;
    const deletedTask = await unAssignTask(taskId, userId); 

    res
      .status(200)
      .json(new ApiResponse(200, `Task Deleted Successfully`, deletedTask ));

})

// fetch user with search option
const getUserTask = asyncHandler (async (req, res) => {
    const { userId } = req.body;    
    const { search, limit, page = 1 } = req.query;

    const task = await fetchingTaskforUser(userId, search, limit, page); 

    res.status(200)
    .json(new ApiResponse(200, "fetch Task by user", task))
})

const getAdminTask = asyncHandler (async (req, res) => {

    const { search, limit, page } = req.query;

    const task = await getTaskForAdminOnly( search, limit, page); 

    res.status(200)
    .json(new ApiResponse(200, "Fetch Task by Admin", task))
})


module.exports = {
  getAdminTask, 
  unAssinAnUserToTask,
  getUserTask,
  assignAnUserToTask,
  createTask,
  deleteTask,
  getAllTasks,
  getSingleTask,
  updateTask,
  assignTask,
  getTaskByEmp,
  getDeptSelft,
  getTaskCount,
};
