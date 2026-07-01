const fs = require("fs");
const path = require("path");
const { portfolioRiskLimits, withEventRisk, assessPortfolio } = require("./risk-engine");
const { isAllowedInPortfolio } = require("./market-intelligence-engine");

const root = path.resolve(__dirname, "..");
const mvpDirectory = path.join(root, "data", "mvp");
const requestedMatch = process.argv[2];

const configs = {
  "Portfolio Safe": {
    id: "safe",
    ...portfolioRiskLimits.safe,
    minScore: 80,
    classes: new Set(["CORE"]),
  },
  "Portfolio Balanced": {
    id: "balanced",
    ...portfolioRiskLimits.balanced,
    minScore: 65,
    classes: new Set(["CORE", "VALUE"]),
  },
  "Portfolio Aggressive": {
    id: "aggressive",
    ...portfolioRiskLimits.aggressive,
    minScore: 55,
    classes: new Set(["CORE", "VALUE", "SPECULATIVE"]),
  },
};

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
    graph.edges.map(edge => [[edge.source, edge.target].sort().join("|"), edge])
  );
}

function edgeFor(first, second, edges) {
  return edges.get([first, second].sort().join("|"));
}

function compatibleWithSelection(candidate, selected, edges) {
  if (
    selected.some(event => {
      const edge = edgeFor(candidate.id, event.id, edges);
      return !edge || edge.type === "NEGATIVE" || edge.type === "REDUNDANT";
    })
  ) return false;

  return selected.filter(event => event.category === candidate.category).length < 2;
}

function adjustedEventQuality(event) {
  const classPenalty = event.class === "CORE" ? 0 : event.class === "VALUE" ? 7 : 14;
  return event.score - classPenalty;
}

function portfolioStats(selected, edges, portfolioId) {
  const totalOdds = selected.reduce((total, event) => total * event.odds, 1);
  const adjusted = selected.map(adjustedEventQuality);
  const averageQuality = adjusted.reduce((total, value) => total + value, 0) / adjusted.length;
  const minimumQuality = Math.min(...adjusted);
  const categories = new Set(selected.map(event => event.category));
  const repeatedCategories = selected.length - categories.size;
  let positive = 0;
  let neutral = 0;
  let veryHighCorrelation = 0;

  for (let i = 0; i < selected.length; i += 1) {
    for (let j = i + 1; j < selected.length; j += 1) {
      const edge = edgeFor(selected[i].id, selected[j].id, edges);
      if (edge?.type === "POSITIVE") positive += 1;
      if (edge?.type === "NEUTRAL") neutral += 1;
      if (edge?.type === "POSITIVE" && edge.correlationScore >= 0.9) veryHighCorrelation += 1;
    }
  }

  const qualityIndex =
    averageQuality +
    minimumQuality * 0.15 +
    categories.size * 1.5 +
    selected.length * 1.8 -
    repeatedCategories -
    neutral * 0.4 -
    veryHighCorrelation * 0.8;
  const risk = assessPortfolio(selected, portfolioId, edges);
  const concentrationPenalty =
    risk.riskProfile.riskConcentration === "high" ? 18 :
    risk.riskProfile.riskConcentration === "medium" ? 7 : 0;
  const optimizationScore =
    risk.riskProfile.averageRisk * 2 +
    risk.riskProfile.maxEventRisk * 0.8 +
    risk.riskProfile.highRiskEvents * 35 +
    concentrationPenalty -
    qualityIndex * 0.35 +
    Math.pow(totalOdds, 1 / selected.length) * 4 -
    selected.length * 2;

  return {
    totalOdds,
    averageQuality,
    minimumQuality,
    categories: categories.size,
    positive,
    neutral,
    veryHighCorrelation,
    qualityIndex,
    optimizationScore,
    ...risk,
  };
}

function searchBest(candidates, config, edges) {
  let bestInside = null;
  const [minimum, maximum] = config.range;

  function consider(selected) {
    if (selected.length < config.minEvents) return;
    const stats = portfolioStats(selected, edges, config.id);
    if (!stats.allowed) return;
    const result = { selected: [...selected], stats };
    if (stats.totalOdds >= minimum && stats.totalOdds <= maximum) {
      if (!bestInside || stats.optimizationScore < bestInside.stats.optimizationScore) bestInside = result;
    }
  }

  function visit(start, selected, product) {
    consider(selected);
    if (selected.length >= config.maxEvents) return;
    for (let index = start; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const nextProduct = product * candidate.odds;
      if (nextProduct > config.range[1]) continue;
      if (!compatibleWithSelection(candidate, selected, edges)) continue;
      selected.push(candidate);
      visit(index + 1, selected, nextProduct);
      selected.pop();
    }
  }

  visit(0, [], 1);

  if (bestInside) return { ...bestInside, rangeStatus: "inside_range" };
  return null;
}

