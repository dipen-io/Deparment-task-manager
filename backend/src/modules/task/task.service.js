const AppError = require("../../utils/AppError");
const Task = require("./task.model");
const TaskAssignment = require("./taskAssignment.model"); 
const User = require("../user/user.model");
const { ROLES } = require("../../constant/roles");

const create = async (taskData) => {
  const task = await Task.create(taskData);
  return task;
};

const remove = async (taskId, user) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }
  const isAdmin = user.role !== ROLES.DEPT_HEAD;
  const isCreator = task.createdBy.toString() === user._id.toString();

  if (!isAdmin && !isCreator) {
    throw new AppError("You do not have permission to delete this task", 403);
  }

  await Task.findByIdAndDelete(taskId);

  return;
};

const getAll = async (role, id, query) => {
  const filter = {};

  if (role === ROLES.DEPT_HEAD) {
    // he can see only the
    filter.createdBy = id;
  }

  // If the admin searches for a specific status (?status=completed)
  if (query.status) {
    filter.status = query.status;
  }

  if (query.assignedTo) {
    filter.assignedTo = query.assignedTo;
  }

  if (query.search) {
    // $regex allows partial matches, $options: 'i' makes it case-insensitive!
    filter.title = { $regex: query.search, $options: "i" };
  }

  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const tasks = await Task.find(filter)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Task.countDocuments(filter);

  return {
    tasks,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// single task
const getOne = async (taskId, user) => {
  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name");

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const isAdmin = user.role !== ROLES.MEMBER;
  const isAssignee = task.assignedTo?._id.toString() === user._id.toString();

  // 3. If they aren't an Admin AND they aren't the assignee, block them!
  if (!isAdmin && !isAssignee) {
    throw new AppError("You do not have permission to view this task", 403);
  }

  return task;
};

const getTaskByEmployee = async (id) => {
  const tasks = await Task.find({ assignedTo: id })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
  return tasks;
};

const updateOne = async (taskId, updateData, user, assignedTo) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const isAdmin = user.role !== ROLES.MEMBER;
  const isAssignee = task.assignedTo?.toString() === user._id.toString();

  if (!isAdmin && !isAssignee) {
    throw new AppError("You do not have permission to update this task", 403);
  }

  let finalUpdateData = {};

  if (isAdmin) {
    // ✅ admin can update everything
    finalUpdateData = { ...updateData };
    if (assignedTo) {
      finalUpdateData.assignedTo = assignedTo;
    }
    delete finalUpdateData.assigneeId;
  } else if (isAssignee) {
    // ✅ employee can ONLY update status
    if (!updateData.status) {
      throw new AppError("Employees can only update task status", 400);
    }
    finalUpdateData = { status: updateData.status };
  }

  const updatedTask = await Task.findByIdAndUpdate(taskId, finalUpdateData, {
    new: true,
    runValidators: true,
  })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name");

  return updatedTask;
};

const assignOne = async (taskId, newAssigneeId) => {
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError("Task not found", 404);
  }

  const employee = await User.findById(newAssigneeId);
  if (!employee) {
    throw new AppError("Employee not found in the database", 404);
  }

  task.assignedTo = newAssigneeId;

  await task.save();

  const updatedTask = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("createdBy", "name");

  return updatedTask;
};

const getDeptWiseTask = async (id) => {
  const tasks = await Task.find({ createdBy: id }).populate(
    "createdBy",
    "name email",
  );

  if (!tasks || tasks.length === 0) {
    // You could return an empty array or handle as needed
    return [];
  }

  return tasks;
};

const assingTask = async({userId, taskId}) => {
    const newTask = await  TaskAssignment.create({
        task: taskId,
        assignedTo: userId,
        assignedBy: "69f7c04664873be6ab4bbb73" 
    })
    return newTask;
}


module.exports = {
  assingTask,
  getDeptWiseTask,
  create,
  remove,
  getAll,
  getOne,
  updateOne,
  assignOne,
  getTaskByEmployee,
};
