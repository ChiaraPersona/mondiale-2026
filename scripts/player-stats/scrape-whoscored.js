#!/usr/bin/env node
const {
  emptyPlayer,
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

const PROVIDER = "WhoScored";
const usage = 'node scripts/player-stats/scrape-whoscored.js --url "WHOSCORED_URL" --match MATCH_ID [--playwright]';

function extractMatchCentreData(html) {
  const patterns = [
    /matchCentreData\s*=\s*({[\s\S]*?});\s*<\/script>/i,
    /matchCentreData\s*:\s*({[\s\S]*?})\s*,\s*matchCentreEventTypeJson/i
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match) continue;
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      return { parseError: error.message, rawSnippet: match[1].slice(0, 2000) };
    }
  }
  return null;
}

function mapPlayer(entry) {
  const stats = entry.stats || {};
  const player = emptyPlayer();
  setValue(player, "name", entry.name || entry.playerName, PROVIDER);
  setValue(player, "role", entry.position || entry.positionText, PROVIDER);
  setValue(player, "starter", typeof entry.isFirstEleven === "boolean" ? entry.isFirstEleven : null, PROVIDER);
  setValue(player, "minutes", toNumber(stats.minutes || entry.minutesPlayed), PROVIDER);
  setValue(player, "shots", toNumber(stats.totalShots || stats.shotsTotal), PROVIDER);
  setValue(player, "shotsOnTarget", toNumber(stats.shotsOnTarget), PROVIDER);
  setValue(player, "goals", toNumber(stats.goals), PROVIDER);
  setValue(player, "assists", toNumber(stats.assists), PROVIDER);
  setValue(player, "keyPasses", toNumber(stats.keyPasses), PROVIDER);
  setValue(player, "crosses", toNumber(stats.crossesTotal || stats.totalCrosses), PROVIDER);
  setValue(player, "accurateCrosses", toNumber(stats.crossesAccurate || stats.accurateCrosses), PROVIDER);
  setValue(player, "longBalls", toNumber(stats.longBallsTotal || stats.totalLongBalls), PROVIDER);
  setValue(player, "accurateLongBalls", toNumber(stats.longBallsAccurate || stats.accurateLongBalls), PROVIDER);
  setValue(player, "dribblesAttempted", toNumber(stats.dribblesAttempted || stats.dribblesTotal), PROVIDER);
  setValue(player, "dribblesCompleted", toNumber(stats.dribblesWon || stats.successfulDribbles), PROVIDER);
  setValue(player, "foulsCommitted", toNumber(stats.foulsCommited || stats.foulsCommitted), PROVIDER);
  setValue(player, "foulsWon", toNumber(stats.foulsWon), PROVIDER);
  setValue(player, "tackles", toNumber(stats.tacklesTotal || stats.tackles), PROVIDER);
  setValue(player, "interceptions", toNumber(stats.interceptions), PROVIDER);
  setValue(player, "clearances", toNumber(stats.clearances), PROVIDER);
  setValue(player, "aerialDuelsWon", toNumber(stats.aerialsWon), PROVIDER);
  setValue(player, "yellowCards", toNumber(stats.yellowCards), PROVIDER);
  setValue(player, "redCards", toNumber(stats.redCards), PROVIDER);
  setValue(player, "touches", toNumber(stats.touches), PROVIDER);
  setValue(player, "passes", toNumber(stats.passesTotal || stats.totalPasses), PROVIDER);
  setValue(player, "passAccuracy", toNumber(stats.passSuccess), PROVIDER);
  setValue(player, "rating", toNumber(stats.rating), PROVIDER);
  return player;
}

function extractTeams(data) {
  if (!data || data.parseError) return {};
  const teams = {};
  for (const side of ["home", "away"]) {
    const block = data[side];
    if (!block?.name) continue;
    teams[block.name] = { players: (block.players || []).map(mapPlayer).filter((player) => player.name) };
  }
  return teams;
}

async function scrape(args) {
  const debugDir = rawDebugDir("whoscored", args.match);
  const errors = [];
  const log = [];
  const page = await fetchText(args.url);
  writeText(`${debugDir}\\page.html`, page.text);
  log.push(`GET ${args.url} -> ${page.status}`);
  if (!page.ok) errors.push(`WhoScored page HTTP ${page.status}.`);
  let html = page.text;

  if (args.playwright || !extractMatchCentreData(html)) {
    const rendered = await fetchRenderedHtml(args.url);
    if (rendered.html) {
      html = rendered.html;
      writeText(`${debugDir}\\page.rendered.html`, rendered.html);
      log.push("Playwright render OK");
    } else {
      errors.push(rendered.error);
    }
  }

  const data = extractMatchCentreData(html);
  if (data) {
    writeJson(`${debugDir}\\match-centre.json`, data);
    if (data.parseError) errors.push(`matchCentreData non parsabile: ${data.parseError}`);
  } else {
    errors.push("matchCentreData non trovato.");
  }

  const teams = extractTeams(data);
  const allPlayers = Object.values(teams).flatMap((team) => team.players);
  return {
    matchId: args.match,
    provider: PROVIDER,
    sourceUrl: args.url,
    fetchedAt: new Date().toISOString(),
    completion: providerCompletion(allPlayers),
    errors,
    log,
    debug: [`${debugDir}\\page.html`, `${debugDir}\\match-centre.json`],
    teams
  };
}

async function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["url", "match"], usage);
  const result = await scrape(args);
  const output = args.output || rawPath("whoscored", args.match);
  writeJson(output, result);
  console.log(`WhoScored raw: ${output}`);
  console.log(`completion=${result.completion || 0}% errors=${result.errors.length}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { scrape };
