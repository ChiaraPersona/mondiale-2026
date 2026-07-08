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

const PROVIDER = "FotMob";
const usage = 'node scripts/player-stats/scrape-fotmob.js --url "FOTMOB_URL" --match MATCH_ID [--playwright]';

function matchIdFromText(text) {
  const patterns = [
    /matchId=(\d+)/i,
    /"@id"\s*:\s*"https:\/\/www\.fotmob\.com\/match\/(\d+)"/i,
    /\/match\/(\d+)/i,
    /#(\d{6,})/
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function visit(obj, callback) {
  if (!obj || typeof obj !== "object") return;
  callback(obj);
  if (Array.isArray(obj)) {
    obj.forEach((item) => visit(item, callback));
    return;
  }
  Object.values(obj).forEach((value) => visit(value, callback));
}

function mapPlayerStatsEntry(entry) {
  const player = emptyPlayer();
  const name = entry.name || entry.playerName || entry.player?.name;
  setValue(player, "name", name, PROVIDER);
  setValue(player, "role", entry.role || entry.position || entry.player?.position, PROVIDER);
  setValue(player, "starter", entry.isStarter ?? entry.starter, PROVIDER);
  setValue(player, "minutes", toNumber(entry.minutes || entry.minutesPlayed), PROVIDER);
  setValue(player, "xG", toNumber(entry.expectedGoals || entry.xG), PROVIDER);
  setValue(player, "xA", toNumber(entry.expectedAssists || entry.xA), PROVIDER);
  setValue(player, "shots", toNumber(entry.shots || entry.totalShots), PROVIDER);
  setValue(player, "shotsOnTarget", toNumber(entry.shotsOnTarget), PROVIDER);
  setValue(player, "touches", toNumber(entry.touches), PROVIDER);
  setValue(player, "touchesInBox", toNumber(entry.touchesInOppBox || entry.touchesInBox), PROVIDER);
  setValue(player, "keyPasses", toNumber(entry.keyPasses || entry.chancesCreated), PROVIDER);
  setValue(player, "rating", toNumber(entry.rating || entry.fotmobRating), PROVIDER);
  return player.name ? player : null;
}

function extractPlayers(json) {
  const teams = {};
  visit(json, (node) => {
    if (!Array.isArray(node.players) || !node.teamName) return;
    const players = node.players.map(mapPlayerStatsEntry).filter(Boolean);
    if (players.length) teams[node.teamName] = { players };
  });
  return teams;
}

async function scrape(args) {
  const debugDir = rawDebugDir("fotmob", args.match);
  const errors = [];
  const log = [];
  const page = await fetchText(args.url);
  writeText(`${debugDir}\\page.html`, page.text);
  log.push(`GET ${args.url} -> ${page.status}`);
  if (!page.ok) errors.push(`FotMob page HTTP ${page.status}.`);
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

  const matchId = matchIdFromText(`${args.url}\n${html}`);
  if (!matchId) {
    errors.push("MatchId FotMob non trovato.");
    return { provider: PROVIDER, matchId: args.match, sourceUrl: args.url, fetchedAt: new Date().toISOString(), completion: 0, errors, log, debug: [`${debugDir}\\page.html`], teams: {} };
  }

  const urls = [
    `https://www.fotmob.com/api/matchDetails?matchId=${matchId}`,
    `https://www.fotmob.com/api/matchDetails?matchId=${matchId}&ccode3=ITA&timezone=Europe%2FRome`
  ];
  let json = null;
  for (const url of urls) {
    const response = await fetchJson(url);
    writeJson(`${debugDir}\\match-details-${urls.indexOf(url)}.json`, response.json || { raw: response.text, parseError: response.parseError, status: response.status });
    log.push(`GET ${url} -> ${response.status}`);
    if (!response.ok) errors.push(`matchDetails HTTP ${response.status}: ${url}`);
    if (response.json && !json) json = response.json;
  }

  if (!json) errors.push("FotMob matchDetails non parsabile o non disponibile.");
  const teams = json ? extractPlayers(json) : {};
  const allPlayers = Object.values(teams).flatMap((team) => team.players);

  return {
    matchId: args.match,
    provider: PROVIDER,
    sourceUrl: args.url,
    fotmobMatchId: matchId,
    fetchedAt: new Date().toISOString(),
    completion: providerCompletion(allPlayers),
    errors,
    log,
    debug: [`${debugDir}\\page.html`, `${debugDir}\\match-details-0.json`, `${debugDir}\\match-details-1.json`],
    teams
  };
}

async function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["url", "match"], usage);
  const result = await scrape(args);
  const output = args.output || rawPath("fotmob", args.match);
  writeJson(output, result);
  console.log(`FotMob raw: ${output}`);
  console.log(`completion=${result.completion || 0}% errors=${result.errors.length}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}

module.exports = { scrape };