function eventOutput(event) {
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
}

function removalReason(event, finalEvents) {
  const sameCategory = finalEvents.filter(item => item.category === event.category);
  const strongerAlternative = sameCategory.find(item => item.score > event.score);
  if (strongerAlternative) {
    return `Sostituito da un evento della stessa categoria con Score più alto (${strongerAlternative.score} contro ${event.score}) e quota compatibile.`;
  }
  if (event.class === "SPECULATIVE") {
    return "Rimosso per ridurre volatilità e dipendenza da un esito individuale ad alta varianza.";
  }
  if (event.class === "VALUE") {
    return "Rimosso perché la quota aggiunta non compensava abbastanza la variabilità del mercato.";
  }
  return "Rimosso per ridurre il numero di gambe e migliorare la qualità complessiva senza forzare la quota.";
}

function additionReason(event, initialEvents) {
  const similarOdds = initialEvents.find(
    item => Math.abs(item.odds - event.odds) <= 0.35 && item.id !== event.id
  );
  if (similarOdds && event.score > similarOdds.score) {
    return `Inserito come alternativa più stabile a quota simile: Score ${event.score} contro ${similarOdds.score}.`;
  }
  if (event.class === "CORE") {
    return "Inserito per aumentare la stabilità del portfolio con un mercato CORE coerente con lo scenario.";
  }
  return "Inserito perché migliora diversità e qualità mantenendo la quota nell'intervallo accettabile.";
}

function qualitativeImprovement(delta, removed, added) {
  if (!removed.length && !added.length) return "nessuno: la schedina candidata era già ottimale";
  if (delta >= 6) return "alto";
  if (delta >= 2.5) return "medio";
  if (delta > 0) return "contenuto";
  return "strutturale: quota o numero di gambe migliorati senza aumento dell'indice";
}

