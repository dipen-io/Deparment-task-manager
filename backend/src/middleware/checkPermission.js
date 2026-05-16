const User = require("../modules/user/user.model");
const AppError = require("../utils/AppError");

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // populate the roles filed from user model
      // 1. Fetch user and deeply populate roles -> permissions
      const user = await User.findById(req.user._id).populate({
        path: "roles",
        populate: {
          path: "permission",
          model: "Permission",
        },
      });

      if (!user) {
        throw new AppError("User not found", 404);
      }

      // 2 Extract all permision names into an flat array
      const userPermissions = user.roles.flatMap((role) =>
        role.permission.map((p) => p.name),
      );

      // 3. Check if the required permission exists in the user's permission list

      // checking if the Role model name filed permision have that permission that user passed
      if (!userPermissions.includes(permission)) {
        return next(
          new AppError(
            "You do not have permission to perform this action",
            403,
          ),
        );
      }
      // const hashPermision = user.roles.permission.includes(permission);
      // if (!hashPermision) {
      //   throw new AppError("Forbidden: not your department", 403);
      // }

      req.userDoc = user;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { checkPermission };
