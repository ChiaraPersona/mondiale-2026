const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEFAULT_HISTORY = path.join(ROOT, "data", "backtesting", "history.json");
const DEFAULT_DASHBOARD = path.join(ROOT, "data", "backtesting", "dashboard.json");
const PROFILES = ["Safe", "Balanced", "Aggressive"];

function round(value, digits = 2) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function readJson(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  fs.renameSync(temporary, file);
}

function normalizeStatus(value) {
  const status = String(value || "").trim().toLowerCase();
  if (["won", "win", "vinta", "correct", "success"].includes(status)) return "won";
  if (["lost", "lose", "persa", "wrong", "error"].includes(status)) return "lost";
  if (["void", "push", "annullata"].includes(status)) return "void";
  return "pending";
}

function settlementResult(settlement) {
  return settlement?.score || settlement?.result || null;
}

function predictedScenarios(portfolios) {
  const scenarios = portfolios
    .map(portfolio => portfolio.scenario)
    .filter(Boolean)
    .map(scenario => ({
      id: scenario.id || null,
      name: scenario.name || null,
      estimatedProbability: scenario.estimatedProbability || null,
    }));
  return [...new Map(scenarios.map(scenario => [scenario.id || scenario.name, scenario])).values()];
}

function eventKey(event) {
  return [
    event.market || "",
    event.selection || "",
    Number(event.odds || 0).toFixed(3),
    event.category || "",
  ].join("|").toLowerCase();
}

function loadEqs(slug) {
  const candidates = [
    path.join(ROOT, "data", "eqs", `${slug}-eqs.json`),
    path.join(ROOT, "data", "eqs", `${slug}-events.json`),
  ];
  const file = candidates.find(fs.existsSync);
  if (!file) return new Map();
  const rows = readJson(file, []);
  const index = new Map();
  for (const row of rows) {
    if (Number.isFinite(row.eqs) && !index.has(eventKey(row))) index.set(eventKey(row), row.eqs);
  }
  return index;
}

function uniqueEvents(portfolios) {
  const events = new Map();
  for (const portfolio of portfolios) {
    for (const event of portfolio.events || []) {
      const id = String(event.id || event.selectionId || eventKey(event));
      if (!events.has(id)) events.set(id, event);
    }
  }
  return events;
}

function buildRecord(mycombo, options = {}) {
  const settlement = options.settlement || mycombo.settlement;
  if (!settlementResult(settlement)) {
    throw new Error(`${mycombo.slug || "Partita"}: risultato finale mancante.`);
  }

  const portfolios = mycombo.portfolios || [];
  const eventMap = uniqueEvents(portfolios);
  const eqsIndex = loadEqs(mycombo.slug);
  const events = [...eventMap].map(([id, event]) => {
    const settled = settlement.events?.[id] || {};
    return {
      id,
      market: event.market || null,
      category: event.category || "altro",
      selection: event.selection || null,
      odds: Number.isFinite(Number(event.odds)) ? Number(event.odds) : null,
      eqs: Number.isFinite(event.eqs) ? event.eqs : (eqsIndex.get(eventKey(event)) ?? null),
      outcome: normalizeStatus(settled.status),
      evidence: settled.evidence || null,
    };
  });
  const outcomes = new Map(events.map(event => [event.id, event.outcome]));

  const portfolioResults = {};
  for (const name of PROFILES) {
    const portfolio = portfolios.find(item =>
      String(item.name || "").toLowerCase().replace(/^portfolio\s+/, "") === name.toLowerCase()
    );
    const ids = (portfolio?.events || []).map(event => String(event.id || event.selectionId || eventKey(event)));
    const statuses = ids.map(id => outcomes.get(id) || "pending");
    const generated = Boolean(portfolio && ids.length);
    let outcome = "not_generated";
    if (generated && statuses.some(status => status === "pending")) outcome = "pending";
    else if (generated && statuses.some(status => status === "lost")) outcome = "lost";
    else if (generated && statuses.every(status => ["won", "void"].includes(status))) outcome = "won";
    portfolioResults[name] = {
      generated,
      outcome,
      finalOdds: generated && Number.isFinite(Number(portfolio.finalOdds))
        ? Number(portfolio.finalOdds)
        : null,
      eventIds: ids,
    };
  }

  const resolved = events.filter(event => ["won", "lost"].includes(event.outcome));
  const eqsValues = events.map(event => event.eqs).filter(Number.isFinite);
  return {
    slug: mycombo.slug,
    date: options.date || mycombo.date || null,
    result: settlementResult(settlement),
    predictedScenario: predictedScenarios(portfolios),
    actualScenario: options.actualScenario ?? settlement.actualScenario ?? null,
    Safe: portfolioResults.Safe.outcome,
    Balanced: portfolioResults.Balanced.outcome,
    Aggressive: portfolioResults.Aggressive.outcome,
    correctEvents: resolved.filter(event => event.outcome === "won").length,
    incorrectEvents: resolved.filter(event => event.outcome === "lost").length,
    finalOdds: Object.fromEntries(PROFILES.map(name => [name, portfolioResults[name].finalOdds])),
    riskProfile: portfolioResults,
    averageEqs: eqsValues.length ? round(eqsValues.reduce((sum, value) => sum + value, 0) / eqsValues.length) : null,
    notes: options.notes ?? settlement.notes ?? null,
    source: settlement.source || null,
    events,
  };
}

