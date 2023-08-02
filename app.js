const cookieParser = require("cookie-parser");
const express = require("express");
const morgan = require("morgan");
const app = express();
const response = require("./functions/response");
const tokenRouter = require("./routes/Token");
const historyRouter = require("./routes/History");
const searchRouter = require("./routes/Search");
const reasonRouter = require("./routes/Reason");

// Middlewares:
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/token/", tokenRouter);
app.use("/history/", historyRouter);
app.use("/search/", searchRouter);
app.use("/reason/", reasonRouter);

app.all("*", (req, res) => {
  response({
    req,
    message: "error 404",
    error: true,
  })(res);
});

module.exports = app;
