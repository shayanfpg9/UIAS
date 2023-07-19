const dotenv = require("dotenv");

dotenv.config({ path: ".env.test" });

module.exports = {
  testEnvironment: "node",
  testTimeout: 15000,
  globals: {
    PORT: process.env.PORT || 4000,
  },
};
