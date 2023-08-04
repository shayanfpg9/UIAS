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
const SearchSchema = require("../../model/Search");
const generate = require("../../functions/generate");
const { history, token: TestToken, search } = require("../functions/fake");
const HistorySchema = require("../../model/History");
const Search = require("../../model/Search");

global.console = {
  log: jest.fn,
};

const pageName = faker.commerce.product();
let pageId = "";
let token = "";
let page = "";

beforeAll(async () => {
  token = (await TestToken()).token;
  page = (await history())._id;
});

test("ALL /search/** [WITHOUT-TRUE-TOKEN]", async () => {
  await request.post(`/search/new`).expect(401);
  await request.post(`/search/new?token=${generate()}`).expect(401);
  await request
    .post(`/search/new/`)
    .query({ token })
    .expect("Content-Type", /json/)
    .expect(400);

  await request.put(`/search/update/`)
    .query({ id: generate() })
    .expect(400);

  await request.get(`/search/get/`)
    .query({ id: generate() })
    .expect(400);
  await request.get(`/search/get/`)
    .query({ user: generate() })
    .expect(400);
  await request.get(`/search/get/`).expect(400);
});

describe("Check status + Make new", () => {
  test("POST /search/new/?token= [NEW-PAGE]", async () => {
    const information = {
      ...(await search({ word: pageName }, true)),
      Histories: generate(),
    };
    const response = await request
      .post(`/search/new/`)
      .query({ token })
      .send(information)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data._id).toBeDefined();
    expect(response.body.data.Histories).toBeUndefined();

    pageId = response.body.data._id;
  });
});

describe("Update visits", () => {
  test("PUT /search/update/?id= [UPDATE-PAGE]", async () => {
    await request
      .put(`/search/update/`)
      .query({ id: pageId })
      .send({ page: generate() })
      .expect(400);

    const response = await request
      .put(`/search/update/`)
      .query({ id: pageId })
      .send({
        page,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.Histories).toBeDefined();

    const Check = await Search.findById(pageId);

    await Check.populate("Histories");

    expect(Check).toBeDefined();
    expect(Check.Histories.name).toBeDefined();
  });
});

describe("Get search", () => {
  test("GET /search/get/?id= [GET-ONE]", async () => {
    const response = await request
      .get(`/search/get/`)
      .query({ id: pageId })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data[0]).toBeDefined();
    expect(response.body.data[0].token).toBe(token);

    if (response.body.data[0].Histories) {
      expect(response.body.data[0].Histories.name).toBeDefined();
    }
  });

  test("GET /search/get/?user= [GET-MANY]", async () => {
    await search({});

    const response = await request
      .get(`/search/get/`)
      .query({ user: token })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[1]).toBeDefined();
    expect(response.body.data[1].token).toBe(token);

    response.body.data.forEach((obj, i) => {
      if (obj.Histories) {
        expect(i).toBe(0)
        expect(obj.Histories.name).toBeDefined();
      }
    })
  });
});

afterAll(async () => {
  await SearchSchema.deleteMany({
    token,
  });
  await HistorySchema.deleteMany({
    token,
  });
});
