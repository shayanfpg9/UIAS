const router = require("express").Router();
const generate = require("../functions/generate");
const TokenSchema = require("../model/Token");
const response = require("../functions/response");
const location = require("../functions/location");
const { encrypt, decrypt } = require("../functions/secret");

// Set Cookie:
function setCookie(token) {
  const salt = generate(32);
  const hidden = encrypt(token, salt);

  return (res) => {
    res.cookie("Token", hidden + "/" + salt, {
      maxAge: process.env["EXP-MONTH"] * 30 * 24 * 60 * 60 * 1000,
    });
  };
}

// Generate Token:
router.post("/generate", async (req, res) => {
  try {
    res.clearCookie("Token");

    global.ip =
      process.env.NODE_ENV === "test" && req.query.ip
        ? req.query.ip
        : await location.ip();

    const LocationObj = await location();
    const TokenObject = {
      token: generate(),
      ip: LocationObj.ip,
      platform: req.headers["sec-ch-ua-platform"].replace(/(\/|")/gm, ""),
      agent: req.headers["user-agent"],
      location: LocationObj.toString(),
      test: process.env.NODE_ENV === "test",
    };

    setCookie(TokenObject.token)(res);

    response({
      req,
      status: 200,
      action: "generate token",
      data: {
        ...(await TokenSchema.create(TokenObject)).toObject(),
        test: undefined,
      },
    })(res);
  } catch (e) {
    response({
      req,
      status: e?.status || 500,
      action: "generate token",
      error: true,
      message: e?.message || e,
    })(res);
  }
});

// Get Token:
router.get("/get", async (req, res) => {
  try {
    const ip =
      process.env.NODE_ENV === "test" && req.query.ip
        ? req.query.ip
        : await location.ip();
    const FindByIp = await TokenSchema.findOne({ ip });

    let token = undefined;
    if (FindByIp) {
      token = FindByIp.token;
      setCookie(token)(res);
    } else {
      if (
        req.cookies.Token == undefined &&
        typeof req.cookies.Token !== "string"
      ) {
        throw "Cookie is undefined";
      }

      const [hash, salt] = req.cookies.Token.split("/");
      token = decrypt(hash, salt);
    }

    const filter = { token };
    const update = { ip, date: Date.now() };

    const updated = await TokenSchema.findOneAndUpdate(filter, update, {
      new: true,
    });

    response({
      req,
      status: 200,
      action: "get token",
      data: {
        ...updated.toObject(),
        test: undefined,
      },
    })(res);
  } catch (e) {
    res.clearCookie("Token");

    response({
      req,
      status: e?.status || 404,
      action: "get token",
      error: true,
      title: "Token not found",
      message: e?.message || e,
    })(res);
  }
});

module.exports = router;
