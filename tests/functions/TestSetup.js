require("dotenv").config();
const connect = require("../../functions/connect")
const log = require("node-color-log");

(async () => {
    await connect(process.env.MONGOURI)
    log.success("Database connected");
})()