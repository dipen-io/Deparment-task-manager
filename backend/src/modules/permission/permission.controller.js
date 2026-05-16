// permission.controller.js
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");

const {
  getPerm,
  updatePerm,
  deletePerm,
  createPerm,
} = require("./permission.service");

// CREATE PERMISSION
const getPermission = asyncHandler(async (req, res) => {
  const permissions = await getPerm(req);
  res
    .status(200)
    .json(new ApiResponse(200, "Permission Recived Successfully", permissions));
});

// DELETE PERMISSION
const deletePermission = asyncHandler(async (req, res) => {
  const permissionId = req.params.id;
  await deletePerm(permissionId);
  res.status(200).json(new ApiResponse(200, "Permission Deleted Successfully"));
});

const createPermission = asyncHandler(async (req, res) => {
  const permission = await createPerm(req.body);
  res
    .status(200)
    .json(new ApiResponse(201, "Permission Created Successfully", permission));
});

const editPermission = asyncHandler(async (req, res) => {});

module.exports = {
  createPermission,
  deletePermission,
  getPermission,
  editPermission,
};
