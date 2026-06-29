const fs = require("fs");
const path = require("path");
const { readEvents, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const inputDirectory = path.join(root, "data", "intelligence");
const outputDirectory = path.join(root, "data", "scoring");
const requestedFile = process.argv[2];

function processFile(filename) {
  const events = readEvents(path.join(inputDirectory, filename));
  const outputPath = path.join(outputDirectory, filename);

  // Scoring v1 è uno stadio di validazione: non possiede ancora campi da mutare.
  writeEvents(outputPath, events);
  console.log(`${events[0]?.match || filename}: ${events.length} eventi -> data/scoring/${filename}`);
}

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(inputDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun file intelligence *-events.json disponibile.");
files.forEach(processFile);
