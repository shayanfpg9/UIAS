const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSchema = new Schema(
  {
    token: {
      type: "string",
      required: true,
      unique: true,
    },
    ip: {
      type: "string",
    },
    date: {
      type: "number",
    },
    agent: {
      type: "string",
    },
    location: {
      type: "string",
    },
    platform: {
      type: "string",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tokens", TokenSchema);
