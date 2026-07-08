const fs = require("fs");
const path = require("path");

const PLAYER_FIELDS = [
  "name",
  "role",
  "starter",
  "minutes",
  "minuteIn",
  "minuteOut",
  "shots",
  "shotsOnTarget",
  "goals",
  "assists",
  "xG",
  "xA",
  "touches",
  "touchesInBox",
  "passes",
  "accuratePasses",
  "passAccuracy",
  "keyPasses",
  "crosses",
  "accurateCrosses",
  "longBalls",
  "accurateLongBalls",
  "dribblesAttempted",
  "dribblesCompleted",
  "foulsCommitted",
  "foulsWon",
  "offsides",
  "tackles",
  "interceptions",
  "clearances",
  "groundDuelsWon",
  "groundDuelsTotal",
  "aerialDuelsWon",
  "aerialDuelsTotal",
  "yellowCards",
  "redCards",
  "rating"
];

const PROVIDERS = ["espn", "sofascore", "fotmob", "whoscored"];

const DEFAULT_HEADERS = {
  "accept": "text/html,application/json;q=0.9,*/*;q=0.8",
  "accept-language": "en-US,en;q=0.9,it;q=0.8",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36"
};

function repoRoot() {
  return path.resolve(__dirname, "..", "..", "..");
}

function resolveRepo(...parts) {
  return path.join(repoRoot(), ...parts);
}

function ensureDir(fileOrDir, isDir = false) {
  fs.mkdirSync(isDir ? fileOrDir : path.dirname(fileOrDir), { recursive: true });
}

function writeJson(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function writeText(filePath, data) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, data, "utf8");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const args = {};
  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith("--")) {
      args[key] = true;
    } else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

function requireArgs(args, names, usage) {
  const missing = names.filter((name) => !args[name]);
  if (!missing.length) return;
  console.error(`Parametri mancanti: ${missing.map((name) => `--${name}`).join(", ")}`);
  console.error(usage);
  process.exit(1);
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: { ...DEFAULT_HEADERS, ...headers },
    redirect: "follow"
  });
  return {
    ok: response.ok,
    status: response.status,
    url: response.url,
    text: await response.text()
  };
}

async function fetchJson(url, headers = {}) {
  const response = await fetchText(url, { accept: "application/json,text/plain,*/*", ...headers });
  try {
    return { ...response, json: JSON.parse(response.text) };
  } catch (error) {
    return { ...response, json: null, parseError: error.message };
  }
}

async function fetchRenderedHtml(url) {
  let chromium;
  try {
    ({ chromium } = require("playwright"));
  } catch (error) {
    return {
      ok: false,
      html: null,
      error: "Playwright non installato: esegui npm install -D playwright."
    };
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ userAgent: DEFAULT_HEADERS["user-agent"] });
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    return { ok: true, html: await page.content(), url: page.url() };
  } finally {
    await browser.close();
  }
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const cleaned = String(value).replace("%", "").replace(",", ".").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function minuteToNumber(value) {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const text = String(value).replace(/[’']/g, "").trim();
  const added = text.match(/^(\d+)\+(\d+)$/);
  if (added) return Number(added[1]) + Number(added[2]);
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .toLowerCase();
}

function emptyPlayer() {
  const player = {};
  for (const field of PLAYER_FIELDS) player[field] = null;
  player.name = "";
  player.sources = {};
  return player;
}

function setValue(player, field, value, source, overwrite = false) {
  if (!PLAYER_FIELDS.includes(field)) return;
  if (value === null || value === undefined || value === "") return;
  if (!overwrite && player[field] !== null && player[field] !== undefined && player[field] !== "") return;
  player[field] = value;
  player.sources[field] = source;
}

function statMap(stats = []) {
  const mapped = {};
  for (const stat of stats || []) {
    if (!stat?.name) continue;
    mapped[stat.name] = toNumber(stat.value ?? stat.displayValue);
  }
  return mapped;
}

function rawPath(provider, matchId) {
  return resolveRepo("data", "player-stats", "raw", provider, `${matchId}.json`);
}

function rawDebugDir(provider, matchId) {
  return resolveRepo("data", "player-stats", "raw", provider, matchId);
}

function mergedPath(matchId) {
  return resolveRepo("data", "player-stats", "merged", `${matchId}.json`);
}

function providerCompletion(players) {
  const fields = PLAYER_FIELDS.filter((field) => field !== "name");
  const total = players.length * fields.length;
  if (!total) return 0;
  let filled = 0;
  for (const player of players) {
    for (const field of fields) {
      if (player[field] !== null && player[field] !== undefined && player[field] !== "") filled += 1;
    }
  }
  return Math.round((filled / total) * 1000) / 10;
}

module.exports = {
  PLAYER_FIELDS,
  PROVIDERS,
  emptyPlayer,
  ensureDir,
  fetchJson,
  fetchRenderedHtml,
  fetchText,
  mergedPath,
  minuteToNumber,
  normalizeName,
  parseArgs,
  providerCompletion,
  rawDebugDir,
  rawPath,
  readJson,
  requireArgs,
  resolveRepo,
  setValue,
  statMap,
  toNumber,
  writeJson,
  writeText
};
