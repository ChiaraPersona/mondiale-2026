const fs = require("fs");
const path = require("path");
const { createEvent, round3, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const inputDirectory = path.join(root, "data", "quote");
const outputDirectory = path.join(root, "data", "events");
const requestedFile = process.argv[2];

function processFile(filename) {
  const inputPath = path.join(inputDirectory, filename);
  if (!fs.existsSync(inputPath)) throw new Error(`File quote non trovato: ${filename}`);
  const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  if (!payload.match || !Array.isArray(payload.markets)) {
    throw new Error(`${filename}: struttura quote non valida.`);
  }

  const events = payload.markets.map(market => {
    const event = createEvent({ ...market, match: payload.match });
    event.bookmakerProbability = round3(1 / event.odds);
    return event;
  });

  const base = filename.replace(/-quote\.json$/i, "");
  const outputPath = path.join(outputDirectory, `${base}-events.json`);
  writeEvents(outputPath, events);
  console.log(`${payload.match}: ${events.length} eventi -> data/events/${path.basename(outputPath)}`);
}

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(inputDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-quote.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun file quote disponibile.");
files.forEach(processFile);
