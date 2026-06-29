const { section, teamParagraph } = require("./reading-source");

function level(value) {
  const text = String(value ?? "").toLowerCase();
  if (/motivazione massima|motivazione molto alta/.test(text)) return "very_high";
  if (/motivazione alta/.test(text)) return "high";
  if (/motivazione media/.test(text)) return "medium";
  if (/motivazione bassa/.test(text)) return "low";
  return null;
}

module.exports = function MotivationProvider(source) {
  const block = section(source, /motivaz/i);
  return {
    home: level(teamParagraph(block, source.teams[0] || "", 0)),
    away: level(teamParagraph(block, source.teams[1] || "", 1)),
  };
};
