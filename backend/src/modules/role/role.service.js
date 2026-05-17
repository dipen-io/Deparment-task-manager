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

const updateRoles = async(roleId, { roleName, permissionId }) => {
    const updateQuery = { $set: {}, $addToSet: {} };

    if (roleName) {
        updateQuery.$set.name = roleName.trim().toUpperCase();
    }

    if (permissionId) {
        updateQuery.$addToSet.permission = permissionId;
    }

    // clean up 
    if (Object.keys(updateQuery.$set).length === 0) delete updateQuery.$set;
    if (Object.keys(updateQuery.$addToSet).length === 0 ) delete updateQuery.$addToSet;

    const updatedRole = await Role.findByIdAndUpdate(roleId, updateQuery,
        {
            returnDocument: 'after',
            runValidators: true
        } 
    );

    if (!updatedRole) {
        throw new AppError('No role discoverd matching that tracking ID', 404);
    }
    return updatedRole;
}

const deleteRoles = async (roleId) => {
}

module.exports = { createRoles, getRoles, updateRoles, deleteRoles };
