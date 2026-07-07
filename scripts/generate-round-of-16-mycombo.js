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
  "portogallo-spagna": { p: [23, 29, 48], score: "1-2", scenario: "Spagna favorita, Portogallo pericoloso nelle transizioni", picks: [["PASSAGGIO TURNO","2"],["U/O 1.5","OVER"],["GOAL/NO GOAL","GOAL"],["U/O 3.5","UNDER"],["ESITO FINALE 1X2","2"]], anomaly: null },
  "stati-uniti-belgio": { p: [43, 30, 27], score: "1-0", scenario: "USA avanti con ufficiali: Belgio più prudente senza De Bruyne, Doku e Lukaku", picks: [["U/O 3.5","UNDER"],["DOPPIA CHANCE MULTIESITI","1X"],["PASSAGGIO TURNO","1"],["GOAL/NO GOAL","NOGOAL"],["U/O 1.5","OVER"]], anomaly: ["PULISIC C. U/O 1.5 SOMMA TIRI IN PORTA", .31] },
  "argentina-egitto": { p: [72, 18, 10], score: "2-0", scenario: "Controllo Argentina con Messi motore", picks: [["PASSAGGIO TURNO","1"],["U/O 3.5","UNDER"],["U/O 1.5","OVER"],["ESITO FINALE 1X2","1"],["GOAL/NO GOAL","NOGOAL"]], anomaly: ["MESSI L. MARCATORE 1T", .34] },
  "svizzera-colombia": { p: [30, 32, 38], score: "1-1", scenario: "Equilibrio, Colombia avanti per qualificazione", picks: [["U/O 3.5","UNDER"],["U/O 1.5","OVER"],["DOPPIA CHANCE MULTIESITI","X2"],["PASSAGGIO TURNO","2"],["GOAL/NO GOAL","GOAL"]], anomaly: null },
  "francia-marocco": { p: [58, 25, 17], score: "1-0", scenario: "Francia favorita, quarto a ritmo controllato", picks: [["PASSAGGIO TURNO","1"],["U/O 3.5","UNDER"],["U/O 1.5","OVER"],["ESITO FINALE 1X2","1"],["GOAL/NO GOAL","NOGOAL"]], anomaly: null }
};

const diverseMarketNeedles = {
  "canada-marocco": ["U/O 3.5 CORNER SQUADRA 2", "DAVID J. U/O 1.5 SOMMA TIRI TOTALI", "BRAHIM DIAZ U/O 1.5 SOMMA TIRI TOTALI", "HAKIMI A. U/O 1.5 SOMMA TIRI TOTALI"],
  "paraguay-francia": ["U/O 5.5 CORNER SQUADRA 2", "MBAPPE K. U/O 3.5 SOMMA TIRI TOTALI", "DEMBELE OUSMANE U/O 2.5 SOMMA TIRI TOTALI", "DEMBELE OUSMANE U/O 3.5 SOMMA TIRI TOTALI", "BARCOLA B. U/O 2.5 SOMMA TIRI TOTALI", "ENCISO C. U/O 1.5 SOMMA TIRI TOTALI"],
  "brasile-norvegia": ["U/O 3.5 CORNER SQUADRA 1", "HAALAND E. U/O 3.5 SOMMA TIRI TOTALI", "VINICIUS JUNIOR U/O 2.5 SOMMA TIRI TOTALI", "NUSA A. U/O 1.5 SOMMA TIRI TOTALI"],
  "messico-inghilterra": ["U/O 3.5 CORNER SQUADRA 2", "BELLINGHAM JUDE U/O 1.5 SOMMA TIRI TOTALI", "KANE H. U/O 2.5 SOMMA TIRI TOTALI", "SAKA B. U/O 1.5 SOMMA TIRI TOTALI", "ALVARADO R. U/O 1.5 SOMMA TIRI TOTALI", "ANDERSON E. U/O 0.5 SOMMA TIRI TOTALI"],
  "portogallo-spagna": ["LAMINE YAMAL U/O 2.5 SOMMA TIRI TOTALI", "FERNANDES B. U/O 1.5 SOMMA TIRI TOTALI", "JOAO FELIX U/O 1.5 SOMMA TIRI TOTALI", "OYARZABAL M. U/O 1.5 SOMMA TIRI TOTALI", "PEDRI U/O 1.5 SOMMA TIRI TOTALI", "OLMO D. U/O 1.5 SOMMA TIRI TOTALI"],
  "stati-uniti-belgio": ["U/O 3.5 CORNER SQUADRA 1", "PULISIC C. U/O 1.5 SOMMA TIRI TOTALI", "BALOGUN F. U/O 1.5 SOMMA TIRI TOTALI", "DEST S. U/O 1.5 SOMMA TIRI TOTALI", "TILLMAN M. U/O 1.5 SOMMA TIRI TOTALI", "ADAMS T. U/O 0.5 SOMMA TIRI TOTALI", "DE KETELAERE C. U/O 1.5 SOMMA TIRI TOTALI", "TROSSARD L. U/O 1.5 SOMMA TIRI TOTALI"],
  "argentina-egitto": ["SEGNA GOAL 1", "MESSI L. SEGNA O SUO SOSTITUTO", "MESSI L. U/O 1.5 SOMMA TIRI IN PORTA", "MESSI L. U/O 3.5 SOMMA TIRI TOTALI", "SQUADRA 1: U/O 5.5 TIRI IN PORTA", "U/O 24.5 TIRI TOTALI"],
  "svizzera-colombia": ["SEGNA GOAL SQUADRA OSPITE", "SEGNA GOAL 1", "SQUADRA 2: U/O 14.5 TIRI TOTALI", "U/O 4.5 CORNER SQUADRA 2", "SQUADRA 1: U/O 11.5 TIRI TOTALI", "U/O 3.5 CORNER SQUADRA 1", "JAMES RODRIGUEZ U/O 1.5 SOMMA TIRI TOTALI", "LUIS SUAREZ J. C. U/O 1.5 SOMMA TIRI TOTALI"],
  "francia-marocco": ["MBAPPE K. SEGNA O SUO SOSTITUTO", "MULTIGOAL MULTIESITI 16 ESITI", "1 TEMPO: SEGNA GOAL 1"],
};

