const fs = require("fs");
const path = require("path");
const { portfolioRiskLimits, withEventRisk, assessPortfolio } = require("./risk-engine");
const { isAllowedInPortfolio } = require("./market-intelligence-engine");

const root = path.resolve(__dirname, "..");
const mvpDirectory = path.join(root, "data", "mvp");
const requestedMatch = process.argv[2];

const portfolioConfigs = [
  {
    id: "safe",
    name: "Portfolio Safe",
    target: 5,
    minScore: 80,
    classes: new Set(["CORE"]),
    scenarioLevels: new Set(["alta"]),
    ...portfolioRiskLimits.safe,
  },
  {
    id: "balanced",
    name: "Portfolio Balanced",
    target: 10,
    minScore: 65,
    classes: new Set(["CORE", "VALUE"]),
    scenarioLevels: new Set(["alta", "media"]),
    ...portfolioRiskLimits.balanced,
  },
  {
    id: "aggressive",
    name: "Portfolio Aggressive",
    target: 20,
    minScore: 55,
    classes: new Set(["CORE", "VALUE", "SPECULATIVE"]),
    scenarioLevels: new Set(["alta", "media", "bassa"]),
    ...portfolioRiskLimits.aggressive,
  },
];

function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function isMyComboEligible(event, profile, scenario) {
  const market = String(event?.market || "").toUpperCase();
  return isAllowedInPortfolio(event, profile, scenario) && !(
    market.includes("PRIMA A X CORNER") ||
    market.includes("PRIMA A 2 CALCI D'ANGOLO")
  );
}

function edgeMap(graph) {
  return new Map(
    graph.edges.map(edge => [
      [edge.source, edge.target].sort().join("|"),
      edge,
    ])
  );
}

function pairEdge(first, second, edges) {
  return edges.get([first, second].sort().join("|"));
}

function pairAllowed(first, second, edges) {
  const edge = pairEdge(first, second, edges);
  return edge && edge.type !== "NEGATIVE" && edge.type !== "REDUNDANT";
}

function candidateCompatible(candidate, selected, edges) {
  if (selected.some(event => !pairAllowed(candidate.id, event.id, edges))) return false;
  const sameCategory = selected.filter(event => event.category === candidate.category).length;
  return sameCategory < 2;
}

function combinationStats(selected, edges, portfolioId) {
  const product = selected.reduce((total, event) => total * event.odds, 1);
  const categories = new Set(selected.map(event => event.category));
  const averageScore =
    selected.reduce((total, event) => total + event.score, 0) / selected.length;
  let positive = 0;
  let neutral = 0;
  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      const edge = pairEdge(selected[i].id, selected[j].id, edges);
      if (edge?.type === "POSITIVE") positive += 1;
      if (edge?.type === "NEUTRAL") neutral += 1;
    }
  }
  const risk = assessPortfolio(selected, portfolioId, edges);
  return { product, diversity: categories.size, averageScore, positive, neutral, ...risk };
}

function objective(stats, legs) {
  const averageOdds = Math.pow(stats.product, 1 / legs);
  const concentrationPenalty =
    stats.riskProfile.riskConcentration === "high" ? 18 :
    stats.riskProfile.riskConcentration === "medium" ? 7 : 0;
  return (
    stats.riskProfile.averageRisk * 2 +
    stats.riskProfile.maxEventRisk * 0.8 +
    stats.riskProfile.highRiskEvents * 35 +
    concentrationPenalty -
    stats.diversity * 5 -
    stats.averageScore * 0.12 -
    stats.positive * 1.5 +
    stats.neutral * 0.5 +
    averageOdds * 4 -
    legs * 2
  );
}

