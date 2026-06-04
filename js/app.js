const roleOrder = ["Portieri", "Difensori", "Centrocampisti", "Attaccanti"];
let activeGroup = "Tutti";

const tabs = document.getElementById("tabs");
const content = document.getElementById("content");
const search = document.getElementById("search");
const empty = document.getElementById("empty");
const statsStore = typeof playerStats !== "undefined" ? playerStats : {};
const insightsStore = typeof teamInsights !== "undefined" ? teamInsights : {};
const captainsStore = typeof teamCaptains !== "undefined" ? teamCaptains : {};

function fold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function statKey(row) {
  return fold(row.team + "::" + row.player);
}

function valueOrBlank(value) {
  return value === 0 || value ? value : "";
}

function getStats(row) {
  const roleKey = statKey(row) + "::" + fold(row.role);
  const stats = statsStore[roleKey] || statsStore[statKey(row)] || {};
  const career = stats.career || {};
  const season = stats.season2025_26 || {};
  const recent = stats.recent15 || {};
  const advanced = recent.advanced || {};
  return {
    age: valueOrBlank(stats.age) || valueOrBlank(row.age),
    career: {
      worldCupEditions: valueOrBlank(career.worldCupEditions) || valueOrBlank(row.worldCupsPlayed) || valueOrBlank(row.worldCupAppearances),
      worldCupAppearances: valueOrBlank(career.worldCupAppearances) || valueOrBlank(row.worldCupMatches),
      clubAppearances: valueOrBlank(career.clubAppearances) || valueOrBlank(row.clubMatches),
      nationalAppearances: valueOrBlank(career.nationalAppearances) || valueOrBlank(row.nationalTeamMatches) || valueOrBlank(row.caps),
      goals: valueOrBlank(career.goals) || valueOrBlank(row.goals),
      assists: valueOrBlank(career.assists) || valueOrBlank(row.assists),
      goalsConceded: valueOrBlank(career.goalsConceded) || valueOrBlank(row.goalsConceded),
      goalsConcededPerGame: valueOrBlank(career.goalsConcededPerGame) || valueOrBlank(row.goalsConcededPerGame),
      yellowCards: valueOrBlank(career.yellowCards) || valueOrBlank(row.yellowCards),
      redCards: valueOrBlank(career.redCards) || valueOrBlank(row.redCards),
    },
    season2025_26: {
      appearances: valueOrBlank(season.appearances),
      starts: valueOrBlank(season.starts),
      subIns: valueOrBlank(season.subIns),
      minutes: valueOrBlank(season.minutes),
      goals: valueOrBlank(season.goals),
      assists: valueOrBlank(season.assists),
      goalsConceded: valueOrBlank(season.goalsConceded),
      goalsConcededPerGame: valueOrBlank(season.goalsConcededPerGame),
      yellowCards: valueOrBlank(season.yellowCards),
      redCards: valueOrBlank(season.redCards),
      matchesSample: valueOrBlank(season.matchesSample),
    },
    recent15: {
      appearances: valueOrBlank(recent.appearances),
      minutes: valueOrBlank(recent.minutes),
      goals: valueOrBlank(recent.goals),
      assists: valueOrBlank(recent.assists),
      goalsConceded: valueOrBlank(recent.goalsConceded),
      goalsConcededMatches: valueOrBlank(recent.goalsConcededMatches),
      goalsConcededPerGame: valueOrBlank(recent.goalsConcededPerGame),
      yellowCards: valueOrBlank(recent.yellowCards),
      redCards: valueOrBlank(recent.redCards),
      averageRating: valueOrBlank(recent.averageRating),
      scope: valueOrBlank(recent.scope),
      advanced: {
        shotsPerGame: valueOrBlank(advanced.shotsPerGame),
        shotsOnTargetPerGame: valueOrBlank(advanced.shotsOnTargetPerGame),
        foulsCommittedPerGame: valueOrBlank(advanced.foulsCommittedPerGame),
        foulsSufferedPerGame: valueOrBlank(advanced.foulsSufferedPerGame),
      },
    },
    sources: stats.sources || [],
  };
}

function teamInsight(team) {
  return insightsStore[team] || {};
}

