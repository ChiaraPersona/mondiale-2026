const fs = require("fs");
const path = require("path");
const { readEvents, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const scoringDirectory = path.join(root, "data", "scoring");
const confidenceDirectory = path.join(root, "data", "confidence");
const requestedFile = process.argv[2];
const BASE_CONFIDENCE = 50;

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`${label} non trovato: ${path.relative(root, filePath)}`);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} non valido: ${path.relative(root, filePath)} (${error.message})`);
  }
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function flattenText(value) {
  if (value === null || value === undefined) return [];
  if (typeof value === "string") return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(flattenText);
  if (typeof value === "object") return Object.values(value).flatMap(flattenText);
  return [];
}

function joinedText(value) {
  return normalize(flattenText(value).join(" "));
}

function matchTeams(match) {
  const teams = String(match ?? "").split(/\s+-\s+/).map(team => team.trim()).filter(Boolean);
  return { home: teams[0] || "", away: teams[1] || "" };
}

function selectedSide(event, teams) {
  const market = normalize(event.market);
  const selection = normalize(event.selection);
  const context = `${market} ${selection}`;

  if (teams.home && context.includes(normalize(teams.home))) return "home";
  if (teams.away && context.includes(normalize(teams.away))) return "away";
  if (/\b(casa|squadra 1|team 1|home)\b/.test(context)) return "home";
  if (/\b(ospite|squadra 2|team 2|away)\b/.test(context)) return "away";
  if (/\b(1x2|esito finale|doppia chance|passaggio turno|qualificazione)\b/.test(market)) {
    if (selection === "1") return "home";
    if (selection === "2") return "away";
  }
  return null;
}

function scopedTeamData(section, side) {
  if (side && section && typeof section === "object" && !Array.isArray(section)) {
    return section[side];
  }
  return section;
}

function motivationScore(data) {
  const text = joinedText(data);
  if (/\b(very_high|motivazione massima|motivazione molto alta|molto motivat[oaie])\b/.test(text)) {
    return { points: 15, reason: "Motivazione molto alta" };
  }
  if (/\b(high|motivazione alta|alta motivazione|fortemente motivat[oaie])\b/.test(text)) {
    return { points: 10, reason: "Motivazione alta" };
  }
  if (/\b(medium|motivazione media|mediamente motivat[oaie])\b/.test(text)) {
    return { points: 5, reason: "Motivazione media" };
  }
  if (/\b(low|motivazione bassa|poco motivat[oaie])\b/.test(text)) {
    return { points: 0, reason: null };
  }
  return { points: 0, reason: null };
}

function formScore(data) {
  const text = joinedText(data);
  if (/\b(excellent|forma ottima|ottima forma)\b/.test(text)) {
    return { points: 15, reason: "Forma classificata come ottima" };
  }
  if (/\b(good|forma buona|buona forma)\b/.test(text)) {
    return { points: 10, reason: "Forma classificata come buona" };
  }
  if (/\b(medium|forma media|forma recente nella media)\b/.test(text)) {
    return { points: 5, reason: "Forma classificata come media" };
  }
  if (/\b(negative|forma negativa|momento negativo|serie negativa)\b/.test(text)) {
    return { points: 0, reason: null };
  }
  return { points: 0, reason: null };
}

function pressureScore(data) {
  let points = 0;
  const reasons = [];

  if (data.mustWin === true || flattenText(data.mustWin).length) {
    points += 10;
    reasons.push("La partita deve essere vinta");
  }
  if (data.knockout === true || flattenText(data.knockout).length) {
    points += 6;
    reasons.push("Partita a eliminazione diretta");
  }
  if (data.canSettle === true || flattenText(data.canSettle).length) {
    points -= 5;
    reasons.push("Una squadra può giocare con pressione inferiore");
  }

  return { points, reasons };
}

function tacticsScore(data, side) {
  const offensive = scopedTeamData(data?.offensiveApproach, side);
  const defensive = scopedTeamData(data?.defensiveApproach, side);
  const offensiveText = joinedText(offensive);
  const defensiveText = joinedText(defensive);

  if (/\b(molto offensiv[oaie]|ultra offensiv[oaie])\b/.test(offensiveText)) {
    return { points: 15, reason: "Atteggiamento molto offensivo previsto" };
  }
  if (/\b(offensiv[oaie]|attaccare|attacco|attacchi)\b/.test(offensiveText)) {
    return { points: 10, reason: "Atteggiamento offensivo previsto" };
  }
  if (/\b(difensiv[oaie]|difendere|blocco basso|proteggere l'area)\b/.test(defensiveText)) {
    return { points: -8, reason: "Atteggiamento difensivo previsto" };
  }
  return { points: 0, reason: null };
}

function absencesScore(data) {
  const evidence = flattenText(data?.important);
  const text = joinedText(evidence);

  if (/\b(nessuna assenza|nessuna assenza importante|organico completo|al completo)\b/.test(text)) {
    return { points: 5, reason: "Nessuna assenza importante dichiarata" };
  }
  if (evidence.length === 1) {
    return { points: -5, reason: "Una assenza importante segnalata" };
  }
  if (evidence.length > 1) {
    return { points: -12, reason: "Più assenze importanti segnalate" };
  }
  return { points: 0, reason: null };
}

function risksScore(risks) {
  let points = 0;
  const reasons = [];
  const turnoverText = joinedText(risks?.probableTurnover);
  const upsetText = joinedText(risks?.upset);

  if (/\b(turnover alto|turnover elevato|rotazioni importanti)\b/.test(turnoverText)) {
    points -= 10;
    reasons.push("Turnover alto");
  }
  if (/\b(rischio sorpresa alto|rischio alto di sorpresa|sorpresa alta)\b/.test(upsetText)) {
    points -= 8;
    reasons.push("Rischio sorpresa alto");
  }

  return { points, reasons };
}

function scoreEvent(event) {
  const intelligence = event.breakdown || {};
  const teams = matchTeams(event.match);
  const side = selectedSide(event, teams);
  const breakdown = {};

  if (event.needs?.motivation) {
    const result = motivationScore(scopedTeamData(intelligence.motivation, side));
    breakdown.motivation = result.points;
  }
  if (event.needs?.form) {
    const result = formScore(scopedTeamData(intelligence.form, side));
    breakdown.form = result.points;
  }
  if (event.needs?.tactics) {
    const result = tacticsScore(intelligence.tactics, side);
    breakdown.tactics = result.points;
  }
  if (event.needs?.pressure) {
    const result = pressureScore(intelligence.pressure || {});
    breakdown.pressure = result.points;
  }
  if (event.needs?.players) {
    breakdown.players = 0;
  }
  if (event.needs?.absences) {
    const result = absencesScore(intelligence.absences || {});
    breakdown.absences = result.points;
  }
  if (event.needs?.risks) {
    const result = risksScore(intelligence.risks || {});
    breakdown.risks = result.points;
  }

  const adjustment = Object.values(breakdown).reduce((total, value) => total + value, 0);
  const confidence = Math.max(0, Math.min(100, BASE_CONFIDENCE + adjustment));

  return {
    ...event,
    confidence,
  };
}

function processScoringFile(filename) {
  const scoringPath = path.join(scoringDirectory, filename);
  const outputPath = path.join(confidenceDirectory, filename);
  const events = readEvents(scoringPath);
  const results = events.map(scoreEvent);
  writeEvents(outputPath, results);
  console.log(`${events[0]?.match || filename}: ${results.length} eventi -> data/confidence/${filename}`);
}

if (!fs.existsSync(scoringDirectory)) {
  throw new Error("Cartella data/scoring/ non trovata.");
}

fs.mkdirSync(confidenceDirectory, { recursive: true });

const files = requestedFile
  ? [requestedFile]
  : fs.readdirSync(scoringDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) {
  throw new Error("Nessun file *-events.json presente in data/scoring/.");
}

files.forEach(processScoringFile);
