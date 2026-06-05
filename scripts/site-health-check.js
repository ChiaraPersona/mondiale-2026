const fs = require("fs");
const vm = require("vm");

function loadRows() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    fs.readFileSync("js/data.js", "utf8").replace(/^\uFEFF?const rows = /, "globalThis.rows = "),
    context,
  );
  return context.rows || [];
}

const htmls = fs.readdirSync(".").filter((file) => file.endsWith(".html"));
const missingAssets = [];
for (const file of htmls) {
  const html = fs.readFileSync(file, "utf8");
  const attrPattern = new RegExp("(?:href|src)=\"([^\"]+)\"", "g");
  for (const match of html.matchAll(attrPattern)) {
    const ref = match[1];
    if (/^(https?:|#|mailto:)/.test(ref)) continue;
    const clean = ref.split("#")[0].split("?")[0];
    if (clean && !fs.existsSync(clean)) missingAssets.push({ file, ref });
  }
}

const rows = loadRows();
const stats = JSON.parse(fs.readFileSync("stats.json", "utf8"));
const statsBundle = fs.readFileSync("js/stats.js", "utf8")
  .replace(/^\uFEFF?const playerStats\s*=\s*/, "")
  .replace(/;\s*$/, "");
const bundledStats = JSON.parse(statsBundle);
const missingFlags = [...new Set(rows.map((row) => row.flag).filter(Boolean).filter((flag) => !fs.existsSync(flag)))];

const fold = (value) => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const rowKey = (row) => `${fold(row.team)}::${fold(row.player)}`;
const roleKey = (row) => `${rowKey(row)}::${fold(row.role)}`;
const missingStatsRows = rows.filter((row) => !stats[roleKey(row)] && !stats[rowKey(row)]).map((row) => `${row.team} - ${row.player}`);
const goalkeepers = rows.filter((row) => row.role === "Portieri");
const goalkeeperCoverage = goalkeepers.filter((row) => stats[rowKey(row)]?.recent15?.goalsConcededPerGame).length;

console.log(JSON.stringify({
  pages: htmls,
  rows: rows.length,
  teams: new Set(rows.map((row) => row.team)).size,
  groups: [...new Set(rows.map((row) => row.group))],
  statsRecords: Object.keys(stats).length,
  statsBundleSynced: Object.keys(stats).length === Object.keys(bundledStats).length,
  missingAssets,
  missingFlags,
  missingStatsRows,
  goalkeeperCoverage: `${goalkeeperCoverage}/${goalkeepers.length}`,
}, null, 2));
