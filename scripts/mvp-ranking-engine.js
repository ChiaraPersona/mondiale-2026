const fs = require("fs");
const path = require("path");
const { classifyMarket } = require("./market-intelligence-engine");

const root = path.resolve(__dirname, "..");
const mvpDirectory = path.join(root, "data", "mvp");
const requestedMatch = process.argv[2];

function normalized(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function marketProfile(event) {
  const market = normalized(event.mercato);
  const reason = normalized(event.motivo);
  const isCard = event.categoria === "cartellini";
  const isPlayer = market.includes("GIOCATORE");
  const isTeamShots =
    event.categoria === "tiri" &&
    (market.includes("SQUADRA X") || market.includes("1X2 TIRI"));
  const isAggressive =
    Number(event.quota) >= 4 ||
    /\b(AGGRESSIV|AMBIZIOS|ALTA|VARIANTE PIU)\b/.test(reason);

  const intelligence = classifyMarket(event);
  return { market, reason, isCard, isPlayer, isTeamShots, isAggressive, intelligence };
}

function coherence(event, profile) {
  if (/\b(PRINCIPALE|PREFERITO|PRIMA SCELTA|VERDETTO)\b/.test(profile.reason)) return 25;
  if (/\b(PROIEZIONE|COERENTE|SOSTIENE|INDICAT[OA])\b/.test(profile.reason)) return 23;
  if (profile.isAggressive) return 18;
  return 21;
}

function marketStability(event, profile) {
  if (profile.intelligence.recognized) {
    return Math.max(4, Math.round(27 - profile.intelligence.volatility * 0.2));
  }
  if (event.categoria === "esito") return profile.market.includes("DOPPIA CHANCE") ? 25 : 22;
  if (event.categoria === "goal") return 21;
  if (event.categoria === "corner") {
    if (profile.market.includes("SQUADRA X") || profile.market.includes("1X2 CORNER")) return 22;
    if (profile.market.includes("PRIMA A")) return 18;
    return 21;
  }
  if (profile.isTeamShots) return 20;
  if (profile.isPlayer) return profile.market.includes("TIRI IN PORTA") ? 12 : 15;
  if (profile.isCard) return 10;
  return 12;
}

function singlePlayerIndependence(profile) {
  if (profile.isCard) return 3;
  if (profile.isPlayer) return 4;
  return 15;
}

function minuteStability(profile) {
  if (profile.intelligence.minutePenalty) return Math.max(1, 10 - profile.intelligence.minutePenalty);
  if (profile.isCard) return 7;
  if (profile.isPlayer) return 5;
  return 10;
}

function gameStateStability(event, profile) {
  if (event.categoria === "esito") return 12;
  if (event.categoria === "goal") return 10;
  if (event.categoria === "corner") return profile.market.includes("PRIMA A") ? 8 : 10;
  if (profile.isTeamShots) return 10;
  if (profile.isPlayer) return 8;
  if (profile.isCard) return 7;
  return 8;
}

function simplicity(profile) {
  if (profile.isCard) return 8;
  if (profile.isPlayer) return 8;
  return 10;
}

function eventClass(event, profile) {
  if (profile.intelligence.riskLevel === "high") return "SPECULATIVE";
  if (["medium", "medium_high"].includes(profile.intelligence.riskLevel)) return "VALUE";
  if (profile.isAggressive && (profile.isPlayer || profile.isCard)) return "SPECULATIVE";
  if (profile.isPlayer || profile.isCard) return "VALUE";
  return "CORE";
}

function scoreReason(event, profile, factors, classification) {
  const strengths = [];
  const penalties = [];

  if (factors.coerenzaAnalisi >= 23) strengths.push("forte coerenza con l'analisi");
  else if (factors.coerenzaAnalisi >= 20) strengths.push("buona coerenza con il copione");
  else penalties.push("linea più aggressiva rispetto allo scenario centrale");

  if (factors.stabilitaMercato >= 20) strengths.push("mercato strutturalmente stabile");
  else penalties.push("mercato soggetto a maggiore varianza");

  if (profile.isPlayer) {
    penalties.push("dipendenza dal singolo giocatore e dal minutaggio");
  }
  if (profile.isCard) {
    penalties.push("forte sensibilità a arbitro e sviluppo dei duelli");
  }
  if (event.categoria === "corner" || event.categoria === "goal") {
    penalties.push("sensibilità all'andamento del punteggio");
  }

  const first = strengths.length ? strengths.join(" e ") : "supporto sufficiente dell'analisi";
  const second = penalties.length ? `; penalizzato da ${penalties.join(" e ")}` : "";
  return `${classification}: ${first}${second}.`;
}

function rankEvent(event, index) {
  const profile = marketProfile(event);
  const factors = {
    coerenzaAnalisi: coherence(event, profile),
    stabilitaMercato: marketStability(event, profile),
    indipendenzaSingoloGiocatore: singlePlayerIndependence(profile),
    stabilitaMinutaggio: minuteStability(profile),
    stabilitaAndamentoPartita: gameStateStability(event, profile),
    semplicitaMercato: simplicity(profile),
  };
  const score = Math.max(
    0,
    Math.min(100, Object.values(factors).reduce((total, value) => total + value, 0))
  );
  const classification = eventClass(event, profile);

  return {
    ...event,
    marketKey: profile.intelligence.marketKey,
    marketIntelligence: profile.intelligence.recognized ? {
      family: profile.intelligence.family,
      volatility: profile.intelligence.volatility,
      riskLevel: profile.intelligence.riskLevel,
      correlationGroup: profile.intelligence.correlationGroup,
      starterCertainty: profile.intelligence.starterCertainty,
    } : null,
    score,
    classe: classification,
    motivoScore: scoreReason(event, profile, factors, classification),
    fattoriScore: factors,
    _index: index,
  };
}

function processMatch(directoryName) {
  const inputPath = path.join(mvpDirectory, directoryName, "top-events.json");
  if (!fs.existsSync(inputPath)) throw new Error(`File non trovato: ${inputPath}`);
  const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  if (!payload.match || !Array.isArray(payload.events)) {
    throw new Error(`${inputPath}: formato top-events non valido.`);
  }

  const events = payload.events
    .map(rankEvent)
    .sort((a, b) => b.score - a.score || a._index - b._index)
    .map(({ _index, ...event }) => event);

  const outputPath = path.join(mvpDirectory, directoryName, "ranking-events.json");
  fs.writeFileSync(
    outputPath,
    `${JSON.stringify({ match: payload.match, events }, null, 2)}\n`,
    "utf8"
  );
  console.log(`${payload.match}: ${events.length} eventi ordinati -> ${path.relative(root, outputPath)}`);
}

const matches = requestedMatch
  ? [requestedMatch]
  : fs.readdirSync(mvpDirectory)
      .filter(name => fs.existsSync(path.join(mvpDirectory, name, "top-events.json")))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!matches.length) throw new Error("Nessun top-events.json disponibile.");
matches.forEach(processMatch);
