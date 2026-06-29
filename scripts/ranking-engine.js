const fs = require("fs");
const path = require("path");
const { readEvents, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const inputDirectory = path.join(root, "data", "value");
const outputDirectory = path.join(root, "data", "ranking");
const requestedFile = process.argv[2];

function processFile(filename) {
  const events = readEvents(path.join(inputDirectory, filename));

  // Nessuna regola di ranking è ancora definita: status resta invariato.
  writeEvents(path.join(outputDirectory, filename), events);
  console.log(`${events[0]?.match || filename}: ${events.length} eventi -> data/ranking/${filename}`);
}

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(inputDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun file Value *-events.json disponibile.");
files.forEach(processFile);
