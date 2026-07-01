const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputDirectory = path.join(root, "data", "mycombo");

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
}

function writeJson(fileName, payload) {
  fs.mkdirSync(outputDirectory, { recursive: true });
  const destination = path.join(outputDirectory, fileName);
  if (fs.existsSync(destination)) {
    const existing = JSON.parse(fs.readFileSync(destination, "utf8"));
    if (existing.status === "completed" && payload.status !== "completed") {
      console.log(`${fileName}: archivio completato preservato.`);
      return;
    }
  }
  fs.writeFileSync(destination, `${JSON.stringify(payload, null, 2)}\n`);
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
    riskProfile: portfolio.riskProfile || null,
    riskVerdict: portfolio.riskVerdict || "high",
    riskNotes: portfolio.riskNotes || [],
    optimization: {
      initialOdds: portfolio.initialOdds,
      acceptedRange: portfolio.acceptedRange,
      removedEvents: portfolio.removedEvents || [],
      addedEvents: portfolio.addedEvents || [],
      improvementEstimate: portfolio.improvementEstimate,
    },
  };
}

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function bookingPlayer(event) {
  const market = String(event.mercato || event.market || "");
  const detail = market.split(/\s+(?:—|â€”)\s+/).pop();
  return detail
    .replace(/\s+CARTELLINO O SUO SOST\..*$/i, "")
    .replace(/\s+CARTELLINO.*$/i, "")
    .trim();
}

function unavailableBookingsTrio(reason) {
  return {
    available: false,
    totalOdds: null,
    mode: null,
    events: [],
    reason,
    risks: [],
  };
}

function buildBookingsTrio(ranking, quote) {
  const candidates = (ranking?.events || [])
    .filter(event =>
      String(event.categoria || "").toLowerCase() === "cartellini" &&
      String(event.selezione || "").toUpperCase() === "SI" &&
      Number(event.quota) > 1
    )
    .sort((first, second) =>
      Number(second.score || 0) - Number(first.score || 0) ||
      Number(second.fattoriScore?.stabilitaMinutaggio || 0) -
        Number(first.fattoriScore?.stabilitaMinutaggio || 0) ||
      Number(first.quota) - Number(second.quota)
    );

  if (candidates.length < 3) {
    return unavailableBookingsTrio(
      `Dati insufficienti: disponibili soltanto ${candidates.length} candidati ammonito valutati.`
    );
  }

  const selected = candidates.slice(0, 3);
  if (selected.some(event => Number(event.fattoriScore?.stabilitaMinutaggio || 0) < 5)) {
    return unavailableBookingsTrio(
      "Dati insufficienti: i candidati migliori presentano un rischio minutaggio troppo alto."
    );
  }

  const specialMarket = (quote?.markets || []).find(item => {
    const text = `${item.mercato || ""} ${item.info || ""}`.toUpperCase();
    return (
      Number(item.stato) === 1 &&
      Number(item.quota) > 1 &&
      text.includes("TRIS") &&
      /(AMMON|CARTELL)/.test(text) &&
      text.includes("ERRORE")
    );
  });

  const events = selected.map((event, index) => ({
    id: `booking-${String(index + 1).padStart(2, "0")}`,
    player: bookingPlayer(event),
    market: event.mercato,
    selection: event.selezione,
    odds: Number(event.quota),
    selectionId: event.selectionId,
    marketId: event.marketId,
    category: "cartellini",
    rankingScore: event.score,
    class: event.classe,
    reason: event.motivo,
    minuteStability: event.fattoriScore?.stabilitaMinutaggio ?? null,
  }));
  const totalOdds = specialMarket
    ? Number(specialMarket.quota)
    : round2(events.reduce((total, event) => total * event.odds, 1));

  return {
    available: true,
    totalOdds,
    mode: specialMarket ? "tris_ammoniti_con_errore" : "manual_trio",
    events,
    reason: specialMarket
      ? "Usato il mercato Sisal Tris ammoniti con errore, con i tre profili meglio classificati per ruolo, duelli, storico disciplinare e stabilità di impiego."
      : "Tris manuale costruito sui tre profili meglio classificati per ruolo, duelli, storico disciplinare, avversario e stabilità di impiego.",
    risks: [
      "I cartellini individuali restano eventi ad alta varianza e dipendono dalla direzione arbitrale.",
      "Sostituzioni, cambi di ruolo e andamento della partita possono ridurre l'esposizione ai duelli previsti.",
      ...(specialMarket ? [] : ["La quota è il prodotto teorico delle tre singole Sisal e va verificata nel betslip."]),
    ],
  };
}

