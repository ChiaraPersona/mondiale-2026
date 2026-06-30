const assert = require("node:assert/strict");
const fs = require("fs");
const os = require("os");
const path = require("path");
const test = require("node:test");
const { buildRecord, buildDashboard, updateHistory } = require("./backtesting-engine");

function fixture(slug = "a-b") {
  return {
    slug,
    date: "2026-06-30",
    portfolios: [
      {
        name: "Safe",
        finalOdds: 2,
        scenario: { id: "control", name: "Controllo" },
        events: [
          { id: "e1", category: "goal", market: "Goal", selection: "Over", odds: 1.5, eqs: 80 },
          { id: "e2", category: "corner", market: "Corner", selection: "Over", odds: 1.4, eqs: 60 },
        ],
      },
      {
        name: "Balanced",
        finalOdds: 3,
        events: [{ id: "e1", category: "goal", market: "Goal", selection: "Over", odds: 1.5, eqs: 80 }],
      },
      { name: "Aggressive", finalOdds: null, events: [] },
    ],
    settlement: {
      score: "A 1-0 B",
      events: { e1: { status: "won" }, e2: { status: "lost" } },
    },
  };
}

test("calcola eventi, portfolio ed EQS senza duplicare eventi condivisi", () => {
  const record = buildRecord(fixture(), { actualScenario: "Partita bloccata" });
  assert.equal(record.correctEvents, 1);
  assert.equal(record.incorrectEvents, 1);
  assert.equal(record.Safe, "lost");
  assert.equal(record.Balanced, "won");
  assert.equal(record.Aggressive, "not_generated");
  assert.equal(record.averageEqs, 70);
  assert.equal(record.events.length, 2);
});

test("dashboard esclude non generati e pending dalla percentuale", () => {
  const record = buildRecord(fixture());
  const dashboard = buildDashboard([record]);
  assert.deepEqual(dashboard.profiles.Safe, { generated: 1, won: 0, lost: 1, successRate: 0 });
  assert.equal(dashboard.profiles.Aggressive.generated, 0);
  assert.equal(dashboard.markets.goal.successRate, 100);
  assert.equal(dashboard.markets.corner.successRate, 0);
});

test("lo storico è permanente e idempotente per slug", () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "backtesting-"));
  const files = {
    historyFile: path.join(directory, "history.json"),
    dashboardFile: path.join(directory, "dashboard.json"),
  };
  updateHistory(buildRecord(fixture()), files);
  const changed = fixture();
  changed.settlement.score = "A 2-0 B";
  updateHistory(buildRecord(changed), files);
  const history = JSON.parse(fs.readFileSync(files.historyFile, "utf8"));
  assert.equal(history.matches.length, 1);
  assert.equal(history.matches[0].result, "A 2-0 B");
});