const verifiedQuoteErrors = {
  "portogallo-spagna": [
    { label: "Spagna almeno 7 tiri in porta", info: "SQUADRA 2: U/O 6.5 TIRI IN PORTA", selection: "OVER", probability: .35, reason: "Il volume offensivo spagnolo stimato porta la probabilità sopra il 32,26% implicito." },
    { label: "João Félix almeno 4 tiri totali", includes: "JOAO FELIX U/O 3.5 SOMMA TIRI TOTALI", selection: "OVER", probability: .29, reason: "La titolarità ufficiale sulla trequarti porta la stima sopra il 25% implicito." },
    { label: "Lamine Yamal marcatore nel primo tempo", info: "LAMINE YAMAL MARCATORE 1T", selection: "SI", probability: .22, reason: "La centralità offensiva di Yamal e il volume spagnolo portano la stima sopra il 19,05% implicito." },
  ],
  "stati-uniti-belgio": [
    { label: "Folarin Balogun marcatore nel primo tempo", info: "BALOGUN F. MARCATORE 1T", selection: "SI", probability: .23, reason: "La revoca dell’espulsione e la probabile titolarità aumentano minuti e presenza in area." },
    { label: "Christian Pulisic almeno 2 tiri in porta", includes: "PULISIC C. U/O 1.5 SOMMA TIRI IN PORTA", selection: "OVER", probability: .31, reason: "Ruolo, piazzati e volume offensivo USA sostengono una stima superiore al 26,67% implicito." },
    { label: "Charles De Ketelaere almeno 2 tiri in porta", includes: "DE KETELAERE C. U/O 1.5 SOMMA TIRI IN PORTA", selection: "OVER", probability: .24, reason: "Da riferimento offensivo ufficiale del Belgio mantiene una quota alta, pur con volume squadra ridotto." },
  ],
  "argentina-egitto": [
    { label: "Messi almeno 4 tiri in porta", includes: "MESSI L. U/O 3.5 SOMMA TIRI IN PORTA", selection: "OVER", probability: .29, reason: "Quota alta e scenario Messi-centrico: resta molto volatile, ma è più coerente dei tiri di Álvarez se il gioco passa sempre dal 10." },
    { label: "Argentina almeno 8 tiri in porta", info: "SQUADRA 1: U/O 7.5 TIRI IN PORTA", selection: "OVER", probability: .33, reason: "Possesso, territorio e qualità delle conclusioni portano la stima sopra il 30,77% implicito." },
    { label: "Messi segna su rigore", info: "MESSI L. SEGNA SU RIGORE INC TS", selection: "SI", probability: .24, reason: "Messi resta rigorista e il dominio territoriale argentino può produrre area occupata e contatti; mercato comunque episodico." },
  ],
  "svizzera-colombia": [
    { label: "Breel Embolo almeno 4 tiri totali", includes: "EMBOLO B. U/O 3.5 SOMMA TIRI TOTALI", selection: "OVER", probability: .34, reason: "Il ruolo di riferimento offensivo porta la stima sopra il 30,77% implicito." },
    { label: "Luis Díaz almeno 5 tiri totali", includes: "LUIS DIAZ U/O 4.5 SOMMA TIRI TOTALI", selection: "OVER", probability: .33, reason: "La centralità di Díaz negli attacchi colombiani supera il 28,57% implicito." },
    { label: "Colombia almeno 7 tiri in porta", info: "SQUADRA 2: U/O 6.5 TIRI IN PORTA", selection: "OVER", probability: .26, reason: "La superiorità negli uno contro uno porta la stima sopra il 22,22% implicito." },
  ],
};

