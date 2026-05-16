const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const {createRoles, getRoles} = require("./role.service");

const createRole = asyncHandler(async(req, res) => {
    console.log(req.body);
    const roles  =  await createRoles(req.body) 
    res.status(201)
    .json(new ApiResponse(200, "creating new role", roles))
})

// const deletePermission = asyncHandler(async (req, res) => {
// })

const getRole = asyncHandler(async (req, res) => {
    const role = await getRoles();

    res.status(200)
    .json(new ApiResponse(200, "fetching roles", role ))
})

module.exports = { createRole, getRole };
