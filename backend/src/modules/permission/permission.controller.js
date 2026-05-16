// permission.controller.js
const asyncHandler = require("../../utils/asyncHandler");

const {
  getPerm,
  updatePerm,
  deletePerm,
  createPerm,
} = require("./permission.service");

// CREATE PERMISSION
const getPermission = asyncHandler(async (req, res) => {
  console.log("HELLO");
  const permissions = await getPerm();
  console.log("HELLO");
  res
    .status(200)
    .json(
      new ApiResponse(200, "Employees retrieved successfully", permissions),
    );
});

createPermission;
const deletePermission = asyncHandler(async (req, res) => {});
const createPermission = asyncHandler(async (req, res) => {});
const editPermission = asyncHandler(async (req, res) => {});

module.exports = {
  createPermission,
  deletePermission,
  getPermission,
  editPermission,
};
