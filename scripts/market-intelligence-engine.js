const config = require("../data/config/market-intelligence.json");

const markets = new Map(config.markets.map(market => [market.marketKey, Object.freeze(market)]));
const RISK_BASE = { low: 18, medium_low: 30, medium: 44, medium_high: 58, high: 72 };

function normalized(value) {
  return String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

function identifyMarket(input) {
  const marketText = normalized(typeof input === "string" ? input : input?.market ?? input?.mercato ?? "");
  const text = normalized(typeof input === "string"
    ? input
    : `${marketText} ${input?.info ?? ""} ${input?.selection ?? input?.selezione ?? ""}`);
  const rules = [
    ["tris_ammoniti", /TRIS.*AMMON|AMMON.*TRIS/],
    ["player_goal_or_card", /(GIOCATORE|CALCIATORE).*(SEGNA|GOL).*(CARTELL)|(?:SEGNA|GOL).*O.*CARTELL/],
    ["player_shots_both_halves", /^(GIOCATORE|CALCIATORE).*(TIRI).*(2 TEMPI|ENTRAMBI I TEMPI|OGNI TEMPO)/],
    ["both_teams_corners_both_halves", /ENTRAMB.*(?:CORNER|ANGOLO).*(ENTRAMBI I TEMPI|OGNI TEMPO)/],
    ["player_goal_or_assist", /(GIOCATORE|CALCIATORE|MARCATORE).*(SEGNA|GOL).*(ASSIST)|SEGNA O ASSIST/],
    ["both_teams_cards", /ENTRAMB.*(?:CARTELL|AMMON)/],
    ["both_teams_corners", /ENTRAMB.*(?:CORNER|ANGOLO)/],
    ["team_saves_over_under", /(U\/O|OVER|UNDER).*(PARATE|SAVES).*(SQUADRA|TEAM)|(?:SQUADRA|TEAM).*(U\/O|OVER|UNDER).*(PARATE|SAVES)/],
    ["player_shots_on_target", /(GIOCATORE|CALCIATORE|DUO).*(TIRI IN PORTA)|TIRI IN PORTA GIOCATORE/],
    ["player_total_shots", /(GIOCATORE|CALCIATORE|DUO).*(TIRI TOTALI)|TIRI TOTALI GIOCATORE/],
    ["player_card", /CARTELLINO SI\/NO|(?:GIOCATORE|CALCIATORE).*(CARTELL|AMMON)/],
    ["cards_over", /(U\/O|OVER).*(CARTELL|AMMON)|(?:CARTELL|AMMON).*(U\/O|OVER)/],
    ["team_multigoal", /MULTIGOAL SQUADRA|SQUADRA [12].*MULTIGOAL/],
    ["multigoal", /MULTIGOAL/],
    ["team_shots_on_target", /TIRI IN PORTA SQUADRA|SQUADRA [12].*TIRI IN PORTA/],
    ["team_total_shots", /TIRI TOTALI SQUADRA|SQUADRA [12].*TIRI TOTALI|1X2 TIRI/],
    ["corners_over_under", /CORNER|CALCI D.ANGOLO|ANGOLO/],
    ["goals_over_under", /GOAL\/NO ?GOAL|UNDER\/OVER|U\/O [0-9]|GOL/],
    ["match_result", /1X2|DOPPIA CHANCE|PASSAGGIO TURNO/],
  ];
  const match = rules.find(([, pattern]) => pattern.test(text));
  if (!match) return null;
  if (match[0] === "match_result" && /FALLI|FUORIGIOCO|PALI|CARTELL|RIMESSE|TIRI/.test(marketText)) return null;
  if (
    match[0] === "goals_over_under" &&
    /^U\/O/.test(marketText) &&
    !/GOAL|GOL|SOMMA GOAL|^U\/O SQUADRA X$/.test(marketText)
  ) return null;
  return markets.get(match[0]);
}

function scenarioTags(scenario) {
  const text = normalized(`${scenario?.id ?? ""} ${scenario?.name ?? ""} ${scenario?.description ?? ""}`);
  const tags = new Set();
  if (/DOMIN|FAVORIT|CONTROL|PRESSION|TERRITOR/.test(text)) tags.add("dominant_team");
  if (/PRESSION|RITMO|ATTACC|VOLUME/.test(text)) tags.add("high_pressure");
  if (/APERT|OPEN|GOAL|RIMONTA|SCAMBI/.test(text)) tags.add("open_match");
  if (/FISIC|DUELL|CARTELL|NERV|PHYSICAL/.test(text)) tags.add("physical_match");
  return tags;
}

function scenarioCompatible(metadata, scenario) {
  if (!scenario) return true;
  if (!metadata || !metadata.scenarioCompatibility.length) return true;
  const tags = scenarioTags(scenario);
  return metadata.scenarioCompatibility.some(tag => tags.has(tag));
}

function starterCertainty(event) {
  if (event?.starterConfirmed === true || event?.isStarter === true || Number(event?.expectedMinutes) >= 70) return "high";
  if (event?.starterConfirmed === false || event?.isStarter === false || Number(event?.expectedMinutes) < 45) return "low";
  return "unknown";
}

function classifyMarket(event, options = {}) {
  const metadata = identifyMarket(event);
  if (!metadata) return { recognized: false, marketKey: null, metadata: null, minutePenalty: 0 };
  const certainty = starterCertainty(event);
  const minutePenalty = metadata.dependsOnMinutes && certainty !== "high"
    ? (certainty === "low" ? 24 : 14)
    : 0;
  return {
    recognized: true,
    marketKey: metadata.marketKey,
    label: metadata.label,
    category: metadata.category,
    family: metadata.family,
    volatility: metadata.volatility,
    riskLevel: metadata.riskLevel,
    dependsOnMinutes: metadata.dependsOnMinutes,
    needsStarter: metadata.needsStarter,
    correlationGroup: metadata.correlationGroup,
    notes: metadata.notes,
    minutePenalty,
    starterCertainty: certainty,
    scenarioCompatible: scenarioCompatible(metadata, options.scenario),
    allowedInPortfolio: { ...metadata.allowedInPortfolio },
    metadata,
  };
}

function isAllowedInPortfolio(event, profile, scenario) {
  const classification = classifyMarket(event, { scenario });
  return classification.recognized &&
    classification.allowedInPortfolio[profile] === true &&
    classification.scenarioCompatible;
}

function marketRisk(event) {
  const classification = classifyMarket(event);
  if (!classification.recognized) return { score: 8, reasons: [], classification };
  const base = RISK_BASE[classification.riskLevel] ?? 44;
  return {
    score: Math.round(Math.min(100, base + classification.volatility * 0.18 + classification.minutePenalty)),
    reasons: [
      `Mercato ${classification.marketKey}: volatilità ${classification.volatility}/100.`,
      ...(classification.minutePenalty ? ["Minutaggio o titolarità non confermati."] : []),
    ],
    classification,
  };
}

function listMarkets() {
  return [...markets.values()];
}

function auditEvents(events) {
  const recognized = [];
  const unmapped = [];
  for (const event of events || []) {
    const classification = classifyMarket(event);
    const market = String(event?.market ?? event?.mercato ?? "");
    if (classification.recognized) {
      recognized.push({ market, marketKey: classification.marketKey });
    } else {
      unmapped.push(market);
    }
  }
  return {
    total: recognized.length + unmapped.length,
    recognized,
    unmapped: [...new Set(unmapped)].sort((a, b) => a.localeCompare(b, "it")),
  };
}

module.exports = {
  identifyMarket,
  classifyMarket,
  isAllowedInPortfolio,
  marketRisk,
  scenarioCompatible,
  listMarkets,
  auditEvents,
};
