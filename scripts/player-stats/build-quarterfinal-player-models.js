const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..", "..");
const mergedDir = path.join(root, "data", "player-stats", "merged");
const playerStatsDir = path.join(root, "data", "player-stats");
const intelligenceDir = path.join(root, "data", "mycombo-intelligence");
const mycomboDir = path.join(root, "data", "mycombo");

const numericWeightByLabel = {
  "Medio-basso": 0.55,
  Medio: 0.65,
  Alto: 0.82,
  "Molto alto": 0.95,
};

const matchContextOverrides = {
  "spain-cape-verde-2026": {
    round: "Group stage",
    tipoPartita: "girone",
    livelloAvversario: "basso-medio",
    statoAvversario: "molto difensivo, blocco basso",
    statoGara: "Spagna dominante ma poco concreta",
    pesoModello: 0.45,
  },
  "spain-saudi-arabia-2026": {
    round: "Group stage",
    tipoPartita: "girone",
    livelloAvversario: "basso-medio",
    statoAvversario: "difensivo, concede possesso e campo",
    statoGara: "gara chiusa presto e dominata",
    pesoModello: 0.6,
  },
  "uruguay-spain-2026": {
    round: "Group stage",
    tipoPartita: "girone contro avversario forte",
    livelloAvversario: "alto",
    statoAvversario: "fisico, aggressivo, intenso nei duelli",
    statoGara: "partita tesa e sporca",
    pesoModello: 0.7,
  },
  "spain-austria-2026-07-02": {
    round: "Round of 32",
    tipoPartita: "eliminazione diretta",
    livelloAvversario: "medio-alto",
    statoAvversario: "fisico, organizzato, aggressivo nei duelli",
    statoGara: "Spagna dominante, vantaggio gestito",
    pesoModello: 0.82,
  },
  "portugal-spain-2026-07-06": {
    round: "Round of 16",
    tipoPartita: "eliminazione diretta",
    livelloAvversario: "elite",
    statoAvversario: "tecnico, organizzato, possesso medio-alto",
    statoGara: "partita chiusa/equilibrata, pochi spazi, gol Spagna nel finale",
    pesoModello: 1,
  },
};

const quarterfinals = [
  {
    matchId: "spain-belgium-2026-07-10",
    match: "Spagna-Belgio",
    date: "2026-07-10",
    quoteFile: "data/quote/spagna-belgio-quote.json",
    teams: [
      {
        team: "Spain",
        displayName: "Spagna",
        requiredMatches: [
          "spain-cape-verde-2026",
          "spain-saudi-arabia-2026",
          "uruguay-spain-2026",
          "spain-austria-2026-07-02",
          "portugal-spain-2026-07-06",
        ],
      },
      {
        team: "Belgium",
        displayName: "Belgio",
        requiredMatches: [
          "nuova-zelanda-belgio",
          "stati-uniti-belgio",
          "belgio-senegal",
          "belgio-iran",
          null,
        ],
      },
    ],
  },
  {
    matchId: "norway-england-2026-07-11",
    match: "Norvegia-Inghilterra",
    date: "2026-07-11",
    quoteFile: "data/quote/norvegia-inghilterra-quote.json",
    teams: [
      {
        team: "Norway",
        displayName: "Norvegia",
        requiredMatches: [
          "costa-avorio-norvegia",
          "norvegia-senegal",
          "brasile-norvegia",
          "norvegia-francia",
          null,
        ],
      },
      {
        team: "England",
        displayName: "Inghilterra",
        requiredMatches: [
          "panama-inghilterra",
          "messico-inghilterra",
          "inghilterra-ghana",
          "inghilterra-rd-congo",
          null,
        ],
      },
    ],
  },
  {
    matchId: "argentina-switzerland-2026-07-11",
    match: "Argentina-Svizzera",
    date: "2026-07-11",
    quoteFile: "data/quote/argentina-svizzera-quote.json",
    teams: [
      {
        team: "Argentina",
        displayName: "Argentina",
        requiredMatches: [
          "argentina-capo-verde",
          "giordania-argentina",
          "argentina-egitto",
          "argentina-austria",
          null,
        ],
      },
      {
        team: "Switzerland",
        displayName: "Svizzera",
        requiredMatches: [
          "svizzera-algeria",
          "svizzera-canada",
          "svizzera-colombia",
          null,
          null,
        ],
      },
    ],
  },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, payload) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

