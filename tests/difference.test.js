const { expect, test } = require("@jest/globals");
const difference = require("../functions/difference");
const { faker } = require("@faker-js/faker");

const first = {
  name: faker.person.firstName(),
  last: faker.person.lastName(),
  age: Date.now(),
  location: {
    city: faker.location.city(),
    country: faker.location.country(),
  },
};

const second = {
  name: first.name,
  last: faker.person.lastName(),
  job: faker.person.jobTitle(),
  location: {
    city: faker.location.city(),
    country: faker.location.country(),
  },
};

const diff = difference(first, second);

test("Name is the same", () => {
  expect(diff.name).toBeUndefined();
});

test("Last is changed", () => {
  expect(diff.last).toBeDefined();
  expect(diff.last.action).toBe("Change");
  expect(diff.last.before).toBe(first.last);
  expect(diff.last.after).toBe(second.last);
});

test("Location is changed [Object]", () => {
  expect(diff.location).toBeDefined();
  expect(diff.location.action).toBe("Change");
  expect(diff.location.before).toBe(first.location);
  expect(diff.location.after).toBe(second.location);
});

test("Age is removed", () => {
  expect(diff.age).toBeDefined();
  expect(diff.age.action).toBe("Remove");
  expect(diff.age.before).toBe(first.age);
  expect(diff.age.after).toBeUndefined();
});

test("Job is added", () => {
  expect(diff.job).toBeDefined();
  expect(diff.job.action).toBe("Add");
  expect(diff.job.before).toBeUndefined();
  expect(diff.job.after).toBe(second.job);
});
