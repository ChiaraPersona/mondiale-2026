#!/usr/bin/env node
const path = require("path");
const { parseArgs, requireArgs } = require("./lib/cli");
const { writeJson, writeText } = require("./lib/files");
const { playerCompleteness } = require("./lib/schema");
const { getProvider } = require("./providers");

const usage = [
  "Uso:",
  'node scripts/stats/scrape-player-stats.js --provider espn --url "URL_PARTITA" --match portugal-spain-2026-07-06',
  "",
  "Opzioni:",
  "--output data/player-stats/raw/MATCH.json",
  "--playwright  prova anche rendering JS se il provider lo supporta"
].join("\n");

function repoPath(...parts) {
  return path.resolve(__dirname, "..", "..", ...parts);
}

function defaultOutput(matchId) {
  return repoPath("data", "player-stats", "raw", `${matchId}.json`);
}

function debugPath(matchId, fileName) {
  return repoPath("data", "player-stats", "debug", matchId, fileName);
}

function saveArtifact(matchId, artifact) {
  const filePath = debugPath(matchId, artifact.suggestedFileName);
  if (artifact.kind === "json") {
    if (typeof artifact.content === "string") {
      writeText(filePath, artifact.content);
    } else {
      writeJson(filePath, artifact.content);
    }
  } else {
    writeText(filePath, String(artifact.content || ""));
  }

  return {
    kind: artifact.kind,
    label: artifact.label,
    path: filePath
  };
}

function buildFieldLog(extracted) {
  const logs = [];
  if (!extracted?.teams) return logs;

  for (const [teamName, team] of Object.entries(extracted.teams)) {
    for (const player of team.players || []) {
      const completeness = playerCompleteness(player);
      logs.push({
        team: teamName,
        player: player.name,
        found: completeness.found,
        missing: completeness.missing
      });
    }
  }

  return logs;
}

async function main() {
  const args = parseArgs(process.argv);
  requireArgs(args, ["provider", "url", "match"], usage);

  const provider = getProvider(args.provider);
  const result = await provider.scrape({
    url: args.url,
    matchId: args.match,
    usePlaywright: Boolean(args.playwright)
  });

  const artifacts = [];
  for (const artifact of result.rawArtifacts || []) {
    artifacts.push(saveArtifact(args.match, artifact));
  }

  const fieldLog = buildFieldLog(result.extracted);
  const output = {
    matchId: args.match,
    provider: result.provider,
    sourceUrl: result.sourceUrl,
    apiUrl: result.apiUrl || null,
    fetchedAt: result.fetchedAt || new Date().toISOString(),
    artifacts,
    errors: result.errors || [],
    notes: result.notes || [],
    extracted: result.extracted || null,
    fieldLog
  };

  const outputPath = args.output ? path.resolve(args.output) : defaultOutput(args.match);
  writeJson(outputPath, output);

  console.log(`Raw salvato: ${outputPath}`);
  for (const artifact of artifacts) {
    console.log(`Debug ${artifact.label}: ${artifact.path}`);
  }
  for (const error of output.errors) {
    console.warn(`WARN: ${error}`);
  }
  for (const row of fieldLog) {
    console.log(`[${row.team}] ${row.player}: trovati=${row.found.join(",") || "-"}; mancanti=${row.missing.join(",") || "-"}`);
  }
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
