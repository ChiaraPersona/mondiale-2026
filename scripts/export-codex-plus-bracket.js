const fs = require("fs");
const vm = require("vm");

const files = [
  "js/data.js",
  "js/stats.js",
  "js/formations.js",
  "js/formations-insights.js",
  "js/penalty-takers.js",
  "js/team-insights.js",
  "js/fifa-rankings.js",
  "js/team-stats-data.js",
  "js/worldcup-fixtures.js",
  "js/worldcup-results.js",
  "js/pronostico-codex.js",
];

const ctx = {
  console,
  window: {},
  document: {
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    getElementById() { return null; },
  },
  localStorage: {
    getItem() { return null; },
    setItem() {},
  },
  setTimeout,
  clearTimeout,
};

ctx.globalThis = ctx;
vm.createContext(ctx);
files.forEach((file) => {
  vm.runInContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
});

vm.runInContext(`
function exportMatch(number) {
  const result = codexState.results[number];
  if (!result) return null;
  const phase = codexPhaseLabel(result.fixture?.[1] || "");
  return {
    number,
    phase,
    teamA: result.teamA,
    teamB: result.teamB,
    goalsA: result.goalsA,
    goalsB: result.goalsB,
    winner: result.winner,
    note: result.note || "",
    expectedA: Number((result.expectedA || 0).toFixed(2)),
    expectedB: Number((result.expectedB || 0).toFixed(2)),
    codexPlusA: Number(codexPlusScore(result.teamA).toFixed(1)),
    codexPlusB: Number(codexPlusScore(result.teamB).toFixed(1)),
    badgesA: codexExternalModelBadgeItems(result.teamA).map((badge) => badge.label + (badge.value ? " " + badge.value : "")),
    badgesB: codexExternalModelBadgeItems(result.teamB).map((badge) => badge.label + (badge.value ? " " + badge.value : "")),
  };
}

globalThis.__bracketExport = {
  generatedAt: new Date().toISOString(),
  title: "Pronostico Codex+ Mondiale 2026",
  formula: "Codex 70% · Opta 12% · Klement 7% · Goldman Sachs 6% · IA varie 5%",
  formula: "Codex 60% - Motivation Index 10% - Opta 12% - Klement 7% - Goldman Sachs 6% - IA varie 5%",
  champion: codexState.results[104]?.winner || "",
  final: exportMatch(104),
  bronze: exportMatch(103),
  left: {
    r32: [74, 77, 73, 75, 83, 84, 81, 82].map(exportMatch),
    r16: [89, 90, 93, 94].map(exportMatch),
    qf: [97, 98].map(exportMatch),
    sf: [101].map(exportMatch),
  },
  right: {
    sf: [102].map(exportMatch),
    qf: [99, 100].map(exportMatch),
    r16: [91, 92, 95, 96].map(exportMatch),
    r32: [76, 78, 79, 80, 86, 88, 85, 87].map(exportMatch),
  },
  consensus: codexExternalConsensusRanking().slice(0, 6).map((row) => ({
    team: row.team,
    points: row.total,
  })),
  motivation: codexMotivationRanking().slice(0, 10).map((row) => ({
    team: row.team,
    total: row.total,
    reasons: row.reasons,
  })),
};
`, ctx);

const output = process.argv[2] || "data/codex-plus-bracket.json";
fs.mkdirSync(require("path").dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(ctx.__bracketExport, null, 2), "utf8");
console.log(output);
