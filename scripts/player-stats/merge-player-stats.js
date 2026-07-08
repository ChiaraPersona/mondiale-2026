#!/usr/bin/env node
const {
  PLAYER_FIELDS,
  PROVIDERS,
  emptyPlayer,
  mergedPath,
  normalizeName,
  parseArgs,
  providerCompletion,
  rawPath,
  readJson,
  requireArgs,
  setValue,
  writeJson
} = require("./lib/common");

const usage = "node scripts/player-stats/merge-player-stats.js --match MATCH_ID";

const FIELD_PRIORITY = {
  role: ["espn", "sofascore", "fotmob", "whoscored"],
  starter: ["espn", "sofascore", "fotmob", "whoscored"],
  minutes: ["espn", "sofascore", "fotmob", "whoscored"],
  minuteIn: ["espn", "sofascore", "fotmob", "whoscored"],
  minuteOut: ["espn", "sofascore", "fotmob", "whoscored"],
  shots: ["espn", "fotmob", "sofascore", "whoscored"],
  shotsOnTarget: ["espn", "fotmob", "sofascore", "whoscored"],
  goals: ["espn", "sofascore", "fotmob", "whoscored"],
  assists: ["espn", "sofascore", "fotmob", "whoscored"],
  xG: ["fotmob", "sofascore", "espn", "whoscored"],
  xA: ["fotmob", "sofascore", "espn", "whoscored"],
  touches: ["sofascore", "fotmob", "whoscored", "espn"],
  touchesInBox: ["sofascore", "fotmob", "whoscored", "espn"],
  passes: ["sofascore", "whoscored", "espn", "fotmob"],
  accuratePasses: ["sofascore", "espn", "whoscored", "fotmob"],
  passAccuracy: ["sofascore", "whoscored", "espn", "fotmob"],
  keyPasses: ["sofascore", "whoscored", "fotmob", "espn"],
  crosses: ["whoscored", "sofascore", "espn", "fotmob"],
  accurateCrosses: ["whoscored", "sofascore", "espn", "fotmob"],
  longBalls: ["whoscored", "sofascore", "espn", "fotmob"],
  accurateLongBalls: ["whoscored", "sofascore", "espn", "fotmob"],
  dribblesAttempted: ["whoscored", "sofascore", "fotmob", "espn"],
  dribblesCompleted: ["whoscored", "sofascore", "fotmob", "espn"],
  foulsCommitted: ["espn", "sofascore", "whoscored", "fotmob"],
  foulsWon: ["espn", "sofascore", "whoscored", "fotmob"],
  offsides: ["espn", "sofascore", "whoscored", "fotmob"],
  tackles: ["sofascore", "whoscored", "espn", "fotmob"],
  interceptions: ["sofascore", "whoscored", "espn", "fotmob"],
  clearances: ["sofascore", "whoscored", "espn", "fotmob"],
  groundDuelsWon: ["sofascore", "whoscored", "espn", "fotmob"],
  groundDuelsTotal: ["sofascore", "whoscored", "espn", "fotmob"],
  aerialDuelsWon: ["whoscored", "sofascore", "espn", "fotmob"],
  aerialDuelsTotal: ["whoscored", "sofascore", "espn", "fotmob"],
  yellowCards: ["espn", "sofascore", "whoscored", "fotmob"],
  redCards: ["espn", "sofascore", "whoscored", "fotmob"],
  rating: ["sofascore", "fotmob", "whoscored", "espn"]
};

function providerRank(field, provider) {
  const list = FIELD_PRIORITY[field] || PROVIDERS;
  const index = list.indexOf(provider);
  return index === -1 ? 999 : index;
}

function readProvider(matchId, provider) {
  try {
    return readJson(rawPath(provider, matchId));
  } catch (error) {
    return {
      provider,
      matchId,
      completion: 0,
      errors: [`Raw ${provider} non trovato: ${error.message}`],
      teams: {}
    };
  }
}

function candidateKey(teamName, player) {
  return `${normalizeName(teamName)}::${normalizeName(player.name)}`;
}

function ensureMergedPlayer(map, teamName, sourcePlayer) {
  const key = candidateKey(teamName, sourcePlayer);
  if (!map.has(key)) {
    const player = emptyPlayer();
    setValue(player, "name", sourcePlayer.name, "merge");
    map.set(key, { teamName, player, candidates: [] });
  }
  return map.get(key);
}

function mergeCandidate(target, sourcePlayer, provider) {
  target.candidates.push(provider);
  for (const field of PLAYER_FIELDS) {
    if (field === "name") continue;
    const value = sourcePlayer[field];
    if (value === null || value === undefined || value === "") continue;
    const currentSource = target.player.sources[field];
    const shouldOverwrite = currentSource && providerRank(field, provider) < providerRank(field, String(currentSource).toLowerCase());
    setValue(target.player, field, value, provider.toUpperCase(), shouldOverwrite);
  }
}

function merge(matchId) {
  const providerData = Object.fromEntries(PROVIDERS.map((provider) => [provider, readProvider(matchId, provider)]));
  const mergedPlayers = new Map();
  const metaSource = providerData.espn || Object.values(providerData).find(Boolean);

  for (const provider of PROVIDERS) {
    const raw = providerData[provider];
    for (const [teamName, team] of Object.entries(raw.teams || {})) {
      for (const sourcePlayer of team.players || []) {
        if (!sourcePlayer.name) continue;
        const target = ensureMergedPlayer(mergedPlayers, teamName, sourcePlayer);
        mergeCandidate(target, sourcePlayer, provider);
      }
    }
  }

  const teams = {};
  for (const { teamName, player, candidates } of mergedPlayers.values()) {
    if (!teams[teamName]) teams[teamName] = { players: [] };
    player.providerCandidates = [...new Set(candidates.map((provider) => provider.toUpperCase()))];
    teams[teamName].players.push(player);
  }

  for (const team of Object.values(teams)) {
    team.players.sort((a, b) => {
      if (a.starter !== b.starter) return a.starter === true ? -1 : 1;
      return String(a.name).localeCompare(String(b.name));
    });
  }

  const allPlayers = Object.values(teams).flatMap((team) => team.players);
  const nullFields = {};
  for (const field of PLAYER_FIELDS.filter((item) => item !== "name")) {
    const missing = allPlayers.filter((player) => player[field] === null || player[field] === undefined || player[field] === "").map((player) => player.name);
    if (missing.length) nullFields[field] = missing;
  }

  return {
    matchId,
    provider: "Merged",
    competition: metaSource.competition || null,
    round: metaSource.round || null,
    date: metaSource.date || null,
    homeTeam: metaSource.homeTeam || null,
    awayTeam: metaSource.awayTeam || null,
    score: metaSource.score || null,
    generatedAt: new Date().toISOString(),
    providers: Object.fromEntries(PROVIDERS.map((provider) => [
      provider,
      {
        completion: providerData[provider].completion || 0,
        errors: providerData[provider].errors || [],
        log: providerData[provider].log || []
      }
    ])),
    completion: providerCompletion(allPlayers),
    nullFields,
    teams
  };
}

function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["match"], usage);
  const result = merge(args.match);
  const output = args.output || mergedPath(args.match);
  writeJson(output, result);
  console.log(`Merged: ${output}`);
  console.log(`completion=${result.completion}%`);
  for (const provider of PROVIDERS) {
    console.log(`${provider}=${result.providers[provider].completion}% errors=${result.providers[provider].errors.length}`);
  }
}

if (require.main === module) main();

module.exports = { merge };
