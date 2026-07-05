const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const quoteDir = path.join(root, "data", "quote");
const outputDir = path.join(root, "data", "mycombo");

const models = {
  "canada-marocco": { p: [18, 29, 53], score: "0-1", scenario: "Marocco favorito, gara contenuta", picks: [["PASSAGGIO TURNO","2"],["U/O 3.5","UNDER"],["U/O 2.5","UNDER"],["ESITO FINALE 1X2","2"],["GOAL/NO GOAL","NOGOAL"]], anomaly: ["DAVID J. U/O 1.5 SOMMA TIRI IN PORTA", .28] },
  "paraguay-francia": { p: [5, 16, 79], score: "0-2", scenario: "Dominio Francia, caldo da gestire", picks: [["PASSAGGIO TURNO","2"],["ESITO FINALE 1X2","2"],["U/O 1.5","OVER"],["U/O 3.5","UNDER"],["GOAL/NO GOAL","NOGOAL"]], anomaly: ["ENCISO C. U/O 2.5 SOMMA TIRI TOTALI", .31] },
  "brasile-norvegia": { p: [55, 24, 21], score: "2-1", scenario: "Brasile avanti, Norvegia pericolosa", picks: [["PASSAGGIO TURNO","1"],["U/O 1.5","OVER"],["GOAL/NO GOAL","GOAL"],["U/O 2.5","OVER"],["ESITO FINALE 1X2","1"]], anomaly: ["HAALAND E. U/O 2.5 SOMMA TIRI IN PORTA", .31] },
  "messico-inghilterra": { p: [34, 30, 36], score: "1-1", scenario: "Equilibrio con forte fattore Azteca", picks: [["U/O 3.5","UNDER"],["U/O 1.5","OVER"],["U/O 2.5","UNDER"],["PASSAGGIO TURNO","2"],["ESITO FINALE 1X2","X"]], anomaly: ["SAKA B. ALMENO 1 TIRI IN PORTA NEL 1 TEMPO", .36] },
  "portogallo-spagna": { p: [25, 29, 46], score: "1-2", scenario: "Spagna favorita in una gara aperta", picks: [["PASSAGGIO TURNO","2"],["U/O 1.5","OVER"],["GOAL/NO GOAL","GOAL"],["U/O 3.5","UNDER"],["ESITO FINALE 1X2","2"]], anomaly: ["LEAO R. ALMENO 1 TIRI IN PORTA NEL 1 TEMPO", .36] },
  "stati-uniti-belgio": { p: [35, 29, 36], score: "1-1", scenario: "Equilibrio e occasioni da entrambe le parti", picks: [["U/O 1.5","OVER"],["U/O 3.5","UNDER"],["GOAL/NO GOAL","GOAL"],["U/O 2.5","OVER"],["PASSAGGIO TURNO","2"]], anomaly: ["PULISIC C. U/O 1.5 SOMMA TIRI IN PORTA", .32] },
  "argentina-egitto": { p: [71, 19, 10], score: "2-0", scenario: "Controllo Argentina", picks: [["PASSAGGIO TURNO","1"],["U/O 3.5","UNDER"],["U/O 1.5","OVER"],["ESITO FINALE 1X2","1"],["GOAL/NO GOAL","NOGOAL"]], anomaly: ["MARTINEZ LAUTARO MARCATORE 1T", .28] },
  "svizzera-colombia": { p: [29, 31, 40], score: "0-1", scenario: "Colombia di misura, partita stretta", picks: [["U/O 3.5","UNDER"],["U/O 2.5","UNDER"],["PASSAGGIO TURNO","2"],["GOAL/NO GOAL","NOGOAL"],["ESITO FINALE 1X2","2"]], anomaly: null },
  "francia-marocco": { p: [58, 25, 17], score: "1-0", scenario: "Francia favorita, quarto a ritmo controllato", picks: [["PASSAGGIO TURNO","1"],["U/O 3.5","UNDER"],["U/O 1.5","OVER"],["ESITO FINALE 1X2","1"],["GOAL/NO GOAL","NOGOAL"]], anomaly: null }
};

