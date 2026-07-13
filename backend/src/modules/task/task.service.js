const AppError = require("../../utils/AppError");
const Task = require("./task.model");
const TaskAssignment = require("./taskAssignment.model");
const User = require("../user/user.model");
const { ROLES } = require("../../constant/roles");

const create = async (taskData) => {

    if (taskData.department === "") {
        taskData.department = null;
    };
    if (taskData.assigneeId === "") {
        taskData.assigneeId = null;
    };
    // if there is assignedTo i need to assing that userId to 
    const task = await Task.create(taskData);

    if (taskData.assigneeId) {
        const userId = taskData.assigneeId;  
        const taskId =  task._id.toString();
        await assingTask({
            userId,
            taskId,
        });
        return;
    }

    console.log("success!")

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
        throw new AppError(
            "You do not have permission to delete this task",
            403,
        );
    }

    await Task.findByIdAndDelete(taskId);

    return;
};

// OLD API
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
        // .populate("assignedTo", "name email") // removed
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
        .populate("department", "name head description")
        .populate("createdBy", "name");

    if (!task) {
        throw new AppError("Task not found", 404);
    }

    let assignedDetails;
    if (user.userType == "admin") {
        const assingTaskDetails = await TaskAssignment.findOne({
            task: task._id,
        }).populate("assignedTo", "name email");
        // if user is admin i need other detisl toos uch as
        // who is assgined too
        assignedDetails = assingTaskDetails?.assignedTo;
    }

    // const isAdmin = user.role !== ROLES.MEMBER;
    // const isAssignee = task.assignedTo?._id.toString() === user._id.toString();
    //
    // // 3. If they aren't an Admin AND they aren't the assignee, block them!
    // if (!isAdmin && !isAssignee) {
    //   throw new AppError("You do not have permission to view this task", 403);
    // }

    return { task, assignedDetails };
};

const getTaskByEmployee = async (id) => {
    const tasks = await Task.find({ assignedTo: id })
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 });
    return tasks;
};

const updateOne = async (taskId, updateData, user, assignedTo) => {
    console.log("assignedTo", assignedTo);
    // 1. Fetch the core Task to see what department it belongs to
    const task = await Task.findById(taskId);
    if (!task) {
        throw new AppError("Task not found", 404);
    }

    // 2. Identify the user's exact permissions
    const isAdmin = user.userType === "admin";
    const isHead = user.userType === "head";
    const isMember = user.userType === "member";

    // 3. Find the assignment for this specific task (if updating status/assignee)
    // If a member is calling this, they can only update their own assignment
    const assignmentQuery = { task: taskId };
    if (isMember) {
        assignmentQuery.assignedTo = user._id;
    }

    const assignment = await TaskAssignment.findOne(assignmentQuery);

    // 4. Enforce Permission Guardrails
    if (isHead) {
        // Heads can only touch tasks belonging to their own department
        const isSameDepartment =
            task.department?.toString() === user.department?.toString();
        if (!isSameDepartment) {
            throw new AppError(
                "You can only update tasks within your own department",
                403,
            );
        }
    } else if (isMember) {
        // Members cannot change core task info, and must own the assignment they are updating
        if (!assignment) {
            throw new AppError(
                "You do not have permission to update this task's assignment",
                403,
            );
        }
    }

    // 5. Handle updates based on who is asking
    let updatedTask = task;

    if (isAdmin || isHead) {
        // ✅ Admins & Heads can update core Task details (title, priority, etc.)
        if (Object.keys(updateData).length > 0) {
            updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
                new: true,
                runValidators: true,
            }).populate("createdBy", "name");
        }

        // ✅ Admins & Heads can also change who the task is assigned to or the status
        if (assignment) {
            if (assignedTo) assignment.assignedTo = assignedTo;
            if (updateData.status) assignment.status = updateData.status;
            await assignment.save();
        } else if (assignedTo) {
            // If no assignment exists yet, create one
            await TaskAssignment.create({
                task: taskId,
                assignedTo: assignedTo,
                assignedBy: user._id,
                status: updateData.status || "pending",
            });
        }
    } else if (isMember) {
        // ✅ Members can ONLY update status on their assignment
        if (!updateData.status) {
            throw new AppError("Members can only update task status", 400);
        }

        assignment.status = updateData.status;
        await assignment.save();
    }

    // 6. Return the updated task with populated data
    // Since assignments are in a different collection, we fetch the updated assignment state
    const finalAssignment = await TaskAssignment.findOne({
        task: taskId,
    }).populate("assignedTo", "name email");

    return {
        ...updatedTask.toObject(),
        assignment: finalAssignment,
    };
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

