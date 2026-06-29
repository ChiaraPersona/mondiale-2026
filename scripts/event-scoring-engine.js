const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const quoteDirectory = path.join(root, "data", "quote");
const intelligenceDirectory = path.join(root, "data", "intelligence");
const scoringDirectory = path.join(root, "data", "scoring");
const requestedFile = process.argv[2];

const emptyNeeds = Object.freeze({
  motivation: false,
  form: false,
  tactics: false,
  pressure: false,
  players: false,
  absences: false,
  risks: false,
});

const needsByCategory = Object.freeze({
  corner: {
    motivation: true,
    tactics: true,
    pressure: true,
    risks: true,
  },
  cartellini: {
    pressure: true,
    risks: true,
    tactics: true,
  },
  tiri: {
    players: true,
    tactics: true,
    form: true,
  },
  goal: {
    tactics: true,
    form: true,
    motivation: true,
  },
  esito: {
    motivation: true,
    form: true,
    tactics: true,
    absences: true,
  },
  giocatori: {
    players: true,
    form: true,
    tactics: true,
  },
});

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function categoryOf(event) {
  const market = normalizeText(event.mercato);
  const info = normalizeText(event.info);
  const text = `${market} ${info}`;

  if (text.includes("CORNER") || text.includes("ANGOLO")) return "corner";
  if (text.includes("CARTELL") || text.includes("AMMON")) return "cartellini";
  if (text.includes("TIR")) return "tiri";
  if (
    text.includes("MARCATORE") ||
    text.includes("ASSIST") ||
    text.includes("GIOCATORE") ||
    text.includes("FALLI COMMESSI") ||
    text.includes("FALLI SUBITI") ||
    text.includes("FUORIGIOCO GIOCATORE")
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
  return "unsupported";
}

function needsFor(category) {
  return {
    ...emptyNeeds,
    ...(needsByCategory[category] || {}),
  };
}

function normalizeEvent(event) {
  const category = categoryOf(event);
  return {
    market: event.mercato ?? "",
    selection: event.esito ?? "",
    odds: Number(event.quota),
    needs: needsFor(category),
    confidence: null,
    value: null,
    stability: null,
    reasons: [],
  };
}

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} non trovato: ${path.relative(root, filePath)}`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} non valido: ${path.relative(root, filePath)} (${error.message})`);
  }
}

function baseName(filename) {
  return filename.replace(/-quote\.json$/i, "");
}

function processQuoteFile(filename) {
  const base = baseName(filename);
  const quotePath = path.join(quoteDirectory, filename);
  const intelligencePath = path.join(intelligenceDirectory, `${base}-intelligence.json`);
  const outputPath = path.join(scoringDirectory, `${base}-events.json`);

  const quoteData = readJson(quotePath, "File quote");
  const intelligenceData = readJson(intelligencePath, "File intelligence");

  if (!Array.isArray(quoteData.markets)) {
    throw new Error(`${filename}: proprietà markets mancante o non valida.`);
  }
  if (!intelligenceData || typeof intelligenceData !== "object" || !intelligenceData.match) {
    throw new Error(`${base}-intelligence.json: struttura intelligence non valida.`);
  }

  const events = quoteData.markets.map(normalizeEvent);
  fs.writeFileSync(outputPath, `${JSON.stringify(events, null, 2)}\n`, "utf8");

  console.log(
    `${quoteData.match || base}: ${events.length} eventi -> data/scoring/${path.basename(outputPath)}`
  );
}

if (!fs.existsSync(quoteDirectory)) {
  throw new Error("Cartella data/quote/ non trovata.");
}

fs.mkdirSync(scoringDirectory, { recursive: true });

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(quoteDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-quote.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) {
  throw new Error("Nessun file *-quote.json presente in data/quote/.");
}

files.forEach(processQuoteFile);
