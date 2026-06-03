const playerRankingSearch = document.getElementById("player-ranking-search");
const playerRankingsContent = document.getElementById("player-rankings-content");
const playerRankingsEmpty = document.getElementById("player-rankings-empty");

const playerRankingStats = typeof playerStats !== "undefined" ? playerStats : {};

const playerRankingSections = [
  { key: "averageRating", label: "Rating medio", source: "Diretta", decimals: 2 },
  { key: "goals", label: "Gol", source: "Diretta", decimals: 0 },
  { key: "assists", label: "Assist", source: "Diretta", decimals: 0 },
  { key: "minutes", label: "Minuti", source: "Diretta", decimals: 0 },
  { key: "shotsPerGame", label: "Tiri medi", source: "SofaScore", decimals: 2 },
  { key: "shotsOnTargetPerGame", label: "Tiri in porta medi", source: "SofaScore", decimals: 2 },
  { key: "foulsCommittedPerGame", label: "Falli commessi medi", source: "SofaScore", decimals: 2 },
  { key: "foulsSufferedPerGame", label: "Falli subiti medi", source: "SofaScore", decimals: 2 },
  { key: "yellowCards", label: "Cartellini gialli", source: "Diretta", decimals: 0 },
  { key: "redCards", label: "Cartellini rossi", source: "Diretta", decimals: 0 },
];

function foldPlayerRanking(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function statValueFor(record, key) {
  const recent = record.recent15 || {};
  const advanced = recent.advanced || {};
  if (Object.prototype.hasOwnProperty.call(advanced, key)) return numberValue(advanced[key]);
  return numberValue(recent[key]);
}

function formatPlayerRankingValue(value, decimals) {
  if (!Number.isFinite(value)) return "n.d.";
  if (decimals === 0) return String(Math.round(value));
  return value.toFixed(decimals);
}

function playerRankingRows() {
  return Object.values(playerRankingStats)
    .filter((record) => record && record.recent15 && record.recent15.appearances)
    .map((record) => ({
      player: record.player || "",
      team: record.team || "",
      club: record.club || "",
      age: record.age || "",
      appearances: Number(record.recent15.appearances) || 0,
      record,
    }));
}

function matchesPlayerRanking(row, query) {
  if (!query) return true;
  return foldPlayerRanking([row.player, row.team, row.club, row.age].join(" ")).includes(query);
}

function rankingForMetric(rows, metric) {
  return rows
    .map((row) => ({ ...row, value: statValueFor(row.record, metric.key) }))
    .filter((row) => row.value !== null)
    .sort((a, b) => b.value - a.value || b.appearances - a.appearances || a.player.localeCompare(b.player))
    .slice(0, 15);
}

function renderRankingItem(row, index, metric) {
  return '<div class="player-ranking-row">' +
    '<span class="player-ranking-pos">' + (index + 1) + '</span>' +
    '<div class="player-ranking-name">' +
      '<strong>' + row.player + '</strong>' +
      '<small>' + row.team + (row.club ? ' &middot; ' + row.club : '') + '</small>' +
    '</div>' +
    '<span class="player-ranking-value">' + formatPlayerRankingValue(row.value, metric.decimals) + '</span>' +
  '</div>';
}

function renderRankingCard(rows, metric) {
  const ranking = rankingForMetric(rows, metric);
  if (!ranking.length) return "";
  return '<article class="player-ranking-card">' +
    '<div class="player-ranking-head">' +
      '<div><span>' + metric.source + '</span><h3>' + metric.label + '</h3></div>' +
      '<strong>Top 15</strong>' +
    '</div>' +
    '<div class="player-ranking-list">' +
      ranking.map((row, index) => renderRankingItem(row, index, metric)).join("") +
    '</div>' +
  '</article>';
}

function renderPlayerRankings() {
  const query = foldPlayerRanking(playerRankingSearch.value.trim());
  const rows = playerRankingRows().filter((row) => matchesPlayerRanking(row, query));
  playerRankingsEmpty.style.display = rows.length ? "none" : "block";
  playerRankingsContent.innerHTML = playerRankingSections.map((metric) => renderRankingCard(rows, metric)).join("");
}

playerRankingSearch.addEventListener("input", renderPlayerRankings);
renderPlayerRankings();
