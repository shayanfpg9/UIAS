const dotenv = require("dotenv");

dotenv.config({ path: ".env.test" });

module.exports = {
  testEnvironment: "node",
  testTimeout: 15000,
  setupFiles: [
    "./setup.js"
  ],
};