const diverseMarketNeedles = {
  "canada-marocco": ["U/O 3.5 CORNER SQUADRA 2", "DAVID J. U/O 1.5 SOMMA TIRI TOTALI", "BRAHIM DIAZ U/O 1.5 SOMMA TIRI TOTALI", "HAKIMI A. U/O 1.5 SOMMA TIRI TOTALI"],
  "paraguay-francia": ["U/O 5.5 CORNER SQUADRA 2", "MBAPPE K. U/O 3.5 SOMMA TIRI TOTALI", "DEMBELE OUSMANE U/O 2.5 SOMMA TIRI TOTALI", "DEMBELE OUSMANE U/O 3.5 SOMMA TIRI TOTALI", "BARCOLA B. U/O 2.5 SOMMA TIRI TOTALI", "ENCISO C. U/O 1.5 SOMMA TIRI TOTALI"],
  "brasile-norvegia": ["U/O 3.5 CORNER SQUADRA 1", "HAALAND E. U/O 3.5 SOMMA TIRI TOTALI", "VINICIUS JUNIOR U/O 2.5 SOMMA TIRI TOTALI", "NUSA A. U/O 1.5 SOMMA TIRI TOTALI"],
  "messico-inghilterra": ["U/O 3.5 CORNER SQUADRA 2", "BELLINGHAM JUDE U/O 1.5 SOMMA TIRI TOTALI", "KANE H. U/O 2.5 SOMMA TIRI TOTALI", "SAKA B. U/O 1.5 SOMMA TIRI TOTALI", "ALVARADO R. U/O 1.5 SOMMA TIRI TOTALI", "ANDERSON E. U/O 0.5 SOMMA TIRI TOTALI"],
  "portogallo-spagna": ["LAMINE YAMAL U/O 2.5 SOMMA TIRI TOTALI", "FERNANDES B. U/O 1.5 SOMMA TIRI TOTALI", "LEAO R. U/O 1.5 SOMMA TIRI TOTALI", "OYARZABAL M. U/O 1.5 SOMMA TIRI TOTALI", "PEDRI U/O 1.5 SOMMA TIRI TOTALI", "OLMO D. U/O 1.5 SOMMA TIRI TOTALI"],
  "stati-uniti-belgio": ["U/O 3.5 CORNER SQUADRA 1", "PULISIC C. U/O 1.5 SOMMA TIRI TOTALI", "DOKU J. U/O 1.5 SOMMA TIRI TOTALI", "DE BRUYNE K. U/O 1.5 SOMMA TIRI TOTALI", "TILLMAN M. U/O 1.5 SOMMA TIRI TOTALI", "ADAMS T. U/O 0.5 SOMMA TIRI TOTALI"],
  "argentina-egitto": ["SEGNA GOAL 1", "MESSI L. SEGNA O SUO SOSTITUTO", "MULTIGOAL MULTIESITI 16 ESITI", "METODO DEL GOAL 1", "U/O 0.5 PALI/TRAVERSE", "ARBITRO CONSULTA MONITOR VAR", "PARI/DISPARI"],
  "svizzera-colombia": ["SEGNA GOAL SQUADRA OSPITE", "U/O 0.5 SQUADRA 1", "MULTIGOAL MULTIESITI 16 ESITI", "METODO DEL GOAL 1", "U/O 0.5 PALI/TRAVERSE", "ARBITRO CONSULTA MONITOR VAR", "PARI/DISPARI"],
  "francia-marocco": ["MBAPPE K. SEGNA O SUO SOSTITUTO", "MULTIGOAL MULTIESITI 16 ESITI", "1 TEMPO: SEGNA GOAL 1"],
};