function profileStats(records, name) {
  const generated = records.filter(record => record.riskProfile?.[name]?.generated);
  const won = generated.filter(record => record[name] === "won").length;
  const lost = generated.filter(record => record[name] === "lost").length;
  const settled = won + lost;
  return { generated: generated.length, won, lost, successRate: settled ? round(won / settled * 100) : null };
}

function marketStats(records) {
  const stats = {};
  for (const record of records) {
    for (const event of record.events || []) {
      if (!["won", "lost"].includes(event.outcome)) continue;
      const market = event.category || "altro";
      stats[market] ||= { events: 0, successes: 0, errors: 0, successRate: null };
      stats[market].events += 1;
      stats[market][event.outcome === "won" ? "successes" : "errors"] += 1;
    }
  }
  for (const value of Object.values(stats)) value.successRate = round(value.successes / value.events * 100);
  return stats;
}

function buildDashboard(records) {
  const markets = marketStats(records);
  const rankedMarkets = Object.entries(markets)
    .map(([market, stats]) => ({ market, ...stats }))
    .sort((a, b) => b.successRate - a.successRate || b.events - a.events || a.market.localeCompare(b.market));
  const trend = [...records]
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
    .slice(-10)
    .map(record => ({
      slug: record.slug,
      date: record.date,
      Safe: record.Safe,
      Balanced: record.Balanced,
      Aggressive: record.Aggressive,
      correctEvents: record.correctEvents,
      incorrectEvents: record.incorrectEvents,
    }));
  return {
    analyzedMatches: records.length,
    profiles: Object.fromEntries(PROFILES.map(name => [name, profileStats(records, name)])),
    markets,
    bestMarkets: rankedMarkets.slice(0, 3),
    worstMarkets: [...rankedMarkets].reverse().slice(0, 3),
    last10Trend: trend,
  };
}

function updateHistory(record, files = {}) {
  const historyFile = files.historyFile || DEFAULT_HISTORY;
  const dashboardFile = files.dashboardFile || DEFAULT_DASHBOARD;
  const history = readJson(historyFile, { version: 1, matches: [] });
  const index = history.matches.findIndex(item => item.slug === record.slug);
  if (index === -1) history.matches.push(record);
  else history.matches[index] = record;
  history.matches.sort((a, b) => String(a.date).localeCompare(String(b.date)) || a.slug.localeCompare(b.slug));
  writeJson(historyFile, history);
  writeJson(dashboardFile, buildDashboard(history.matches));
  return { history, dashboard: buildDashboard(history.matches) };
}

function processMycomboFile(file, options = {}) {
  const mycombo = readJson(file);
  if (!mycombo?.slug || !mycombo.settlement || !settlementResult(mycombo.settlement)) return null;
  const record = buildRecord(mycombo, options);
  if (record.events.some(event => event.outcome === "pending")) {
    if (options.skipIncomplete) return null;
    throw new Error(`${record.slug}: settlement incompleto; mancano esiti per uno o più eventi generati.`);
  }
  return updateHistory(record, options.files).dashboard;
}

function runCli() {
  const requested = process.argv[2];
  const directory = path.join(ROOT, "data", "mycombo");
  const files = requested
    ? [path.join(directory, requested.endsWith(".json") ? requested : `${requested}.json`)]
    : fs.readdirSync(directory)
      .filter(file => file.endsWith(".json") && !file.startsWith("mycombo-definitive-"))
      .map(file => path.join(directory, file));
  let processed = 0;
  for (const file of files) {
    if (!fs.existsSync(file)) throw new Error(`MyCombo non trovata: ${file}`);
    if (processMycomboFile(file, { skipIncomplete: !requested })) processed += 1;
  }
  console.log(`Backtesting: ${processed} partite registrate; dashboard aggiornata.`);
}

if (require.main === module) runCli();

module.exports = {
  buildRecord,
  buildDashboard,
  marketStats,
  profileStats,
  updateHistory,
  processMycomboFile,
};