const portfolioAdditions = {
  "portogallo-spagna": {
    Safe: [{ info: "OYARZABAL M. U/O 1.5 SOMMA TIRI TOTALI E SUO SOST. INCL. T.S.", selection: "OVER" }],
    Balanced: [
      { info: "U/O 3.5 CORNER SQUADRA 2", selection: "OVER" },
      { info: "U/O 2.5 CORNER SQUADRA 1", selection: "OVER" },
    ],
    Aggressive: [
      { info: "PASSAGGIO TURNO", selection: "2" },
      { info: "U/O 5.5 CORNER SQUADRA 2", selection: "OVER" },
    ],
  },
  "stati-uniti-belgio": {
    Balanced: [
      { info: "U/O 4.5 CORNER SQUADRA 1", selection: "OVER" },
      { info: "U/O 25.5 TIRI TOTALI", selection: "OVER" },
    ],
    Aggressive: [
      { info: "U/O 4.5 CORNER SQUADRA 2", selection: "OVER" },
      { info: "U/O 9.5 TIRI IN PORTA", selection: "OVER" },
    ],
  },
  "argentina-egitto": {
    Balanced: [{ info: "U/O 4.5 CORNER SQUADRA 1", selection: "OVER" }],
    Aggressive: [
      { info: "SQUADRA 1: U/O 6.5 TIRI IN PORTA", selection: "OVER" },
      { info: "U/O 6.5 CORNER SQUADRA 1", selection: "OVER" },
    ],
  },
  "svizzera-colombia": {
    Balanced: [{ info: "PRIMA A 5 CALCI D'ANGOLO", selection: "TEAM 2" }],
    Aggressive: [
      { info: "SQUADRA 2: U/O 4.5 TIRI IN PORTA", selection: "OVER" },
      { info: "PASSAGGIO TURNO", selection: "2" },
      { info: "U/O 4.5 CORNER SQUADRA 2", selection: "OVER" },
    ],
  },
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
const requestedSlugs = new Set(process.argv.slice(2));
for (const [slug, model] of Object.entries(models)) {
  if (requestedSlugs.size && !requestedSlugs.has(slug)) continue;
  const quote = JSON.parse(fs.readFileSync(path.join(quoteDir, `${slug}-quote.json`), "utf8"));
  const selected = easyCandidates(slug, quote, model);
  const anomalyEvents = [];
  if (verifiedQuoteErrors[slug]) {
    for (const candidate of verifiedQuoteErrors[slug]) {
      const market = quote.markets.find(m =>
        (candidate.info ? m.info === candidate.info : m.info.includes(candidate.includes)) &&
        m.esito === candidate.selection &&
        Number(m.quota) > 3
      );
      if (!market) throw new Error(`Errore di quota non trovato: ${slug} ${candidate.info || candidate.includes}`);
      const implied = 1 / Number(market.quota);
      const edge = (candidate.probability - implied) * 100;
      anomalyEvents.push({
        label: candidate.label, event: candidate.label, technicalEvent: market.info,
        market: market.mercato, selection: market.esito, odds: Number(market.quota),
        impliedProbability: round(implied * 100), estimatedProbability: round(candidate.probability * 100),
        edge: round(edge), classification: "Quota interessante",
        level: "value", reason: candidate.reason,
        modelConfidence: 61, risk: "medium", selectionId: String(market.selectionId), marketId: String(market.marketId)
      });
    }
  } else if (model.anomaly) {
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
  if (slug === "brasile-norvegia") {
    const rayan = quote.markets.find(m =>
      m.info.includes("RAYAN U/O 1.5 SOMMA TIRI IN PORTA") &&
      m.esito === "OVER" &&
      Number(m.quota) === 3.75
    );
    if (rayan) {
      const estimatedProbability = 0.32;
      const implied = 1 / Number(rayan.quota);
      anomalyEvents.push({
        event: rayan.info, market: rayan.mercato, selection: rayan.esito, odds: Number(rayan.quota),
        impliedProbability: round(implied * 100), estimatedProbability: round(estimatedProbability * 100),
        edge: round((estimatedProbability - implied) * 100), classification: "Quota interessante",
        level: "value",
        reason: "La titolarità ufficiale da esterno offensivo aumenta minuti e volume atteso; il mercato resta volatile.",
        modelConfidence: 64, risk: "medium", selectionId: String(rayan.selectionId), marketId: String(rayan.marketId)
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
  if (verifiedQuoteErrors[slug]) {
    const pools = [[], [], []];
    selected.forEach((item, index) => pools[index % 3].push(item));
    const buildDistinct = (name, target, pool) => {
      const picked = closestPortfolio(pool, target, 1);
      return portfolio(name, picked, model.scenario);
    };
    payload.portfolios = [
      buildDistinct("Safe", 5, pools[0]),
      buildDistinct("Balanced", 10, pools[1]),
      buildDistinct("Aggressive", 20, pools[2]),
    ];
    if (slug === "portogallo-spagna") {
      payload.portfolios = payload.portfolios.map(item => ({
        ...item,
        weaknesses: ["Partita a eliminazione diretta.", "Formazioni ufficiali confermate; i mercati individuali mantengono varianza."],
      }));
    }
    for (const item of payload.portfolios) {
      for (const addition of portfolioAdditions[slug]?.[item.name] || []) {
        const market = quote.markets.find(m => m.info === addition.info && m.esito === addition.selection);
        if (!market) throw new Error(`Aggiunta MyCombo non trovata: ${slug} ${addition.info} ${addition.selection}`);
        item.events.push(event(market, item.events.length, item.name === "Safe" ? 82 : 78));
      }
      item.finalOdds = round(item.events.reduce((product, current) => product * current.odds, 1));
    }
  }
  if (slug === "messico-inghilterra") {
    const curatedMarket = (needle, selection, score, mercato = null) => {
      const matchesMarket = item => !mercato || item.mercato === mercato;
      const item = quote.markets.find(m => matchesMarket(m) && m.info === needle && m.esito === selection)
        || quote.markets.find(m => matchesMarket(m) && m.info.includes(needle) && m.esito === selection);
      if (!item) throw new Error(`Mercato MyCombo non trovato: ${needle} ${selection}`);
      return event(item, 0, score);
    };
    const mexicoX2 = curatedMarket("DOPPIA CHANCE MULTIESITI", "X2", 88);
    const mexico1X = curatedMarket("DOPPIA CHANCE MULTIESITI", "1X", 86);
    const goal = curatedMarket("GOAL/NO GOAL", "GOAL", 84);
    const englandCorners = curatedMarket("U/O 3.5 CORNER SQUADRA 2", "OVER", 82);
    const kaneShots = curatedMarket("KANE H. U/O 2.5 SOMMA TIRI TOTALI", "OVER", 82);
    const sakaShots = curatedMarket("SAKA B. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 82);
    const bellinghamShots = curatedMarket("BELLINGHAM JUDE U/O 1.5 SOMMA TIRI TOTALI", "OVER", 80);
    const andersonShots = curatedMarket("ANDERSON E. U/O 0.5 SOMMA TIRI TOTALI", "OVER", 80);
    const jimenezShots = curatedMarket("RAUL JIMENEZ U/O 1.5 SOMMA TIRI TOTALI", "OVER", 80);
    const quinonesShots = curatedMarket("QUINONES J. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 80);
    const alvaradoShots = curatedMarket("ALVARADO R. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 78);
    payload.portfolios = [
      portfolio("Safe", [mexicoX2, goal, kaneShots, jimenezShots], model.scenario),
      portfolio("Balanced", [mexico1X, goal, englandCorners, quinonesShots, alvaradoShots], model.scenario),
      portfolio("Aggressive", [mexico1X, goal, kaneShots, sakaShots, bellinghamShots, andersonShots, quinonesShots], model.scenario),
    ].map(item => ({
      ...item,
      weaknesses: ["Partita a eliminazione diretta.", "Formazioni ufficiali verificate; mercati tiri comunque volatili."],
    }));
  }
  if (slug === "stati-uniti-belgio") {
    const curatedMarket = (needle, selection, score, mercato = null) => {
      const matchesMarket = item => !mercato || item.mercato === mercato;
      const item = quote.markets.find(m => matchesMarket(m) && m.info === needle && m.esito === selection)
        || quote.markets.find(m => matchesMarket(m) && m.info.includes(needle) && m.esito === selection);
      if (!item) throw new Error(`Mercato MyCombo non trovato: ${needle} ${selection}`);
      return event(item, 0, score);
    };
    const usa1x = curatedMarket("DOPPIA CHANCE MULTIESITI", "1X", 90);
    const usaQualifies = curatedMarket("PASSAGGIO TURNO", "1", 88);
    const under35 = curatedMarket("U/O 3.5", "UNDER", 88, "UNDER/OVER");
    const under45 = curatedMarket("U/O 4.5", "UNDER", 86, "UNDER/OVER");
    const noGoal = curatedMarket("GOAL/NO GOAL", "NOGOAL", 80);
    const usaCorners35 = curatedMarket("U/O 3.5 CORNER SQUADRA 1", "OVER", 82);
    const pulisicShots = curatedMarket("PULISIC C. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 82);
    const balogunShots = curatedMarket("BALOGUN F. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 82);
    const destShots = curatedMarket("DEST S. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 80);
    const adamsShots = curatedMarket("ADAMS T. U/O 0.5 SOMMA TIRI TOTALI", "OVER", 78);
    const deKetelaereShots = curatedMarket("DE KETELAERE C. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 78);
    const trossardShots = curatedMarket("TROSSARD L. U/O 1.5 SOMMA TIRI TOTALI", "OVER", 78);
    payload.portfolios = [
      portfolio("Safe", [usa1x, under45, balogunShots, usaCorners35], model.scenario),
      portfolio("Balanced", [usaQualifies, under35, pulisicShots, deKetelaereShots, adamsShots], model.scenario),
      portfolio("Aggressive", [usa1x, noGoal, under35, destShots, trossardShots, deKetelaereShots], model.scenario),
    ].map(item => ({
      ...item,
      weaknesses: ["Partita a eliminazione diretta.", "Formazioni ufficiali verificate; mercati tiri comunque volatili."],
    }));
  }
  fs.writeFileSync(path.join(outputDir, `${slug}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  summary.push({ slug, match: quote.match, prediction: model.score, probabilities: model.p, portfolios: payload.portfolios.map(p => ({ name: p.name, odds: p.finalOdds })), anomalies: anomalyEvents });
}
const summaryPath = path.join(outputDir, "round-of-16-summary.json");
let summaryMatches = summary;
if (requestedSlugs.size && fs.existsSync(summaryPath)) {
  const previous = JSON.parse(fs.readFileSync(summaryPath, "utf8")).matches || [];
  const replacements = new Map(summary.map(item => [item.slug, item]));
  summaryMatches = previous.map(item => replacements.get(item.slug) || item);
  summary.forEach(item => {
    if (!previous.some(existing => existing.slug === item.slug)) summaryMatches.push(item);
  });
  const modelOrder = Object.keys(models);
  summaryMatches.sort((a, b) => modelOrder.indexOf(a.slug) - modelOrder.indexOf(b.slug));
}
fs.writeFileSync(summaryPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), matches: summaryMatches }, null, 2)}\n`);
console.log(`Generate ${summary.length} MyCombo degli ottavi.`);