function round(n) { return Math.round(n * 100) / 100; }
function findMarket(markets, info, selection) {
  return markets.find(m => m.info === info && m.esito === selection);
}
function event(m, index, score) {
  const label = `${m.mercato} ${m.info}`;
  const category = /CORNER/.test(label) ? "corner"
    : /TIRI/.test(label) ? "tiri"
    : /MARCATORE/.test(label) ? "giocatore"
    : /MULTIGOAL/.test(label) ? "multigol"
    : /METODO DEL GOAL/.test(label) ? "metodo-gol"
    : /PALI|TRAVERSE/.test(label) ? "legni"
    : /MONITOR VAR/.test(label) ? "var"
    : /PARI\/DISPARI/.test(label) ? "parita"
    : /RIMESSE/.test(label) ? "rimesse"
    : /SEGNA GOAL/.test(label) ? "gol-squadra"
    : /TURNO|1X2|DOPPIA CHANCE|DRAW NO BET/.test(label) ? "esito"
    : /GOAL\/NO GOAL/.test(label) ? "btts"
    : /U\/O|UNDER\/OVER/.test(label) ? "goal-total"
    : "goal";
  return {
    id: `event-${String(index + 1).padStart(2, "0")}`,
    market: `${m.mercato} — ${m.info}`, selection: m.esito, odds: Number(m.quota),
    selectionId: m.selectionId, marketId: m.marketId,
    category,
    rankingScore: score, class: score >= 86 ? "CORE" : "VALUE",
    riskScore: Math.round(105 - score), riskLevel: score >= 82 ? "low" : "medium", riskReasons: []
  };
}
function portfolio(name, events, scenario) {
  return {
    name, finalOdds: round(events.reduce((p, e) => p * e.odds, 1)), events,
    reason: "Selezioni derivate dalla lettura tecnica; le quote sono usate per scegliere la combinazione, non per definire il pronostico.",
    scenario: { id: scenario.toLowerCase().replace(/\W+/g, "_"), name: scenario, estimatedProbability: name === "Safe" ? "medio-alta" : "media" },
    strengths: ["Coerenza tattica interna.", "Mercati principali e verificabili."],
    weaknesses: ["Partita a eliminazione diretta.", "Formazioni ancora probabili."],
    riskVerdict: name === "Safe" ? "low" : name === "Balanced" ? "medium" : "high"
  };
}

function closestPortfolio(candidates, target, minimumCategories) {
  let best = null;
  const total = 1 << candidates.length;
  for (let mask = 1; mask < total; mask += 1) {
    const events = candidates.filter((_, index) => mask & (1 << index));
    if (events.length < 2 || events.length > 12) continue;
    const categoryCounts = events.reduce((counts, item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
      return counts;
    }, {});
    if ((categoryCounts.esito || 0) > 1) continue;
    if ((categoryCounts["goal-total"] || 0) > 1) continue;
    if ((categoryCounts.btts || 0) > 1) continue;
    if ((categoryCounts.corner || 0) > 1) continue;
    if ((categoryCounts["gol-squadra"] || 0) > 1) continue;
    if ((categoryCounts.multigol || 0) > 1) continue;
    const odds = events.reduce((product, item) => product * item.odds, 1);
    const categories = new Set(events.map(item => item.category)).size;
    const diversityPenalty = Math.max(0, minimumCategories - categories) * 0.45;
    const distance = Math.abs(Math.log(odds / target)) + diversityPenalty;
    if (!best || distance < best.distance || (distance === best.distance && events.length < best.events.length)) {
      best = { events, odds, distance };
    }
  }
  return best.events;
}

