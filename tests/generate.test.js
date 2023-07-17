const { expect, test } = require("@jest/globals");
const generate = require("../functions/generate");

const token = generate();

test("Is it String",()=>{
    expect(typeof token).toBe("string")
})

test("Is it 256 characters",()=>{
    expect(token.length).toBe(256)
})