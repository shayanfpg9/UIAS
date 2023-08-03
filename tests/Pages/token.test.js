const { expect, test, describe, afterAll } = require("@jest/globals");
const app = require("../../app");
const request = require("supertest")(app);
const { faker } = require("@faker-js/faker");
const TokenSchema = require("../../model/Token");

global.console = {
  log: jest.fn,
};

let ip = faker.internet.ipv4();
let cookie = "";
let id;

describe("Test token router", () => {
  test("POST /token/generate [GENERATE-TOKEN]", async () => {
    const platform = faker.helpers.arrayElement([
      "Windows",
      "macOS",
      "Linux",
      "Android",
      "iOS",
    ]);
    const agent = faker.internet.userAgent();

    const response = await request
      .post("/token/generate")
      .query({ ip })
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
    id = response.body.data._id
  });

  test("GET /token/ [GET-TOKEN] -BY_COOKIE-", async () => {
    const response = await request
      .get("/token/get")
      .query({ ip })
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

  test("GET /token/ [GET-TOKEN] -BY_ID-", async () => {
    const response = await request
      .get("/token/get")
      .query({ ip })
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

  test("GET /token/ [GET] -ERROR-", async () => {
    const response = await request
      .get("/token/get")
      .query({ ip: faker.internet.ipv4() })
      .expect(404)
      .expect("Content-Type", /json/);

    expect(response.body).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.error).toBeTruthy();
    expect(Object.keys(response.body.data)).toMatchObject(["title", "message"]);
  });
});

afterAll(async () => {
  await TokenSchema.findByIdAndDelete(id)
});