function bestCombination(candidates, config, edges) {
  let best = null;
  const maximumProduct = config.range[1];

  function consider(selected) {
    if (selected.length < config.minEvents) return;
    const stats = combinationStats(selected, edges, config.id);
    if (stats.product < config.range[0] || stats.product > config.range[1] || !stats.allowed) return;
    const quality = objective(stats, selected.length);
    if (!best || quality < best.quality) {
      best = { selected: [...selected], stats, quality };
    }
  }

  function search(start, selected, product) {
    consider(selected);
    if (selected.length >= config.maxEvents) return;

    for (let index = start; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const nextProduct = product * candidate.odds;
      if (nextProduct > maximumProduct) continue;
      if (!candidateCompatible(candidate, selected, edges)) continue;
      selected.push(candidate);
      search(index + 1, selected, nextProduct);
      selected.pop();
    }
  }

  search(0, [], 1);
  return best;
}

function portfolioEvents(selected) {
  return selected.map(event => {
    const risk = withEventRisk(event);
    return {
    id: event.id,
    market: event.market,
    selection: event.selection,
    odds: event.odds,
    selectionId: event.selectionId,
    marketId: event.marketId,
    category: event.category,
    marketKey: risk.marketKey,
    marketVolatility: risk.marketVolatility,
    correlationGroup: risk.correlationGroup,
    rankingScore: event.score,
    class: event.class,
    reason: event.reason,
    riskScore: risk.riskScore,
    riskLevel: risk.riskLevel,
    riskReasons: risk.riskReasons,
  };
  });
}

function portfolioNarrative(best, scenario, config) {
  const stats = best.stats;
  const categories = [...new Set(best.selected.map(event => event.category))];
  const weak = [];

  if (stats.neutral) {
    weak.push(`${stats.neutral} relazioni sono neutrali: gli eventi condividono lo scenario ma non una dipendenza diretta.`);
  }
  if (best.selected.some(event => event.category === "tiri" && event.class !== "CORE")) {
    weak.push("I mercati giocatore restano sensibili a minutaggio, ruolo e sostituzioni.");
  }
  if (scenario.estimatedProbability !== "alta") {
    weak.push(`Lo scenario ha probabilità qualitativa ${scenario.estimatedProbability}.`);
  }

  return {
    reason:
      `Selezione costruita interamente sullo scenario “${scenario.name}”, ` +
      `massimizzando stabilità e probabilità entro l'intervallo quota ${config.range[0]}-${config.range[1]}.`,
    strengths: [
      `${categories.length} categorie rappresentate: ${categories.join(", ")}.`,
      `Score medio ${round2(stats.averageScore)}.`,
      `${stats.positive} relazioni positive e nessuna relazione negativa o ridondante.`,
      ...scenario.rootCauses.slice(0, 2),
    ],
    weaknesses: weak.length
      ? weak
      : ["Il portfolio resta sensibile al mancato verificarsi dello scenario comune."],
  };
}

