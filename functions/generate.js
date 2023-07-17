const { randomBytes } = require("crypto");
const Chance = require("chance");
const chance = new Chance();

function generate() {
  const token = randomBytes(64).toString("hex").split("");
  const hash = chance.hash({ length: 128 });

  return token.map((letter, index) => letter + hash[index]).join("");
}

module.exports = generate;
