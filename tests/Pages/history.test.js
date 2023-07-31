const {
  expect,
  test,
  describe,
  afterAll,
  beforeAll,
} = require("@jest/globals");
const app = require("../../server");
const request = require("supertest")(app);
const { faker } = require("@faker-js/faker");
const HistorySchema = require("../../model/History");
const generate = require("../../functions/generate");
const TestFunctions = require("../functions/fake");

global.console = {
  log: jest.fn,
};

const pageName = faker.commerce.product() + " - " + faker.word.sample();
const pageId = Date.now();
let token = "";

beforeAll(async () => {
  token = (await TestFunctions.token()).token;
});

test("ALL /history/** [WITHOUT-TRUE-TOKEN]", async () => {
  await request.get(`/history/has`).expect(401);
  await request.post(`/history/new`).expect(401);
  await request.put(`/history/update`).expect(401);

  await request.get(`/history/has?token=${generate()}`).expect(401);
  await request.post(`/history/new?token=${generate()}`).expect(401);
  await request.put(`/history/update?token=${generate()}`).expect(401);

  await request
    .post(`/history/new/?token=${token}`)
    .send({})
    .expect("Content-Type", /json/)
    .expect(400);
});

describe("Check status + Make new", () => {
  test("GET /history/has/?token=&page= [HAS-PAGE-EXISTED] -FALSE-", async () => {
    await request
      .get(`/history/has/?token=${token}&page=${pageId}`)
      .expect("Content-Type", /json/)
      .expect(404);
  });

  test("POST /history/new/?token= [NEW-PAGE]", async () => {
    const information = await TestFunctions.history(
      { PageId: pageId, name: pageName },
      true
    );

    const response = await request
      .post(`/history/new/?token=${token}`)
      .send(information)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
  });

  test("GET /history/has/?token=&page= [HAS-PAGE-EXISTED] -TRUE-", async () => {
    await request
      .get(`/history/has/?token=${token}&page=${pageId}`)
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Update status", () => {
  test("PUT /history/update/?token=&page= [UPDATE-PAGE]", async () => {
    const response = await request
      .put(
        `/history/update/?token=${token}&page=${faker.number.int({
          min: 2000,
        })}`
      )
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeTruthy();
    expect(response.body.data).toBeDefined();
  });

  test("PUT /history/update/?token=&page= [UPDATE-PAGE]", async () => {
    const response = await request
      .put(`/history/update/?token=${token}&page=${pageId}`)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toMatchObject({
      id: pageId,
      name: pageName,
      visits: 2,
    });
  });
});

afterAll(async () => {
  await HistorySchema.deleteOne({
    token,
    PageId: pageId,
  });
});
