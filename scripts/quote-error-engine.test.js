const assert = require("assert");
const {
  MIN_CONFIDENCE,
  MIN_ODDS,
  MIN_VALUE_SCORE,
  anomalyIndex,
  buildCandidate,
  compareCandidates,
  edgeClassification,
  isEligible,
  matchesRule,
} = require("./quote-error-engine");

const market = {
  mercato: "TIRI IN PORTA GIOCATORE",
  info: "ATTACCANTE U/O 1.5 SOMMA TIRI IN PORTA",
  soglia: "1.5",
  esito: "OVER",
  quota: 4,
  selectionId: 123,
  marketId: 456,
};
const rule = {
  event: "Attaccante almeno 2 tiri in porta",
  infoContains: "ATTACCANTE U/O 1.5",
  selection: "OVER",
  threshold: "1.5",
  estimatedProbability: 0.38,
  modelConfidence: 70,
  risk: "medium",
  myComboCompatible: true,
  scenarioCompatible: true,
  correlationCompatible: true,
  tacticalFit: true,
  isolatedScore: 70,
  confirmations: ["Scenario Engine", "Player Engine", "MyCombo Engine"],
  reason: "Possibile disallineamento del mercato.",
};

assert.strictEqual(MIN_ODDS, 3);
assert.strictEqual(MIN_VALUE_SCORE, 0.02);
assert.strictEqual(MIN_CONFIDENCE, 55);
assert.strictEqual(matchesRule(market, rule), true);

const candidate = buildCandidate(market, rule);
assert.strictEqual(candidate.impliedProbability, 25);
assert.strictEqual(candidate.estimatedProbability, 38);
assert.strictEqual(candidate.valueScore, 0.13);
assert.strictEqual(candidate.edge, 13);
assert.strictEqual(candidate.classification, "Quota sospetta");
assert.strictEqual(isEligible(candidate, rule), true);

assert.strictEqual(edgeClassification(4.99).band, "Leggero value");
assert.strictEqual(edgeClassification(5).band, "Quota interessante");
assert.strictEqual(edgeClassification(10).band, "Quota sospetta");
assert.strictEqual(edgeClassification(18.01).band, "Possibile errore di quota");

assert.ok(anomalyIndex({
  odds: 5,
  edge: 15,
  confirmations: ["a", "b", "c", "d"],
  myComboCompatible: true,
  risk: "low",
  isolatedScore: 80,
}) > anomalyIndex({
  odds: 3.1,
  edge: 4,
  confirmations: ["a"],
  myComboCompatible: false,
  risk: "high",
  isolatedScore: 20,
}));

const ordered = [
  { anomalyIndex: 60, edge: 8, modelConfidence: 80, risk: "low", myComboCompatible: true },
  { anomalyIndex: 80, edge: 6, modelConfidence: 60, risk: "medium", myComboCompatible: true },
].sort(compareCandidates);
assert.strictEqual(ordered[0].anomalyIndex, 80);

console.log("Quote Error Engine: test superati.");
