const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const quoteDirectory = path.join(projectRoot, "data", "quote");
const requestedFile = process.argv[2] || "brasile-giappone-quote.json";
const inputFile = path.resolve(quoteDirectory, requestedFile);
const outputFile = path.join(projectRoot, "confidence-events.json");

if (!inputFile.startsWith(`${quoteDirectory}${path.sep}`)) {
  throw new Error("Il file di input deve trovarsi in data/quote/.");
}
if (!fs.existsSync(inputFile)) {
  throw new Error(`File quote non trovato: data/quote/${requestedFile}`);
}

const payload = JSON.parse(fs.readFileSync(inputFile, "utf8"));
if (!payload || !Array.isArray(payload.markets)) {
  throw new Error(`Struttura JSON non valida: data/quote/${requestedFile}`);
}

function normalized(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function categoryOf(event) {
  const market = normalized(event.mercato);
  const text = normalized(`${event.mercato} ${event.info}`);
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

function isVeryComplex(event) {
  const text = normalized(`${event.mercato} ${event.info} ${event.esito}`);
  const comboLegs = (text.match(/\+/g) || []).length + 1;
  return (
    text.includes("RISULTATO ESATTO") ||
    text.includes("DOPPIETTA") ||
    text.includes("TRIPLETTA") ||
    text.includes("MARCATORE MULTIPLO") ||
    text.includes("MARCATORE PI") ||
    (text.includes("COMBO") && comboLegs >= 3)
  );
}

function isSpecial(event) {
  const text = normalized(`${event.mercato} ${event.info}`);
  return text.includes("RISULTATO ESATTO") || text.includes("MULTIGOL");
}

function isSimple(event, category) {
  const market = normalized(event.mercato);
  const info = normalized(event.info);
  const selection = normalized(event.esito);
  if (isVeryComplex(event) || isSpecial(event) || category === "combo") return false;

  const basicOutcome =
    market.includes("ESITO FINALE 1X2") ||
    market === "1X2" ||
    market.includes("DOPPIA CHANCE") ||
    market.includes("PASSAGGIO TURNO");
  const basicUnderOver =
    market.includes("UNDER/OVER") ||
    market.startsWith("U/O ") ||
    info.startsWith("U/O ");
  const overCorner =
    category === "corner" &&
    (selection === "OVER" || selection.startsWith("OVER "));

  return basicOutcome || basicUnderOver || overCorner;
}

function scoreOf(event, category) {
  const odd = Number(event.quota);
  let score = 0;
  if (isSimple(event, category)) score += 15;
  if (Number.isFinite(odd) && odd >= 1.3 && odd <= 2.2) score += 10;
  if (!isSpecial(event)) score += 8;
  if (["corner", "cartellini", "tiri", "goal"].includes(category)) score += 5;
  if (isVeryComplex(event)) score -= 15;
  return score;
}

const ranking = payload.markets
  .map((event, index) => {
    const category = categoryOf(event);
    return {
      market: event.mercato ?? "",
      selection: event.esito ?? "",
      quota: Number(event.quota),
      score: scoreOf(event, category),
      category,
      _index: index,
    };
  })
  .sort((a, b) => b.score - a.score || a._index - b._index)
  .map(({ _index, ...event }) => event);

fs.writeFileSync(outputFile, `${JSON.stringify(ranking, null, 2)}\n`, "utf8");

console.log(`Input: data/quote/${requestedFile}`);
console.log(`Eventi classificati: ${ranking.length}`);
console.log(`Output: confidence-events.json`);
