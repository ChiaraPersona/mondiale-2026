const fs = require("fs");
const path = require("path");

const EVENT_FIELDS = Object.freeze([
  "match",
  "category",
  "market",
  "selection",
  "odds",
  "selectionId",
  "marketId",
  "expectedProbability",
  "probabilityBreakdown",
  "bookmakerProbability",
  "confidence",
  "stability",
  "value",
  "scenarioFit",
  "marketReliability",
  "volatilityPenalty",
  "eqs",
  "eqsBreakdown",
  "class",
  "status",
  "needs",
  "breakdown",
  "reasons",
  "history",
]);

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function categoryOf(source) {
  const market = normalizeText(source.mercato ?? source.market);
  const info = normalizeText(source.info);
  const text = `${market} ${info}`;

  if (text.includes("COMBO")) return "combo";
  if (text.includes("RISULTATO ESATTO")) return "esatto";
  if (text.includes("CORNER") || text.includes("ANGOLO")) return "corner";
  if (text.includes("CARTELL") || text.includes("AMMON")) return "cartellini";
  if (text.includes("TIR")) return "tiri";
  if (
    text.includes("MARCATORE") ||
    text.includes("ASSIST") ||
    text.includes("GIOCATORE") ||
    text.includes("FALLI COMMESSI") ||
    text.includes("FALLI SUBITI")
  ) return "giocatori";
  if (
    text.includes("GOAL") ||
    text.includes("NOGOAL") ||
    text.includes("NO GOAL") ||
    text.includes("U/O GOL") ||
    text.includes("MULTIGOL") ||
    market === "UNDER/OVER"
  ) return "goal";
  if (
    market === "1X2" ||
    text.includes("ESITO FINALE 1X2") ||
    text.includes("DOPPIA CHANCE") ||
    text.includes("PASSAGGIO TURNO") ||
    text.includes("QUALIFICAZIONE")
  ) return "esito";
  return "altro";
}

function round3(value) {
  return Math.round((value + Number.EPSILON) * 1000) / 1000;
}

function createEvent(source = {}) {
  const odds = Number(source.odds ?? source.quota);
  return {
    match: source.match ?? "",
    category: source.category ?? categoryOf(source),
    market: source.market ?? source.mercato ?? "",
    selection: source.selection ?? source.esito ?? "",
    odds: Number.isFinite(odds) ? odds : 0,
    selectionId:
      source.selectionId === null || source.selectionId === undefined
        ? ""
        : String(source.selectionId),
    marketId:
      source.marketId === null || source.marketId === undefined
        ? ""
        : String(source.marketId),
    expectedProbability: source.expectedProbability ?? null,
    probabilityBreakdown:
      source.probabilityBreakdown && typeof source.probabilityBreakdown === "object"
        ? source.probabilityBreakdown
        : {},
    bookmakerProbability: source.bookmakerProbability ?? null,
    confidence: source.confidence ?? null,
    stability: source.stability ?? null,
    value: source.value ?? null,
    scenarioFit: source.scenarioFit ?? null,
    marketReliability: source.marketReliability ?? null,
    volatilityPenalty: source.volatilityPenalty ?? null,
    eqs: source.eqs ?? null,
    eqsBreakdown:
      source.eqsBreakdown && typeof source.eqsBreakdown === "object"
        ? source.eqsBreakdown
        : {},
    class: source.class ?? source.classe ?? "",
    status: source.status ?? "pending",
    needs: source.needs && typeof source.needs === "object" ? source.needs : {},
    breakdown:
      source.breakdown && typeof source.breakdown === "object" ? source.breakdown : {},
    reasons: Array.isArray(source.reasons) ? source.reasons : [],
    history: source.history && typeof source.history === "object" ? source.history : {},
  };
}

function validateEvent(event, label = "evento") {
  const missing = EVENT_FIELDS.filter(field => !Object.hasOwn(event, field));
  if (missing.length) throw new Error(`${label}: campi mancanti: ${missing.join(", ")}.`);
  if (!Number.isFinite(event.odds) || event.odds <= 0) {
    throw new Error(`${label}: odds non valida.`);
  }
  if (
    event.bookmakerProbability !== null &&
    (!Number.isFinite(event.bookmakerProbability) ||
      event.bookmakerProbability < 0 ||
      event.bookmakerProbability > 1)
  ) throw new Error(`${label}: bookmakerProbability non valida.`);
  if (
    event.expectedProbability !== null &&
    (!Number.isFinite(event.expectedProbability) ||
      event.expectedProbability < 0 ||
      event.expectedProbability > 1)
  ) throw new Error(`${label}: expectedProbability non valida.`);
  if (
    event.value !== null &&
    (!Number.isFinite(event.value) || event.value < -1 || event.value > 1)
  ) throw new Error(`${label}: value non valido.`);
  for (const field of [
    "confidence",
    "stability",
    "scenarioFit",
    "marketReliability",
    "volatilityPenalty",
    "eqs",
  ]) {
    if (
      event[field] !== null &&
      (!Number.isFinite(event[field]) || event[field] < 0 || event[field] > 100)
    ) throw new Error(`${label}: ${field} non valida.`);
  }
  return event;
}

function readEvents(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`File non trovato: ${filePath}`);
  const events = JSON.parse(fs.readFileSync(filePath, "utf8"));
  if (!Array.isArray(events)) throw new Error(`${filePath}: atteso un array di eventi.`);
  return events.map((event, index) => validateEvent(createEvent(event), `evento ${index + 1}`));
}

function writeEvents(filePath, events) {
  const normalized = events.map((event, index) =>
    validateEvent(createEvent(event), `evento ${index + 1}`)
  );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(normalized, null, 2)}\n`, "utf8");
}

module.exports = {
  EVENT_FIELDS,
  categoryOf,
  createEvent,
  readEvents,
  round3,
  validateEvent,
  writeEvents,
};
