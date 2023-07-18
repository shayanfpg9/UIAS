require("dotenv").config();

const connect = require("../functions/connect");
const TokenSchema = require("../model/Token");
const log = require("node-color-log");

const ClearTokens = async () => {
  const now = new Date();
  const threeMonthsAgo = now.setMonth(
    now.getMonth() - process.env["EXP-MONTH"]
  );
  log.warn(`Delete tokens before [${threeMonthsAgo.toString()}]`);

  const expaire = await TokenSchema.deleteMany({
    date: {
      $lte: threeMonthsAgo,
    },
  });

  log.debug(`Delete ${expaire.deletedCount | 0} tokens`);

  return expaire.deletedCount | 0
};

connect(process.env.MONGOURI)
  .then(() => {
    log.success("Now we have access to Database");
  })
  .catch((e) => {
    log.error(e);
  });

module.exports = ClearTokens;
