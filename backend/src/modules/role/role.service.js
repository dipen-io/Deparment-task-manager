const Role = require("./role.model");

const createRoles = async ({roleName, permissionId}) => {
    const roles = await Role.create({
        name: roleName,
        permission: permissionId
    })
    return roles;
}

const getRoles = async () => {
  const roles = await Role.find({})
    .select("name permission")
    .populate({
      path: "permission",
      select: "name desc createdBy",
      populate: {
        path: "createdBy",
        model: "User",
        select: "name email role"
      }
    })
    .lean(); // 4. Critical performance booster for read-only operations

  return roles;
};

module.exports = {createRoles, getRoles};
