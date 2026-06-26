const AppError = require("../../utils/AppError");
const Department = require("./department.model");
const User = require("../user/user.model");

const createDept = async (data) => {
    try {
        const new_dept = await Department.create(data);
        return new_dept;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError("Department name already eixst", 409);
        }
    }
};

const getDept = async (query = {}) => {
    const {
        cursor,
        limit = 1,
        search,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = query;

    const pageSize = Math.min(parseInt(limit) || 20, 100);
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    const matchStage = {};

    if (cursor) {
        try {
            if (sortBy == "id") {
                matchStage._id = {
                    [sortDirection === 1 ? "$gt" : "$lt"]: cursor,
                };
            } else {
                const cursorDate = new Date(cursor);
                if (!isNaN(cursorDate)) {
                    matchStage[sortBy] = {
                        [sortDirection === 1 ? "$gt" : "$lt"]: cursorDate,
                    };
                }
            }
        } catch (error) {
            throw new AppError("Invalid  cursor format", 400);
        }
    }

    // search accross multiple fields
    if (search && search.trim()) {
        const searchRegex = new RegExp(search.trim(), "i");
        matchStage.$or = [
            { name: searchRegex },
            { description: searchRegex },
            { code: searchRegex }, // if have department code
        ];
    }

    // build the aggregation pipelines
    const pipeline = [
        { $match: matchStage },
        { $sort: { [sortBy]: sortDirection, _id: sortDirection } },
        { $limit: pageSize + 1 }, // extrac 1 for if there is more
    ];

    const results = await Department.aggregate(pipeline);

    // Determine if there is next page
    const hasMore = results.length > pageSize;
    const departments = hasMore ? results.slice(0, pageSize) : results;

    // Generate next cursor
    let nextCursor = null;
    if (hasMore && departments.length > 0) {
        const lastDoc = departments[departments.length - 1];
        nextCursor =
            sortBy === "_id"
                ? lastDoc._id.toString()
                : lastDoc[sortBy]?.toISOString?.() || lastDoc[sortBy];
    }

    return {
        data: departments,
        nextCursor,
        hasMore,
        limit: pageSize,
    };
};

const deleteDept = async (deptId) => {
    const dept = await Department.findById(deptId);
    if (!dept) {
        throw new AppError("Department not Exist", 404);
    }
    await Department.findByIdAndDelete(deptId);
};

const updateDept = async ({ deptId, name, description, manager }) => {
    const data = {};
    if (name !== undefined) data.name = name;
    if (description !== undefined) data.description = description;
    if (manager !== undefined) data.manager = manager;

    if (Object.keys(data).length === 0) {
        throw new AppError("No valid fieles are provided for update", 400);
    }

    const updatedData = await Department.findByIdAndUpdate(
        deptId,
        {
            $set: data,
        },
        { new: true, runValidator: true },
    );
    if (!updatedData) {
        throw new AppError("Department does not exist ", 404);
    }

    return updatedData;
};

const assignDept = async ( userId, deptId ) => {
    const dept = await Department.findById(deptId);
    if (!dept) {
        throw new AppError("Department does not exist", 404);
    }

    const existingUser = await User.findById(userId);

    if (!existingUser) {
        throw new AppError("User does not existe", 404);
    }

    if (existingUser.department?.toString() === deptId) {
        return {
            user: await existingUser.populate("department", "name description"),
            mesage: "User already assigned to this department"
        }
    }

    // update user with new department
    const user = await User.findByIdAndUpdate(
        userId,
        {
            $set: { department: deptId },
        },
        { new: true, runValidators: true },
    ).populate("department", "name description");

    if (!user) {
        throw new AppError("User does not exist", 404);
    }
    return user;
};

const removeDepartment = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        { $unset: { department: 1}}, // remove this fields
        { new: true }
    );

    if (!user) {
        throw new AppError("User does not exist", 404);
    }

    return user;

}

module.exports = { createDept, getDept, deleteDept, updateDept, assignDept, removeDepartment };
