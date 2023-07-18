const { default: axios } = require("axios");

async function IP() {
  if (!global.ip) {
    const { ip } = (await axios.get("https://api64.ipify.org/?format=json"))
      .data;
    global.ip = ip;
  }
  
  return global.ip;
}

async function location() {
  const ip = await IP();
  const geoLocation = (
    await axios.get(
      `https://ipinfo.io/${ip}/geo?token=${process.env["IPINFO-TOKEN"]}`
    )
  ).data;

  return {
    ...geoLocation,
    location: geoLocation.loc.split(","),
    toString: function () {
      const removeSpace = (text) => text.replaceAll(" ", "-");
      return (
        removeSpace(this.city) +
        "/" +
        removeSpace(this.region) +
        "/" +
        removeSpace(this.country)
      ).toLowerCase();
    },
  };
}

location.ip = IP;

module.exports = location;
