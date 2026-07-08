const asyncHandler = require("../../utils/asyncHandler");
const {
    getDept,
    createDept,
    deleteDept,
    updateDept,
    assignDept,
    removeDepartment,
} = require("./department.service");
const ApiResponse = require("../../utils/ApiResponse");

exports.createDepartment = asyncHandler(async (req, res) => {
    const data = await createDept(req.body);
    res.status(201).json(new ApiResponse(201, "creating new department", data));
});

exports.getDepartment = asyncHandler(async (req, res) => {
    const departments = await getDept(req.query);

    res.status(200).json(
        new ApiResponse(200, "fetching department", departments),
    );
});

exports.delDepartment = asyncHandler(async (req, res) => {
    const deptId = req.params.id;
    await deleteDept(deptId);

    res.status(200).json(
        new ApiResponse(200, "Department Deleted Successfully"),
    );
});

exports.updateDepartment = asyncHandler(async (req, res) => {
    const deptId = req.params.id;
    const { name, description, manager } = req.body;
    const updatedData = await updateDept({
        deptId,
        name,
        description,
        manager,
    });

    res.status(200).json(
        new ApiResponse(200, "Department updated successfully", updatedData),
    );
});

exports.assignDepartment = asyncHandler(async (req, res) => {
    const { userId, deptId } = req.params;
    const { role } = req.body
    const user = await assignDept(userId, deptId, role);
    res.status(200).json(
        new ApiResponse(200, "Department assigned successfully", user),
    );
});

exports.unassingDepartment = asyncHandler( async (req, res) => {
    const userId = req.params.id;
    await removeDepartment(userId);

    res.status(200).json(
        new ApiResponse(200, "Department removed successfully" ),
    );
})
