const crypto = require("crypto");
const algorithm = "aes-256-ctr";
const iv = crypto.randomBytes(16);

function encrypt(text, salt) {
  try {
    const cipher = crypto.createCipheriv(algorithm, salt, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return encrypted.toString("hex");
  } catch (e) {
    return undefined;
  }
}

function decrypt(hash, salt) {
  try {
    const decipher = crypto.createDecipheriv(algorithm, salt, iv);
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()])

    return decrpyted.toString("utf-8");
  } catch (e) {
    return undefined;
  }
}

module.exports = {
  encrypt,
  decrypt,
};
