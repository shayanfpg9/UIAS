require("dotenv").config();
const log = require("node-color-log");
const connect = require("./functions/connect");
const app = require("./app");

// Listen:
connect(process.env.MONGOURI)
  .then(() => {
    if (process.env.NODE_ENV !== "test") {
      app.listen(process.env.PORT, () => {
        log.success("Run in http://localhost:" + process.env.PORT);
      });
    }
  })
  .catch((e) => {
    log.error(e);
  });

app.enable("trust proxy");