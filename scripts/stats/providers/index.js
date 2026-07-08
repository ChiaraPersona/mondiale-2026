const espn = require("./espn");
const fotmob = require("./fotmob");
const sofascore = require("./sofascore");
const whoscored = require("./whoscored");

const providers = {
  espn,
  fotmob,
  sofascore,
  whoscored
};

function getProvider(name) {
  const provider = providers[String(name || "").toLowerCase()];
  if (!provider) {
    throw new Error(`Provider non supportato: ${name}. Usa: ${Object.keys(providers).join(", ")}`);
  }
  return provider;
}

module.exports = {
  getProvider,
  providers
};
