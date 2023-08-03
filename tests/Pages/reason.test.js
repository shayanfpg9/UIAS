const {
  expect,
  test,
  describe,
  afterAll,
  beforeAll,
} = require("@jest/globals");
const app = require("../../app");
const request = require("supertest")(app);
const SearchSchema = require("../../model/Search");
const { history, token: TestToken, search } = require("../functions/fake");
const HistorySchema = require("../../model/History");
const ReasonSchema = require("../../model/Reason");

global.console = {
  log: jest.fn,
};

let token, PageId, SearchId, date

beforeAll(async () => {
  token = (await TestToken()).token;
  PageId = (await history())._id;
  SearchId = (await search({ Histories: PageId }))._id;
});

test("ALL /reason/**", async () => {
  await request.post(`/reason/set`).expect(401);

  await request.get(`/reason/get/`).expect(401);
  await request.get(`/reason/get/`).query({ token }).expect(404);
});

describe("Make new", () => {
  test("POST /reason/set/?token= [NEW-PAGE] -Search-", async () => {
    const information = {
      token,
      page: PageId,
      type: "search",
      reason: SearchId
    };
    const response = await request
      .post(`/reason/set/`).query({ token })
      .send(information)
      .expect("Content-Type", /json/)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data._id).toBeDefined();
    expect(JSON.stringify(response.body.data.Histories._id)).toEqual(JSON.stringify(PageId))
    expect(JSON.stringify(response.body.data.reasonId)).toEqual(JSON.stringify(SearchId))

    date = (response.body.data.date)
  });
});

describe("Get reason", () => {
  test("GET /reason/get/?token=&at= [GET-ONE]", async () => {
    const response = await request
      .get(`/reason/get/`).query({ token, at: date })
      .expect("Content-Type", /json/)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.error).toBeUndefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data.token).toBe(token);
    expect(JSON.stringify(response.body.data.Histories._id)).toEqual(JSON.stringify(PageId))
    expect(JSON.stringify(response.body.data.reasonId)).toEqual(JSON.stringify(SearchId))
    expect(response.body.data.Histories.name).toBeDefined();

  });
});

afterAll(async () => {
  await ReasonSchema.deleteMany({
    token,
  });
  await SearchSchema.deleteMany({
    token,
  });
  await HistorySchema.deleteMany({
    token,
  });
});
