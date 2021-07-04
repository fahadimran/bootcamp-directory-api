const NodeGeocoder = require("node-geocoder");

// for some reason, environment variables are not accessible without dotenv
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
