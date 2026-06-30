const User = require("./user.model");
const { ROLES } = require("../../constant/roles");

const getAllEmployees = async (role, department, query) => {
  const filter = { role: "member" };

  if (role === ROLES.DEPT_HEAD) {
    filter.department = department;
  }
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { email: { $regex: query.search, $options: "i" } },
    ];
  }

  const employees = await User.find(filter)
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return employees;
};

const getUsersService = async (currentUser) => {
  // if the user is dept_head then return only that department
  let query = {};

  if (currentUser.role === "org_admin") {
    // Org Admin: View all users
    query = {
      _id: { $ne: currentUser._id }, //excluding self
      // role: { $in: ["dept_head", "member"] },
    };
  } else if (currentUser.role === "dept_head") {
    // Dept Head: Only users in their department
    query = { department: currentUser.department, role: "member" };
  } else {
    // Members or unauthorized roles should be blocked
    throw new Error("403 Forbidden: Access Denied");
  }

  return await User.find(query).populate({
      path: 'roles',
      populate: 'permissions'
  });
};

module.exports = { getAllEmployees, getUsersService };
