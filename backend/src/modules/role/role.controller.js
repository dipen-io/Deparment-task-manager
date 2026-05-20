const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const {createRoles, getRoles, getUpdatedUser, updateRoles, deleteRoles} = require("./role.service");

const createRole = asyncHandler(async(req, res) => {
    const roles  =  await createRoles(req.body) 
    res.status(201)
    .json(new ApiResponse(200, "creating new role", roles))
})


const getRole = asyncHandler(async (req, res) => {
    const role = await getRoles();

    res.status(200)
    .json(new ApiResponse(200, "fetching roles", role ))
})

const updateRole = asyncHandler(async(req, res )=> {
    const id = req.params.id
    const updatedData = await updateRoles(id, req.body);
    res.status(200)
    .json(new ApiResponse(200, "Role updated Successfully", updatedData));
})

const deleteRole = asyncHandler(async(req, res )=> {
    const roleId = req.params.id
    const deletedRoleData = await deleteRoles(roleId)
    res.status(200)
    .json(new ApiResponse(200, "Role deleted Successfully", deletedRoleData))
})

const assingRoleToUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { roleId } = req.body;

    const updatedUser = await getUpdatedUser(userId, roleId);
    res.status(200)
    .json(new ApiResponse(200, "updated user role", updatedUser));
})

module.exports = { createRole, getRole, updateRole, deleteRole, assingRoleToUser };
