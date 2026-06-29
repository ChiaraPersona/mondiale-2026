const fs = require("fs");
const path = require("path");
const { readPage } = require("./providers/reading-source");
const QuoteProvider = require("./providers/quote-provider");
const MotivationProvider = require("./providers/motivation-provider");
const FormProvider = require("./providers/form-provider");
const TacticsProvider = require("./providers/tactics-provider");
const PressureProvider = require("./providers/pressure-provider");
const AbsenceProvider = require("./providers/absence-provider");
const RiskProvider = require("./providers/risk-provider");
const PlayerProvider = require("./providers/player-provider");
const RefereeProvider = require("./providers/referee-provider");
const WeatherProvider = require("./providers/weather-provider");

const root = path.resolve(__dirname, "..");
const quoteDirectory = path.join(root, "data", "quote");
const providerDirectory = path.join(root, "data", "providers");
const requestedFile = process.argv[2];

const providers = {
  motivation: MotivationProvider,
  form: FormProvider,
  tactics: TacticsProvider,
  pressure: PressureProvider,
  absences: AbsenceProvider,
  risks: RiskProvider,
  players: PlayerProvider,
  referee: RefereeProvider,
  weather: WeatherProvider,
};

function writeProvider(name, base, value) {
  const directory = path.join(providerDirectory, name);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(
    path.join(directory, `${base}.json`),
    `${JSON.stringify(value, null, 2)}\n`,
    "utf8"
  );
}

function processFile(filename) {
  const base = filename.replace(/-quote\.json$/i, "");
  const quoteData = QuoteProvider(path.join(quoteDirectory, filename));
  const pagePath = path.join(root, `lettura-${base}.html`);
  if (!fs.existsSync(pagePath)) throw new Error(`Pagina lettura non trovata: ${pagePath}`);
  const source = readPage(pagePath);

  writeProvider("quote", base, quoteData);
  for (const [name, provider] of Object.entries(providers)) {
    writeProvider(name, base, {
      match: quoteData.match,
      data: provider(source),
    });
  }
  console.log(`${quoteData.match}: ${Object.keys(providers).length + 1} provider aggiornati`);
}

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(quoteDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-quote.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) throw new Error("Nessun file quote disponibile per i provider.");
files.forEach(processFile);