function mergedPath(matchId) {
  return path.join(mergedDir, `${matchId}.json`);
}

function existingMerged(matchId) {
  if (!matchId) return null;
  const file = mergedPath(matchId);
  return fs.existsSync(file) ? file : null;
}

function opponentForMatch(match, team) {
  if (match.homeTeam === team) return match.awayTeam;
  if (match.awayTeam === team) return match.homeTeam;
  return null;
}

function contextForMatch(matchId, match, team) {
  const override = matchContextOverrides[matchId] || {};
  return {
    match: `${match.homeTeam} vs ${match.awayTeam}`,
    opponent: opponentForMatch(match, team),
    round: override.round || match.round || null,
    tipoPartita: override.tipoPartita || "n/d",
    livelloAvversario: override.livelloAvversario || "n/d",
    statoAvversario: override.statoAvversario || "n/d",
    statoGara: override.statoGara || "n/d",
    pesoModello: override.pesoModello ?? numericWeightByLabel[override.modelWeight] ?? null,
  };
}

function valueOrNull(value) {
  return Number.isFinite(Number(value)) ? Number(value) : null;
}

function sumKnown(values) {
  const known = values.filter(value => value !== null && Number.isFinite(Number(value)));
  return known.length ? known.reduce((total, value) => total + Number(value), 0) : null;
}

function weightedPer90(matches, field) {
  const usable = matches.filter(match =>
    Number.isFinite(Number(match.minutes)) &&
    Number(match.minutes) > 0 &&
    Number.isFinite(Number(match.matchContext?.pesoModello)) &&
    Number.isFinite(Number(match[field]))
  );
  const weightedMinutes = usable.reduce(
    (total, match) => total + Number(match.minutes) * Number(match.matchContext.pesoModello),
    0
  );
  if (!weightedMinutes) return null;
  const weightedTotal = usable.reduce(
    (total, match) => total + Number(match[field]) * Number(match.matchContext.pesoModello),
    0
  );
  return Math.round((weightedTotal / weightedMinutes) * 90 * 100) / 100;
}

function cardRisk(matches) {
  const yellowPer90 = weightedPer90(matches, "cards");
  const foulsPer90 = weightedPer90(matches, "foulsCommitted");
  if (yellowPer90 === null && foulsPer90 === null) return null;
  const score = (yellowPer90 || 0) * 55 + (foulsPer90 || 0) * 14;
  return Math.round(Math.max(0, Math.min(100, score)));
}

function attackingIndex(matches) {
  const shots = weightedPer90(matches, "shots");
  const shotsOnTarget = weightedPer90(matches, "shotsOnTarget");
  const keyPasses = weightedPer90(matches, "keyPasses");
  if (shots === null && shotsOnTarget === null && keyPasses === null) return null;
  const score =
    Math.min(50, (shots || 0) * 10) +
    Math.min(35, (shotsOnTarget || 0) * 14) +
    Math.min(15, (keyPasses || 0) * 5);
  return Math.round(Math.max(0, Math.min(100, score)));
}

