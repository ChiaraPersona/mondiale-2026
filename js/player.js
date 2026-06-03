const playerRankingSearch = document.getElementById("player-ranking-search");
const playerRankingsContent = document.getElementById("player-rankings-content");
const playerRankingsEmpty = document.getElementById("player-rankings-empty");
const playerRankingModeButtons = Array.from(document.querySelectorAll("[data-player-ranking-mode]"));

const playerRankingStats = typeof playerStats !== "undefined" ? playerStats : {};
let activePlayerRankingMode = "all";

const playerRankingSections = [
  { key: "averageRating", label: "Rating medio", source: "Diretta", decimals: 2, topFive: true },
  { key: "goals", label: "Gol", source: "Diretta", decimals: 0, topFive: true },
  { key: "assists", label: "Assist", source: "Diretta", decimals: 0, topFive: true },
  { key: "minutes", label: "Minuti", source: "Diretta", decimals: 0, topFive: true },
  { key: "shotsPerGame", label: "Tiri medi", source: "SofaScore", decimals: 2, topFive: false },
  { key: "shotsOnTargetPerGame", label: "Tiri in porta medi", source: "SofaScore", decimals: 2, topFive: false },
  { key: "foulsCommittedPerGame", label: "Falli commessi medi", source: "SofaScore", decimals: 2, topFive: false },
  { key: "foulsSufferedPerGame", label: "Falli subiti medi", source: "SofaScore", decimals: 2, topFive: false },
  { key: "yellowCards", label: "Cartellini gialli", source: "Diretta", decimals: 0, topFive: true },
  { key: "redCards", label: "Cartellini rossi", source: "Diretta", decimals: 0, topFive: true },
];

function foldPlayerRanking(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function isTopFiveCompetition(competition) {
  const value = foldPlayerRanking(competition);
  if (!value) return false;
  if (value === "pl") return true;
  if (value === "ll") return true;
  if (value === "bun") return true;
  if (value === "sa") return true;
  if (value === "l1") return true;
  if (value.includes("premier league") && value.includes("england")) return true;
  if (value.includes("la liga") && (value.includes("spanien") || value.includes("spain") || value.includes("espana"))) return true;
  if (value.includes("ligue 1") && (value.includes("frankreich") || value.includes("france") || value.includes("francia"))) return true;
  if (value.includes("serie a") && (value.includes("italien") || value.includes("italy") || value.includes("italia"))) return true;
  if (value.includes("bundesliga") && (value.includes("deutschland") || value.includes("germany") || value.includes("germania"))) return true;
  return false;
}

function topFiveStatsFor(record) {
  const sample = ((record.recent15 || {}).sample || []).filter((match) => isTopFiveCompetition(match.competition));
  if (!sample.length) return null;
  const ratings = sample.map((match) => numberValue(match.rating)).filter((rating) => rating !== null);
  return {
    appearances: sample.length,
    minutes: sample.reduce((total, match) => total + (numberValue(match.minutes) || 0), 0),
    goals: sample.reduce((total, match) => total + (numberValue(match.goals) || 0), 0),
    assists: sample.reduce((total, match) => total + (numberValue(match.assists) || 0), 0),
    yellowCards: sample.reduce((total, match) => total + (numberValue(match.yellowCards) || 0), 0),
    redCards: sample.reduce((total, match) => total + (numberValue(match.redCards) || 0), 0),
    averageRating: ratings.length ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length : null,
  };
}

function statValueFor(record, key, mode) {
  if (mode === "top-five") {
    const topFiveStats = topFiveStatsFor(record);
    return topFiveStats ? numberValue(topFiveStats[key]) : null;
  }
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
      topFiveAppearances: topFiveStatsFor(record)?.appearances || 0,
      record,
    }));
}

function matchesPlayerRanking(row, query) {
  if (!query) return true;
  return foldPlayerRanking([row.player, row.team, row.club, row.age].join(" ")).includes(query);
}

function rankingForMetric(rows, metric) {
  return rows
    .map((row) => ({
      ...row,
      appearances: activePlayerRankingMode === "top-five" ? row.topFiveAppearances : row.appearances,
      value: statValueFor(row.record, metric.key, activePlayerRankingMode),
    }))
    .filter((row) => row.value !== null)
    .sort((a, b) => b.value - a.value || b.appearances - a.appearances || a.player.localeCompare(b.player))
    .slice(0, 15);
}

function renderRankingItem(row, index, metric) {
  return '<div class="player-ranking-row">' +
    '<span class="player-ranking-pos">' + (index + 1) + '</span>' +
    '<div class="player-ranking-name">' +
      '<strong>' + row.player + '</strong>' +
      '<small>' + row.team + (row.club ? ' &middot; ' + row.club : '') + (row.appearances ? ' &middot; ' + row.appearances + ' pres.' : '') + '</small>' +
    '</div>' +
    '<span class="player-ranking-value">' + formatPlayerRankingValue(row.value, metric.decimals) + '</span>' +
  '</div>';
}

function renderRankingCard(rows, metric) {
  if (activePlayerRankingMode === "top-five" && !metric.topFive) return "";
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
  const markup = playerRankingSections.map((metric) => renderRankingCard(rows, metric)).join("");
  playerRankingsEmpty.style.display = markup ? "none" : "block";
  playerRankingsContent.innerHTML = markup;
}

playerRankingModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activePlayerRankingMode = button.dataset.playerRankingMode || "all";
    playerRankingModeButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderPlayerRankings();
  });
});

playerRankingSearch.addEventListener("input", renderPlayerRankings);
renderPlayerRankings();
