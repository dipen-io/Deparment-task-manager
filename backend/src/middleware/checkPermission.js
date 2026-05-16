const User = require("../modules/user/user.model");
const AppError = require("../utils/AppError");

const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      // populate the roles filed from user model
      const user = await User.findById(req.user._id).populate("roles");
      if (!user) {
        throw new AppError("User not found", 404);
      }

      // checking if the Role model name filed permision have that permission that user passed
      const hashPermision = user.roles.permission.includes(permission);
      if (!hashPermision) {
        throw new AppError("Forbidden: not your department", 403);
      }

      req.userDoc = user;
      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = { checkPermission };
