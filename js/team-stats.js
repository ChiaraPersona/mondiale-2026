const teamStatsSearch = document.getElementById("team-stats-search");
const teamStatsContent = document.getElementById("team-stats-content");
const teamStatsEmpty = document.getElementById("team-stats-empty");

const teamStatsSections = [
  {
    title: "Disciplina",
    tone: "discipline",
    metrics: [
      ["yellowCards", "Cartellini gialli totali"],
      ["redCards", "Cartellini rossi totali"],
      ["cardsPerGame", "Cartellini per partita"],
      ["cardsAgainstPerGame", "Cartellini avversari per partita"],
    ],
  },
  {
    title: "Attacco",
    tone: "attack",
    metrics: [
      ["xgFor", "xG per partita"],
      ["cornersFor", "Corner per partita"],
      ["shotsFor", "Tiri per partita"],
      ["shotsOnTargetFor", "Tiri in porta per partita"],
      ["offsidesFor", "Fuorigioco per partita"],
    ],
  },
  {
    title: "Concessi",
    tone: "against",
    metrics: [
      ["xgAgainst", "xGA per partita"],
      ["cornersAgainst", "Corner concessi per partita"],
      ["shotsAgainst", "Tiri concessi per partita"],
      ["shotsOnTargetAgainst", "Tiri in porta concessi per partita"],
      ["offsidesAgainst", "Fuorigioco concessi per partita"],
    ],
  },
  {
    title: "Controllo",
    tone: "control",
    metrics: [
      ["possession", "Possesso medio"],
      ["foulsFor", "Falli per partita"],
      ["foulsAgainst", "Falli concessi per partita"],
    ],
  },
];

