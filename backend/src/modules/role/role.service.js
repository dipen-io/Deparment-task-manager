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

// here let make if sending another same permission will remove that permission
const updateRoles = async(roleId, { roleName, permissionId }) => {

    const role = await Role.findById(roleId);

    if (!role) {
        throw new AppError("Role not found", 404);
    }

    // update name 
    if (roleName) {
        role.name = roleName.trim().toUpperCase();
    }

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

    try {
       await role.save(); 
        return role;
    } catch (error) {
        if (error.code === 11000) {
            throw new AppError("This role group identifier name is already taken.", 409);
        } 
        throw error;
    }

    const updateQuery = { $set: {}, $addToSet: {} };


    const validRole = await Role.findById(roleId);

    let exist = []
    let notExist = []

    permissionId?.forEach(element => {
       const exists = validRole.permission.some((perm) => perm._id.toString() === element)

        if (exists) {
            exist.push(element)
        } else {
            notExist.push(element)
        }
    });

    if (exist) {
        // remove that permissionId from db
        exist.forEach(ele => {
            validRole.permission = validRole.permission.filter((perm) => {
                perm._id.toString() !== ele;
            })
        })
    }

    if (notExist) {
        // add that permissionId to db
        validRole.permission.push(...notExist);
    }

    // clean up 
    if (Object.keys(updateQuery.$set).length === 0) delete updateQuery.$set;
    // if (Object.keys(updateQuery.$addToSet).length === 0 ) delete updateQuery.$addToSet;

    const updatedRole = await Role.findByIdAndUpdate(roleId, updateQuery,
        {
            returnDocument: 'after',
            runValidators: true
        } 
    );
    await validRole.save();

    if (!updatedRole) {
        throw new AppError('No role discoverd matching that tracking ID', 404);
    }
    return updatedRole;
}

const deleteRoles = async (roleId) => {
}

module.exports = { createRoles, getRoles, updateRoles, deleteRoles };
