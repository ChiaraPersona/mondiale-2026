const PLAYER_FIELDS = [
  "name",
  "role",
  "starter",
  "minutes",
  "shots",
  "shotsOnTarget",
  "goals",
  "assists",
  "xG",
  "xA",
  "keyPasses",
  "touches",
  "touchesInBox",
  "passes",
  "accuratePasses",
  "passAccuracy",
  "crosses",
  "accurateCrosses",
  "dribblesAttempted",
  "dribblesCompleted",
  "foulsCommitted",
  "foulsWon",
  "tackles",
  "interceptions",
  "clearances",
  "duelsWon",
  "aerialsWon",
  "yellowCards",
  "redCards",
  "rating",
  "source"
];

function emptyPlayer(source) {
  return {
    name: "",
    role: "",
    starter: null,
    minutes: null,
    shots: null,
    shotsOnTarget: null,
    goals: null,
    assists: null,
    xG: null,
    xA: null,
    keyPasses: null,
    touches: null,
    touchesInBox: null,
    passes: null,
    accuratePasses: null,
    passAccuracy: null,
    crosses: null,
    accurateCrosses: null,
    dribblesAttempted: null,
    dribblesCompleted: null,
    foulsCommitted: null,
    foulsWon: null,
    tackles: null,
    interceptions: null,
    clearances: null,
    duelsWon: null,
    aerialsWon: null,
    yellowCards: null,
    redCards: null,
    rating: null,
    source
  };
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const normalized = String(value).replace("%", "").replace(",", ".").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function statMap(stats = []) {
  const mapped = {};
  for (const stat of stats) {
    if (!stat || !stat.name) continue;
    mapped[stat.name] = toNumber(stat.value ?? stat.displayValue);
  }
  return mapped;
}

function playerCompleteness(player) {
  const found = [];
  const missing = [];

  for (const field of PLAYER_FIELDS) {
    if (field === "source") continue;
    const value = player[field];
    if (value === null || value === undefined || value === "") {
      missing.push(field);
    } else {
      found.push(field);
    }
  }

  return { found, missing };
}

module.exports = {
  PLAYER_FIELDS,
  emptyPlayer,
  playerCompleteness,
  statMap,
  toNumber
};