function buildTeamModel(teamConfig) {
  const missingMatches = [];
  const unknownMatches = [];
  const playerMap = new Map();

  for (const matchId of teamConfig.requiredMatches) {
    if (!matchId) {
      unknownMatches.push({
        matchId: null,
        reason: "MatchId non ancora identificato per una delle 5 partite richieste.",
      });
      continue;
    }

    const file = existingMerged(matchId);
    if (!file) {
      missingMatches.push({
        matchId,
        expectedFile: `data/player-stats/merged/${matchId}.json`,
      });
      continue;
    }

    const match = readJson(file);
    const teamData = match.teams?.[teamConfig.team];
    if (!teamData?.players?.length) {
      missingMatches.push({
        matchId,
        expectedTeam: teamConfig.team,
        reason: "File merged presente ma squadra non trovata.",
      });
      continue;
    }

    const context = contextForMatch(matchId, match, teamConfig.team);
    for (const row of teamData.players) {
      const key = row.name;
      if (!playerMap.has(key)) {
        playerMap.set(key, {
          player: row.name,
          team: teamConfig.team,
          role: row.role || null,
          matches: [],
        });
      }
      const player = playerMap.get(key);
      if (!player.role && row.role) player.role = row.role;
      player.matches.push({
        matchId,
        match: context.match,
        opponent: context.opponent,
        round: context.round,
        minutes: valueOrNull(row.minutes),
        goals: valueOrNull(row.goals),
        assists: valueOrNull(row.assists),
        shots: valueOrNull(row.shots),
        shotsOnTarget: valueOrNull(row.shotsOnTarget),
        keyPasses: valueOrNull(row.keyPasses),
        dribblesAttempted: valueOrNull(row.dribblesAttempted),
        dribblesCompleted: valueOrNull(row.dribblesCompleted),
        foulsDrawn: valueOrNull(row.foulsWon),
        foulsCommitted: valueOrNull(row.foulsCommitted),
        cards: sumKnown([valueOrNull(row.yellowCards), valueOrNull(row.redCards)]),
        yellowCards: valueOrNull(row.yellowCards),
        redCards: valueOrNull(row.redCards),
        matchContext: {
          tipoPartita: context.tipoPartita,
          livelloAvversario: context.livelloAvversario,
          statoAvversario: context.statoAvversario,
          statoGara: context.statoGara,
          pesoModello: context.pesoModello,
        },
        sources: row.sources || {},
      });
    }
  }

  const players = [...playerMap.values()]
    .map(player => ({
      ...player,
      weightedAverages: {
        shotsPer90: weightedPer90(player.matches, "shots"),
        shotsOnTargetPer90: weightedPer90(player.matches, "shotsOnTarget"),
        keyPassesPer90: weightedPer90(player.matches, "keyPasses"),
        foulsDrawnPer90: weightedPer90(player.matches, "foulsDrawn"),
        foulsCommittedPer90: weightedPer90(player.matches, "foulsCommitted"),
        cardRisk: cardRisk(player.matches),
        attackingIndex: attackingIndex(player.matches),
      },
    }))
    .sort((a, b) =>
      (b.weightedAverages.attackingIndex || 0) - (a.weightedAverages.attackingIndex || 0) ||
      (b.weightedAverages.shotsPer90 || 0) - (a.weightedAverages.shotsPer90 || 0) ||
      a.player.localeCompare(b.player)
    );

  return {
    team: teamConfig.team,
    displayName: teamConfig.displayName,
    requiredMatches: teamConfig.requiredMatches,
    availableMergedMatches: teamConfig.requiredMatches.filter(matchId => existingMerged(matchId)).length,
    requiredMergedMatches: 5,
    missingMatches,
    unknownMatches,
    players,
  };
}

function completionForQuarter(teams) {
  const required = teams.length * 5;
  const available = teams.reduce((total, team) => total + team.availableMergedMatches, 0);
  return Math.round((available / required) * 1000) / 10;
}

function buildPlayerStatsFile(config) {
  const teams = config.teams.map(buildTeamModel);
  const completion = completionForQuarter(teams);
  return {
    matchId: config.matchId,
    match: config.match,
    date: config.date,
    status: completion === 100 ? "complete" : "partial_missing_merged_player_stats",
    flow: [
      "player-stats raw match-by-match",
      "weighted player model",
      "match reading / lettura",
      "betting intelligence",
      "mycombo safe / balanced / aggressive",
    ],
    weightingRules: {
      gironeFacileConTurnover: 0.45,
      gironeControAvversarioForte: 0.7,
      sedicesimo: 0.8,
      ottavo: 0.9,
      partitaEquilibrataKnockout: 1,
      garaChiusaPresto: 0.6,
      supplementari: 1.1,
    },
    dataPolicy: {
      noEstimates: true,
      missingStatsRemainNull: true,
      missingMergedMatchesBlockMyCombo: true,
    },
    completion,
    teams,
  };
}

