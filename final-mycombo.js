const fs = require("fs");

const quotesFile = process.argv[2] || "sudafrica-canada-quote.json";
const eventsFile = process.argv[3] || "events-target.json";

const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"));
const targets = JSON.parse(fs.readFileSync(eventsFile, "utf8"));

const upper = (value) => String(value || "").toUpperCase();
const textOf = (market) => `${market.mercato || ""} ${market.info || ""} ${market.esito || ""}`.toUpperCase();

function isSpecificTimeMarket(market) {
  return /(?:NEL|IN|ENTRAMBI I)\s+(?:1|2|PRIMO|SECONDO)\s*(?:°|º)?\s*TEMPO/.test(upper(market.info));
}

function isPrebuiltCombo(market) {
  return upper(market.mercato).startsWith("COMBO:");
}

function semanticShotMatches(event, market) {
  const label = upper(event.label);
  const amount = Number(label.match(/ALMENO\s+(\d+)/)?.[1]);
  const player = upper(event.search?.[0]);
  if (!amount || !player || !upper(market.info).includes(player)) return false;
  if (market.esito !== "OVER" || Number(market.soglia) !== amount - 0.5) return false;
  if (isSpecificTimeMarket(market)) return false;

  const onTarget = label.includes("IN PORTA");
  const marketName = upper(market.mercato);
  return onTarget
    ? marketName.includes("TIRI IN PORTA GIOCATORE")
    : marketName.includes("TIRI TOTALI GIOCATORE");
}

function semanticGoalsMatches(event, market) {
  const match = upper(event.label).match(/\b(UNDER|OVER)\s+(\d+(?:[.,]\d+)?)/);
  if (!match) return false;
  const direction = match[1];
  const threshold = Number(match[2].replace(",", "."));
  return upper(market.mercato) === "UNDER/OVER"
    && upper(market.esito) === direction
    && Number(market.soglia) === threshold;
}

function marketMatches(event, market) {
  if (market.stato !== 1 || Number(market.quota) <= 1 || Number(market.quota) > event.maxOdd) return false;
  if (isPrebuiltCombo(market)) return false;

  const label = upper(event.label);
  if (label.includes("TIR")) return semanticShotMatches(event, market);
  if (/\b(?:UNDER|OVER)\s+\d/.test(label) && label.includes("GOL")) return semanticGoalsMatches(event, market);

  const text = textOf(market);
  return event.search.every((term) => text.includes(upper(term)));
}

function findBestMarket(event) {
  const found = quotes.markets
    .filter((market) => marketMatches(event, market))
    .sort((a, b) => b.quota - a.quota);

  if (!found.length) return null;
  const best = found[0];
  const implied = (1 / best.quota) * 100;

  return {
    eventId: event.id,
    label: event.label,
    probability: event.probability,
    quota: best.quota,
    mercato: best.mercato,
    info: best.info,
    esito: best.esito,
    selectionId: best.selectionId,
    marketId: best.marketId,
    codiceMercato: best.codiceMercato,
    impliedProbability: Number(implied.toFixed(1)),
    value: Number((event.probability - implied).toFixed(1)),
  };
}

function playerKey(selection) {
  const match = upper(selection.info).match(/^([A-ZÀ-ÖØ-Ý' -]+\s[A-Z]\.)/);
  return match && upper(selection.mercato).includes("GIOCATORE") ? match[1].trim() : "";
}

function compatible(combo, candidate) {
  if (combo.some((item) => item.selectionId === candidate.selectionId || item.marketId === candidate.marketId)) return false;

  const candidatePlayer = playerKey(candidate);
  if (candidatePlayer && combo.some((item) => playerKey(item) === candidatePlayer)) return false;

  // Una selezione già combinata non può essere una gamba di un'altra MyCombo.
  if (isPrebuiltCombo(candidate)) return false;
  return true;
}

const candidates = targets.events
  .map(findBestMarket)
  .filter(Boolean)
  .sort((a, b) => b.value - a.value);

function eligibleForMyCombo(candidate) {
  const market = upper(candidate.mercato);
  if (market === "PASSAGGIO TURNO") return false;
  if (isPrebuiltCombo(candidate)) return false;
  return true;
}

const compatibleCandidates = candidates.filter(eligibleForMyCombo);

function allCompatibleSubsets() {
  const subsets = [];
  const visit = (index, combo) => {
    if (index === compatibleCandidates.length) {
      if (combo.length >= 2) subsets.push(combo);
      return;
    }
    visit(index + 1, combo);
    if (compatible(combo, compatibleCandidates[index])) {
      visit(index + 1, [...combo, compatibleCandidates[index]]);
    }
  };
  visit(0, []);
  return subsets;
}

const subsets = allCompatibleSubsets();
const totalOdd = (combo) => combo.reduce((total, item) => total * item.quota, 1);

function buildCombo(target) {
  const ranked = subsets
    .map((selections) => ({ selections, quotaTotale: totalOdd(selections) }))
    .sort((a, b) => {
      const distance = Math.abs(a.quotaTotale - target) - Math.abs(b.quotaTotale - target);
      if (distance) return distance;
      return b.selections.reduce((sum, item) => sum + item.value, 0)
        - a.selections.reduce((sum, item) => sum + item.value, 0);
    });
  const best = ranked[0];
  if (!best) {
    return {
      quotaTotale: null,
      targetReached: false,
      reason: "Eventi compatibili insufficienti",
      selections: [],
    };
  }
  return {
    quotaTotale: Number(best.quotaTotale.toFixed(2)),
    targetReached: Math.abs(best.quotaTotale - target) <= target * 0.1,
    selections: best.selections,
  };
}

const result = {
  match: quotes.match,
  date: quotes.date,
  compatibilityPolicy: "no-prebuilt-combos; exact-event-context; one-market-per-player; unique-marketId",
  candidates,
  combos: {
    quota5: buildCombo(5),
    quota10: buildCombo(10),
    quota20: buildCombo(20),
  },
};

fs.writeFileSync("final-mycombo.json", JSON.stringify(result, null, 2), "utf8");
fs.writeFileSync(
  "js/final-mycombo-data.js",
  `/* Generato automaticamente da final-mycombo.js */\nwindow.FINAL_MYCOMBO_DATA = ${JSON.stringify(result, null, 2)};\n`,
  "utf8",
);
console.log("Creato: final-mycombo.json");
console.log("Creato: js/final-mycombo-data.js");
console.log(JSON.stringify(result.combos, null, 2));
