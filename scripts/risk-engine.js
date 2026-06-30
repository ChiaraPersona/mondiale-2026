const portfolioRiskLimits = Object.freeze({
  safe: Object.freeze({
    range: [4.5, 5.5],
    maxSingleOdds: 1.80,
    maxAverageRisk: 42,
    maxEventRisk: 62,
    maxHighRiskEvents: 0,
    minEvents: 4,
    maxEvents: 8,
  }),
  balanced: Object.freeze({
    range: [9, 11],
    maxSingleOdds: 2.20,
    maxAverageRisk: 52,
    maxEventRisk: 72,
    maxHighRiskEvents: 0,
    minEvents: 5,
    maxEvents: 7,
  }),
  aggressive: Object.freeze({
    range: [18, 22],
    maxSingleOdds: 2.80,
    maxAverageRisk: 62,
    maxEventRisk: 86,
    maxHighRiskEvents: 1,
    minEvents: 5,
    maxEvents: 8,
  }),
});

function clamp(value, minimum = 0, maximum = 100) {
  return Math.max(minimum, Math.min(maximum, value));
}

function round(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function normalized(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase();
}

function oddsRisk(odds) {
  if (odds <= 1.10) return 8;
  if (odds <= 1.25) return 16;
  if (odds <= 1.50) return 28;
  if (odds <= 1.80) return 42;
  if (odds <= 2.20) return 58;
  if (odds <= 2.70) return 72;
  return clamp(84 + (odds - 2.70) * 7, 84, 100);
}

function eventRisk(event) {
  const odds = Number(event.odds ?? event.quota);
  const market = normalized(event.market ?? event.mercato);
  const category = normalized(event.category ?? event.categoria);
  const reasons = [];
  let score = oddsRisk(Number.isFinite(odds) ? odds : 10);

  const categoryRisk = {
    ESITO: 2,
    GOAL: 5,
    CORNER: 8,
    TIRI: 10,
    CARTELLINI: 15,
    GIOCATORI: 14,
  }[category] ?? 8;
  score += categoryRisk;

  const isTeamMarket = /SQUADRA|TEAM\s*[12]/.test(market);
  const isPlayerMarket =
    !isTeamMarket &&
    /(GIOCATORE|CARTELLINO O SUO SOST|TIRI TOTALI E SUO SOST|MARCATORE|SEGNA|ASSIST)/.test(market);
  const minuteSensitive = isPlayerMarket && /(TIRI|CARTELLINO|MARCATORE|SEGNA|ASSIST)/.test(market);
  const complexMarket = /(COMBO|SUPERCOMBO|MULTIGOAL|METODO|INTERVALLO|RISULTATO ESATTO)/.test(market);
  const volatileMarket = /(CARTELLINO|MARCATORE|RISULTATO ESATTO|PRIMA A|RIGORE|ESPULS)/.test(market);

  if (isPlayerMarket) {
    score += 10;
    reasons.push("Dipende dal rendimento di un singolo giocatore.");
  }
  if (minuteSensitive) {
    score += 7;
    reasons.push("Sensibile a titolarità, minutaggio e sostituzioni.");
  }
  if (complexMarket) {
    score += 9;
    reasons.push("Mercato composto o ad alta complessità.");
  }
  if (volatileMarket) {
    score += 10;
    reasons.push("Mercato ad alta varianza episodica.");
  }
  if (event.class === "SPECULATIVE" || event.classe === "SPECULATIVE") {
    score += 12;
    reasons.push("Evento classificato SPECULATIVE.");
  } else if (event.class === "VALUE" || event.classe === "VALUE") {
    score += 4;
  }

  const riskScore = Math.round(clamp(score));
  return {
    riskScore,
    riskLevel: riskScore >= 70 ? "high" : riskScore >= 45 ? "medium" : "low",
    riskReasons: reasons,
    isPlayerMarket,
    minuteSensitive,
    complexMarket,
    volatileMarket,
  };
}

function withEventRisk(event) {
  return { ...event, ...eventRisk(event) };
}

function portfolioRisk(events, edges = null) {
  const enriched = events.map(withEventRisk);
  if (!enriched.length) {
    return {
      averageRisk: null,
      maxEventRisk: null,
      maxSingleOdds: null,
      riskConcentration: "none",
      numberOfEvents: 0,
      highRiskEvents: 0,
    };
  }

  const averageRisk = enriched.reduce((total, event) => total + event.riskScore, 0) / enriched.length;
  const maxEventRisk = Math.max(...enriched.map(event => event.riskScore));
  const maxSingleOdds = Math.max(...enriched.map(event => Number(event.odds ?? event.quota)));
  const highRiskEvents = enriched.filter(event => event.riskScore >= 70).length;
  const categoryCounts = new Map();
  enriched.forEach(event => {
    const key = String(event.category ?? event.categoria ?? "altro");
    categoryCounts.set(key, (categoryCounts.get(key) || 0) + 1);
  });
  const largestCategory = Math.max(...categoryCounts.values()) / enriched.length;
  let strongDependencies = 0;
  let pairs = 0;
  if (edges) {
    for (let first = 0; first < enriched.length; first += 1) {
      for (let second = first + 1; second < enriched.length; second += 1) {
        const key = [enriched[first].id, enriched[second].id].sort().join("|");
        const edge = edges.get(key);
        pairs += 1;
        if (edge?.type === "POSITIVE" && Number(edge.correlationScore) >= 0.8) strongDependencies += 1;
      }
    }
  }
  const dependencyShare = pairs ? strongDependencies / pairs : 0;
  const concentrationValue = Math.max(largestCategory, dependencyShare);
  const riskConcentration = concentrationValue >= 0.67 ? "high" : concentrationValue >= 0.45 ? "medium" : "low";
  return {
    averageRisk: Math.round(averageRisk),
    maxEventRisk,
    maxSingleOdds: round(maxSingleOdds),
    riskConcentration,
    numberOfEvents: enriched.length,
    highRiskEvents,
  };
}

function riskVerdict(profile) {
  if (!profile?.numberOfEvents) return "high";
  if (
    profile.averageRisk >= 60 ||
    profile.maxEventRisk >= 85 ||
    profile.highRiskEvents >= 2
  ) return "high";
  if (
    profile.averageRisk >= 42 ||
    profile.maxEventRisk >= 68 ||
    profile.highRiskEvents === 1
  ) return "medium";
  return "low";
}

function portfolioRiskNotes(profile, limits, events) {
  const notes = [];
  if (!profile.numberOfEvents) return ["Nessun evento disponibile per calcolare il rischio."];
  if (profile.maxSingleOdds > limits.maxSingleOdds) {
    notes.push(`Quota singola massima ${profile.maxSingleOdds} oltre il limite ${limits.maxSingleOdds}.`);
  }
  if (profile.averageRisk > limits.maxAverageRisk) {
    notes.push(`Rischio medio ${profile.averageRisk}/100 oltre il limite ${limits.maxAverageRisk}/100.`);
  }
  if (profile.maxEventRisk > limits.maxEventRisk) {
    notes.push(`Evento con rischio ${profile.maxEventRisk}/100 oltre il massimo consentito.`);
  }
  if (profile.highRiskEvents > limits.maxHighRiskEvents) {
    notes.push(`${profile.highRiskEvents} eventi ad alto rischio; massimo consentito ${limits.maxHighRiskEvents}.`);
  }
  if (profile.riskConcentration === "high") {
    notes.push("Rischio concentrato su mercati o dinamiche troppo simili.");
  }
  events
    .map(withEventRisk)
    .filter(event => event.riskScore >= 70)
    .forEach(event => notes.push(`Evento ad alto rischio: ${event.market ?? event.mercato} (${event.riskScore}/100).`));
  if (!notes.length) notes.push("Profilo entro tutti i limiti di rischio configurati.");
  return notes;
}

function assessPortfolio(events, portfolioId, edges = null) {
  const limits = portfolioRiskLimits[portfolioId];
  if (!limits) throw new Error(`Limiti rischio mancanti per ${portfolioId}.`);
  const riskProfile = portfolioRisk(events, edges);
  const riskNotes = portfolioRiskNotes(riskProfile, limits, events);
  const allowed =
    riskProfile.numberOfEvents > 0 &&
    riskProfile.maxSingleOdds <= limits.maxSingleOdds &&
    riskProfile.averageRisk <= limits.maxAverageRisk &&
    riskProfile.maxEventRisk <= limits.maxEventRisk &&
    riskProfile.highRiskEvents <= limits.maxHighRiskEvents;
  return { allowed, riskProfile, riskVerdict: riskVerdict(riskProfile), riskNotes, limits };
}

module.exports = {
  portfolioRiskLimits,
  eventRisk,
  withEventRisk,
  portfolioRisk,
  riskVerdict,
  portfolioRiskNotes,
  assessPortfolio,
};
