const authRoutes = require("../modules/auth/auth.router");
const taskRoutes = require("../modules/task/task.router");
const userRoutes = require("../modules/user/user.route");
const dept = require("./config.routes");
const permission = require("../modules/permission/permission.routes");
const roleRoutes = require("../modules/role/role.router");
const deptRoutes = require("../modules/department/department.router");
const chatRoutes = require("../modules/chat/chat.router");

const routes = (app) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/task", taskRoutes);
  app.use("/api/v1/user", userRoutes);
  app.use("/api/v1/dept", dept);
  app.use("/api/v1/permission", permission);
  app.use("/api/v1/role", roleRoutes);
  app.use("/api/v1/dept", deptRoutes, chatRoutes);
};

module.exports = routes;
