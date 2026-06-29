const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const mvpDirectory = path.join(root, "data", "mvp");
const intelligenceDirectory = path.join(root, "data", "intelligence");
const requestedMatch = process.argv[2];

const teamPlayers = {
  "olanda-marocco": {
    team1: ["BROBBEY", "MALEN", "DE JONG"],
    team2: ["SAIBARI", "BRAHIM DIAZ", "BOUADDI"],
  },
  "brasile-giappone": {
    team1: ["VINICIUS", "MATHEUS CUNHA", "RAYAN", "CASEMIRO"],
    team2: ["UEDA", "DOAN", "SANO"],
  },
  "germania-paraguay": {
    team1: ["HAVERTZ", "UNDAV", "SANE", "WIRTZ"],
    team2: ["AVALOS", "ENCISO", "ALMIRON", "CUBAS", "CACERES", "ALONSO"],
  },
};

function normalized(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function intelligenceContext(events) {
  const context = {};
  for (const event of events) {
    for (const [key, value] of Object.entries(event.breakdown || {})) {
      if (!(key in context) && value !== null && value !== undefined) context[key] = value;
    }
  }
  return context;
}

function eventAttributes(event, matchKey) {
  const market = normalized(event.mercato);
  const selection = normalized(event.selezione);
  const players = teamPlayers[matchKey] || { team1: [], team2: [] };
  let side = "match";
  if (
    market.includes("SQUADRA 1") ||
    selection === "1" ||
    selection === "1X" ||
    selection === "TEAM 1"
  ) side = "team1";
  else if (
    market.includes("SQUADRA 2") ||
    selection === "2" ||
    selection === "X2" ||
    selection === "TEAM 2"
  ) side = "team2";
  else if (players.team1.some(player => market.includes(player))) side = "team1";
  else if (players.team2.some(player => market.includes(player))) side = "team2";

  let metric = event.categoria;
  if (event.categoria === "tiri" && market.includes("TIRI IN PORTA")) metric = "tiri_in_porta";
  const positive = ["OVER", "GOAL", "SI", "1", "1X", "TEAM 1", "2-4"].includes(selection);
  const negative = ["UNDER", "NOGOAL", "NO", "2", "X2", "TEAM 2"].includes(selection);
  const threshold = Number(market.match(/\bU\/O\s+(\d+(?:\.\d+)?)/)?.[1] ?? NaN);

  return { market, selection, side, metric, positive, negative, threshold };
}

function eventRef(event, index) {
  return {
    id: `event-${String(index + 1).padStart(2, "0")}`,
    market: event.mercato,
    selection: event.selezione,
  };
}

function classifyEvent(event, index, matchKey, scenario) {
  const a = eventAttributes(event, matchKey);
  const ref = eventRef(event, index);

  if (scenario === "favorite_dominance") {
    const compatible =
      (a.metric === "esito" && a.side === "team1") ||
      (["corner", "tiri", "tiri_in_porta"].includes(a.metric) && a.side === "team1" && a.positive) ||
      (a.metric === "goal" && a.positive);
    const incompatible =
      (a.metric === "esito" && a.side === "team2") ||
      (["corner", "tiri", "tiri_in_porta"].includes(a.metric) && a.side === "team1" && a.negative);
    return { ref, compatible, incompatible };
  }

  if (scenario === "controlled_favorite_win") {
    const compatible =
      (a.metric === "esito" && a.side === "team1") ||
      (a.metric === "goal" && a.negative);
    const incompatible = a.metric === "goal" && a.positive && Number(event.quota) >= 1.5;
    return { ref, compatible, incompatible };
  }

  if (scenario === "balanced_resistance") {
    const compatible =
      (a.metric === "goal" && a.negative) ||
      (["tiri", "tiri_in_porta", "corner"].includes(a.metric) && a.side === "team2" && a.positive);
    const incompatible =
      (["tiri", "tiri_in_porta", "corner"].includes(a.metric) &&
        a.side === "team1" &&
        a.positive &&
        Number.isFinite(a.threshold) &&
        a.threshold >= 6.5);
    return { ref, compatible, incompatible };
  }

  if (scenario === "open_game") {
    const compatible =
      (a.metric === "goal" && a.positive) ||
      (["tiri", "tiri_in_porta", "corner"].includes(a.metric) && a.positive);
    const incompatible = a.metric === "goal" && a.negative;
    return { ref, compatible, incompatible };
  }

  return { ref, compatible: false, incompatible: false };
}

function qualitativeLevels(context) {
  const motivation = context.motivation || {};
  const form = context.form || {};
  const risks = context.risks || {};
  const upsetText = normalized(JSON.stringify(risks.upset || []));
  const favoriteStrong =
    ["VERY_HIGH", "HIGH"].includes(normalized(motivation.home)) &&
    ["EXCELLENT", "GOOD"].includes(normalized(form.home));

  return {
    dominance: favoriteStrong ? "alta" : "media",
    controlled: "media",
    balanced: /MEDIO-BASSO|BASSO/.test(upsetText) ? "bassa" : "media",
    open: "media",
  };
}

function rootCauses(context, home, away) {
  const motivation = context.motivation || {};
  const form = context.form || {};
  const pressure = context.pressure || {};
  const risks = context.risks || {};
  return {
    favorite: [
      `Motivazione ${home}: ${motivation.home ?? "non disponibile"}`,
      `Forma ${home}: ${form.home ?? "non disponibile"}`,
      pressure.mustWin ? `${home} deve vincere` : null,
      pressure.knockout ? "Partita a eliminazione diretta" : null,
    ].filter(Boolean),
    underdog: [
      `Motivazione ${away}: ${motivation.away ?? "non disponibile"}`,
      `Forma ${away}: ${form.away ?? "non disponibile"}`,
      ...(Array.isArray(risks.upset) ? risks.upset : []),
    ].filter(Boolean),
  };
}

function scenarioDefinition(id, name, description, level, causes, events, matchKey) {
  const compatible = [];
  const incompatible = [];
  events.forEach((event, index) => {
    const result = classifyEvent(event, index, matchKey, id);
    if (result.compatible) compatible.push(result.ref);
    if (result.incompatible) incompatible.push(result.ref);
  });
  return {
    id,
    name,
    description,
    estimatedProbability: level,
    compatibleEvents: compatible,
    incompatibleEvents: incompatible,
    rootCauses: causes,
  };
}

function processMatch(matchKey) {
  const rankingPath = path.join(mvpDirectory, matchKey, "ranking-events.json");
  const intelligencePath = path.join(intelligenceDirectory, `${matchKey}-events.json`);
  if (!fs.existsSync(rankingPath)) throw new Error(`Ranking non trovato: ${rankingPath}`);
  if (!fs.existsSync(intelligencePath)) throw new Error(`Match Intelligence non trovato: ${intelligencePath}`);

  const ranking = JSON.parse(fs.readFileSync(rankingPath, "utf8"));
  const intelligence = JSON.parse(fs.readFileSync(intelligencePath, "utf8"));
  const [home, away] = ranking.match.split(/\s+-\s+/);
  const context = intelligenceContext(intelligence);
  const levels = qualitativeLevels(context);
  const causes = rootCauses(context, home, away);

  const scenarios = [
    scenarioDefinition(
      "favorite_dominance",
      `Dominio ${home}`,
      `${home} controlla territorio e volume offensivo, producendo più tiri e corner.`,
      levels.dominance,
      causes.favorite,
      ranking.events,
      matchKey
    ),
    scenarioDefinition(
      "controlled_favorite_win",
      `Vittoria controllata ${home}`,
      `${home} passa in vantaggio e gestisce la gara senza trasformarla in una partita aperta.`,
      levels.controlled,
      [...causes.favorite, "Gestione del vantaggio"],
      ranking.events,
      matchKey
    ),
    scenarioDefinition(
      "balanced_resistance",
      `Resistenza ${away}`,
      `${away} mantiene equilibrio, limita la favorita e conserva possibilità nelle transizioni.`,
      levels.balanced,
      causes.underdog,
      ranking.events,
      matchKey
    ),
    scenarioDefinition(
      "open_game",
      "Partita aperta",
      "Il ritmo cresce, aumentano conclusioni, corner e possibilità di gol da entrambe le parti.",
      levels.open,
      ["Intensità offensiva", "Transizioni", "Partita sensibile al primo gol"],
      ranking.events,
      matchKey
    ),
  ];

  const output = { match: ranking.match, scenarios };
  const outputPath = path.join(mvpDirectory, matchKey, "match-scenarios.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`${ranking.match}: ${scenarios.length} scenari -> ${path.relative(root, outputPath)}`);
}

const matches = requestedMatch
  ? [requestedMatch]
  : fs.readdirSync(mvpDirectory)
      .filter(name => fs.existsSync(path.join(mvpDirectory, name, "ranking-events.json")))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!matches.length) throw new Error("Nessun ranking disponibile per gli scenari.");
matches.forEach(processMatch);