function cleanNameTokens(value) {
  return fold(value).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function starterMatchesPlayer(starter, player) {
  const starterName = fold(starter);
  const playerName = fold(player);
  if (!starterName || !playerName) return false;
  if (starterName.length > 2 && (playerName.includes(starterName) || starterName.includes(playerName))) return true;

  const starterTokens = cleanNameTokens(starter).filter((token) => token.length > 1);
  const playerTokens = cleanNameTokens(player).filter((token) => token.length > 1);
  if (!starterTokens.length || !playerTokens.length) return false;
  if (starterTokens.length === 1) {
    const token = starterTokens[0];
    return playerTokens.includes(token) || playerTokens[playerTokens.length - 1] === token;
  }
  return starterTokens.every((token) => playerTokens.includes(token));
}

function isProbableStarter(row) {
  const starters = teamInsight(row.team).starters || [];
  return starters.some((starter) => starterMatchesPlayer(starter, row.player));
}

function isCaptain(row) {
  const captains = captainsStore[row.team] || [];
  return captains.some((captain) => starterMatchesPlayer(captain, row.player));
}

function stat(value) {
  return value === 0 || value ? value : "n.d.";
}

function flagImg(team, className) {
  const src = teamFlags[team];
  return src ? '<img class="' + className + '" src="' + src + '" alt="Bandiera ' + team + '" loading="lazy">' : "";
}

function makeTabs() {
  ["Tutti", ...Object.keys(groupTeams)].forEach((group) => {
    const button = document.createElement("button");
    button.className = "tab" + (group === "Tutti" ? " tab-all-groups" : "") + (group === activeGroup ? " active" : "");
    button.style.setProperty("--group-color", groupColors[group] || "#1d2329");
    if (group === "Tutti") {
      button.innerHTML = '<div class="tab-title">Tutti i gironi</div><div class="tab-all">48 nazionali e ' + rows.length + ' calciatori</div>';
    } else {
      button.innerHTML = '<div class="tab-title">Girone ' + group + '</div><div class="tab-teams">' + groupTeams[group].map((team) => '<div class="tab-team">' + flagImg(team, "tab-flag") + '<span>' + team + '</span></div>').join("") + '</div>';
    }
    button.addEventListener("click", () => {
      activeGroup = group;
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      render();
    });
    tabs.appendChild(button);
  });
}

function matches(row, query) {
  if (!query) return true;
  const stats = getStats(row);
  const haystack = fold([
    row.group, row.team, row.role, row.player, row.club, row.clubCountry, row.league, row.status,
    isCaptain(row) ? "capitano" : "",
    stats.age,
    ...Object.values(stats.career),
    ...Object.values(stats.season2025_26),
    ...Object.values(stats.recent15)
  ].join(" "));
  return haystack.includes(query);
}

function visibleRows() {
  const query = fold(search.value.trim());
  return rows.filter((row) => (query || activeGroup === "Tutti" || row.group === activeGroup) && matches(row, query));
}

function statChip(label, value) {
  return '<span class="stat-chip"><b>' + label + '</b>' + stat(value) + '</span>';
}

function hasStatValue(value) {
  return value === 0 || (value !== undefined && value !== null && value !== "");
}

function optionalStatChip(label, value) {
  return hasStatValue(value) ? statChip(label, value) : "";
}

function statLine(label, value) {
  return '<div class="player-stat-line"><span>' + label + '</span><strong>' + stat(value) + '</strong></div>';
}

function statLineList(items) {
  const available = items.filter(([, value]) => hasStatValue(value));
  if (!available.length) return '<div class="player-stat-list"><div class="player-stat-empty">Statistiche non disponibili</div></div>';
  return '<div class="player-stat-list">' + available.map(([label, value]) => statLine(label, value)).join("") + '</div>';
}

function goalsConcededAverage(goalsConceded, appearances) {
  const goals = Number(goalsConceded);
  const games = Number(appearances);
  if (!Number.isFinite(goals) || !Number.isFinite(games) || games <= 0) return "";
  return (goals / games).toFixed(2);
}

function goalkeeperConcededAverage(stats) {
  return stats.recent15.nationalGoalkeeper?.goalsConcededPerGame
    || stats.season2025_26.goalsConcededPerGame
    || goalsConcededAverage(stats.season2025_26.goalsConceded, stats.season2025_26.appearances)
    || stats.career.goalsConcededPerGame
    || goalsConcededAverage(stats.career.goalsConceded, stats.career.clubAppearances);
}

function playerStatsHtml(row) {
  const stats = getStats(row);
  const s = stats.season2025_26;
  const recent = stats.recent15;
  const advanced = recent.advanced || {};
  const nationalGoalkeeper = recent.nationalGoalkeeper || {};
  const hasRecent = Object.values(recent).some(Boolean);
  const hasNationalGoalkeeper = Object.values(nationalGoalkeeper).some(Boolean);
  const hasDirettaSource = stats.sources.some((source) => fold(source).includes("diretta.it"));
  const sourceLabel = hasDirettaSource ? "Diretta" : (stats.sources.length ? stats.sources.length + ' fonti' : 'fonti da aggiungere');
  const seasonLabel = hasDirettaSource ? "Ultime 15 partite in nazionale" : "Stagione 2025/26";
  const isGoalkeeper = row.role === "Portieri";
  const seasonItems = [
    ['Presenze', s.appearances],
    ['Titolare', s.starts],
    ['Subentra', s.subIns],
    ...(isGoalkeeper ? [['Media gol subiti', goalkeeperConcededAverage(stats)]] : [['Goal', s.goals], ['Assist', s.assists]]),
    ['Gialli', s.yellowCards],
    ['Rossi', s.redCards],
  ];
  const nationalGoalkeeperItems = [
    ['Presenze', nationalGoalkeeper.appearances],
    ['Gol subiti', nationalGoalkeeper.goalsConceded],
    ['Media gol subiti', nationalGoalkeeper.goalsConcededPerGame],
    ['Rating medio', nationalGoalkeeper.averageRating],
  ];
  const recentItems = [
    ['Ambito', recent.scope || 'Club + nazionale'],
    ['Presenze', recent.appearances],
    ...(isGoalkeeper ? [['Media gol subiti', recent.goalsConcededPerGame], ['Rating medio', recent.averageRating]] : [['Goal', recent.goals], ['Assist', recent.assists]]),
    ['Gialli', recent.yellowCards],
    ['Rossi', recent.redCards],
    ...(isGoalkeeper ? [] : [
      ['Rating medio', recent.averageRating],
      ['Tiri medi', advanced.shotsPerGame],
      ['Tiri in porta medi', advanced.shotsOnTargetPerGame],
      ['Falli commessi medi', advanced.foulsCommittedPerGame],
      ['Falli subiti medi', advanced.foulsSufferedPerGame],
    ]),
  ];

  return '<div class="player-stats-panel">'
    + '<div class="stats-row stats-row-top">'
    + optionalStatChip('Et&agrave;', stats.age)
    + statChip('Fonti', sourceLabel)
    + '</div>'
    + '<details class="stats-details">'
    + '<summary>' + seasonLabel + '</summary>'
    + statLineList(seasonItems)
    + '</details>'
    + (isGoalkeeper && hasNationalGoalkeeper ? '<details class="stats-details" open>'
      + '<summary>Ultime 15 partite in nazionale</summary>'
      + statLineList(nationalGoalkeeperItems)
      + '</details>' : '')
    + (hasRecent ? '<details class="stats-details">'
      + '<summary>Ultime 15 partite generali</summary>'
      + statLineList(recentItems)
      + '</details>' : '')
    + '</div>';
}

function render() {
  const filtered = visibleRows();
  const hasSearch = Boolean(search.value.trim());
  content.innerHTML = "";
  empty.style.display = filtered.length ? "none" : "block";

  const groups = activeGroup === "Tutti" ? Object.keys(groupTeams) : [activeGroup];
  for (const group of groups) {
    const groupRows = filtered.filter((row) => row.group === group);
    if (!groupRows.length) continue;

    const section = document.createElement("section");
    section.style.setProperty("--group-color", groupColors[group] || "#1f7a5b");
    section.innerHTML = '<div class="group-title"><h2>Girone ' + group + '</h2><span class="badge">' + groupRows.length + ' calciatori</span></div>';
    const grid = document.createElement("div");
    grid.className = "team-grid";

    for (const team of groupTeams[group]) {
      const teamRows = groupRows.filter((row) => row.team === team);
      if (!teamRows.length) continue;
      const status = teamRows.some((row) => row.status !== "Ufficiale") ? teamRows.find((row) => row.status !== "Ufficiale").status : "Ufficiale";
      const insight = teamInsight(team);
      const coach = insight.coach ? '<div class="team-coach">Allenatore: <strong>' + insight.coach + '</strong></div>' : "";
      const card = document.createElement("details");
      card.className = "team";
      card.open = hasSearch;
      card.style.setProperty("--group-color", groupColors[group] || "#1f7a5b");
      card.innerHTML = '<summary class="team-head"><div><div class="team-name-row">' + flagImg(team, "flag") + '<h3>' + team + '</h3></div><div class="sub">Girone ' + group + '</div>' + coach + '</div><span class="team-head-meta"><span class="badge ' + (status === "Ufficiale" ? "" : "warn") + '">' + status + ' &middot; ' + teamRows.length + '</span><span class="team-toggle" aria-hidden="true"></span></span></summary>';
      const teamBody = document.createElement("div");
      teamBody.className = "team-body";

      for (const role of roleOrder) {
        const roleRows = teamRows.filter((row) => row.role === role).sort((a, b) => a.player.localeCompare(b.player));
        if (!roleRows.length) continue;
        const roleBlock = document.createElement("div");
        roleBlock.className = "role";
        roleBlock.dataset.role = role;
        roleBlock.innerHTML = '<div class="role-title">' + role + '</div><div class="players">' + roleRows.map((row) => {
          const club = row.club ? row.club : "Club non indicato";
          const country = row.clubCountry ? row.clubCountry : "Non indicato";
          const league = row.league ? row.league : "Non indicata";
          const probableStarter = isProbableStarter(row);
          const captain = isCaptain(row);
          return '<div class="player player-expanded ' + (probableStarter ? 'is-probable-starter' : '') + (captain ? ' is-captain' : '') + '">'
            + '<div class="player-main"><div class="name">' + row.player + (captain ? '<span class="captain-pill">Capitano</span>' : '') + (probableStarter ? '<span class="starter-pill">Probabile titolare</span>' : '') + '</div><div class="club">' + club + ' <span class="country">(' + country + ' &middot; ' + league + ')</span></div></div>'
            + playerStatsHtml(row)
            + '</div>';
        }).join("") + '</div>';
        teamBody.appendChild(roleBlock);
      }
      card.appendChild(teamBody);
      grid.appendChild(card);
    }
    section.appendChild(grid);
    content.appendChild(section);
  }
}

search.addEventListener("input", render);
makeTabs();
render();
