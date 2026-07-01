#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const ACTIVE_DIR = path.join(ROOT, "data", "active");
const ARCHIVE_DIR = path.join(ROOT, "data", "archive", "world-cup-2026");
const TEAM_ARCHIVE_DIR = path.join(ARCHIVE_DIR, "eliminated-teams");
const PLAYER_ARCHIVE_DIR = path.join(ARCHIVE_DIR, "eliminated-players");

const GROUP_ELIMINATION_DATES = {
  A: "2026-06-25", B: "2026-06-24", C: "2026-06-24", D: "2026-06-26",
  E: "2026-06-25", F: "2026-06-26", G: "2026-06-27", H: "2026-06-27",
  I: "2026-06-26", J: "2026-06-28", K: "2026-06-28", L: "2026-06-27"
};
const ROUND_OF_32_DATES = {
  73: "2026-06-28", 74: "2026-06-29", 75: "2026-06-30", 76: "2026-06-29",
  77: "2026-06-30", 78: "2026-06-30", 79: "2026-07-01"
};

function readScript(file, names) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(ROOT, file), "utf8"), context, { filename: file });
  return Object.fromEntries(names.map((name) => [name, vm.runInContext(name, context)]));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function writeJs(file, declarations) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const body = Object.entries(declarations)
    .map(([name, value]) => `const ${name} = ${JSON.stringify(value)};`)
    .join("\n");
  fs.writeFileSync(file, `${body}\n`, "utf8");
}

