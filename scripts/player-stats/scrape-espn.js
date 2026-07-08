#!/usr/bin/env node
const {
  emptyPlayer,
  fetchJson,
  minuteToNumber,
  parseArgs,
  providerCompletion,
  rawDebugDir,
  rawPath,
  requireArgs,
  setValue,
  statMap,
  writeJson
} = require("./lib/common");

const PROVIDER = "ESPN";
const usage = 'node scripts/player-stats/scrape-espn.js --url "ESPN_URL" --match MATCH_ID';

function eventIdFromUrl(url) {
  const direct = String(url).match(/gameId[=/](\d+)/i);
  if (direct) return direct[1];
  const lastNumber = String(url).match(/(\d{5,})(?!.*\d)/);
  return lastNumber ? lastNumber[1] : null;
}

function apiUrlFromUrl(url) {
  const eventId = eventIdFromUrl(url);
  return eventId ? `https://site.web.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${eventId}` : null;
}

function metaFromJson(json, matchId) {
  const competition = json?.header?.competitions?.[0];
  const competitors = competition?.competitors || [];
  const home = competitors.find((item) => item.homeAway === "home") || competitors[0];
  const away = competitors.find((item) => item.homeAway === "away") || competitors[1];
  return {
    matchId,
    competition: json?.header?.league?.name || "FIFA World Cup",
    round: competition?.notes?.[0]?.headline || null,
    date: competition?.date ? competition.date.slice(0, 10) : null,
    homeTeam: home?.team?.displayName || null,
    awayTeam: away?.team?.displayName || null,
    score: home && away ? `${home.score}-${away.score}` : null
  };
}

function substitutionEvents(json) {
  const events = [];
  for (const item of json?.commentary || []) {
    const play = item.play;
    if (play?.type?.type !== "substitution") continue;
    const team = play.team?.displayName;
    const minute = minuteToNumber(play.clock?.displayValue || item.time?.displayValue);
    const incoming = play.participants?.[0]?.athlete?.displayName;
    const outgoing = play.participants?.[1]?.athlete?.displayName;
    if (!team || minute === null || !incoming || !outgoing) continue;
    events.push({ team, minute, incoming, outgoing });
  }
  return events;
}

function finalMinute(json) {
  const end = [...(json?.commentary || [])].reverse().find((item) => {
    const text = item.play?.type?.type || "";
    return text === "end-regular-time" || String(item.text || "").includes("Second Half ends");
  });
  return minuteToNumber(end?.play?.clock?.displayValue || end?.time?.displayValue) || 90;
}

function applyMinutes(player, teamName, subs, endMinute) {
  const subIn = subs.find((event) => event.team === teamName && event.incoming === player.name);
  const subOut = subs.find((event) => event.team === teamName && event.outgoing === player.name);
  const starter = player.starter === true;

  if (starter) {
    setValue(player, "minuteIn", 0, PROVIDER);
    setValue(player, "minuteOut", subOut ? subOut.minute : endMinute, PROVIDER);
    setValue(player, "minutes", (subOut ? subOut.minute : endMinute), PROVIDER);
    return;
  }

  if (subIn) {
    setValue(player, "minuteIn", subIn.minute, PROVIDER);
    setValue(player, "minuteOut", subOut ? subOut.minute : endMinute, PROVIDER);
    setValue(player, "minutes", Math.max(0, (subOut ? subOut.minute : endMinute) - subIn.minute), PROVIDER);
    return;
  }

  setValue(player, "minutes", 0, PROVIDER);
}

function mapPlayer(entry, teamName, subs, endMinute) {
  const stats = statMap(entry.stats);
  const player = emptyPlayer();
  setValue(player, "name", entry.athlete?.displayName || entry.athlete?.fullName, PROVIDER);
  setValue(player, "role", entry.position?.displayName, PROVIDER);
  setValue(player, "starter", typeof entry.starter === "boolean" ? entry.starter : null, PROVIDER);
  setValue(player, "shots", stats.totalShots, PROVIDER);
  setValue(player, "shotsOnTarget", stats.shotsOnTarget, PROVIDER);
  setValue(player, "goals", stats.totalGoals, PROVIDER);
  setValue(player, "assists", stats.goalAssists, PROVIDER);
  setValue(player, "foulsCommitted", stats.foulsCommitted, PROVIDER);
  setValue(player, "foulsWon", stats.foulsSuffered, PROVIDER);
  setValue(player, "offsides", stats.offsides, PROVIDER);
  setValue(player, "yellowCards", stats.yellowCards, PROVIDER);
  setValue(player, "redCards", stats.redCards, PROVIDER);
  applyMinutes(player, teamName, subs, endMinute);
  return player;
}

async function scrape(args) {
  const apiUrl = apiUrlFromUrl(args.url);
  const log = [];
  const errors = [];

  if (!apiUrl) {
    errors.push("GameId ESPN non trovato nell'URL.");
    return { provider: PROVIDER, matchId: args.match, sourceUrl: args.url, errors, log, teams: {} };
  }

  const response = await fetchJson(apiUrl);
  const debugDir = rawDebugDir("espn", args.match);
  writeJson(`${debugDir}\\summary.json`, response.json || { raw: response.text, parseError: response.parseError });
  log.push(`GET ${apiUrl} -> ${response.status}`);
  if (!response.ok) errors.push(`ESPN API HTTP ${response.status}.`);

  if (!response.json) {
    errors.push(`JSON ESPN non parsabile: ${response.parseError || response.status}`);
    return { provider: PROVIDER, matchId: args.match, sourceUrl: args.url, apiUrl, errors, log, teams: {} };
  }

  const subs = substitutionEvents(response.json);
  const endMinute = finalMinute(response.json);
  const teams = {};

  for (const roster of response.json.rosters || []) {
    const teamName = roster.team?.displayName;
    if (!teamName) continue;
    teams[teamName] = {
      players: (roster.roster || [])
        .map((entry) => mapPlayer(entry, teamName, subs, endMinute))
        .filter((player) => player.name)
    };
  }

  const allPlayers = Object.values(teams).flatMap((team) => team.players);
  return {
    ...metaFromJson(response.json, args.match),
    provider: PROVIDER,
    sourceUrl: args.url,
    apiUrl,
    fetchedAt: new Date().toISOString(),
    completion: providerCompletion(allPlayers),
    errors,
    log,
    debug: [`${debugDir}\\summary.json`],
    teams
  };
}

async function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["url", "match"], usage);
  const result = await scrape(args);
  const output = args.output || rawPath("espn", args.match);
  writeJson(output, result);
  console.log(`ESPN raw: ${output}`);
  console.log(`completion=${result.completion || 0}% errors=${result.errors.length}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { scrape };
