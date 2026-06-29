const { section } = require("./reading-source");

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

module.exports = function TacticsProvider(source) {
  const home = section(source, new RegExp(`partita (?:del|della) ${escapeRegex(source.teams[0])}`, "i"));
  const away = section(source, new RegExp(`partita (?:del|della) ${escapeRegex(source.teams[1])}`, "i"));
  return {
    home: home?.paragraphs || [],
    away: away?.paragraphs || [],
  };
};
