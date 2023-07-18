require("dotenv").config();

const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const app = express();
const log = require("node-color-log");
const response = require("./functions/response");
const connect = require("./functions/connect");
const tokenRouter = require("./routes/Token");

// Listen:
connect(process.env.MONGOURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      log.success("Run in http://localhost:" + process.env.PORT);
    });
  })
  .catch((e) => {
    log.error(e);
  });

app.enable("trust proxy");

// Middlewares:
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.all("*", (req, res) => {
  response({
    req,
    message: "error 404",
    error: true,
  })(res);
});
