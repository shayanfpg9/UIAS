const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TokenSchema = new Schema(
  {
    token: {
      type: "string",
      required: true,
      unique: true,
    },
    ip: String,
    date: {
      type: Date,
      default: Date.now,
    },
    agent: String,
    location: String,
    platform: String,
    test: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tokens", TokenSchema);
