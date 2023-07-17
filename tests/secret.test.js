const Chance = require("chance");
const chance = new Chance();
const secret = require("../functions/secret");
const { expect, test } = require("@jest/globals");
const generate = require("../functions/generate");

const text = generate();
const salt = chance.hash({
  length: 32,
});
const encrypted = secret.encrypt(text, salt);
const decrypted = secret.decrypt(encrypted, salt);

test("Is it Empty (encrypt)", () => {
  expect(encrypted).not.toBe("");
});

test("Is it String (encrypt)", () => {
  expect(typeof encrypted).toBe("string");
});

test("Is it Empty (decrypt)", () => {
  expect(decrypted).not.toBe("");
});

test("Is it String (decrypt)", () => {
  expect(typeof decrypted).toBe("string");
});

test("Is it the main text (decrypt)", () => {
  expect(decrypted).toEqual(text);
});
