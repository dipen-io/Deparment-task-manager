const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const { getAllEmployees, getUsersService, usersByAdmin } = require("./user.service");

const listEmployees = asyncHandler(async (req, res) => {
  const department = req.user.department;
  const role = req.user.role;
  const employees = await getAllEmployees(role, department, req.query);
    const data = {
        users: employees,
        totalUsers: employees.length, 
    }

  res
    .status(200)
    .json(new ApiResponse(200, "Employees retrieved successfully", data));
});

const getAllUsers = async (req, res) => {

  try {
    const { search } = req.query;
    const users = await getUsersService(req.user, search);
    const totalUsers = users.length;
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Users retrieved successfully by ${req.user.role}`,
          { totalUsers, users },
        ),
      );
  } catch (error) {
    if (error.message.includes("403")) {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const user_member_head = asyncHandler(async (req, res) => {
    const { deptId, deptCode } = req.query;
    const { users, memberInDept, headInDept } = await usersByAdmin(deptId, deptCode);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Users retrieved successfully by`,
          {users, memberInDept, headInDept },
        ),
      );
}) 

module.exports = { getAllUsers, listEmployees, user_member_head };
