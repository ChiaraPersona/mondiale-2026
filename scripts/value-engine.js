const fs = require("fs");
const path = require("path");
const { readEvents, round3, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const inputDirectory = path.join(root, "data", "probability");
const outputDirectory = path.join(root, "data", "value");
const requestedFile = process.argv[2];

function calculateValue(event) {
  if (event.expectedProbability === null) {
    return { ...event, value: null };
  }
  if (event.bookmakerProbability === null) {
    throw new Error(`${event.match}: bookmakerProbability mancante.`);
  }
  return {
    ...event,
    value: round3(event.expectedProbability - event.bookmakerProbability),
  };
}

function processFile(filename) {
  const events = readEvents(path.join(inputDirectory, filename));
  const output = events.map(calculateValue);
  writeEvents(path.join(outputDirectory, filename), output);
  console.log(`${events[0]?.match || filename}: ${output.length} eventi -> data/value/${filename}`);
}

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(inputDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun file Probability *-events.json disponibile.");
files.forEach(processFile);
