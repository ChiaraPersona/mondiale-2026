#!/usr/bin/env node
const { parseArgs, requireArgs } = require("./lib/common");
const { scrape: scrapeEspn } = require("./scrape-espn");
const { scrape: scrapeSofaScore } = require("./scrape-sofascore");
const { scrape: scrapeFotMob } = require("./scrape-fotmob");
const { scrape: scrapeWhoScored } = require("./scrape-whoscored");
const { merge } = require("./merge-player-stats");
const { mergedPath, rawPath, writeJson } = require("./lib/common");

const usage = [
  "node scripts/player-stats/run-match.js --match MATCH_ID",
  "--espn ESPN_URL --sofascore SOFASCORE_URL --fotmob FOTMOB_URL --whoscored WHOSCORED_URL [--playwright]"
].join("\n");

async function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["match"], usage);
  const providers = [
    ["espn", scrapeEspn, args.espn],
    ["sofascore", scrapeSofaScore, args.sofascore],
    ["fotmob", scrapeFotMob, args.fotmob],
    ["whoscored", scrapeWhoScored, args.whoscored]
  ];

  for (const [provider, scrape, url] of providers) {
    if (!url) {
      writeJson(rawPath(provider, args.match), {
        provider,
        matchId: args.match,
        completion: 0,
        errors: [`URL ${provider} non fornito.`],
        log: [],
        teams: {}
      });
      continue;
    }
    const result = await scrape({ url, match: args.match, playwright: args.playwright });
    writeJson(rawPath(provider, args.match), result);
  }

  const result = merge(args.match);
  writeJson(mergedPath(args.match), result);
  console.log(`Pipeline completa: ${mergedPath(args.match)}`);
  console.log(`completion=${result.completion}%`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.stack || error.message);
    process.exit(1);
  });
}
