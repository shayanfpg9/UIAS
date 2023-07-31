const { faker } = require("@faker-js/faker");
const Token = require("../../model/Token");
const History = require("../../model/History");
const Search = require("../../model/Search");

async function token() {
  return await Token.findOne({ test: true });
}

async function history(data, information = false) {
  const info = {
    PageId: Date.now(),
    name: faker.commerce.product(),
    color: faker.color.human(),
    age: faker.helpers.arrayElement([
      "baby",
      "child",
      "teen",
      "adult",
      "middle-aged",
      "elder",
    ]),
    model: faker.helpers.arrayElement([
      "oval",
      "butterfly",
      "square",
      "circle",
      "pilot",
      "cat",
      "rectangle",
      "polygon",
      "wayfarer",
    ]),
    gender: faker.person.sex(),
    usage: faker.helpers.arrayElement([
      "sunglasses",
      "goggles",
      "glasses",
      "sport-glasses",
      "smoked-glasses",
      "dual-purpose",
    ]),
    price: faker.commerce.price(),
    material: faker.helpers.arrayElement([
      "plastic",
      "zelonite",
      "cellulose-acetate",
      "zylonit",
      "nylon",
      "optyl",
      "spx",
      "aluminium",
      "nickel",
      "flexon",
      "stainless-steel",
      "beryllium",
      "titanium",
      "monelle",
      "gold",
      "wooden",
      "bony",
    ]),
    FrameType: faker.helpers.arrayElement(["combination", "rimless", "half"]),
    ...data,
  };

  if (information) return info;

  return await History.create({
    token: (await token()).token,
    ...info,
  });
}

async function search(data, information = false) {
  const filters = {
    color: faker.color.human(),
    age: faker.helpers.arrayElement([
      "baby",
      "child",
      "teen",
      "adult",
      "middle-aged",
      "elder",
    ]),
    model: faker.helpers.arrayElement([
      "oval",
      "butterfly",
      "square",
      "circle",
      "pilot",
      "cat",
      "rectangle",
      "polygon",
      "wayfarer",
    ]),
    gender: faker.person.sex(),
    usage: faker.helpers.arrayElement([
      "sunglasses",
      "goggles",
      "glasses",
      "sport-glasses",
      "smoked-glasses",
      "dual-purpose",
    ]),
    price: faker.commerce.price(),
    material: faker.helpers.arrayElement([
      "plastic",
      "zelonite",
      "cellulose-acetate",
      "zylonit",
      "nylon",
      "optyl",
      "spx",
      "aluminium",
      "nickel",
      "flexon",
      "stainless-steel",
      "beryllium",
      "titanium",
      "monelle",
      "gold",
      "wooden",
      "bony",
    ]),
    FrameType: faker.helpers.arrayElement(["combination", "rimless", "half"]),
    face: faker.helpers.arrayElement([
      "circle",
      "oval",
      "square",
      "heart",
      "rectangle",
      "diamond",
    ]),
    ...data?.filters,
  };
  const info = {
    word: faker.commerce.product(),
    filters,
    ...data,
  };

  if (information) return info;

  return await Search.create({
    ...info,
    token: (await token()).token,
    date: Date.now(),
    visit: undefined,
  });
}

module.exports = {
  history,
  token,
  search,
};
