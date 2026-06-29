const fs = require("fs");
const path = require("path");
const { readEvents, round3, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const inputDirectory = path.join(root, "data", "confidence");
const outputDirectory = path.join(root, "data", "probability");
const requestedFile = process.argv[2];

// Pesi deterministici v1. Le categorie supportate hanno massa massima 0,74.
const weightsByCategory = Object.freeze({
  corner: {
    motivation: 0.18,
    form: 0.20,
    tactics: 0.22,
    pressure: 0.14,
  },
  cartellini: {
    pressure: 0.20,
    rivalry: 0.14,
    risks: 0.22,
    tactics: 0.18,
  },
  tiri: {
    players: 0.28,
    form: 0.22,
    tactics: 0.24,
  },
  goal: {
    form: 0.26,
    tactics: 0.26,
    motivation: 0.22,
  },
  giocatori: {
    players: 0.28,
    form: 0.22,
    tactics: 0.24,
  },
  esito: {
    motivation: 0.18,
    form: 0.20,
    tactics: 0.22,
    absences: 0.14,
  },
});

function hasInformation(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasInformation);
  if (typeof value === "object") return Object.values(value).some(hasInformation);
  return false;
}

function probabilityFor(event) {
  const weights = weightsByCategory[event.category];
  if (!weights) {
    return {
      ...event,
      expectedProbability: null,
      probabilityBreakdown: {},
    };
  }

  const probabilityBreakdown = {};
  for (const [factor, weight] of Object.entries(weights)) {
    const evidence = event.breakdown?.[factor];
    probabilityBreakdown[factor] = hasInformation(evidence) ? weight : 0;
  }

  const probability = round3(
    Object.values(probabilityBreakdown).reduce((total, contribution) => total + contribution, 0)
  );

  return {
    ...event,
    expectedProbability: probability,
    probabilityBreakdown,
  };
}

function processFile(filename) {
  const events = readEvents(path.join(inputDirectory, filename));
  const output = events.map(probabilityFor);
  writeEvents(path.join(outputDirectory, filename), output);
  console.log(`${events[0]?.match || filename}: ${output.length} eventi -> data/probability/${filename}`);
}

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(inputDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun file Confidence *-events.json disponibile.");
files.forEach(processFile);