function optimizePortfolio(portfolio, ranking, scenarios, graph) {
  const config = configs[portfolio.name];
  if (!config) throw new Error(`Configurazione mancante per ${portfolio.name}`);
  if (!portfolio.scenario || !Array.isArray(portfolio.events) || !portfolio.events.length) {
    return {
      ...portfolio,
      initialOdds: portfolio.totalOdds,
      finalOdds: portfolio.totalOdds,
      acceptedRange: config.range,
      status: "unchanged_no_candidate",
      removedEvents: [],
      addedEvents: [],
      improvementEstimate: "nessuno",
      reason: portfolio.reason || "Nessun candidato disponibile da ottimizzare.",
      riskProfile: portfolio.riskProfile || assessPortfolio([], config.id).riskProfile,
      riskVerdict: portfolio.riskVerdict || "high",
      riskNotes: portfolio.riskNotes || ["Nessun candidato disponibile per il calcolo del rischio."],
    };
  }
  const scenario = scenarios.find(item => item.id === portfolio.scenario.id);
  if (!scenario) throw new Error(`Scenario non trovato: ${portfolio.scenario.id}`);

  const edges = edgeMap(graph);
  const rankingById = new Map(
    ranking.events.map((event, index) => {
      const id = `event-${String(index + 1).padStart(2, "0")}`;
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

  const incompatible = new Set(scenario.incompatibleEvents.map(event => event.id));
  const candidates = scenario.compatibleEvents
    .map(event => rankingById.get(event.id))
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

  const optimized = searchBest(candidates, config, edges);
  const initialEvents = portfolio.events
    .map(event => rankingById.get(event.id))
    .filter(Boolean)
    .filter(event => isMyComboEligible(event, config.id, scenario));
  const initialStats = portfolioStats(initialEvents, edges, config.id);

  if (!optimized) {
    const initialWithinRange =
      initialStats.totalOdds >= config.range[0] && initialStats.totalOdds <= config.range[1];
    const keepInitial = initialWithinRange && initialStats.allowed;
    return {
      name: portfolio.name,
      scenario: portfolio.scenario,
      initialOdds: portfolio.totalOdds,
      finalOdds: keepInitial ? portfolio.totalOdds : null,
      acceptedRange: config.range,
      status: keepInitial ? "unchanged_risk_optimal" : "unchanged_no_better_solution",
      events: keepInitial ? portfolio.events : [],
      removedEvents: [],
      addedEvents: [],
      improvementEstimate: "nessuno",
      reason: keepInitial
        ? "Il portfolio iniziale è già la soluzione più stabile entro l'intervallo quota."
        : "Nessuna combinazione valida nell'intervallo previsto e coerente con i vincoli del profilo.",
      strengths: portfolio.strengths,
      weaknesses: [
        ...portfolio.weaknesses,
        "L'Optimizer non ha forzato la quota con eventi di qualità inferiore.",
      ],
      riskProfile: keepInitial ? initialStats.riskProfile : assessPortfolio([], config.id, edges).riskProfile,
      riskVerdict: keepInitial ? initialStats.riskVerdict : "high",
      riskNotes: keepInitial
        ? initialStats.riskNotes
        : ["Portfolio non generato: nessun evento debole è stato aggiunto per forzare la quota."],
    };
  }

  const finalIds = new Set(optimized.selected.map(event => event.id));
  const initialIds = new Set(initialEvents.map(event => event.id));
  const removed = initialEvents.filter(event => !finalIds.has(event.id));
  const added = optimized.selected.filter(event => !initialIds.has(event.id));
  const delta = optimized.stats.qualityIndex - initialStats.qualityIndex;
  const insideRange = optimized.rangeStatus === "inside_range";

  return {
    name: portfolio.name,
    scenario: portfolio.scenario,
    initialOdds: portfolio.totalOdds,
    finalOdds: round2(optimized.stats.totalOdds),
    acceptedRange: config.range,
    status: insideRange ? "optimized_inside_range" : "optimized_below_range",
    events: optimized.selected.map(eventOutput),
    removedEvents: removed.map(event => ({
      ...eventOutput(event),
      reason: removalReason(event, optimized.selected),
    })),
    addedEvents: added.map(event => ({
      ...eventOutput(event),
      reason: additionReason(event, initialEvents),
    })),
    improvementEstimate: qualitativeImprovement(delta, removed, added),
    qualityIndex: {
      initial: round2(initialStats.qualityIndex),
      final: round2(optimized.stats.qualityIndex),
      delta: round2(delta),
      note: "Indice comparativo di qualità, non probabilità.",
    },
    reason: insideRange
      ? "La soluzione minimizza il rischio tra le combinazioni ammissibili nell'intervallo."
      : "Quota target non raggiungibile senza aumentare troppo il rischio: mantenuta la soluzione più stabile sotto intervallo.",
    strengths: [
      `${optimized.stats.categories} categorie rappresentate.`,
      `${optimized.stats.positive} relazioni positive, nessuna negativa o ridondante.`,
      `Score medio corretto per classe: ${round2(optimized.stats.averageQuality)}.`,
      optimized.selected.length > initialEvents.length
        ? `Eventi aumentati da ${initialEvents.length} a ${optimized.selected.length} per distribuire il rischio su quote più basse.`
        : `Numero eventi: ${optimized.selected.length}.`,
    ],
    weaknesses: [
      optimized.stats.neutral
        ? `${optimized.stats.neutral} relazioni neutrali restano nel portfolio.`
        : "Tutte le coppie hanno una relazione positiva nello scenario.",
      "La qualità resta condizionata dal verificarsi dello scenario comune.",
    ],
    riskProfile: optimized.stats.riskProfile,
    riskVerdict: optimized.stats.riskVerdict,
    riskNotes: optimized.stats.riskNotes,
  };
}

function processMatch(matchKey) {
  const directory = path.join(mvpDirectory, matchKey);
  const portfolioPath = path.join(directory, "portfolios.json");
  const rankingPath = path.join(directory, "ranking-events.json");
  const scenarioPath = path.join(directory, "match-scenarios.json");
  const graphPath = path.join(directory, "matchGraph.json");

  for (const filePath of [portfolioPath, rankingPath, scenarioPath, graphPath]) {
    if (!fs.existsSync(filePath)) throw new Error(`Input mancante: ${filePath}`);
  }

  const portfolios = JSON.parse(fs.readFileSync(portfolioPath, "utf8"));
  const ranking = JSON.parse(fs.readFileSync(rankingPath, "utf8"));
  const scenarios = JSON.parse(fs.readFileSync(scenarioPath, "utf8"));
  const graph = JSON.parse(fs.readFileSync(graphPath, "utf8"));

  const optimized = [];
  for (const portfolio of portfolios.portfolios) {
    const result = optimizePortfolio(
      portfolio,
      ranking,
      scenarios.scenarios,
      graph
    );
    optimized.push(result);
  }
  const output = { match: portfolios.match, portfolios: optimized };
  const outputPath = path.join(directory, "portfolio-optimized.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(
    `${portfolios.match}: ${optimized.map(item => `${item.name} ${item.initialOdds}→${item.finalOdds}`).join(", ")}`
  );
}

const matches = requestedMatch
  ? [requestedMatch]
  : fs.readdirSync(mvpDirectory)
      .filter(name =>
        fs.existsSync(path.join(mvpDirectory, name, "portfolios.json")) &&
        fs.existsSync(path.join(mvpDirectory, name, "ranking-events.json")) &&
        fs.existsSync(path.join(mvpDirectory, name, "match-scenarios.json")) &&
        fs.existsSync(path.join(mvpDirectory, name, "matchGraph.json"))
      )
      .sort((a, b) => a.localeCompare(b, "it"));

if (!matches.length) throw new Error("Nessun portfolio completo disponibile.");
matches.forEach(processMatch);
