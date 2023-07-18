const { randomBytes } = require("crypto");
const Chance = require("chance");
const chance = new Chance();

function generate(length = 256) {
  const token = randomBytes(length / 4)
    .toString("hex")
    .split("");
  const hash = chance.hash({ length: length / 2 });

  return token.map((letter, index) => letter + hash[index]).join("");
}

module.exports = generate;
