require('dotenv').config({quiet: true});
const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const erroHandler = require("./middleware/errorHandler");
const AppError = require("./utils/AppError");
const validateEnv = require('./utils/validateEnv');
const routes = require("./routes/index");
const corsOptions = require("./config/cors");

const app = express();
validateEnv();

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded ({extended: true}))

app.use((req, res, next) => {
    console.log(`INCOMING REQUEST: ${req.method} ${req.url}`);
    next();
});

//register routes
routes(app);

// healthcheck
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: "API Is WORKING..",
    });
});


app.use((req, res, next) => {
    console.log(`HIT 404 CATCH-ALL for ${req.url}`);
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(erroHandler);

module.exports = app;
