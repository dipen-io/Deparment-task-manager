const app = require("./src/app");
const http = require("node:http");
const { Server } = require("socket.io");
const initializeChatSockets = require('./src/modules/chat/io');
const corsOptions = require("./src/config/cors");

const connectDb = require("./src/config/db");
// const makeAdmin = require("./src/middleware/makeAdmin");
// const seedDepartmentData = require("./src/modules/department/seedDept")

const PORT = process.env.PORT || 8081;

const server = http.createServer(app);

const io = new Server(server, {
    // cors: corsOptions
    cors: {
        origin: "*", // Allows any client address during testing
    }
});

app.set('io', io);

initializeChatSockets(io) 

const startServer = async () => {
  try {
    await connectDb();
    // await makeAdmin();
    // seedDepartmentData()
    server.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting the server:", error.message);
    process.exit(1);
  }
};

startServer();
