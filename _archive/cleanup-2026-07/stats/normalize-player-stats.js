#!/usr/bin/env node
const path = require("path");
const { parseArgs, requireArgs } = require("./lib/cli");
const { readJson, writeJson } = require("./lib/files");
const { emptyPlayer, playerCompleteness, toNumber } = require("./lib/schema");

const usage = [
  "Uso:",
  "node scripts/stats/normalize-player-stats.js --input data/player-stats/raw/portugal-spain-2026-07-06.json --output data/player-stats/normalized/portugal-spain-2026-07-06.json"
].join("\n");

function basenameProvider(provider) {
  const normalized = String(provider || "").toLowerCase();
  if (normalized === "whoscored") return "WhoScored";
  if (normalized === "fotmob") return "FotMob";
  if (normalized === "sofascore") return "SofaScore";
  if (normalized === "espn") return "ESPN";
  return provider || "";
}

function normalizePlayer(player, source) {
  return {
    ...emptyPlayer(source),
    ...player,
    name: player.name || "",
    role: player.role || null,
    source: player.source || source
  };
}

function normalizeFromExtracted(raw) {
  if (!raw.extracted) return null;
  const source = basenameProvider(raw.extracted.provider || raw.provider);
  const teams = {};

  for (const [teamName, team] of Object.entries(raw.extracted.teams || {})) {
    teams[teamName] = {
      players: (team.players || []).map((player) => normalizePlayer(player, source))
    };
  }

  return {
    matchId: raw.extracted.matchId || raw.matchId,
    competition: raw.extracted.competition || null,
    round: raw.extracted.round || null,
    date: raw.extracted.date || null,
    homeTeam: raw.extracted.homeTeam || null,
    awayTeam: raw.extracted.awayTeam || null,
    score: raw.extracted.score || null,
    provider: source,
    teams
  };
}

function readArtifactJson(raw, labelIncludes) {
  const artifact = (raw.artifacts || []).find((item) => item.kind === "json" && item.label.includes(labelIncludes));
  if (!artifact?.path) return null;
  try {
    return readJson(artifact.path);
  } catch (error) {
    return null;
  }
}

function normalizeWhoScored(raw) {
  const data = readArtifactJson(raw, "match-centre");
  if (!data || data.parseError) return null;

  const teams = {};
  for (const side of ["home", "away"]) {
    const block = data[side];
    if (!block?.name) continue;
    teams[block.name] = {
      players: (block.players || []).map((entry) => {
        const stats = entry.stats || {};
        return normalizePlayer({
          name: entry.name || entry.playerName,
          role: entry.position || entry.positionText || null,
          starter: typeof entry.isFirstEleven === "boolean" ? entry.isFirstEleven : null,
          minutes: toNumber(stats.minutes || entry.minutesPlayed),
          shots: toNumber(stats.totalShots || stats.shotsTotal),
          shotsOnTarget: toNumber(stats.shotsOnTarget),
          goals: toNumber(stats.goals),
          assists: toNumber(stats.assists),
          keyPasses: toNumber(stats.keyPasses),
          touches: toNumber(stats.touches),
          passes: toNumber(stats.passesTotal || stats.totalPasses),
          passAccuracy: toNumber(stats.passSuccess),
          aerialsWon: toNumber(stats.aerialsWon),
          tackles: toNumber(stats.tacklesTotal || stats.tackles),
          foulsCommitted: toNumber(stats.foulsCommited || stats.foulsCommitted),
          foulsWon: toNumber(stats.foulsWon),
          yellowCards: toNumber(stats.yellowCards),
          redCards: toNumber(stats.redCards),
          rating: toNumber(stats.rating)
        }, "WhoScored");
      }).filter((player) => player.name)
    };
  }

  return {
    matchId: raw.matchId,
    competition: null,
    round: null,
    date: null,
    homeTeam: Object.keys(teams)[0] || null,
    awayTeam: Object.keys(teams)[1] || null,
    score: null,
    provider: "WhoScored",
    teams
  };
}

