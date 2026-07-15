const jwt = require("jsonwebtoken");
const User = require("../modules/user/user.model");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
// const { ROLES } = require("../constant/roles");

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AppError("No Token Provided", 401);
  }

  const token = authHeader.split(" ")[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired token", 401);
  }

  const user = await User.findById(decoded.id).lean();

  if (!user) throw new AppError("User no longer exists", 401);

  req.user = user;
  next();
});

const authorize = (...allowedRoles) => {
  // console.log("ROLES VERFIED!")
  return (req, res, next) => {
  // console.log("req.user from authorize => ", req.user);
    if (!req.user || !allowedRoles.includes(req.user.userType)) {
      return res.status(403).json({
        error:
          "403 Forbidden: You do not have permission to perform this action.",
      });
    }
    next();
  };
};

module.exports = { authorize, protect };
