const AppError = require("../../utils/AppError");
const Task = require("./task.model");
const TaskAssignment = require("./taskAssignment.model");
const User = require("../user/user.model");
const { ROLES } = require("../../constant/roles");
const mongoose = require("mongoose");

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
    const tasks = await TaskAssignment.find({ assignedTo: id })
        .populate("task", "title description priority")
        .populate("assignedBy", "name email")
        .sort({ createdAt: -1 });
    return tasks;
};

const updateOne = async (taskId, updateData, user, assignedTo) => {

    // 1. Fetch the core Task to see what department it belongs to
    const task = await Task.findById(taskId.toString());
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

const getTaskWiseTask = async (id) => {

    return await Task.aggregate([
        {
            // 1️⃣ Filter by creator ID
            $match: {
                createdBy: new mongoose.Types.ObjectId(id),
            },
        },
        {
            // 2️⃣ Join with Department collection to grab name and code
            $lookup: {
                from: "departments", // ⚠️ Check if your collection name is pluralized 'departments'
                localField: "department",
                foreignField: "_id",
                as: "departmentDetails"
            }
        },
        {
            $unwind: {
                path: "$departmentDetails",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            // 3️⃣ Join with TaskAssignments (Keep as array to support multiple assignees!)
            $lookup: {
                from: "taskassignments",
                localField: "_id",
                foreignField: "task",
                as: "assignments"
            }
        },
        {
            // 4️⃣ Deep populate user info inside the assignments array
            $lookup: {
                from: "users",
                localField: "assignments.assignedTo",
                foreignField: "_id",
                as: "assignedUsers"
            }
        },
        {
            // 🔍 New Join: Look up the profile details of the task creator
            $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                as: "creatorInfo"
            }
        },
        {
            $unwind: {
                path: "$creatorInfo",
                preserveNullAndEmptyArrays: true
            }
        },
        {
            // 5️⃣ Shape the payload cleanly for your React frontend roster list
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                priority: 1,
                createdAt: 1,
                // If the assignments array has items, it means it is assigned
                isAssigned: { 
                    $gt: [{ $size: "$assignments" }, 0] 
                },
                // Returns clean department mapping nodes
                department: {
                    _id: "$departmentDetails._id",
                    name: { $ifNull: ["$departmentDetails.name", "Unassigned"] },
                    code: { $ifNull: ["$departmentDetails.code", "N/A"] }
                },
                createdBy: {
                    _id: "$creatorInfo._id",
                    name: { $ifNull: ["$creatorInfo.name", "Unknown Admin"] }
                },

                // Maps out all assigned users into a clean array list block
                // First projection helper stage:Convert array mapping into a single element extraction
                // 1 user to 1 task
                assignedUserRaw: {
                    $arrayElemAt: [
                        {
                            $map: {
                                input: "$assignments",
                                as: "assign",
                                in: {
                                    assignmentId: "$$assign._id",
                                    status: "$$assign.status",
                                    user: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: "$assignedUsers",
                                                    cond: { $eq: ["$$this._id", "$$assign.assignedTo"] }
                                                }
                                            },
                                            0
                                        ]
                                    }
                                }
                            }
                        },
                        0 // Extract index 0 to collapse the multi-row array structure instantly
                    ]
                }

                // 1 user to many task
                // assignedToUsers: {
                //     $map: {
                //         input: "$assignments",
                //         as: "assign",
                //         in: {
                //             assignmentId: "$$assign._id",
                //             status: "$$assign.status",
                //             user: {
                //                 // Find matching user object fields from our deep lookup array
                //                 $arrayElemAt: [
                //                     {
                //                         $filter: {
                //                             input: "$assignedUsers",
                //                             cond: { $eq: ["$$this._id", "$$assign.assignedTo"] }
                //                         }
                //                     },
                //                     0
                //                 ]
                //             }
                //         }
                //     }
                // }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                priority: 1,
                createdBy: 1,
                createdAt: 1,
                isAssigned: 1,
                department: 1,

                // many task 1 user
                // assignedToUsers: {
                //     $map: {
                //         input: "$assignedToUsers",
                //         as: "item",
                //         in: {
                //             assignmentId: "$$item.assignmentId",
                //             status: "$$item.status",
                //             _id: "$$item.user._id",
                //             name: "$$item.user.name",
                //             email: "$$item.user.email"
                //         }
                //     }
                // }
            // ⚡ NEW: Flat, structured assignment object instead of an array wrapper shell
                assignedTo: {
                    $cond: [
                        { $ifNull: ["$assignedUserRaw.assignmentId", false] },
                        {
                            assignmentId: "$assignedUserRaw.assignmentId",
                            status: "$assignedUserRaw.status",
                            _id: "$assignedUserRaw.user._id",
                            name: "$assignedUserRaw.user.name",
                            email: "$assignedUserRaw.user.email"
                        },
                        null // Clean fallback to prevent undefined references on unassigned cards
                    ]
                }
            }
        }
    ]);

    // return {tasks, userAssigned };
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
    getTaskWiseTask,
    create,
    remove,
    getAll,
    getOne,
    updateOne,
    assignOne,
    getTaskByEmployee,
};