function optimizedMatch(slug, source, date, bookingsTrio = null) {
  return {
    slug,
    match: source.match,
    date,
    status: "prepared",
    portfolios: source.portfolios.map(normalizePortfolio),
    bookingsTrio: bookingsTrio || unavailableBookingsTrio("Analisi ammoniti non disponibile per questa partita."),
  };
}

function diversifiedGermany(source, ranking) {
  const match = optimizedMatch("germania-paraguay", source, "29/06/2026 ore 22:30");
  const definitions = [
    {
      name: "Safe",
      indexes: [3, 4, 5, 13],
      reason: "Nucleo strutturale: esito Germania, limite gol e volumi collettivi.",
      scenario: "Controllo Germania",
    },
    {
      name: "Balanced",
      indexes: [1, 7, 16, 18, 20, 23],
      reason: "Portfolio alternativo costruito su qualificazione, volume partita e tiri di giocatori diversi.",
      scenario: "Germania territoriale, Paraguay presente in transizione",
    },
    {
      name: "Aggressive",
      indexes: [1, 21, 25, 28, 29],
      reason: "Portfolio ad alta quota concentrato su Havertz, Sané, Undav e Cáceres.",
      scenario: "Pressione tedesca e duelli individuali",
    },
  ];
  match.portfolios = definitions.map(definition => {
    const events = definition.indexes.map(index => {
      const event = ranking.events[index - 1];
      return {
        id: `event-${String(index).padStart(2, "0")}`,
        market: event.mercato,
        selection: event.selezione,
        odds: event.quota,
        category: event.categoria,
        rankingScore: event.score,
        class: event.classe,
      };
    });
    const finalOdds = Math.round(events.reduce((total, event) => total * Number(event.odds), 1) * 100) / 100;
    return {
      name: definition.name,
      finalOdds,
      events,
      reason: definition.reason,
      scenario: {
        id: definition.name.toLowerCase(),
        name: definition.scenario,
        estimatedProbability: definition.name === "Safe" ? "alta" : definition.name === "Balanced" ? "media" : "bassa",
      },
      strengths: ["Massimo due selezioni condivise con gli altri portfolio.", "Mercati coerenti con le formazioni ufficiali."],
      weaknesses: [definition.name === "Aggressive" ? "Maggiore dipendenza dai singoli giocatori." : "La quota dipende dal copione territoriale previsto."],
      optimization: {
        initialOdds: finalOdds,
        acceptedRange: definition.name === "Safe" ? [4.5, 5.5] : definition.name === "Balanced" ? [9, 11] : [18, 22],
        removedEvents: [],
        addedEvents: [],
        improvementEstimate: "diversificazione controllata",
      },
    };
  });
  return match;
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
const germany = diversifiedGermany(
  readJson("data/mvp/germania-paraguay/portfolio-optimized.json"),
  readJson("data/mvp/germania-paraguay/ranking-events.json")
);
const southAfrica = archivedMatch(readJson("final-mycombo.json"));
const requestedSlug = process.argv[2];

if (requestedSlug) {
  const source = readJson(`data/mvp/${requestedSlug}/portfolio-optimized.json`);
  const quote = readJson(`data/quote/${requestedSlug}-quote.json`);
  const ranking = readJson(`data/mvp/${requestedSlug}/ranking-events.json`);
  const match = optimizedMatch(
    requestedSlug,
    source,
    quote.date,
    buildBookingsTrio(ranking, quote)
  );
  writeJson(`${requestedSlug}.json`, match);
  console.log(`MyCombo generata per ${source.match}.`);
  return;
}

[brazil, germany, southAfrica].forEach(match => writeJson(`${match.slug}.json`, match));
writeJson("mycombo-definitive-2026-06-29.json", {
  date: "2026-06-29",
  status: "prepared",
  matches: [brazil, germany],
});

console.log("MyCombo definitive generate per Brasile-Giappone e Germania-Paraguay.");
console.log("Archivio isolato generato per Sudafrica-Canada.");
