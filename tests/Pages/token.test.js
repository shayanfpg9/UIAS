const { expect, test, describe, afterAll } = require("@jest/globals");
const app = require("../../server");
const request = require("supertest")(app);
const { faker } = require("@faker-js/faker");
const TokenSchema = require("../../model/Token");

global.console = {
  log: jest.fn,
};

let ip = faker.internet.ipv4();
let cookie = "";

describe("Test token router", () => {
  test("POST /token [GENERATE]", async () => {
    const platform = faker.helpers.arrayElement([
      "Windows",
      "macOS",
      "Linux",
      "Android",
      "iOS",
    ]);
    const agent = faker.internet.userAgent();

    const response = await request
      .post("/token/")
      .send({ ip })
      .set("sec-ch-ua-platform", platform)
      .set("user-agent", agent)
      .unset("cookie", "Token")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(Object.keys(response.body.data)).toMatchObject([
      "token",
      "ip",
      "agent",
      "location",
      "platform",
      "_id",
      "date",
      "createdAt",
      "updatedAt",
      "__v",
    ]);

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);
    expect(response.headers["set-cookie"][0]).toMatch(/^Token=.+/);

    cookie = response.headers["set-cookie"][0];
  });

  test("POST /token [GET] -BY_COOKIE-", async () => {
    const response = await request
      .post("/token/")
      .send({ action: "get", ip })
      .expect(200)
      .set("Cookie", cookie)
      .expect("Content-Type", /json/);

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(Object.keys(response.body.data)).toMatchObject([
      "_id",
      "token",
      "ip",
      "agent",
      "location",
      "platform",
      "date",
      "createdAt",
      "updatedAt",
      "__v",
    ]);
  });

  test("POST /token [GET] -BY_ID-", async () => {
    const response = await request
      .post("/token/")
      .send({ action: "get", ip })
      .expect(200)
      .expect("Content-Type", /json/);

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(Object.keys(response.body.data)).toMatchObject([
      "_id",
      "token",
      "ip",
      "agent",
      "location",
      "platform",
      "date",
      "createdAt",
      "updatedAt",
      "__v",
    ]);

    const cookies = response.headers["set-cookie"];
    expect(cookies).toBeDefined();
    expect(cookies.length).toBeGreaterThan(0);
    expect(response.headers["set-cookie"][0]).toMatch(/^Token=.+/);
  });
});

afterAll(async () => {
  await TokenSchema.deleteOne({ ip });
});
