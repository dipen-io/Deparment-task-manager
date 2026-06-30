const User = require("../user/user.model");
const bcrypt = require("bcrypt");
const AppError = require("../../utils/AppError");
const jwt = require("jsonwebtoken");
const { COOKIE_OPTIONS } = require("../../constant/cookieOption");

const generateToken = async (userId, role, department) => {
  const accessToken = jwt.sign(
    { id: userId, role, department },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    },
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
  );
  return { accessToken, refreshToken };
};

const registerUser = async ({ name, email, password, role, department }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new AppError("Email already in use", 409);

  // Default role is Employee
  // let userRole = "Employee";

  // If they provided the secret key, upgrade them to Admin
  // if (adminSecret && adminSecret === process.env.ADMIN_SECRET_KEY) {
  //   userRole = "Admin";
  // }

  const user = await User.create({
    name,
    email,
    password,
    role,
    department,
  });

  const { accessToken, refreshToken } = await generateToken(
    user._id,
    user.role,
    user.department,
  );
  user.refreshToken = await bcrypt.hash(refreshToken, 10);
  await user.save({ validateBeforeSave: false });
  // cookie is not set here

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    },
    accessToken,
    refreshToken,
  };
};

const loginUser = async (res, { email, password }) => {
    const user = await User.findOne({ email }).select("+password").populate('roles')
    .populate("department");
    if (!user) throw new AppError("Invalid email or password", 401);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid email or password", 401);

  const { accessToken, refreshToken } = await generateToken(
    user._id,
    user.roles.name,
    user.department.name,
  );

  const hashedToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedToken;
  await user.save({ validateBeforeSave: false });
  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      role: user.roles,
      department: user.department,
    },
    accessToken,
    refreshToken,
  };
};

const refreshAccessToken = async (res, token) => {
  if (!token) throw new AppError("Refresh Token is required", 401);
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await User.findById(decoded.id).select("+refreshToken");

  if (!user) {
    throw new AppError("User not found or token missing", 401);
  }

  const isMatch = await bcrypt.compare(token, user.refreshToken);

  if (!isMatch) {
    throw new AppError("Refresh token missmatch", 401);
  }

  const { accessToken, refreshToken } = await generateToken(
    user._id,
    user.role,
    user.department,
  );
  const hashedToken = await bcrypt.hash(refreshToken, 10);
  user.refreshToken = hashedToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);

  return { accessToken, refreshToken };
};

module.exports = { registerUser, loginUser, refreshAccessToken };
