const playerRankingSearch = document.getElementById("player-ranking-search");
const playerRankingsContent = document.getElementById("player-rankings-content");
const playerRankingsEmpty = document.getElementById("player-rankings-empty");
const playerRankingModeButtons = Array.from(document.querySelectorAll("[data-player-ranking-mode]"));

const playerRankingStats = typeof playerStats !== "undefined" ? playerStats : {};
const playerRankingDataRows = typeof rows !== "undefined" ? rows : [];
let activePlayerRankingMode = "all";

const playerRankingSections = [
  { key: "averageRating", label: "Rating medio", source: "Diretta", decimals: 2, topFive: true, tone: "rating" },
  { key: "goals", label: "Gol", source: "Diretta", decimals: 0, topFive: true, tone: "goals" },
  { key: "assists", label: "Assist", source: "Diretta", decimals: 0, topFive: true, tone: "assists" },
  { key: "shotsPerGame", label: "Tiri medi", source: "SofaScore", decimals: 2, topFive: false, tone: "shots", excludeGoalkeepers: true },
  { key: "shotsOnTargetPerGame", label: "Tiri in porta medi", source: "SofaScore", decimals: 2, topFive: false, tone: "shots", excludeGoalkeepers: true },
  { key: "foulsCommittedPerGame", label: "Falli commessi medi", source: "SofaScore", decimals: 2, topFive: false, tone: "fouls", excludeGoalkeepers: true },
  { key: "foulsSufferedPerGame", label: "Falli subiti medi", source: "SofaScore", decimals: 2, topFive: false, tone: "fouls", excludeGoalkeepers: true },
  { key: "goalsConcededPerGame", label: "Media gol subiti", source: "Diretta", decimals: 2, topFive: false, tone: "keepers", goalkeepersOnly: true, sort: "asc" },
  { key: "yellowCards", label: "Cartellini gialli", source: "Diretta", decimals: 0, topFive: true, tone: "yellow-cards" },
  { key: "redCards", label: "Cartellini rossi", source: "Diretta", decimals: 0, topFive: true, tone: "red-cards" },
];

const worldChampionGroups = [
  {
    team: "Argentina",
    year: "2022",
    players: [
      ["Lionel Messi"],
      ["Emiliano Martínez", "Dibu Martínez"],
      ["Cristian Romero"],
      ["Nicolás Otamendi", "Otamendi"],
      ["Nahuel Molina"],
      ["Rodrigo De Paul"],
      ["Leandro Paredes"],
      ["Enzo Fernández"],
      ["Alexis Mac Allister"],
      ["Julián Álvarez"],
      ["Lautaro Martínez"],
    ],
  },
  {
    team: "Francia",
    year: "2018",
    players: [
      ["Kylian Mbappé"],
      ["Ousmane Dembélé"],
      ["Lucas Hernández"],
      ["Benjamin Pavard"],
      ["Presnel Kimpembe"],
    ],
  },
  {
    team: "Germania",
    year: "2014",
    players: [
      ["Manuel Neuer"],
      ["Joshua Kimmich"],
    ],
  },
];

function foldPlayerRanking(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function numberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function championKey(team, player) {
  return foldPlayerRanking(team + "::" + player);
}

const worldChampionIndex = worldChampionGroups.reduce((index, group) => {
  group.players.forEach((names) => {
    names.forEach((name) => {
      index[championKey(group.team, name)] = { team: group.team, year: group.year, label: names[0] };
    });
  });
  return index;
}, {});

function championFor(record) {
  return worldChampionIndex[championKey(record.team, record.player)] || null;
}

function playerRoleKey(team, player) {
  return foldPlayerRanking(team + "::" + player);
}

const playerRoleIndex = playerRankingDataRows.reduce((index, row) => {
  index[playerRoleKey(row.team, row.player)] = row.role;
  return index;
}, {});

function roleFor(record) {
  return playerRoleIndex[playerRoleKey(record.team, record.player)] || "";
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
    if (!topFiveStats) return null;
    if (Object.prototype.hasOwnProperty.call(topFiveStats, key)) return numberValue(topFiveStats[key]);
  }
  const recent = record.recent15 || {};
  const advanced = recent.advanced || {};
  if (key === "goalsConcededPerGame" && activePlayerRankingMode !== "top-five") {
    return numberValue(recent.nationalGoalkeeper?.goalsConcededPerGame) ?? numberValue(recent.goalsConcededPerGame);
  }
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
      champion: championFor(record),
      isGoalkeeper: roleFor(record) === "Portieri",
      record,
    }));
}

function matchesPlayerRanking(row, query) {
  if (!query) return true;
  return foldPlayerRanking([row.player, row.team, row.club, row.age].join(" ")).includes(query);
}

function rankingForMetric(rows, metric) {
  return rows
    .filter((row) => !metric.goalkeepersOnly || row.isGoalkeeper)
    .filter((row) => !metric.excludeGoalkeepers || !row.isGoalkeeper)
    .map((row) => ({
      ...row,
      appearances: activePlayerRankingMode === "top-five" ? row.topFiveAppearances : row.appearances,
      value: statValueFor(row.record, metric.key, activePlayerRankingMode),
    }))
    .filter((row) => activePlayerRankingMode !== "top-five" || row.appearances > 0)
    .filter((row) => row.value !== null)
    .sort((a, b) => {
      const direction = metric.sort === "asc" ? a.value - b.value : b.value - a.value;
      return direction || b.appearances - a.appearances || a.player.localeCompare(b.player);
    })
    .slice(0, 15);
}

function renderRankingItem(row, index, metric) {
  const championBadge = row.champion ? '<span class="world-champion-mini">Campione ' + row.champion.year + '</span>' : '';
  return '<div class="player-ranking-row">' +
    '<span class="player-ranking-pos">' + (index + 1) + '</span>' +
    '<div class="player-ranking-name">' +
      '<strong>' + row.player + championBadge + '</strong>' +
      '<small>' + row.team + (row.club ? ' &middot; ' + row.club : '') + (row.appearances ? ' &middot; ' + row.appearances + ' pres.' : '') + '</small>' +
    '</div>' +
    '<span class="player-ranking-value">' + formatPlayerRankingValue(row.value, metric.decimals) + '</span>' +
  '</div>';
}

function renderRankingCard(rows, metric) {
  const ranking = rankingForMetric(rows, metric);
  if (!ranking.length) return "";
  return '<details class="player-ranking-card player-ranking-tone-' + metric.tone + '">' +
    '<summary class="player-ranking-head">' +
      '<div><span>' + metric.source + '</span><h3>' + metric.label + '</h3></div>' +
      '<span class="player-ranking-head-actions"><strong>Top 15</strong><i aria-hidden="true"></i></span>' +
    '</summary>' +
    '<div class="player-ranking-list">' +
      ranking.map((row, index) => renderRankingItem(row, index, metric)).join("") +
    '</div>' +
  '</details>';
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
