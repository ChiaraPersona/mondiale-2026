const fs = require("fs");
const path = require("path");
const { readEvents, round3 } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const inputDirectory = path.join(root, "data", "ranking");
const outputDirectory = path.join(root, "data", "eqs");
const requestedInput = process.argv[2];

const REQUIRED_COMPONENTS = Object.freeze([
  "expectedProbability",
  "confidence",
  "stability",
  "value",
  "scenarioFit",
  "marketReliability",
  "volatilityPenalty",
]);

function contributionBreakdown(event) {
  return {
    expectedProbability:
      event.expectedProbability === null ? null : round3(event.expectedProbability * 30),
    confidence: event.confidence === null ? null : round3(event.confidence * 0.20),
    stability: event.stability === null ? null : round3(event.stability * 0.20),
    value: event.value === null ? null : round3(event.value * 15),
    scenarioFit: event.scenarioFit === null ? null : round3(event.scenarioFit * 0.10),
    marketReliability:
      event.marketReliability === null ? null : round3(event.marketReliability * 0.05),
    volatilityPenalty:
      event.volatilityPenalty === null ? null : round3(-event.volatilityPenalty),
  };
}

function calculateEqs(event) {
  const eqsBreakdown = contributionBreakdown(event);
  const hasMissingComponent = REQUIRED_COMPONENTS.some(field => event[field] === null);
  const rawEqs = hasMissingComponent
    ? null
    : Object.values(eqsBreakdown).reduce((sum, contribution) => sum + contribution, 0);

  return {
    match: event.match,
    market: event.market,
    selection: event.selection,
    odds: event.odds,
    category: event.category,
    class: event.class,
    expectedProbability: event.expectedProbability,
    confidence: event.confidence,
    stability: event.stability,
    value: event.value,
    scenarioFit: event.scenarioFit,
    marketReliability: event.marketReliability,
    volatilityPenalty: event.volatilityPenalty,
    eqs: rawEqs === null ? null : round3(Math.max(0, Math.min(100, rawEqs))),
    eqsBreakdown,
    reasons: event.reasons,
  };
}

function outputName(inputName) {
  return inputName.replace(/-events\.json$/i, "-eqs.json");
}

function processFile(filename) {
  const events = readEvents(path.join(inputDirectory, filename));
  const output = events.map(calculateEqs);
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(outputDirectory, outputName(filename)),
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8"
  );
  const calculated = output.filter(event => event.eqs !== null).length;
  console.log(
    `${events[0]?.match || filename}: ${output.length} eventi, ${calculated} EQS calcolati -> data/eqs/${outputName(filename)}`
  );
}

function inputFiles() {
  if (requestedInput) {
    const filename = requestedInput.toLowerCase().endsWith(".json")
      ? requestedInput
      : `${requestedInput}-events.json`;
    return [filename];
  }
  if (!fs.existsSync(inputDirectory)) {
    throw new Error(`Cartella input non trovata: ${inputDirectory}`);
  }
  return fs.readdirSync(inputDirectory)
    .filter(filename => filename.toLowerCase().endsWith("-events.json"))
    .sort((a, b) => a.localeCompare(b, "it"));
}

const files = inputFiles();
if (!files.length) throw new Error("Nessun file Ranking *-events.json disponibile.");
files.forEach(processFile);

module.exports = { calculateEqs, contributionBreakdown };