const assingTask = async ({ userId, taskId }) => {
    const newTask = await TaskAssignment.create({
        task: taskId,
        assignedTo: userId,
        assignedBy: "69f7c04664873be6ab4bbb73",
    });
    return newTask;
};

const fetchingTaskforUser = async (
    userId,
    search = "",
    limit = 10,
    page = 1,
) => {
    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    const filter = { assignedTo: userId };

    if (search && search.trim() !== "") {
        const matchingTasks = await Task.find(
            { title: { $regex: search.trim(), $options: "i" } },
            { _id: 1 }, // only fetch ID not full docs
        );
        filter.task = { $in: matchingTasks.map((t) => t._id) };
    }

    const [tasks, totalCount] = await Promise.all([
        TaskAssignment.find(filter)
            .populate("task", "title description dueData priority status")
            .populate("assignedBy", "name email")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        TaskAssignment.countDocuments(filter),
    ]);
    return {
        tasks,
        pagination: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            limit,
            hasNextPage: page * limit < totalCount,
            hasPrevPage: page > 1,
        },
    };
};

const unAssignTask = async (taskId, userId) => {
    try {
        const deleted = await TaskAssignment.findOneAndDelete({
            assignedTo: userId,
            task: taskId,
        });

        if (!deleted) {
            throw new AppError("Task assignment not found", 404);
        }

        return deleted;
    } catch (error) {
        if (error instanceof AppError) throw error;
        throw new AppError(
            "Something went wrong while unassigning the task",
            500,
        );
    }
};

const getTaskForAdminOnly = async (search, limit = 10, page = 1) => {
    page = Math.max(parseInt(page) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit) || 10, 1), 100);
    const skip = (page - 1) * limit;

    // 1. Build the search filter cleanly
    const matchFilter = {};
    if (search && search.trim() !== "") {
        // Match search query against either title OR description case-insensitively
        matchFilter.$or = [
            { title: { $regex: search.trim(), $options: "i" } },
            { description: { $regex: search.trim(), $options: "i" } },
        ];
    }

    const result = await Task.aggregate([
        // Place the match filter at the absolute top of the pipeline for best performance
        { $match: matchFilter },

        // Perform lookups on matching tasks
        {
            $lookup: {
                from: "taskassignments",
                localField: "_id",
                foreignField: "task",
                as: "assignment",
            },
        },
        {
            $unwind: {
                path: "$assignment",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "assignment.assignedTo",
                foreignField: "_id",
                as: "assignedUser",
            },
        },
        {
            $unwind: {
                path: "$assignedUser",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creatorUser",
            },
        },
        {
            $unwind: {
                path: "$creatorUser",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: "departments",
                localField: "department",
                foreignField: "_id",
                as: "dept",
            },
        },
        {
            $unwind: {
                path: "$dept",
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                priority: 1,
                createdAt: 1,
                updatedAt: 1,
                status: { $ifNull: ["$assignment.status", "pending"] },
                assignedTo: {
                    _id: "$assignedUser._id",
                    name: "$assignedUser.name",
                    email: "$assignedUser.email",
                },
                createdBy: {
                    _id: "$creatorUser._id",
                    name: "$creatorUser.name",
                },
                department: {
                    _id: "$dept._id",
                    name: "$dept.name",
                    code: "$dept.code",
                },
            },
        },
        { $sort: { createdAt: -1 } },

        // 2. Use $facet to calculate totalCount AND get paginated data in ONE query!
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: limit }],
            },
        },
    ]);

    // Extract values safely from the facet result arrays
    const totalCount = result[0]?.metadata[0]?.total || 0;
    const tasks = result[0]?.data || [];

    return {
        tasks,
        pagination: {
            totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit) || 1,
            limit,
            hasNextPage: page * limit < totalCount,
            hasPrevPage: page > 1,
        },
    };
};

module.exports = {
    getTaskForAdminOnly,
    unAssignTask,
    fetchingTaskforUser,
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
