const fs = require("fs");

module.exports = function QuoteProvider(filePath) {
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!payload.match || !Array.isArray(payload.markets)) {
    throw new Error(`QuoteProvider: struttura non valida in ${filePath}`);
  }
  return { match: payload.match, date: payload.date ?? null, markets: payload.markets };
};