function normalizeSofaScore(raw) {
  const lineups = readArtifactJson(raw, "lineups");
  const event = readArtifactJson(raw, "event");
  if (!lineups) return null;

  const teamPairs = [
    ["home", event?.event?.homeTeam?.name || lineups.home?.team?.name],
    ["away", event?.event?.awayTeam?.name || lineups.away?.team?.name]
  ];
  const teams = {};

  for (const [side, teamName] of teamPairs) {
    const block = lineups[side];
    if (!teamName || !block) continue;
    const players = [...(block.players || []), ...(block.missingPlayers || [])];
    teams[teamName] = {
      players: players.map((entry) => {
        const stats = entry.statistics || {};
        return normalizePlayer({
          name: entry.player?.name || entry.player?.shortName,
          role: entry.position || null,
          starter: typeof entry.substitute === "boolean" ? !entry.substitute : null,
          minutes: toNumber(stats.minutesPlayed),
          shots: toNumber(stats.totalShots),
          shotsOnTarget: toNumber(stats.shotsOnTarget),
          goals: toNumber(stats.goals),
          assists: toNumber(stats.goalAssist),
          xG: toNumber(stats.expectedGoals),
          xA: toNumber(stats.expectedAssists),
          keyPasses: toNumber(stats.keyPass),
          touches: toNumber(stats.touches),
          touchesInBox: toNumber(stats.touchesInOppBox),
          passes: toNumber(stats.totalPass),
          accuratePasses: toNumber(stats.accuratePass),
          crosses: toNumber(stats.totalCross),
          accurateCrosses: toNumber(stats.accurateCross),
          dribblesAttempted: toNumber(stats.totalContest),
          dribblesCompleted: toNumber(stats.wonContest),
          foulsCommitted: toNumber(stats.fouls),
          foulsWon: toNumber(stats.wasFouled),
          tackles: toNumber(stats.totalTackle),
          interceptions: toNumber(stats.interceptionWon),
          clearances: toNumber(stats.totalClearance),
          duelsWon: toNumber(stats.duelWon),
          aerialsWon: toNumber(stats.aerialWon),
          yellowCards: toNumber(stats.yellowCards),
          redCards: toNumber(stats.redCards),
          rating: toNumber(stats.rating)
        }, "SofaScore");
      }).filter((player) => player.name)
    };
  }

  return {
    matchId: raw.matchId,
    competition: event?.event?.tournament?.name || null,
    round: event?.event?.roundInfo?.name || null,
    date: event?.event?.startTimestamp ? new Date(event.event.startTimestamp * 1000).toISOString().slice(0, 10) : null,
    homeTeam: event?.event?.homeTeam?.name || Object.keys(teams)[0] || null,
    awayTeam: event?.event?.awayTeam?.name || Object.keys(teams)[1] || null,
    score: event?.event?.homeScore && event?.event?.awayScore ? `${event.event.homeScore.current}-${event.event.awayScore.current}` : null,
    provider: "SofaScore",
    teams
  };
}

function normalizeFallback(raw) {
  const source = basenameProvider(raw.provider);
  return {
    matchId: raw.matchId,
    competition: null,
    round: null,
    date: null,
    homeTeam: null,
    awayTeam: null,
    score: null,
    provider: source,
    teams: {}
  };
}

function normalize(raw) {
  return normalizeFromExtracted(raw)
    || (String(raw.provider).toLowerCase() === "whoscored" ? normalizeWhoScored(raw) : null)
    || (String(raw.provider).toLowerCase() === "sofascore" ? normalizeSofaScore(raw) : null)
    || normalizeFallback(raw);
}

function logCompleteness(normalized) {
  for (const [teamName, team] of Object.entries(normalized.teams || {})) {
    for (const player of team.players || []) {
      const completeness = playerCompleteness(player);
      console.log(`[${teamName}] ${player.name}: trovati=${completeness.found.join(",") || "-"}; mancanti=${completeness.missing.join(",") || "-"}`);
    }
  }
}

function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["input", "output"], usage);

  const inputPath = path.resolve(args.input);
  const outputPath = path.resolve(args.output);
  const raw = readJson(inputPath);
  const normalized = normalize(raw);

  writeJson(outputPath, normalized);
  console.log(`Normalizzato salvato: ${outputPath}`);
  logCompleteness(normalized);
}

main();
