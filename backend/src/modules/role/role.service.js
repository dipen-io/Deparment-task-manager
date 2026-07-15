const Role = require("./role.model");
const User = require("../user/user.model");
const AppError = require("../../utils/AppError");

const createRoles = async ({roleName, permissionId}) => {
    const roles = await Role.create({
        name: roleName,
        permission: permissionId
    })
    return roles;
}

const getRoles = async () => {
    const roles = await Role.find({})
    .select("name permissions")
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

    // console.log("ROLES: ", roles);
    // console.log(JSON.stringify(roles, null, 2));
    return roles;
};

// here let make if sending another same permission will remove that permission
const updateRoles = async(roleId, { roleName, toAdd = [], toRemove = [] }) => {

    const role = await Role.findById(roleId);

    if (!role) {
        throw new AppError("Role not found", 404);
    }

    // update name 
    if (roleName) {
        role.name = roleName.trim().toUpperCase();
    }

    // add
    if (Array.isArray(toAdd) && toAdd.length > 0 ) {
        const existing = role.permission.map((id) => id.toString());

        toAdd.forEach((id) => {
            if (!existing.includes(id.toString())) {
                role.permission.push(id);
            }
        });
    }

    // remove
    if (Array.isArray(toRemove) && toRemove.length > 0) {
        const removeSet = new Set(toRemove.map(String));

        role.permission = role.permission.filter(
            (id) => !removeSet.has(id.toString())
        );
    }

    /* 
     * if ther is one permissionId = []
     * and sending already existed id will remove it  or if new then add it 
    if (permissionId && Array.isArray(permissionId)) {
        // convert rule role objectId to clearn string
        const existingPerms = role.permission.map(id => id.toString());

        permissionId.forEach(incomingId => {
            const stringId = incomingId.toString();
            const index = existingPerms.indexOf(stringId);

            if (index > -1) {
                // IF Exist Remove 
                // existingPerms.push(stringId);
                existingPerms.slice(index, 1);
                role.permission.splice(index, 1);
            } else {
                //IF Not Exist push it
                existingPerms.push(stringId);
                role.permission.push(incomingId);
            }
        });
    }
     */
    try {
       await role.save(); 
        return role;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError("This role group identifier name is already taken.", 409);
        } 
        throw error;
    }
}

const deleteRoles = async (roleId) => {
    try {
        const deletedRole = await Role.findByIdAndDelete(roleId);

        if (!deletedRole) {
            throw new AppError("Role not found", 404);
        }

        return deletedRole;
    } catch (error) {
        throw new AppError("Failed to delete role", 500);
    }
};

const getUpdatedUser = async (userId, roleId) => {
    const validUser = await User.findById(userId);
    const validRole = await Role.findById(roleId);

    if (!validUser || !validRole) {
        throw new AppError("Invalid user or role", 404)
    }
    validUser.roles = roleId;
    validUser.save();
    return validUser
}

const getRolesUsingId = async(userId) => {
    const validUserId = await User.findById(userId).populate('roles')
    .populate({
        path: "roles",
        populate: {
            path: "permission",
            model: "Permission"
        }
    })

    if (validUserId == null) {
        // two case he may be admin or usel
    }
    if (!validUserId) {
        throw new AppError("Invalid userId or role not found", 404)
    }
    return validUserId
}

module.exports = { createRoles, getRoles, updateRoles, deleteRoles, getUpdatedUser, getRolesUsingId };
