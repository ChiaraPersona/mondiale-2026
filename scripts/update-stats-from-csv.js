#!/usr/bin/env node
/**
 * Aggiorna js/stats.js e stats.json da un CSV gratuito modificato a mano.
 * Uso:
 *   node scripts/update-stats-from-csv.js data/stats.csv
 *
 * Colonne consigliate:
 * team,player,role,age,career_worldCupEditions,career_worldCupAppearances,career_clubAppearances,
 * career_nationalAppearances,career_goals,career_assists,career_goalsConceded,career_goalsConcededPerGame,
 * career_yellowCards,career_redCards,
 * season2025_26_appearances,season2025_26_goals,season2025_26_assists,
 * season2025_26_goalsConceded,season2025_26_goalsConcededPerGame,
 * season2025_26_yellowCards,season2025_26_redCards,sources
 */
const fs = require('fs');
const path = require('path');

const input = process.argv[2];
if (!input) {
  console.error('Indica il CSV da importare. Esempio: node scripts/update-stats-from-csv.js data/stats.csv');
  process.exit(1);
}

function fold(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"' && line[i + 1] === '"') { cur += '"'; i += 1; }
    else if (ch === '"') q = !q;
    else if (ch === ',' && !q) { out.push(cur); cur = ''; }
    else cur += ch;
  }
  out.push(cur);
  return out;
}
function readCsv(file) {
  const lines = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift()).map(h => h.trim());
  return lines.map(line => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] || '']));
  });
}
const root = path.resolve(__dirname, '..');
const statsPath = path.join(root, 'stats.json');
const dataStatsPath = path.join(root, 'data', 'stats.json');

function normalizeStatsKeys(stats) {
  return Object.fromEntries(Object.entries(stats).map(([key, value]) => [fold(key), value]));
}

const stats = normalizeStatsKeys(JSON.parse(fs.readFileSync(statsPath, 'utf8')));

for (const row of readCsv(input)) {
  const baseKey = fold(`${row.team}::${row.player}`);
  const roleKey = row.role ? fold(`${row.team}::${row.player}::${row.role}`) : "";
  const key = roleKey && stats[roleKey] ? roleKey : baseKey;
  if (!stats[key]) {
    console.warn(`Giocatore non trovato nel database: ${row.team} - ${row.player}`);
    continue;
  }
  const item = stats[key];
  item.age = row.age || item.age || '';
  item.career = item.career || {};
  item.season2025_26 = item.season2025_26 || {};
  for (const [csvKey, target] of [
    ['career_worldCupEditions', 'worldCupEditions'], ['career_worldCupAppearances', 'worldCupAppearances'],
    ['career_clubAppearances', 'clubAppearances'], ['career_nationalAppearances', 'nationalAppearances'],
    ['career_goals', 'goals'], ['career_assists', 'assists'],
    ['career_goalsConceded', 'goalsConceded'], ['career_goalsConcededPerGame', 'goalsConcededPerGame'],
    ['career_yellowCards', 'yellowCards'], ['career_redCards', 'redCards'],
  ]) item.career[target] = row[csvKey] || item.career[target] || '';
  for (const [csvKey, target] of [
    ['season2025_26_appearances', 'appearances'], ['season2025_26_goals', 'goals'],
    ['season2025_26_assists', 'assists'],
    ['season2025_26_goalsConceded', 'goalsConceded'], ['season2025_26_goalsConcededPerGame', 'goalsConcededPerGame'],
    ['season2025_26_yellowCards', 'yellowCards'], ['season2025_26_redCards', 'redCards'],
  ]) item.season2025_26[target] = row[csvKey] || item.season2025_26[target] || '';
  item.sources = row.sources ? row.sources.split('|').map(s => s.trim()).filter(Boolean) : item.sources || [];
}

const output = JSON.stringify(stats, null, 2);
fs.writeFileSync(statsPath, output + '\n');
fs.writeFileSync(dataStatsPath, output + '\n');
fs.writeFileSync(path.join(root, 'js', 'stats.js'), 'const playerStats = ' + output + ';\n');
console.log('Statistiche aggiornate.');
