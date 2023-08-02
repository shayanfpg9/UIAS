const response = require("../functions/response");
const HistorySchema = require("../model/History");
const ReasonSchema = require("../model/Reason");
const SearchSchema = require("../model/Search");
const TokenSchema = require("../model/Token");
const router = require("express").Router();

async function validateToken(token) {
  try {
    if (token === undefined) return false;

    return (await TokenSchema.findOne({ token })) !== null;
  } catch {
    return false;
  }
}

// Get reason
router.get("/get/", async (req, res) => {
  try {
    if (!(await validateToken(req.query.token)))
      throw { message: "Token is undefined", status: 401 };

    const reason = await ReasonSchema.findOne({
      token: req.query.token,
      date: req.query.at,
    });

    if (reason == null) throw null;

    await reason.populate("Histories");

    response({
      req,
      action: "get reason",
      status: 200,
      data: reason,
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 404,
      action: "get reason",
      error: true,
      message: e?.message || e || "Reason is undefined",
    })(res);
  }
});

// Set reason
router.post("/set/", async (req, res) => {
  try {
    if (!(await validateToken(req.query.token)))
      throw { message: "Token is undefined", status: 401 };

    const datas = {
      token: req.query.token,
      type: req.body.type,
      Histories: req.body.page,
      reasonId: req.body.reason
    };

    const reason = await ReasonSchema.create(datas);

    await reason.populate("Histories");

    response({
      req,
      action: "set reason",
      status: 201,
      data: reason,
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 500,
      action: "set reason",
      error: true,
      message: e?.message || e,
    })(res);
  }
});

module.exports = router;
