const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HistorySchema = new Schema(
  {
    token: {
      type: "string",
      required: true,
    },
    PageId: {
      type: "number",
      required: true,
    },
    count: {
      type: "number",
      default: 1,
    },
    name: {
      type: String,
      required: true,
    },
    color: String,
    age: {
      type: String,
      required: true,
      enum: ["baby", "child", "teen", "adult", "middle-aged", "elder"],
    },
    model: {
      type: String,
      enum: [
        "oval",
        "butterfly",
        "square",
        "circle",
        "pilot",
        "cat",
        "rectangle",
        "polygon",
        "wayfarer",
        // https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedad.io%2FArticleImage-34446-106096%2F%25DA%2586%25D9%2587-%25D8%25B9%25DB%258C%25D9%2586%25DA%25A9-%25D8%25A2%25D9%2581%25D8%25AA%25D8%25A7%25D8%25A8%25DB%258C-%25D8%25A8%25D9%2587-%25D9%2585%25D9%2586-%25D9%2585%25DB%258C%25D8%25A7%25D8%25AF.jpg&f=1&nofb=1&ipt=bfe2ae88a48ff7d23ebcd854ced9ca4214b4c93164ee3be537e9d064cabe4e52&ipo=images
      ],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      required: true,
    },
    usage: {
      type: String,
      enum: [
        "sunglasses",
        "goggles",
        "glasses",
        "sport-glasses",
        "smoked-glasses",
        "dual-purpose",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    material: {
      type: String,
      enum: [
        "plastic",
        "zelonite",
        "cellulose-acetate",
        "zylonit",
        "nylon",
        "optyl",
        "spx",
        "aluminium",
        "nickel",
        "flexon",
        "stainless-steel",
        "beryllium",
        "titanium",
        "monelle",
        "gold",
        "wooden",
        "bony",
      ],
      required: true,
    },
    FrameType: {
      type: String,
      enum: ["combination", "rimless", "half"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Histories", HistorySchema);
