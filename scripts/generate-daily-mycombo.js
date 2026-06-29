const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "data", "mycombo");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(fileName, payload) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, fileName), `${JSON.stringify(payload, null, 2)}\n`);
}

function normalizePortfolio(portfolio) {
  return {
    name: String(portfolio.name || "").replace(/^Portfolio\s+/i, ""),
    finalOdds: portfolio.finalOdds,
    events: portfolio.events,
    reason: portfolio.reason,
    scenario: portfolio.scenario,
    strengths: portfolio.strengths || [],
    weaknesses: portfolio.weaknesses || [],
    optimization: {
      initialOdds: portfolio.initialOdds,
      acceptedRange: portfolio.acceptedRange,
      removedEvents: portfolio.removedEvents || [],
      addedEvents: portfolio.addedEvents || [],
      improvementEstimate: portfolio.improvementEstimate,
    },
  };
}

function optimizedMatch(slug, source, date) {
  return {
    slug,
    match: source.match,
    date,
    status: "prepared",
    portfolios: source.portfolios.map(normalizePortfolio),
  };
}

function categoryFor(market) {
  const value = String(market || "").toLowerCase();
  if (value.includes("corner") || value.includes("angolo")) return "corner";
  if (value.includes("cartell")) return "cartellini";
  if (value.includes("tiri")) return "tiri";
  if (value.includes("goal") || value.includes("gol") || value.includes("under") || value.includes("over")) return "goal";
  return "esito";
}

function isMyComboEligible(selection) {
  const market = String(selection?.mercato || selection?.market || "").toUpperCase();
  const info = String(selection?.info || "").toUpperCase();
  return !(
    market.includes("PRIMA A X CORNER") ||
    info.includes("PRIMA A 2 CALCI D'ANGOLO")
  );
}

function archivedMatch(source) {
  const definitions = [
    ["Safe", source.combos.quota5],
    ["Balanced", source.combos.quota10],
    ["Aggressive", source.combos.quota20],
  ];
  return {
    slug: "sudafrica-canada",
    match: source.match,
    date: source.date,
    status: "completed",
    settlement: source.settlement,
    portfolios: definitions.map(([name, combo]) => {
      const selections = (combo.selections || []).filter(isMyComboEligible);
      const finalOdds = Math.round(
        selections.reduce((total, selection) => total * Number(selection.quota), 1) * 100
      ) / 100;
      return {
      name,
      finalOdds,
      events: selections.map(selection => ({
        id: selection.eventId,
        market: [selection.mercato, selection.info].filter(Boolean).join(" — "),
        selection: selection.esito || selection.label,
        odds: selection.quota,
        category: categoryFor(selection.mercato),
        selectionId: selection.selectionId,
        marketId: selection.marketId,
      })),
      reason: "Portfolio storico della partita, mantenuto separato dagli output delle altre partite.",
      scenario: {
        name: "Canada favorito in una partita controllata",
        estimatedProbability: "storica",
      },
      strengths: ["Eventi riferiti esclusivamente a Sudafrica - Canada.", "Esito verificato sul risultato finale."],
      weaknesses: ["Portfolio archiviato: non rappresenta una giocata ancora aperta."],
    };
    }),
  };
}

const brazil = optimizedMatch(
  "brasile-giappone",
  readJson("data/mvp/brasile-giappone/portfolio-optimized.json"),
  "29/06/2026 ore 19:00"
);
const germany = optimizedMatch(
  "germania-paraguay",
  readJson("data/mvp/germania-paraguay/portfolio-optimized.json"),
  "29/06/2026 ore 22:30"
);
const southAfrica = archivedMatch(readJson("final-mycombo.json"));

[brazil, germany, southAfrica].forEach(match => writeJson(`${match.slug}.json`, match));
writeJson("mycombo-definitive-2026-06-29.json", {
  date: "2026-06-29",
  status: "prepared",
  matches: [brazil, germany],
});

console.log("MyCombo definitive generate per Brasile-Giappone e Germania-Paraguay.");
console.log("Archivio isolato generato per Sudafrica-Canada.");
