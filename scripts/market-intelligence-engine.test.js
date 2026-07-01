const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  classifyMarket,
  isAllowedInPortfolio,
  auditEvents,
} = require("./market-intelligence-engine");

const root = path.resolve(__dirname, "..");
const match = "inghilterra-rd-congo";
const ranking = JSON.parse(
  fs.readFileSync(path.join(root, "data", "mvp", match, "ranking-events.json"), "utf8")
);

const cases = [
  ["U/O TIRI IN PORTA GIOCATORE (DUO) INC TS — KANE H.", "player_shots_on_target"],
  ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS — KANE H.", "player_total_shots"],
  ["GIOCATORE SEGNA O ASSIST — KANE H.", "player_goal_or_assist"],
  ["GIOCATORE TIRI IN ENTRAMBI I TEMPI — KANE H.", "player_shots_both_halves"],
  ["OVER CARTELLINI", "cards_over"],
  ["ENTRAMBE LE SQUADRE 2+ CARTELLINI", "both_teams_cards"],
  ["U/O PARATE SQUADRA 2", "team_saves_over_under"],
  ["GIOCATORE SEGNA O CARTELLINO — KANE H.", "player_goal_or_card"],
  ["ENTRAMBE LE SQUADRE 2+ CORNER", "both_teams_corners"],
  ["ENTRAMBE LE SQUADRE CORNER IN ENTRAMBI I TEMPI", "both_teams_corners_both_halves"],
  ["MULTIGOAL — 2-4", "multigoal"],
  ["MULTIGOAL SQUADRA 1 — 2-4", "team_multigoal"],
];

for (const [market, expected] of cases) {
  assert.strictEqual(classifyMarket({ mercato: market }).marketKey, expected, market);
}

const unknownMinutes = classifyMarket({
  mercato: "U/O TIRI TOTALI GIOCATORE (DUO) INC TS — KANE H.",
});
const confirmedMinutes = classifyMarket({
  mercato: "U/O TIRI TOTALI GIOCATORE (DUO) INC TS — KANE H.",
  starterConfirmed: true,
});
assert(unknownMinutes.minutePenalty > confirmedMinutes.minutePenalty);
assert.strictEqual(isAllowedInPortfolio({ mercato: "MULTIGOAL — 2-4" }, "safe"), true);
assert.strictEqual(
  isAllowedInPortfolio({ mercato: "GIOCATORE SEGNA O CARTELLINO — KANE H." }, "safe"),
  false
);
assert.strictEqual(
  isAllowedInPortfolio({ mercato: "GIOCATORE SEGNA O CARTELLINO — KANE H." }, "balanced"),
  false
);

const audit = auditEvents(ranking.events);
assert.strictEqual(audit.total, ranking.events.length);
assert(audit.recognized.length > 0);
const recognizedMarketKeys = [...new Set(audit.recognized.map(event => event.marketKey))].sort();
const profileEligibility = Object.fromEntries(
  ["safe", "balanced", "aggressive"].map(profile => [
    profile,
    ranking.events.filter(event => isAllowedInPortfolio(event, profile)).length,
  ])
);

console.log(JSON.stringify({
  match: ranking.match,
  assertions: cases.length + 5,
  recognized: audit.recognized.length,
  recognizedMarketKeys,
  unmapped: audit.unmapped,
  profileEligibility,
}, null, 2));
