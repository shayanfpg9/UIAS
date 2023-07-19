const { faker } = require("@faker-js/faker");
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

  const fakeLocation = () => ({
    ip: ip,
    city: faker.location.city(),
    region: faker.location.state(),
    country: faker.location.countryCode(),
    loc: faker.location.nearbyGPSCoordinate().join(","),
    org: faker.company.name(),
    postal: faker.location.zipCode(),
    timezone: faker.location.timeZone(),
  });

  const geoLocation =
    process.env.NODE_ENV === "test"
      ? fakeLocation()
      : (
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