function buildPortfolio(ranking, scenarios, graph, config) {
  const edges = edgeMap(graph);
  const eventById = new Map(
    ranking.events.map((event, index) => {
      const id = `event-${String(index + 1).padStart(2, "0")}`;
      const node = graph.nodes.find(item => item.id === id);
      return [
        id,
        {
          id,
          market: event.mercato,
          selection: event.selezione,
          odds: Number(event.quota),
          selectionId: event.selectionId,
          marketId: event.marketId,
          category: event.categoria,
          marketKey: event.marketKey,
          marketIntelligence: event.marketIntelligence,
          score: event.score,
          class: event.classe,
          reason: event.motivo,
          node,
          ...withEventRisk({
            market: event.mercato,
            odds: Number(event.quota),
            category: event.categoria,
            class: event.classe,
            starterConfirmed: event.starterConfirmed,
            expectedMinutes: event.expectedMinutes,
          }),
        },
      ];
    })
  );

  let winner = null;
  for (const scenario of scenarios) {
    if (!config.scenarioLevels.has(scenario.estimatedProbability)) continue;
    const incompatible = new Set(scenario.incompatibleEvents.map(event => event.id));
    const candidates = scenario.compatibleEvents
      .map(event => eventById.get(event.id))
      .filter(Boolean)
      .filter(event =>
        !incompatible.has(event.id) &&
        isMyComboEligible(event, config.id, scenario) &&
        event.score >= config.minScore &&
        config.classes.has(event.class) &&
        event.odds > 1.05 &&
        event.odds <= config.maxSingleOdds &&
        event.riskScore <= config.maxEventRisk
      )
      .sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));

    const best = bestCombination(candidates, config, edges);
    if (!best) continue;
    if (!winner || best.quality < winner.best.quality) {
      winner = { scenario, best };
    }
  }

  if (!winner) {
    return {
      name: config.name,
      targetOdds: config.target,
      status: "not_reached",
      totalOdds: null,
      events: [],
      scenario: null,
      reason: "Nessun insieme soddisfa i requisiti minimi di qualità, scenario e compatibilità.",
      strengths: [],
      weaknesses: ["Quota target non raggiunta: non sono stati aggiunti eventi deboli o casuali."],
      riskProfile: assessPortfolio([], config.id, edges).riskProfile,
      riskVerdict: "high",
      riskNotes: ["Quota target non raggiungibile entro i limiti di rischio configurati."],
    };
  }

  const { scenario, best } = winner;
  const targetReached =
    best.stats.product >= config.range[0] && best.stats.product <= config.range[1];
  const narrative = portfolioNarrative(best, scenario, config);

  return {
    name: config.name,
    targetOdds: config.target,
    status: targetReached ? "target_reached" : "not_reached",
    totalOdds: round2(best.stats.product),
    events: portfolioEvents(best.selected),
    scenario: {
      id: scenario.id,
      name: scenario.name,
      estimatedProbability: scenario.estimatedProbability,
    },
    reason: targetReached
      ? narrative.reason
      : `${narrative.reason} La migliore quota ottenibile resta fuori dalla tolleranza prevista.`,
    strengths: narrative.strengths,
    weaknesses: targetReached
      ? narrative.weaknesses
      : [
          ...narrative.weaknesses,
          "Quota target non raggiunta: il builder ha mantenuto invariati i filtri di qualità.",
        ],
    riskProfile: best.stats.riskProfile,
    riskVerdict: best.stats.riskVerdict,
    riskNotes: best.stats.riskNotes,
  };
}

function processMatch(matchKey) {
  const directory = path.join(mvpDirectory, matchKey);
  const rankingPath = path.join(directory, "ranking-events.json");
  const scenariosPath = path.join(directory, "match-scenarios.json");
  const graphPath = path.join(directory, "matchGraph.json");

  for (const filePath of [rankingPath, scenariosPath, graphPath]) {
    if (!fs.existsSync(filePath)) throw new Error(`Input mancante: ${filePath}`);
  }

  const ranking = JSON.parse(fs.readFileSync(rankingPath, "utf8"));
  const scenarioPayload = JSON.parse(fs.readFileSync(scenariosPath, "utf8"));
  const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));

  const portfolios = portfolioConfigs.map(config =>
    buildPortfolio(ranking, scenarioPayload.scenarios, graph, config)
  );
  const output = { match: ranking.match, portfolios };
  const outputPath = path.join(directory, "portfolios.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `${ranking.match}: ${portfolios.map(item => `${item.name}=${item.totalOdds ?? "n.d."} (${item.status})`).join(", ")}`
  );
}

const matches = requestedMatch
  ? [requestedMatch]
  : fs.readdirSync(mvpDirectory)
      .filter(name =>
        fs.existsSync(path.join(mvpDirectory, name, "ranking-events.json")) &&
        fs.existsSync(path.join(mvpDirectory, name, "match-scenarios.json")) &&
        fs.existsSync(path.join(mvpDirectory, name, "matchGraph.json"))
      )
      .sort((a, b) => a.localeCompare(b, "it"));

if (!matches.length) throw new Error("Nessun set completo ranking/scenari/correlazioni disponibile.");
matches.forEach(processMatch);