function foldTeamStat(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function sumMatches(matches, key) {
  return matches.reduce((sum, match) => Number.isFinite(Number(match[key])) ? sum + Number(match[key]) : sum, 0);
}

function countMatchesWithMetric(matches, keys) {
  return matches.filter((match) => keys.some((key) => Number.isFinite(Number(match[key])))).length;
}

function averageMatches(matches, key) {
  const values = matches.map((match) => Number(match[key])).filter(Number.isFinite);
  if (!values.length) return "";
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function hasMetric(matches, key) {
  return matches.some((match) => Number.isFinite(Number(match[key])));
}

function hasCompleteTeamStats(match) {
  return ["xgFor", "possession", "shotsFor", "shotsOnTargetFor", "cornersFor", "offsidesFor", "foulsFor"]
    .every((key) => Number.isFinite(Number(match[key])));
}

function rounded(value) {
  if (value === "" || value === undefined || value === null) return "";
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return Number.isInteger(number) ? String(number) : number.toFixed(1);
}

function aggregateTeamStats(team) {
  const matches = (team.matches || []).slice(0, team.sampleSize || 15);
  const teamTotals = team.teamTotals || {};
  const yellowCards = sumMatches(matches, "yellowCards");
  const redCards = sumMatches(matches, "redCards");
  const opponentYellowCards = sumMatches(matches, "opponentYellowCards");
  const opponentRedCards = sumMatches(matches, "opponentRedCards");
  const hasOwnCards = hasMetric(matches, "yellowCards") || hasMetric(matches, "redCards");
  const hasOpponentCards = hasMetric(matches, "opponentYellowCards") || hasMetric(matches, "opponentRedCards");
  const ownCardMatches = countMatchesWithMetric(matches, ["yellowCards", "redCards"]);
  const opponentCardMatches = countMatchesWithMetric(matches, ["opponentYellowCards", "opponentRedCards"]);

  return {
    matchesUsed: matches.length,
    completeStats: matches.filter(hasCompleteTeamStats).length,
    yellowCards: hasOwnCards ? yellowCards : teamTotals.yellowCards ?? "",
    redCards: hasOwnCards ? redCards : teamTotals.redCards ?? "",
    cardsPerGame: hasOwnCards && ownCardMatches ? (yellowCards + redCards) / ownCardMatches : "",
    cardsAgainstPerGame: hasOpponentCards && opponentCardMatches ? (opponentYellowCards + opponentRedCards) / opponentCardMatches : "",
    xgFor: averageMatches(matches, "xgFor"),
    xgAgainst: averageMatches(matches, "xgAgainst"),
    cornersFor: averageMatches(matches, "cornersFor"),
    cornersAgainst: averageMatches(matches, "cornersAgainst"),
    shotsFor: averageMatches(matches, "shotsFor"),
    shotsAgainst: averageMatches(matches, "shotsAgainst"),
    shotsOnTargetFor: averageMatches(matches, "shotsOnTargetFor"),
    shotsOnTargetAgainst: averageMatches(matches, "shotsOnTargetAgainst"),
    offsidesFor: averageMatches(matches, "offsidesFor"),
    offsidesAgainst: averageMatches(matches, "offsidesAgainst"),
    possession: averageMatches(matches, "possession"),
    foulsFor: averageMatches(matches, "foulsFor"),
    foulsAgainst: averageMatches(matches, "foulsAgainst"),
  };
}

function formatTeamStat(value, key) {
  if (value === "" || value === undefined || value === null) return "";
  return key === "possession" ? rounded(value) + "%" : rounded(value);
}

function renderTeamMetric(metrics, key, label) {
  const value = formatTeamStat(metrics[key], key);
  if (!value) return "";
  return '<div class="team-stats-row">' +
    '<span>' + label + '</span>' +
    '<strong>' + value + '</strong>' +
  '</div>';
}

function renderTeamStatsSection(metrics, section) {
  const rows = section.metrics.map(([key, label]) => renderTeamMetric(metrics, key, label)).join("");
  if (!rows) return "";
  return '<section class="team-stats-section team-stats-tone-' + section.tone + '">' +
    '<h4>' + section.title + '</h4>' +
    '<div class="team-stats-table">' + rows + '</div>' +
  '</section>';
}

function renderMatchSources(matches) {
  if (!matches.length) return "";
  return '<details class="team-stats-matches">' +
    '<summary>Partite inserite</summary>' +
    '<div>' + matches.map((match) => {
      const label = [match.date, match.opponent, match.score].filter(Boolean).join(" &middot; ");
      return '<a href="' + match.source + '" target="_blank" rel="noreferrer">' + label + '</a>';
    }).join("") + '</div>' +
  '</details>';
}

function renderDataNotes(team) {
  const notes = [];
  if (team.teamTotals && team.teamTotals.source) {
    notes.push('<a href="' + team.teamTotals.source + '" target="_blank" rel="noreferrer">Pagina squadra su Diretta</a>');
  }
  if (!notes.length) return "";
  return '<div class="team-stats-notes-inline">' + notes.join("") + '</div>';
}

function renderTeamCard(team) {
  const metrics = aggregateTeamStats(team);
  const sections = teamStatsSections.map((section) => renderTeamStatsSection(metrics, section)).join("");
  const sampleText = metrics.matchesUsed + "/" + (team.sampleSize || 15) + " partite Diretta" +
    " &middot; " + metrics.completeStats + " con statistiche complete";

  return '<details class="team-stats-card">' +
    '<summary class="team-stats-card-head">' +
      '<div class="team-name-row">' +
        '<img class="flag" src="' + team.flag + '" alt="Bandiera ' + team.team + '" loading="lazy">' +
        '<div><h3>' + team.team + '</h3><p>Girone ' + team.group + ' &middot; ' + sampleText + '</p></div>' +
      '</div>' +
      '<span class="team-stats-head-actions"><span class="badge">' + team.status + '</span><span class="team-stats-toggle" aria-hidden="true"></span></span>' +
    '</summary>' +
    '<div class="team-stats-card-body">' +
      '<div class="team-stats-meta">' +
        '<span>Fonte unica: <strong>Diretta.it</strong></span>' +
        '<a href="' + team.source + '" target="_blank" rel="noreferrer">Apri Diretta</a>' +
      '</div>' +
      (sections ? '<div class="team-stats-section-grid">' + sections + '</div>' : '<div class="team-stats-waiting">Nessuna statistica Diretta inserita per questa nazionale.</div>') +
      renderDataNotes(team) +
      renderMatchSources(team.matches || []) +
    '</div>' +
  '</details>';
}

function renderTeamGroup(group, teams, isOpen) {
  const complete = teams.reduce((sum, team) => sum + aggregateTeamStats(team).completeStats, 0);
  const total = teams.reduce((sum, team) => sum + Math.min((team.matches || []).length, team.sampleSize || 15), 0);
  const flags = teams.map((team) => (
    '<img class="team-stats-group-flag" src="' + team.flag + '" alt="Bandiera ' + team.team + '" title="' + team.team + '" loading="lazy">'
  )).join("");
  return '<details class="team-stats-group"' + (isOpen ? ' open' : '') + '>' +
    '<summary class="team-stats-group-title">' +
      '<span class="team-stats-group-label"><span>Girone ' + group + '</span><span class="team-stats-group-flags">' + flags + '</span></span>' +
      '<small>' + teams.length + ' squadre &middot; ' + complete + '/' + total + ' complete</small>' +
    '</summary>' +
    '<div class="team-stats-group-body">' + teams.map(renderTeamCard).join("") + '</div>' +
  '</details>';
}

function renderTeamStats() {
  const query = foldTeamStat(teamStatsSearch.value.trim());
  const filtered = teamStatsData.filter((team) => foldTeamStat(team.team).includes(query));
  const groups = filtered.reduce((list, team) => {
    const current = list[list.length - 1];
    if (!current || current.group !== team.group) list.push({ group: team.group, teams: [team] });
    else current.teams.push(team);
    return list;
  }, []);

  teamStatsContent.innerHTML = "";
  teamStatsEmpty.style.display = filtered.length ? "none" : "block";
  teamStatsContent.innerHTML = groups.map((group) => renderTeamGroup(group.group, group.teams, Boolean(query))).join("");
}

teamStatsSearch.addEventListener("input", renderTeamStats);
renderTeamStats();
