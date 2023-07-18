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
const GenerateToken = async (req, res) => {
  try {
    const LocationObj = await location();
    const TokenObject = {
      token: generate(),
      ip: LocationObj.ip,
      platform: req.headers["sec-ch-ua-platform"].replace(/(\/|")/gm, ""),
      agent: req.headers["user-agent"],
      location: LocationObj.toString(),
      date: Date.now(),
    };

    setCookie(TokenObject.token)(res);

    await TokenSchema.create(TokenObject);

    response({
      req,
      status: 200,
      action: "generate token",
      data: { ...TokenObject },
    })(res);
  } catch (e) {
    response({
      req,
      status: 500,
      action: "generate token",
      error: true,
      message: e?.message || e,
    })(res);
  }
};

// Get Token:
const GetToken = async (req, res) => {
  try {
    let token = undefined;
    if (global.findIp) {
      token = global.findIp.token;
      setCookie(token)(res);
    } else {
      const [hash, salt] = req.cookies.Token.split("/");
      token = decrypt(hash, salt);
    }

    const filter = { token };
    const update = { ip: global.ip, date: Date.now() };

    const updated = await TokenSchema.findOneAndUpdate(filter, update, {
      new: true,
    });

    response({
      req,
      status: 200,
      action: "get token",
      data: {
        ...updated.toObject(),
      },
    })(res);
  } catch (e) {
    response({
      req,
      status: 500,
      action: "generate token",
      error: true,
      message: e?.message || e,
    })(res);
    res.clearCookie("Token");
    GenerateToken(req, res);
  }
};

// Route
router.post("/", async (req, res) => {
  const { cookies } = req;
  const ip = await location.ip();
  const FindByIp = await TokenSchema.findOne({ ip });
  global.ip = ip;
  global.findIp = FindByIp;

  if (cookies.Token || FindByIp) {
    GetToken(req, res);
  } else {
    GenerateToken(req, res);
  }
});

module.exports = router;