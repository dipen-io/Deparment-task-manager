const User = require("./user.model");
const Department = require('../department/department.model') ;
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
        .populate({
            path: "roles",
            populate: {
                path: 'permission',
                model: "Permission"
            },
        })
        .populate({
            path: "department",
        })

    // .populate({
    //   path: "permissions",
    //   select: "name desc createdBy",
    //   populate: {
    //     path: "createdBy",
    //     model: "User",
    //     select: "name email role"
    //   }
    // })
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  return employees;
};

const getUsersService = async (currentUser) => {
  // if the user is dept_head then return only that department
  let query = {};

  if (currentUser.userType === "admin") {
    // Org Admin: View all users
    query = {
      _id: { $ne: currentUser._id }, //excluding self
      // role: { $in: ["dept_head", "member"] },
    };
  } else if (currentUser.userType=== "head") {
    // Dept Head: Only users in their department
    query = { department: currentUser.department, userType: "member" };
  } else {
    // Members or unauthorized roles should be blocked
    throw new Error("403 Forbidden: Access Denied");
  }

  return await User.find(query).populate({
      path: 'roles',
      populate: 'permission'
  }).populate("department", "name code")
};


/*
 * Admin
 *  return all userType: users
 *  return member for current department
 *  return head for current department
 */
const usersByAdmin = async(deptId, deptCode) => {

    const [ users, memberInDept, department ] = await Promise.all([
        User.find({ userType: "user" }).lean(),
        User.find({ department: deptId }).lean(),
        Department.findOne({ code: deptCode })
        .populate("head")
        .lean(),
    ]);

    return {
        users,
        memberInDept,
        headInDept: department?.head || null
    }
}



module.exports = { getAllEmployees, getUsersService, usersByAdmin };
