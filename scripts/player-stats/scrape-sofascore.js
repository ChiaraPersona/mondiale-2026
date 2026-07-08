#!/usr/bin/env node
const {
  emptyPlayer,
  fetchJson,
  fetchRenderedHtml,
  fetchText,
  parseArgs,
  providerCompletion,
  rawDebugDir,
  rawPath,
  requireArgs,
  setValue,
  toNumber,
  writeJson,
  writeText
} = require("./lib/common");

const PROVIDER = "SofaScore";
const usage = 'node scripts/player-stats/scrape-sofascore.js --url "SOFASCORE_URL" --match MATCH_ID [--playwright]';

function eventIdFromText(text) {
  const patterns = [
    /#id:(\d+)/i,
    /"id"\s*:\s*(\d{6,})\s*,\s*"slug"\s*:\s*"[^"]*portugal[^"]*spain/i,
    /"customId"\s*:\s*"[^"]*"\s*,\s*"id"\s*:\s*(\d{6,})/i,
    /event\/(\d{6,})/i
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function mapPlayer(entry) {
  const stats = entry.statistics || {};
  const player = emptyPlayer();
  setValue(player, "name", entry.player?.name || entry.player?.shortName, PROVIDER);
  setValue(player, "role", entry.position, PROVIDER);
  setValue(player, "starter", typeof entry.substitute === "boolean" ? !entry.substitute : null, PROVIDER);
  setValue(player, "minutes", toNumber(stats.minutesPlayed), PROVIDER);
  setValue(player, "shots", toNumber(stats.totalShots), PROVIDER);
  setValue(player, "shotsOnTarget", toNumber(stats.shotsOnTarget), PROVIDER);
  setValue(player, "goals", toNumber(stats.goals), PROVIDER);
  setValue(player, "assists", toNumber(stats.goalAssist), PROVIDER);
  setValue(player, "xG", toNumber(stats.expectedGoals), PROVIDER);
  setValue(player, "xA", toNumber(stats.expectedAssists), PROVIDER);
  setValue(player, "touches", toNumber(stats.touches), PROVIDER);
  setValue(player, "touchesInBox", toNumber(stats.touchesInOppBox), PROVIDER);
  setValue(player, "passes", toNumber(stats.totalPass), PROVIDER);
  setValue(player, "accuratePasses", toNumber(stats.accuratePass), PROVIDER);
  setValue(player, "passAccuracy", toNumber(stats.accuratePass) !== null && toNumber(stats.totalPass) ? Math.round((toNumber(stats.accuratePass) / toNumber(stats.totalPass)) * 1000) / 10 : null, PROVIDER);
  setValue(player, "keyPasses", toNumber(stats.keyPass), PROVIDER);
  setValue(player, "crosses", toNumber(stats.totalCross), PROVIDER);
  setValue(player, "accurateCrosses", toNumber(stats.accurateCross), PROVIDER);
  setValue(player, "longBalls", toNumber(stats.totalLongBalls), PROVIDER);
  setValue(player, "accurateLongBalls", toNumber(stats.accurateLongBalls), PROVIDER);
  setValue(player, "dribblesAttempted", toNumber(stats.totalContest), PROVIDER);
  setValue(player, "dribblesCompleted", toNumber(stats.wonContest), PROVIDER);
  setValue(player, "foulsCommitted", toNumber(stats.fouls), PROVIDER);
  setValue(player, "foulsWon", toNumber(stats.wasFouled), PROVIDER);
  setValue(player, "offsides", toNumber(stats.totalOffside), PROVIDER);
  setValue(player, "tackles", toNumber(stats.totalTackle), PROVIDER);
  setValue(player, "interceptions", toNumber(stats.interceptionWon), PROVIDER);
  setValue(player, "clearances", toNumber(stats.totalClearance), PROVIDER);
  setValue(player, "groundDuelsWon", toNumber(stats.groundDuelsWon), PROVIDER);
  setValue(player, "groundDuelsTotal", toNumber(stats.groundDuelsTotal), PROVIDER);
  setValue(player, "aerialDuelsWon", toNumber(stats.aerialWon), PROVIDER);
  setValue(player, "aerialDuelsTotal", toNumber(stats.aerialLost) !== null && toNumber(stats.aerialWon) !== null ? toNumber(stats.aerialWon) + toNumber(stats.aerialLost) : null, PROVIDER);
  setValue(player, "yellowCards", toNumber(stats.yellowCards), PROVIDER);
  setValue(player, "redCards", toNumber(stats.redCards), PROVIDER);
  setValue(player, "rating", toNumber(stats.rating), PROVIDER);
  return player;
}

async function scrape(args) {
  const debugDir = rawDebugDir("sofascore", args.match);
  const errors = [];
  const log = [];
  const page = await fetchText(args.url);
  writeText(`${debugDir}\\page.html`, page.text);
  log.push(`GET ${args.url} -> ${page.status}`);
  if (!page.ok) errors.push(`SofaScore page HTTP ${page.status}.`);

  let html = page.text;
  if (args.playwright) {
    const rendered = await fetchRenderedHtml(args.url);
    if (rendered.html) {
      html = rendered.html;
      writeText(`${debugDir}\\page.rendered.html`, rendered.html);
      log.push("Playwright render OK");
    } else {
      errors.push(rendered.error);
    }
  }

  const eventId = eventIdFromText(`${args.url}\n${html}`);
  if (!eventId) {
    errors.push("EventId SofaScore non trovato.");
    return { provider: PROVIDER, matchId: args.match, sourceUrl: args.url, fetchedAt: new Date().toISOString(), completion: 0, errors, log, debug: [`${debugDir}\\page.html`], teams: {} };
  }

  const endpoints = {
    event: `https://www.sofascore.com/api/v1/event/${eventId}`,
    lineups: `https://www.sofascore.com/api/v1/event/${eventId}/lineups`,
    statistics: `https://www.sofascore.com/api/v1/event/${eventId}/statistics`
  };

  const data = {};
  for (const [name, url] of Object.entries(endpoints)) {
    const response = await fetchJson(url);
    data[name] = response.json;
    writeJson(`${debugDir}\\${name}.json`, response.json || { raw: response.text, parseError: response.parseError });
    log.push(`GET ${url} -> ${response.status}`);
    if (!response.ok) errors.push(`${name} HTTP ${response.status}.`);
    if (!response.json) errors.push(`${name} non parsabile: ${response.parseError || response.status}`);
  }

  const teams = {};
  const event = data.event?.event;
  for (const side of ["home", "away"]) {
    const teamName = event?.[`${side}Team`]?.name || data.lineups?.[side]?.team?.name;
    const block = data.lineups?.[side];
    if (!teamName || !block) continue;
    teams[teamName] = { players: (block.players || []).map(mapPlayer).filter((player) => player.name) };
  }

  const allPlayers = Object.values(teams).flatMap((team) => team.players);
  return {
    matchId: args.match,
    competition: event?.tournament?.name || null,
    round: event?.roundInfo?.name || null,
    date: event?.startTimestamp ? new Date(event.startTimestamp * 1000).toISOString().slice(0, 10) : null,
    homeTeam: event?.homeTeam?.name || null,
    awayTeam: event?.awayTeam?.name || null,
    score: event?.homeScore && event?.awayScore ? `${event.homeScore.current}-${event.awayScore.current}` : null,
    provider: PROVIDER,
    sourceUrl: args.url,
    eventId,
    fetchedAt: new Date().toISOString(),
    completion: providerCompletion(allPlayers),
    errors,
    log,
    debug: Object.keys(endpoints).map((name) => `${debugDir}\\${name}.json`),
    teams
  };
}

async function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["url", "match"], usage);
  const result = await scrape(args);
  const output = args.output || rawPath("sofascore", args.match);
  writeJson(output, result);
  console.log(`SofaScore raw: ${output}`);
  console.log(`completion=${result.completion || 0}% errors=${result.errors.length}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { scrape };
