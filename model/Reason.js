const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReasonSchema = new Schema(
  {
    token: {
      type: "string",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
    Histories: {
      type: Schema.Types.ObjectId,
      ref: "Histories",
    },
    type: {
      type: String,
      default: "search"
    },
    reasonId: String
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Reasons", ReasonSchema);
