require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const app = express();
const log = require("node-color-log");
const response = require("./functions/response");

// Listen:
app.listen(process.env.PORT, () => {
  log.success("Run in http://localhost:" + process.env.PORT);
});

// Middlewares:
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.all("*", (req, res) => {
  response({
    req,
    message: "Page not found",
    error: true,
  })(res);
});