function easyCandidates(slug, quote, model) {
  const markets = quote.markets;
  const homeFavored = model.p[0] >= model.p[2];
  const favorite = homeFavored ? "1" : "2";
  const doubleChance = homeFavored ? "1X" : "X2";
  const wanted = [
    ["PASSAGGIO TURNO", favorite],
    ["DOPPIA CHANCE MULTIESITI", doubleChance],
    ["U/O 0.5", "OVER"],
    ["U/O 1.5", "OVER"],
    ["U/O 3.5", "UNDER"],
    ["U/O 4.5", "UNDER"],
    ["U/O 5.5", "UNDER"],
  ];
  const found = wanted.map(([info, selection]) =>
    markets.find(item => item.info === info && item.esito === selection)
  ).filter(Boolean);
  for (const [info, selection] of model.picks) {
    const item = findMarket(markets, info, selection);
    if (item) found.push(item);
  }
  for (const needle of diverseMarketNeedles[slug] || []) {
    const candidates = markets.filter(item =>
      item.info.includes(needle) &&
      Number(item.quota) >= 1.20 &&
      Number(item.quota) <= 1.90 &&
      ["OVER", "UNDER", "SI", "NO", "TEAM 1", "TEAM 2", "1-3", "1-2", "TIRO", "PARI", "1", "2"].includes(item.esito)
    );
    if (candidates.length) found.push(candidates[0]);
  }
  const unique = [...new Map(found.map(item => [String(item.selectionId), item])).values()]
    .filter(item => Number(item.quota) >= 1.05 && Number(item.quota) <= 1.90);
  return unique.map((item, index) => event(item, index, Math.max(78, 94 - index * 2)));
}

fs.mkdirSync(outputDir, { recursive: true });
const summary = [];
for (const [slug, model] of Object.entries(models)) {
  const quote = JSON.parse(fs.readFileSync(path.join(quoteDir, `${slug}-quote.json`), "utf8"));
  const selected = easyCandidates(slug, quote, model);
  const anomalyEvents = [];
  if (model.anomaly) {
    const [needle, probability] = model.anomaly;
    const market = quote.markets.find(m => m.info.includes(needle) && Number(m.quota) > 3 && ["OVER","SI"].includes(m.esito));
    if (market) {
      const implied = 1 / Number(market.quota);
      const edge = (probability - implied) * 100;
      anomalyEvents.push({
        event: market.info, market: market.mercato, selection: market.esito, odds: Number(market.quota),
        impliedProbability: round(implied * 100), estimatedProbability: round(probability * 100),
        edge: round(edge), classification: edge > 18 ? "Possibile errore di quota" : edge >= 10 ? "Quota sospetta" : edge >= 5 ? "Quota interessante" : "Leggero value",
        level: edge > 18 ? "error" : edge >= 10 ? "suspicious" : "value",
        reason: "La stima indipendente basata su ruolo, volume atteso e probabile titolarità supera la probabilità implicita; mercato comunque volatile.",
        modelConfidence: 62, risk: "medium", selectionId: String(market.selectionId), marketId: String(market.marketId)
      });
    }
  }
  const payload = {
    slug, match: quote.match, date: quote.date, status: "scheduled",
    prediction: { probabilities90Minutes: { home: model.p[0], draw: model.p[1], away: model.p[2] }, centralScore: model.score, scenario: model.scenario, quoteInfluence: "secondaria" },
    portfolios: [
      portfolio("Safe", closestPortfolio(selected, 5, 2), model.scenario),
      portfolio("Balanced", closestPortfolio(selected, 10, 3), model.scenario),
      portfolio("Aggressive", closestPortfolio(selected, 20, 4), model.scenario)
    ],
    quoteErrorAnalysis: {
      title: "Errore di Quota", generatedAt: new Date().toISOString(),
      criteria: { minimumOddsExclusive: 3, method: "probabilità indipendente contro probabilità implicita" },
      analysis: { totalMarkets: quote.markets.length, manuallyModelledCandidates: anomalyEvents.length, publishedEvents: anomalyEvents.length },
      events: anomalyEvents,
      disclaimer: "Un disallineamento non garantisce la vincita. I mercati giocatore hanno varianza elevata e dipendono dalla conferma delle formazioni."
    }
  };
  fs.writeFileSync(path.join(outputDir, `${slug}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  summary.push({ slug, match: quote.match, prediction: model.score, probabilities: model.p, portfolios: payload.portfolios.map(p => ({ name: p.name, odds: p.finalOdds })), anomalies: anomalyEvents });
}
fs.writeFileSync(path.join(outputDir, "round-of-16-summary.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), matches: summary }, null, 2)}\n`);
console.log(`Generate ${summary.length} MyCombo degli ottavi.`);