function slugify(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function pickObject(source, teams) {
  return Object.fromEntries(Object.entries(source || {}).filter(([team]) => teams.has(team)));
}

function teamOf(value) {
  return value && (value.team || value.squadra || value.nazionale);
}

const { rows } = readScript("js/data.js", ["rows"]);
const { playerStats } = readScript("js/stats.js", ["playerStats"]);
const { teamStatsData } = readScript("js/team-stats-data.js", ["teamStatsData"]);
const { cardRiskPlayers, cardRiskFormula } = readScript(
  "js/card-risk-data.js", ["cardRiskPlayers", "cardRiskFormula"]
);
const { probableFormations } = readScript("js/formations.js", ["probableFormations"]);
const {
  formationTierLabels, formationInsights, formationSpotlights
} = readScript("js/formations-insights.js", [
  "formationTierLabels", "formationInsights", "formationSpotlights"
]);
const { teamInsights } = readScript("js/team-insights.js", ["teamInsights"]);
const { fifaRankingData } = readScript("js/fifa-rankings.js", ["fifaRankingData"]);
const { penaltyTakers } = readScript("js/penalty-takers.js", ["penaltyTakers"]);
const { teamCaptains } = readScript("js/captains.js", ["teamCaptains"]);
const {
  psychologicalFactors, playoffMotivationProfiles, playoffMotivationEvents
} = readScript("js/psychological-factors.js", [
  "psychologicalFactors", "playoffMotivationProfiles", "playoffMotivationEvents"
]);
const bracket = JSON.parse(fs.readFileSync(path.join(ROOT, "data", "codex-plus-bracket.json"), "utf8"));

const allTeams = [...new Set(rows.map((row) => row.team))];
const r32Matches = [...(bracket.left?.r32 || []), ...(bracket.right?.r32 || [])];
const r32Teams = new Set(r32Matches.flatMap((match) => [match.teamA, match.teamB]));
const finishedR32 = r32Matches.filter((match) => ROUND_OF_32_DATES[match.number]);
const r32Eliminated = new Map(finishedR32.map((match) => [
  match.winner === match.teamA ? match.teamB : match.teamA,
  ROUND_OF_32_DATES[match.number]
]));
const groupEliminated = allTeams.filter((team) => !r32Teams.has(team));
const eliminatedTeams = new Set([...groupEliminated, ...r32Eliminated.keys()]);
const activeTeams = new Set(allTeams.filter((team) => !eliminatedTeams.has(team)));

const statsEntries = Object.entries(playerStats);
const activeRows = rows.filter((row) => activeTeams.has(row.team));
const activePlayerNames = new Set(activeRows.map((row) => row.player));

const activeSpotlights = {};
for (const [key, values] of Object.entries(formationSpotlights || {})) {
  if (!Array.isArray(values)) {
    activeSpotlights[key] = values;
  } else if (/team/i.test(key)) {
    activeSpotlights[key] = values.filter((value) => activeTeams.has(value));
  } else {
    activeSpotlights[key] = values.filter((value) =>
      [...activePlayerNames].some((name) => {
        const surname = name.split(/\s+/).filter(Boolean).at(-1);
        return surname && String(value).toLowerCase().includes(surname.toLowerCase());
      })
    );
  }
}

const activeFifaRankingData = {
  ...fifaRankingData,
  rankings: (fifaRankingData.rankings || []).filter((row) =>
    activeTeams.has(row.team === "USA" ? "Stati Uniti" : row.team)
  )
};

const activeDeclarations = {
  "data.js": { rows: activeRows },
  "stats.js": {
    playerStats: Object.fromEntries(statsEntries.filter(([, value]) => activeTeams.has(teamOf(value))))
  },
  "team-stats-data.js": {
    teamStatsData: teamStatsData.filter((value) => activeTeams.has(teamOf(value)))
  },
  "card-risk-data.js": {
    cardRiskPlayers: cardRiskPlayers.filter((value) => activeTeams.has(teamOf(value))),
    cardRiskFormula
  },
  "formations.js": { probableFormations: pickObject(probableFormations, activeTeams) },
  "formations-insights.js": {
    formationTierLabels,
    formationInsights: pickObject(formationInsights, activeTeams),
    formationSpotlights: activeSpotlights
  },
  "team-insights.js": { teamInsights: pickObject(teamInsights, activeTeams) },
  "fifa-rankings.js": { fifaRankingData: activeFifaRankingData },
  "penalty-takers.js": { penaltyTakers: pickObject(penaltyTakers, activeTeams) },
  "captains.js": { teamCaptains: pickObject(teamCaptains, activeTeams) },
  "psychological-factors.js": {
    psychologicalFactors: pickObject(psychologicalFactors, activeTeams),
    playoffMotivationProfiles: pickObject(playoffMotivationProfiles, activeTeams),
    playoffMotivationEvents
  }
};

for (const [file, declarations] of Object.entries(activeDeclarations)) {
  writeJs(path.join(ACTIVE_DIR, file), declarations);
}

const archiveEntries = [...eliminatedTeams].sort().map((team) => {
  const slug = slugify(team);
  const roster = rows.filter((row) => row.team === team);
  const archivedStats = Object.fromEntries(statsEntries.filter(([, value]) => teamOf(value) === team));
  const eliminationDate = r32Eliminated.get(team) ||
    GROUP_ELIMINATION_DATES[roster[0]?.group] || null;
  const stage = r32Eliminated.has(team) ? "Sedicesimi di finale" : "Fase a gironi";
  const teamPath = `eliminated-teams/${slug}.json`;
  const playerPath = `eliminated-players/${slug}.json`;

  writeJson(path.join(ARCHIVE_DIR, teamPath), {
    team,
    group: roster[0]?.group || null,
    eliminationDate,
    stage,
    teamStats: teamStatsData.find((value) => teamOf(value) === team) || null,
    probableFormation: probableFormations[team] || null,
    formationInsight: formationInsights[team] || null,
    teamInsight: teamInsights[team] || null,
    penaltyTakers: penaltyTakers[team] || [],
    captains: teamCaptains[team] || [],
    psychologicalFactors: psychologicalFactors[team] || null
  });
  writeJson(path.join(ARCHIVE_DIR, playerPath), {
    team,
    eliminationDate,
    roster,
    playerStats: archivedStats,
    cardRiskPlayers: cardRiskPlayers.filter((value) => teamOf(value) === team)
  });

  return {
    team,
    group: roster[0]?.group || null,
    stage,
    eliminationDate,
    teamArchive: `data/archive/world-cup-2026/${teamPath}`,
    playerArchive: `data/archive/world-cup-2026/${playerPath}`,
    playerCount: roster.length
  };
});

writeJson(path.join(ARCHIVE_DIR, "archive-index.json"), {
  tournament: "FIFA World Cup 2026",
  generatedAt: new Date().toISOString(),
  strategy: "Copia non distruttiva: i dataset sorgente in js/ restano invariati.",
  eliminatedTeamCount: archiveEntries.length,
  teams: archiveEntries
});
writeJson(path.join(ACTIVE_DIR, "team-index.json"), {
  tournament: "FIFA World Cup 2026",
  generatedAt: new Date().toISOString(),
  activeTeamCount: activeTeams.size,
  teams: [...activeTeams].sort()
});

console.log(`Archiviate ${archiveEntries.length} squadre; ${activeTeams.size} restano attive.`);
console.log(`Bundle attivi scritti in ${path.relative(ROOT, ACTIVE_DIR)}.`);
