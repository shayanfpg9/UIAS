const { expect, test, beforeAll } = require("@jest/globals");
const TokenSchema = require("../model/Token");
const AutoFunction = require("../auto/function");
const generate = require("../functions/generate");
const Chance = require("chance");
const chance = new Chance();

global.console = {
  log: jest.fn,
};

const ids = [];
let deleted = 0;
let testID = "";

beforeAll(async () => {
  await AutoFunction();

  let i = 0;

  while (i < 9) {
    const now = new Date();
    const threeMonthsAgoTimestamp = now.setMonth(now.getMonth() - 3);
    const twoYearsAgoTimestamp = now.setFullYear(now.getFullYear() - 2);
    const randomTimestamp = Math.floor(
      Math.random() * (twoYearsAgoTimestamp - threeMonthsAgoTimestamp + 1) +
        threeMonthsAgoTimestamp
    );

    const item = await TokenSchema.create({
      token: generate(),
      ip: chance.ip(),
      platform: process.platform,
      agent: generate(20),
      location: chance.locale(),
      date: randomTimestamp,
      test: i === 8,
    });

    ids.push(item._id);

    if (i === 8) testID = item._id;

    i++;
  }

  deleted = await AutoFunction();
}, 15000);

test("Test isn't deleted", async () => {
  const testToken = await TokenSchema.findOne({ id: testID });
  expect(testToken).not.toBeNull();

  testToken.delete();
  deleted++;
});

test("Fakes deleted", () => {
  expect(deleted).toBe(ids.length);
});

test("Just these fake tokens deleted", () => {
  expect(deleted - ids.length).toBeFalsy();
});
