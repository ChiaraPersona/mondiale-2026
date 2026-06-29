const fs = require("fs");
const path = require("path");
const { readEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const inputDirectory = path.join(root, "data", "ranking");
const requestedFile = process.argv[2];

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(inputDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun file Ranking *-events.json disponibile.");

files.forEach(filename => {
  const events = readEvents(path.join(inputDirectory, filename));
  console.log(`${events[0]?.match || filename}: ${events.length} eventi disponibili`);
});

console.log("MyCombo Builder in sola lettura: nessuna combinazione generata.");
