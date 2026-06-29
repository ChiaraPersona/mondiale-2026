const fs = require("fs");
const path = require("path");
const { readEvents, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const eventDirectory = path.join(root, "data", "events");
const providerDirectory = path.join(root, "data", "providers");
const outputDirectory = path.join(root, "data", "intelligence");
const requestedFile = process.argv[2];

const needFields = Object.freeze([
  "motivation",
  "form",
  "tactics",
  "pressure",
  "players",
  "absences",
  "risks",
]);

const needsByCategory = Object.freeze({
  corner: { motivation: true, form: true, tactics: true, pressure: true, risks: true },
  cartellini: { pressure: true, risks: true, tactics: true },
  tiri: { players: true, tactics: true, form: true },
  goal: { tactics: true, form: true, motivation: true },
  esito: { motivation: true, form: true, tactics: true, absences: true },
  giocatori: { players: true, form: true, tactics: true },
});

function providerData(provider, base) {
  const filePath = path.join(providerDirectory, provider, `${base}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Provider mancante: data/providers/${provider}/${base}.json`);
  }
  const payload = JSON.parse(fs.readFileSync(filePath, "utf8"));
  return payload.data ?? null;
}

function needsFor(category) {
  return Object.fromEntries(
    needFields.map(field => [field, Boolean(needsByCategory[category]?.[field])])
  );
}

function processFile(filename) {
  const base = filename.replace(/-events\.json$/i, "");
  const events = readEvents(path.join(eventDirectory, filename));
  const providers = Object.fromEntries(
    needFields.map(field => [field, providerData(field, base)])
  );

  const output = events.map(event => {
    const needs = needsFor(event.category);
    const breakdown = Object.fromEntries(
      needFields
        .filter(field => needs[field])
        .map(field => [field, providers[field]])
    );
    return { ...event, needs, breakdown };
  });

  writeEvents(path.join(outputDirectory, filename), output);
  console.log(`${events[0]?.match || filename}: ${output.length} eventi -> data/intelligence/${filename}`);
}

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(eventDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun evento Quote Engine disponibile.");
files.forEach(processFile);
