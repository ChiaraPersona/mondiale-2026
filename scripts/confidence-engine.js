const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const quoteDirectory = path.join(projectRoot, "data", "quote");
const confidenceDirectory = path.join(projectRoot, "data", "confidence");
const requestedFile = process.argv[2];

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function categoryOf(event) {
  const market = normalizeText(event.mercato);
  const text = normalizeText(`${event.mercato} ${event.info}`);

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
    text.includes("1X2") ||
    text.includes("DOPPIA CHANCE") ||
    text.includes("PASSAGGIO TURNO") ||
    text.includes("PARZIALE/FINALE")
  ) return "esito";
  return "altro";
}

function normalizeId(value) {
  return value === undefined || value === null ? "" : String(value);
}

function normalizeEvent(event) {
  return {
    category: categoryOf(event),
    market: event.mercato ?? "",
    selection: event.esito ?? "",
    odds: Number(event.quota),
    marketId: normalizeId(event.marketId),
    selectionId: normalizeId(event.selectionId),
    confidence: 0,
    value: 0,
    risk: 0,
    status: "unknown",
    reasons: [],
  };
}

function validatePayload(payload, filename) {
  if (!payload || !Array.isArray(payload.markets)) {
    throw new Error(`${filename}: struttura JSON non valida o markets mancante.`);
  }
}

function outputName(filename) {
  return filename.replace(/-quote\.json$/i, "-confidence.json");
}

function processFile(filename) {
  const inputPath = path.resolve(quoteDirectory, filename);
  if (!inputPath.startsWith(`${quoteDirectory}${path.sep}`)) {
    throw new Error("Il file di input deve trovarsi in data/quote/.");
  }
  if (!fs.existsSync(inputPath)) {
    throw new Error(`File quote non trovato: data/quote/${filename}`);
  }

  const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  validatePayload(payload, filename);

  const events = payload.markets.map(normalizeEvent);
  const destination = path.join(confidenceDirectory, outputName(filename));
  fs.writeFileSync(destination, `${JSON.stringify(events, null, 2)}\n`, "utf8");

  console.log(`${filename}: ${events.length} eventi -> data/confidence/${path.basename(destination)}`);
}

if (!fs.existsSync(quoteDirectory)) {
  throw new Error("Cartella data/quote/ non trovata.");
}

fs.mkdirSync(confidenceDirectory, { recursive: true });

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(quoteDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-quote.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) {
  throw new Error("Nessun file *-quote.json presente in data/quote/.");
}

files.forEach(processFile);
