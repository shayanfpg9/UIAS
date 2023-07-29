const router = require("express").Router();
const response = require("../functions/response");
const HistorySchema = require("../model/History");
const TokenSchema = require("../model/Token");

async function validateToken(token) {
  if (token === undefined) return false;

  return (await TokenSchema.findOne({ token })) !== null;
}

// Is page existed
router.get("/has/", async (req, res) => {
  try {
    if (!(await validateToken(req.query.token))) {
      throw {
        status: 401,
        message: "token is undefined",
      };
    }

    const page = req.query.page;

    const Found = await HistorySchema.findOne({
      PageId: page,
      token: req.query.token,
    });

    if (Found === null) throw false;

    response({
      req,
      action: "check page",
      status: 200,
      data: {
        existed: true,
        count: Found.count,
      },
    })(res);
  } catch (e) {
    if (e === false) {
      response({
        req,
        action: "check page",
        status: 404,
        data: {
          existed: false,
          count: 0,
        },
      })(res);
    } else {
      response({
        req,
        status: e?.status || 500,
        action: "check page",
        error: true,
        message: e?.message || e,
      })(res);
    }
  }
});

// Add History
router.post("/new/", async (req, res) => {
  try {
    if (!(await validateToken(req.query.token)))
      throw { message: "Token is undefined", status: 401 };

    const page = {
      ...req.body,
      token: req.query.token,
      count: 1,
    };

    if (HistorySchema.length < page.length)
      throw { message: "Complete all fields", status: 400 };

    const IsExisted = await HistorySchema.findOne({
      token: req.query.token,
      PageId: page.PageId,
    });

    if (IsExisted !== null) throw { message: "existed", status: 400 };

    const Push = HistorySchema.create(page);

    response({
      req,
      action: "add history",
      status: 201,
      data: Push,
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 500,
      action: "add history",
      error: true,
      message: e?.message || e,
    })(res);
  }
});

// Update History
router.put("/update/", async (req, res) => {
  try {
    if (!(await validateToken(req.query.token)))
      throw { message: "Token is undefined", status: 401 };

    const IsExisted = await HistorySchema.findOne({
      token: req.query.token,
      PageId: +req.query.page,
    });

    if (IsExisted === null)
      throw { message: "Page is undefined in user history", status: 404 };

    const Update = await HistorySchema.findOneAndUpdate(
      { PageId: +req.query.page },
      { $inc: { count: 1 } },
      {
        new: true,
      }
    );

    response({
      req,
      action: "update history",
      status: 200,
      data: {
        name: Update.name,
        id: Update.PageId,
        visits: Update.count,
      },
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 500,
      action: "update history",
      error: true,
      message: e?.message || e,
    })(res);
  }
});

module.exports = router;
