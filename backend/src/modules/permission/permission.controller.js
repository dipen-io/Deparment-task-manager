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
  console.log("HELLO");
  const permissions = await getPerm(req);
  console.log("HELLO");
  res
    .status(200)
    .json(new ApiResponse(200, "Permission Recived Successfully", permissions));
});

const deletePermission = asyncHandler(async (req, res) => {});
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
