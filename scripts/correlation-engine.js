const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const mvpDirectory = path.join(root, "data", "mvp");
const requestedMatch = process.argv[2];

function normalized(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function structuralKey(event) {
  return normalized(event.mercato)
    .replace(/\bU\/O\s+\d+(?:\.\d+)?/g, "U/O #")
    .replace(/\s+/g, " ")
    .trim();
}

function threshold(event) {
  const match = normalized(event.mercato).match(/\bU\/O\s+(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

function scenarioMembership(scenarios) {
  const membership = new Map();
  for (const scenario of scenarios) {
    for (const event of scenario.compatibleEvents) {
      if (!membership.has(event.id)) membership.set(event.id, {});
      membership.get(event.id)[scenario.id] = 1;
    }
    for (const event of scenario.incompatibleEvents) {
      if (!membership.has(event.id)) membership.set(event.id, {});
      membership.get(event.id)[scenario.id] = -1;
    }
  }
  return membership;
}

function vectorFor(eventId, scenarios, membership) {
  const values = membership.get(eventId) || {};
  return scenarios.map(scenario => values[scenario.id] || 0);
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((total, value, index) => total + value * b[index], 0);
  const magnitudeA = Math.sqrt(a.reduce((total, value) => total + value * value, 0));
  const magnitudeB = Math.sqrt(b.reduce((total, value) => total + value * value, 0));
  if (!magnitudeA || !magnitudeB) return 0;
  return Math.round((dot / (magnitudeA * magnitudeB)) * 100) / 100;
}

function isRedundant(eventA, eventB) {
  const firstThreshold = threshold(eventA);
  const secondThreshold = threshold(eventB);
  return (
    firstThreshold !== null &&
    secondThreshold !== null &&
    firstThreshold !== secondThreshold &&
    structuralKey(eventA) === structuralKey(eventB) &&
    normalized(eventA.selezione) === normalized(eventB.selezione)
  );
}

function scenarioNamesFor(a, b, scenarios, predicate) {
  return scenarios
    .filter((scenario, index) => predicate(a[index], b[index]))
    .map(scenario => scenario.name);
}

function causesFor(names, scenarios) {
  const causes = scenarios
    .filter(scenario => names.includes(scenario.name))
    .flatMap(scenario => scenario.rootCauses || []);
  return [...new Set(causes)].slice(0, 4);
}

function relation(eventA, eventB, vectorA, vectorB, scenarios) {
  const score = cosineSimilarity(vectorA, vectorB);
  const shared = scenarioNamesFor(vectorA, vectorB, scenarios, (a, b) => a === 1 && b === 1);
  const opposed = scenarioNamesFor(vectorA, vectorB, scenarios, (a, b) => a * b === -1);
  const sharedExclusions = scenarioNamesFor(
    vectorA,
    vectorB,
    scenarios,
    (a, b) => a === -1 && b === -1
  );

  if (isRedundant(eventA, eventB)) {
    const redundantScore = Math.max(0.9, Math.abs(score));
    return {
      correlationScore: Math.round(redundantScore * 100) / 100,
      type: "REDUNDANT",
      reason: "I due eventi descrivono lo stesso scenario con soglie annidate.",
      footballCause: shared.length
        ? `Entrambi sono sostenuti dagli scenari: ${shared.join(", ")}.`
        : "La stessa dinamica calcistica soddisfa progressivamente entrambe le soglie.",
      scenarios: [...new Set([...shared, ...sharedExclusions])],
    };
  }

  if (score >= 0.25) {
    const names = shared.length ? shared : sharedExclusions;
    return {
      correlationScore: score,
      type: "POSITIVE",
      reason: shared.length
        ? `Gli eventi sono compatibili con gli stessi scenari: ${shared.join(", ")}.`
        : `Gli eventi entrano in conflitto con gli stessi scenari: ${sharedExclusions.join(", ")}.`,
      footballCause: causesFor(names, scenarios).join("; ") || "Condividono lo stesso copione di partita.",
      scenarios: names,
    };
  }

  if (score <= -0.25) {
    return {
      correlationScore: score,
      type: "NEGATIVE",
      reason: `Gli eventi assumono ruoli opposti negli scenari: ${opposed.join(", ")}.`,
      footballCause:
        causesFor(opposed, scenarios).join("; ") ||
        "Quando uno degli eventi è coerente con il copione, l'altro tende a esserne escluso.",
      scenarios: opposed,
    };
  }

  return {
    correlationScore: score,
    type: "NEUTRAL",
    reason: "Gli eventi non condividono abbastanza scenari per stabilire una relazione forte.",
    footballCause: "Dipendono da sviluppi differenti o non determinanti del match.",
    scenarios: [],
  };
}

function redundantGroups(nodes, edges) {
  const adjacency = new Map(nodes.map(node => [node.id, new Set()]));
  edges.filter(edge => edge.type === "REDUNDANT").forEach(edge => {
    adjacency.get(edge.source).add(edge.target);
    adjacency.get(edge.target).add(edge.source);
  });
  const visited = new Set();
  const groups = [];

  for (const node of nodes) {
    if (visited.has(node.id) || adjacency.get(node.id).size === 0) continue;
    const stack = [node.id];
    const members = [];
    visited.add(node.id);
    while (stack.length) {
      const current = stack.pop();
      members.push(current);
      for (const next of adjacency.get(current)) {
        if (!visited.has(next)) {
          visited.add(next);
          stack.push(next);
        }
      }
    }
    groups.push({ id: `redundant-${groups.length + 1}`, nodes: members.sort() });
  }
  return groups;
}

function processMatch(matchKey) {
  const rankingPath = path.join(mvpDirectory, matchKey, "ranking-events.json");
  const scenarioPath = path.join(mvpDirectory, matchKey, "match-scenarios.json");
  if (!fs.existsSync(rankingPath)) throw new Error(`Ranking non trovato: ${rankingPath}`);
  if (!fs.existsSync(scenarioPath)) throw new Error(`Scenari non trovati: ${scenarioPath}`);

  const ranking = JSON.parse(fs.readFileSync(rankingPath, "utf8"));
  const scenarioPayload = JSON.parse(fs.readFileSync(scenarioPath, "utf8"));
  const scenarios = scenarioPayload.scenarios;
  const membership = scenarioMembership(scenarios);

  const nodes = ranking.events.map((event, index) => {
    const id = `event-${String(index + 1).padStart(2, "0")}`;
    return {
      id,
      label: `${event.mercato} | ${event.selezione}`,
      market: event.mercato,
      selection: event.selezione,
      category: event.categoria,
      rankingScore: event.score,
      class: event.classe,
      odds: event.quota,
      scenarioVector: vectorFor(id, scenarios, membership),
    };
  });

  const edges = [];
  for (let i = 0; i < ranking.events.length; i += 1) {
    for (let j = i + 1; j < ranking.events.length; j += 1) {
      edges.push({
        source: nodes[i].id,
        target: nodes[j].id,
        ...relation(
          ranking.events[i],
          ranking.events[j],
          nodes[i].scenarioVector,
          nodes[j].scenarioVector,
          scenarios
        ),
      });
    }
  }

  const graph = {
    match: ranking.match,
    directed: false,
    scenarioOrder: scenarios.map(scenario => ({
      id: scenario.id,
      name: scenario.name,
      estimatedProbability: scenario.estimatedProbability,
    })),
    nodes,
    edges,
    redundantGroups: redundantGroups(nodes, edges),
  };

  const outputPath = path.join(mvpDirectory, matchKey, "matchGraph.json");
  fs.writeFileSync(outputPath, `${JSON.stringify(graph, null, 2)}\n`, "utf8");
  console.log(
    `${ranking.match}: ${nodes.length} nodi, ${edges.length} relazioni scenario-based, ` +
    `${graph.redundantGroups.length} gruppi ridondanti -> ${path.relative(root, outputPath)}`
  );
}

const matches = requestedMatch
  ? [requestedMatch]
  : fs.readdirSync(mvpDirectory)
      .filter(name =>
        fs.existsSync(path.join(mvpDirectory, name, "ranking-events.json")) &&
        fs.existsSync(path.join(mvpDirectory, name, "match-scenarios.json"))
      )
      .sort((a, b) => a.localeCompare(b, "it"));

if (!matches.length) throw new Error("Nessuna coppia ranking/scenari disponibile.");
matches.forEach(processMatch);
