const fs = require("fs");
const vm = require("vm");

const statsPath = "stats.json";
const dataStatsPath = "data/stats.json";
const jsStatsPath = "js/stats.js";

function loadRows() {
  const context = {};
  vm.createContext(context);
  const code = fs.readFileSync("js/data.js", "utf8")
    .replace(/^\uFEFF?const rows = /, "globalThis.rows = ")
    .replace(/;\s*$/, ";");
  vm.runInContext(code, context);
  return context.rows || [];
}

function fold(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function compact(value) {
  return fold(value).replace(/\s+/g, "");
}

function nameTokens(value) {
  const ignored = new Set(["fc", "sc", "cf", "cd", "ac", "afc", "club", "calcio", "de", "del", "al"]);
  return fold(value).split(/\s+/).filter((token) => token.length >= 4 && !ignored.has(token));
}

function keyFor(row) {
  return `${fold(row.team)}::${fold(row.player)}`;
}

function scoreParts(match) {
  if (typeof match.score === "string") {
    const parts = match.score.match(/(\d+)\s*-\s*(\d+)/);
    if (parts) return [Number(parts[1]), Number(parts[2])];
  }
  const homeScore = Number(match.homeScore);
  const awayScore = Number(match.awayScore);
  if (Number.isFinite(homeScore) && Number.isFinite(awayScore)) return [homeScore, awayScore];
  return null;
}

function sideAliases(row, record) {
  const aliases = new Set([
    row.club,
    row.team,
    record.club,
    record.team,
  ]);
  const club = fold(row.club || record.club);
  if (club.includes("liverpool")) aliases.add("FC Liverpool");
  if (club.includes("arsenal")) aliases.add("FC Arsenal");
  if (club.includes("bayern")) aliases.add("Bayern München");
  if (club.includes("barcelona")) aliases.add("FC Barcelona");
  if (club.includes("real madrid")) aliases.add("Real Madrid");
  if (club.includes("manchester city")) aliases.add("Manchester City");
  if (club.includes("manchester united")) aliases.add("Manchester United");
  if (club.includes("inter")) aliases.add("Inter Mailand");
  if (club.includes("milan")) aliases.add("AC Mailand");
  if (club.includes("psg") || club.includes("paris")) aliases.add("Paris SG");
  return Array.from(aliases).filter(Boolean);
}

function commonSampleTeams(sample) {
  const counts = new Map();
  for (const match of sample) {
    for (const name of [match.home || match.homeTeam, match.away || match.awayTeam]) {
      const key = compact(name);
      if (!key) continue;
      counts.set(key, { name, count: (counts.get(key)?.count || 0) + 1 });
    }
  }
  return Array.from(counts.values())
    .filter((item) => item.count >= 2)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map((item) => item.name);
}

function sideFor(match, row, record, extraAliases = []) {
  const homeName = match.home || match.homeTeam;
  const awayName = match.away || match.awayTeam;
  const home = compact(homeName);
  const away = compact(awayName);
  const aliases = [...sideAliases(row, record), ...extraAliases].filter(Boolean);
  for (const rawAlias of aliases) {
    const alias = compact(rawAlias);
    if (alias.length >= 3 && (home.includes(alias) || alias.includes(home))) return "home";
    if (alias.length >= 3 && (away.includes(alias) || alias.includes(away))) return "away";
    const aliasTokens = nameTokens(rawAlias);
    if (!aliasTokens.length) continue;
    const homeTokens = nameTokens(homeName);
    const awayTokens = nameTokens(awayName);
    if (aliasTokens.some((token) => homeTokens.includes(token))) return "home";
    if (aliasTokens.some((token) => awayTokens.includes(token))) return "away";
  }
  return "";
}

function addConcededStats() {
  const rows = loadRows();
  const stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
  let updated = 0;
  const unresolved = [];

  for (const row of rows.filter((item) => item.role === "Portieri")) {
    const key = keyFor(row);
    const record = stats[key];
    const sample = record?.recent15?.sample || [];
    if (!record || !sample.length) {
      unresolved.push({ team: row.team, player: row.player, reason: "nessun campione partita" });
      continue;
    }

    let goalsConceded = 0;
    let resolvedMatches = 0;
    const extraAliases = commonSampleTeams(sample);
    for (const match of sample) {
      const score = scoreParts(match);
      const side = sideFor(match, row, record, extraAliases);
      if (!score || !side) continue;
      goalsConceded += side === "home" ? score[1] : score[0];
      resolvedMatches += 1;
    }

    if (!resolvedMatches) {
      unresolved.push({ team: row.team, player: row.player, reason: "squadra non riconosciuta nel campione" });
      continue;
    }

    record.recent15.goalsConceded = goalsConceded;
    record.recent15.goalsConcededMatches = resolvedMatches;
    record.recent15.goalsConcededPerGame = (goalsConceded / resolvedMatches).toFixed(2);
    updated += 1;
  }

  const serialized = JSON.stringify(stats, null, 2);
  fs.writeFileSync(statsPath, serialized + "\n");
  fs.writeFileSync(dataStatsPath, serialized + "\n");
  fs.writeFileSync(jsStatsPath, "const playerStats = " + serialized + ";\n");
  return { updated, unresolved };
}

console.log(JSON.stringify(addConcededStats(), null, 2));
