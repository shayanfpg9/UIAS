const {
  expect,
  test,
  describe,
  afterAll,
  beforeAll,
} = require("@jest/globals");
const app = require("../../app");
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
let lastPrice = 0;
let id;

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
    .post(`/history/new/`).query({ token })
    .send({})
    .expect("Content-Type", /json/)
    .expect(400);
});

describe("Check status + Make new", () => {
  test("GET /history/has/?token=&page= [HAS-PAGE-EXISTED] -FALSE-", async () => {
    await request
      .get(`/history/has/`).query({ token, page: pageId })
      .expect("Content-Type", /json/)
      .expect(404);
  });

  test("POST /history/new/?token= [NEW-PAGE]", async () => {
    const information = await TestFunctions.history(
      { PageId: pageId, name: pageName },
      true
    );

    const response = await request
      .post(`/history/new/`)
      .query({ token })
      .send(information)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.PageId).toEqual(pageId);

    id = response.body.data._id
    lastPrice = response.body.data.price;
  });

  test("GET /history/has/?token=&page= [HAS-PAGE-EXISTED] -TRUE-", async () => {
    await request
      .get(`/history/has/`)
      .query({ token, page: pageId })
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Update status", () => {
  test("PUT /history/update/?token=&page= [UPDATE-PAGE] -Error-", async () => {
    const response = await request
      .put(`/history/update/`)
      .query({ token, page: faker.number.int({ min: 1000 }) })
      .expect("Content-Type", /json/)
      .expect(404);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeTruthy();
    expect(response.body.data).toBeDefined();
  });

  test("PUT /history/update/?token=&page= [UPDATE-PAGE]", async () => {
    const searched = await HistorySchema.findById(id)

    expect(searched.PageId).toBe(pageId)

    const response = await request
      .put(`/history/update/`)
      .query({ token, page: pageId })
      .expect("Content-Type", /json/)
      // .expect(200);

    expect(response.body).toBe();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toMatchObject({
      id: pageId,
      name: pageName,
      visits: 2,
    });
  });

  test("PUT /history/update/?token=&page= [EDIT-PAGE]", async () => {
    const information = await TestFunctions.history(
      { PageId: pageId, price: 100 },
      true
    );
    const response = await request
      .put(`/history/update/`)
      .query({ token, page: pageId })
      .send(information)
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.diff).toBeDefined();
    expect(response.body.data.diff.price.before).toBe(lastPrice);
    expect(response.body.data.diff.price.after).toBe(100);
    expect(response.body.data.diff.name).toBeUndefined();
  });
});

afterAll(async () => {
  await HistorySchema.deleteOne({
    token,
    PageId: pageId,
  });
});