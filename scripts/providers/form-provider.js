const { section, teamParagraph } = require("./reading-source");

const numbers = { una: 1, un: 1, due: 2, tre: 3, quattro: 4, cinque: 5 };

function count(text, word) {
  const normalized = String(text ?? "").toLowerCase();
  const numeric = normalized.match(new RegExp(`(\\d+)\\s+${word}`));
  if (numeric) return Number(numeric[1]);
  for (const [label, value] of Object.entries(numbers)) {
    if (new RegExp(`\\b${label}\\s+${word}`).test(normalized)) return value;
  }
  return null;
}

function level(value) {
  const wins = count(value, "vittori[ae]");
  const losses = count(value, "sconfitt[ae]");
  if (wins !== null && losses !== null && losses > wins) return "negative";
  if (wins !== null && wins >= 4) return "excellent";
  if (wins !== null && wins >= 3) return "good";
  if (wins !== null && wins >= 1) return "medium";
  return null;
}

module.exports = function FormProvider(source) {
  const block = section(source, /forma recente/i);
  return {
    home: level(teamParagraph(block, source.teams[0] || "", 0)),
    away: level(teamParagraph(block, source.teams[1] || "", 1)),
  };
};
