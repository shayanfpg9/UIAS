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
    .post(`/search/new/?token=${token}`)
    .send({})
    .expect("Content-Type", /json/)
    .expect(400);

  await request.put(`/search/update/?id=${generate()}`).expect(400);
});

describe("Check status + Make new", () => {
  test("POST /search/new/?token= [NEW-PAGE]", async () => {
    const information = await search({ word: pageName }, true);
    const response = await request
      .post(`/search/new/?token=${token}`)
      .send(information)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data._id).toBeDefined();

    pageId = response.body.data._id;
  });
});

describe("Update visits", () => {
  test("PUT /search/update/?id= [UPDATE-PAGE]", async () => {
    await request
      .put(`/search/update/?id=${pageId}`)
      .send({ page: generate() })
      .expect(400);

    const response = await request
      .put(`/search/update/?id=${pageId}`)
      .send({
        page,
      })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.data.page).toBe();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.Histories).toBeDefined();

    const Check = await Search.findById(pageId);

    await Check.populate("Histories");

    expect(Check).toBeDefined();
    expect(Check.Histories.name).toBeDefined();
  });
});

afterAll(async () => {
  await SearchSchema.findByIdAndDelete(pageId);
  await HistorySchema.findByIdAndDelete({
    token,
    _id: page,
  });
});
