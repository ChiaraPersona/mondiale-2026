const fs = require("fs");

const quotesFile = process.argv[2] || "sudafrica-canada-quote.json";
const eventsFile = process.argv[3] || "events-target.json";

const quotes = JSON.parse(fs.readFileSync(quotesFile, "utf8"));
const targets = JSON.parse(fs.readFileSync(eventsFile, "utf8"));

function textOf(m) {
  return `${m.mercato || ""} ${m.info || ""} ${m.esito || ""}`.toUpperCase();
}

function findBestMarket(event) {
  const found = quotes.markets
    .filter((m) => m.stato === 1)
    .filter((m) => m.quota >= 1.15 && m.quota <= event.maxOdd)
    .filter((m) => {
      const text = textOf(m);
      return event.search.every((s) => text.includes(s.toUpperCase()));
    })
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
    impliedProbability: Number(implied.toFixed(1)),
    value: Number((event.probability - implied).toFixed(1)),
  };
}

const candidates = targets.events
  .map(findBestMarket)
  .filter(Boolean)
  .sort((a, b) => b.value - a.value);

function buildCombo(min, max) {
  const combo = [];
  let odd = 1;

  for (const c of candidates) {
    const next = odd * c.quota;
    if (next > max) continue;

    combo.push(c);
    odd = next;

    if (odd >= min && odd <= max) break;
  }

  return {
    quotaTotale: Number(odd.toFixed(2)),
    selections: combo,
  };
}

const result = {
  match: quotes.match,
  date: quotes.date,
  candidates,
  combos: {
    quota5: buildCombo(4.5, 6),
    quota10: buildCombo(8.5, 11),
    quota20: buildCombo(18, 22),
  },
};

fs.writeFileSync("final-mycombo.json", JSON.stringify(result, null, 2), "utf8");

console.log("Creato: final-mycombo.json");
console.log(JSON.stringify(result.combos, null, 2));
