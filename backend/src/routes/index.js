const authRoutes = require("../modules/auth/auth.router");
const taskRoutes = require("../modules/task/task.router");
const userRoutes = require("../modules/user/user.route");
const dept = require("./config.routes");

const routes = (app) => {
  // app.use("/api/v1/auth", authRoutes);
  // app.use("/api/v1/task", taskRoutes);
  // app.use("/api/v1/user", userRoutes);
  // app.use("/api/v1/dept", dept);
  app.use(req, res)  console.log("hello ");
}
};

module.exports = routes;
