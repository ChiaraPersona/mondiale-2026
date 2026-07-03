const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const quoteDirectory = path.join(root, "data", "quote");
const myComboDirectory = path.join(root, "data", "mycombo");
const rulesPath = path.join(__dirname, "config", "quote-error-rules.json");
const requestedSlug = process.argv[2];

const MIN_ODDS = 3;
const MIN_VALUE_SCORE = 0.02;
const MIN_CONFIDENCE = 55;

function clamp(value, minimum = 0, maximum = 100) {
  return Math.max(minimum, Math.min(maximum, value));
}

function round(value, precision = 2) {
  const factor = 10 ** precision;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function normalized(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();
}

function includesNormalized(source, expected) {
  return normalized(source).includes(normalized(expected));
}

function matchesRule(market, rule) {
  if (rule.marketContains && !includesNormalized(market.mercato, rule.marketContains)) return false;
  if (rule.infoContains && !includesNormalized(market.info, rule.infoContains)) return false;
  if (rule.selection && normalized(market.esito) !== normalized(rule.selection)) return false;
  if (rule.threshold && normalized(market.soglia) !== normalized(rule.threshold)) return false;
  return true;
}

function riskWeight(risk) {
  return { low: 100, medium: 65, high: 25 }[risk] ?? 25;
}

function riskOrder(risk) {
  return { low: 0, medium: 1, high: 2 }[risk] ?? 3;
}

function edgeClassification(edge) {
  if (edge > 18) {
    return {
      band: "Possibile errore di quota",
      badge: "🔴 Possibile errore di quota",
      level: "error",
    };
  }
  if (edge >= 10) {
    return {
      band: "Quota sospetta",
      badge: "🟡 Quota sospetta",
      level: "suspicious",
    };
  }
  return {
    band: edge >= 5 ? "Quota interessante" : "Leggero value",
    badge: "🟢 Value",
    level: "value",
  };
}

function anomalyIndex({ odds, edge, confirmations, myComboCompatible, risk, isolatedScore }) {
  const highOddsScore = clamp(((odds - MIN_ODDS) / 9) * 100);
  const edgeScore = clamp((edge / 20) * 100);
  const probabilityGapScore = clamp((edge / 18) * 100);
  const engineScore = clamp((confirmations.length / 5) * 100);
  const compatibilityScore = myComboCompatible ? 100 : 35;
  return Math.round(
    highOddsScore * 0.12 +
    edgeScore * 0.28 +
    probabilityGapScore * 0.12 +
    engineScore * 0.16 +
    compatibilityScore * 0.10 +
    riskWeight(risk) * 0.10 +
    clamp(isolatedScore) * 0.12
  );
}

function buildCandidate(market, rule) {
  const odds = Number(market.quota);
  const estimatedProbability = Number(rule.estimatedProbability);
  const impliedProbability = 1 / odds;
  const valueScore = estimatedProbability - impliedProbability;
  const edge = valueScore * 100;
  const confirmations = Array.isArray(rule.confirmations) ? rule.confirmations : [];
  const classification = edgeClassification(edge);
  const candidate = {
    event: rule.event,
    market: market.mercato,
    selection: market.esito,
    odds: round(odds),
    impliedProbability: round(impliedProbability * 100),
    estimatedProbability: round(estimatedProbability * 100),
    valueScore: round(valueScore, 4),
    edge: round(edge),
    anomalyIndex: 0,
    classification: classification.band,
    badge: classification.badge,
    level: classification.level,
    reason: rule.reason,
    risk: rule.risk,
    myComboCompatible: Boolean(rule.myComboCompatible),
    modelConfidence: Math.round(Number(rule.modelConfidence)),
    confirmations,
    selectionId: String(market.selectionId ?? ""),
    marketId: String(market.marketId ?? ""),
  };
  candidate.anomalyIndex = anomalyIndex({
    odds,
    edge,
    confirmations,
    myComboCompatible: candidate.myComboCompatible,
    risk: candidate.risk,
    isolatedScore: Number(rule.isolatedScore ?? 0),
  });
  return candidate;
}

function isEligible(candidate, rule) {
  return (
    candidate.odds > MIN_ODDS &&
    candidate.valueScore >= MIN_VALUE_SCORE &&
    candidate.edge > 0 &&
    candidate.modelConfidence >= MIN_CONFIDENCE &&
    rule.scenarioCompatible !== false &&
    rule.correlationCompatible !== false &&
    rule.tacticalFit !== false
  );
}

function compareCandidates(first, second) {
  return (
    second.anomalyIndex - first.anomalyIndex ||
    second.edge - first.edge ||
    second.modelConfidence - first.modelConfidence ||
    riskOrder(first.risk) - riskOrder(second.risk) ||
    Number(second.myComboCompatible) - Number(first.myComboCompatible)
  );
}

function analyzeSlug(slug, rules) {
  const quotePath = path.join(quoteDirectory, `${slug}-quote.json`);
  const myComboPath = path.join(myComboDirectory, `${slug}.json`);
  if (!fs.existsSync(quotePath)) throw new Error(`Quote non trovate: ${quotePath}`);
  if (!fs.existsSync(myComboPath)) throw new Error(`MyCombo non trovata: ${myComboPath}`);

  const quotePayload = JSON.parse(fs.readFileSync(quotePath, "utf8"));
  const myComboPayload = JSON.parse(fs.readFileSync(myComboPath, "utf8"));
  const availableMarkets = Array.isArray(quotePayload.markets) ? quotePayload.markets : [];
  const highOddsMarkets = availableMarkets.filter(market => Number(market.quota) > MIN_ODDS);
  const matchedSelectionIds = new Set();
  const candidates = [];

  for (const rule of rules) {
    const market = highOddsMarkets.find(item =>
      !matchedSelectionIds.has(String(item.selectionId ?? "")) && matchesRule(item, rule)
    );
    if (!market) continue;
    matchedSelectionIds.add(String(market.selectionId ?? ""));
    const candidate = buildCandidate(market, rule);
    if (isEligible(candidate, rule)) candidates.push(candidate);
  }

  candidates.sort(compareCandidates);
  myComboPayload.quoteErrorAnalysis = {
    title: "Errore di Quota",
    generatedAt: new Date().toISOString(),
    criteria: {
      minimumOddsExclusive: MIN_ODDS,
      minimumValueScore: MIN_VALUE_SCORE,
      minimumModelConfidence: MIN_CONFIDENCE,
    },
    analysis: {
      totalMarkets: availableMarkets.length,
      marketsAboveOddsThreshold: highOddsMarkets.length,
      modelMatchedMarkets: matchedSelectionIds.size,
      publishedEvents: candidates.length,
    },
    events: candidates,
    disclaimer:
      "Le quote segnalate non rappresentano garanzie di vincita. Sono eventi in cui il modello rileva un possibile disallineamento tra la quota offerta dal bookmaker e la probabilità stimata.",
  };
  fs.writeFileSync(myComboPath, `${JSON.stringify(myComboPayload, null, 2)}\n`, "utf8");
  console.log(
    `${slug}: ${availableMarkets.length} quote analizzate, ${highOddsMarkets.length} sopra 3.00, ` +
    `${candidates.length} eventi pubblicati.`
  );
}

if (require.main === module) {
  const config = JSON.parse(fs.readFileSync(rulesPath, "utf8"));
  const slugs = requestedSlug ? [requestedSlug] : Object.keys(config.matches);
  for (const slug of slugs) {
    const rules = config.matches[slug];
    if (!Array.isArray(rules)) throw new Error(`Regole Errore di Quota mancanti per ${slug}.`);
    analyzeSlug(slug, rules);
  }
}

module.exports = {
  MIN_CONFIDENCE,
  MIN_ODDS,
  MIN_VALUE_SCORE,
  analyzeSlug,
  anomalyIndex,
  buildCandidate,
  compareCandidates,
  edgeClassification,
  isEligible,
  matchesRule,
};