function topPlayers(team, field, limit = 8) {
  return [...team.players]
    .filter(player => Number.isFinite(Number(player.weightedAverages?.[field])))
    .sort((a, b) => Number(b.weightedAverages[field]) - Number(a.weightedAverages[field]))
    .slice(0, limit)
    .map(player => ({
      player: player.player,
      team: player.team,
      role: player.role,
      value: player.weightedAverages[field],
      minutesSample: player.matches.reduce((total, match) => total + (Number(match.minutes) || 0), 0),
    }));
}

function buildIntelligenceFile(config, playerStats) {
  const allTeamsComplete = playerStats.completion === 100;
  return {
    matchId: config.matchId,
    match: config.match,
    date: config.date,
    status: allTeamsComplete ? "ready_for_market_evaluator" : "waiting_player_stats",
    sourcePlayerStats: `data/player-stats/${config.matchId}.json`,
    sourceQuote: config.quoteFile,
    dataPolicy: playerStats.dataPolicy,
    completion: playerStats.completion,
    missingInputs: playerStats.teams.flatMap(team =>
      [...team.missingMatches, ...team.unknownMatches].map(item => ({
        team: team.team,
        ...item,
      }))
    ),
    playerSignalsSeed: playerStats.teams.flatMap(team => [
      ...topPlayers(team, "shotsPer90").map(row => ({ marketType: "player_shots", ...row })),
      ...topPlayers(team, "shotsOnTargetPer90").map(row => ({ marketType: "player_shots_on_target", ...row })),
      ...topPlayers(team, "foulsDrawnPer90").map(row => ({ marketType: "player_fouls_drawn", ...row })),
      ...topPlayers(team, "foulsCommittedPer90").map(row => ({ marketType: "player_fouls_committed", ...row })),
      ...topPlayers(team, "cardRisk").map(row => ({ marketType: "player_cards", ...row })),
    ]),
    nextStep: allTeamsComplete
      ? "Applicare Market Evaluator V1 e filtrare solo mercati presenti nelle quote Sisal."
      : "Scaricare/mergiare i player-stats mancanti prima di generare MyCombo.",
  };
}

function buildMyComboPlaceholder(config, playerStats, intelligence) {
  return {
    matchId: config.matchId,
    match: config.match,
    date: config.date,
    status: playerStats.completion === 100 ? "not_generated" : "blocked_missing_player_stats",
    sourcePlayerStats: `data/player-stats/${config.matchId}.json`,
    sourceIntelligence: `data/mycombo-intelligence/${config.matchId}.json`,
    sourceQuote: config.quoteFile,
    completion: playerStats.completion,
    safe: null,
    balanced: null,
    aggressive: null,
    blockedReason: intelligence.missingInputs.length
      ? "Mancano merged player-by-player delle 5 partite richieste per almeno una squadra."
      : null,
    missingInputs: intelligence.missingInputs,
  };
}

for (const config of quarterfinals) {
  const playerStats = buildPlayerStatsFile(config);
  const intelligence = buildIntelligenceFile(config, playerStats);
  const mycombo = buildMyComboPlaceholder(config, playerStats, intelligence);

  writeJson(path.join(playerStatsDir, `${config.matchId}.json`), playerStats);
  writeJson(path.join(intelligenceDir, `${config.matchId}.json`), intelligence);
  writeJson(path.join(mycomboDir, `${config.matchId}.json`), mycombo);

  console.log(`${config.matchId}: ${playerStats.completion}% completamento`);
}
