const { section, teamParagraph } = require("./reading-source");

const numbers = { una: 1, un: 1, due: 2, tre: 3, quattro: 4, cinque: 5 };

function count(text, word) {
  const normalized = String(text ?? "").toLowerCase();
  const values = [...normalized.matchAll(new RegExp(`(\\d+)\\s+${word}`, "g"))]
    .map(match => Number(match[1]));
  for (const [label, value] of Object.entries(numbers)) {
    if (new RegExp(`\\b${label}\\s+${word}`).test(normalized)) values.push(value);
  }
  return values.length ? Math.max(...values) : null;
}

function level(value) {
  const normalized = String(value ?? "").toLowerCase();
  const verbWins = Object.entries(numbers)
    .filter(([label]) => new RegExp(`\\b(?:ha\\s+)?vinto\\s+${label}\\b`).test(normalized))
    .map(([, amount]) => amount);
  const wins = Math.max(count(value, "vittori[ae]") ?? 0, ...verbWins);
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
