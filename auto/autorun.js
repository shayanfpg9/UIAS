const moment = require("moment-timezone");
const cron = require("node-cron");
const log = require("node-color-log");
const AutoFunction = require("./function");

const time = "0:0";
cron.schedule(
  `${time.split(":").reverse().join(" ")} * * *`,
  () => {
    log.debug(`Time of running function: ${time}`);
    AutoFunction();
  },
  {
    scheduled: true,
    timezone: moment.tz.guess(),
  }
);
