const response = require("../functions/response");
const HistorySchema = require("../model/History");
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

async function validateSearch(id) {
  try {
    if (id === undefined) return false;

    return (await SearchSchema.findById(id)) !== null;
  } catch {
    return false;
  }
}

async function validateHistory(id) {
  try {
    if (id === undefined) return false;

    return (await HistorySchema.findById(id)) !== null;
  } catch {
    return false;
  }
}

// Add Search
router.post("/new/", async (req, res) => {
  try {
    if (!(await validateToken(req.query.token)))
      throw { message: "Token is undefined", status: 401 };

    req.body.visit = undefined;
    req.body.date = undefined;

    const page = {
      ...req.body,
      token: req.query.token,
      date: Date.now(),
      visit: undefined,
    };

    if (SearchSchema.length < page.length)
      throw { message: "Complete all fields", status: 400 };

    const IsExisted = await SearchSchema.findOne(page);

    if (IsExisted !== null) throw { message: "existed", status: 400 };

    try {
      const Create = await SearchSchema.create(page);

      response({
        req,
        action: "add Search",
        status: 201,
        data: Create,
      })(res);
    } catch (e) {
      throw {
        message: "All fields are require",
        status: 400,
      };
    }
  } catch (e) {
    response({
      req,
      status: e?.status || 500,
      action: "add Search",
      error: true,
      message: e?.message || e,
    })(res);
  }
});

// Update visit page to search
router.put("/update/", async (req, res) => {
  try {
    if (!(await validateSearch(req.query.id)))
      throw { message: "Search id is undefined", status: 400 };

    if (!(await validateHistory(req.body.page)))
      throw { message: "History page id is undefined", status: 400 };

    const Update = await SearchSchema.findByIdAndUpdate(
      req.query.id,
      {
        $set: {
          Histories: req.body.page,
        },
      },
      {
        new: true,
      }
    );

    response({
      req,
      action: "update visits",
      status: 200,
      data: Update,
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 500,
      action: "update visits",
      error: true,
      message: e?.message || e,
    })(res);
  }
});

module.exports = router;
