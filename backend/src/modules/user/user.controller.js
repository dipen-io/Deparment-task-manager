const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const { getAllEmployees, getUsersService } = require("./user.service");

const listEmployees = asyncHandler(async (req, res) => {
  const employees = await getAllEmployees(req.query);

  res
    .status(200)
    .json(new ApiResponse(200, "Employees retrieved successfully", employees));
});

const getAllUsers = async (req, res) => {
  try {
    const users = await getUsersService(req.user);
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

module.exports = { getAllUsers, listEmployees };
