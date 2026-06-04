const formationsContent = document.getElementById("formations-content");
const formationsSearch = document.getElementById("formations-search");

function formationFold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function formationFlag(team) {
  const src = teamFlags[team];
  return src ? '<img class="formation-flag" src="' + src + '" alt="Bandiera ' + team + '" loading="lazy">' : "";
}

function formationLines(module, starters) {
  const parts = String(module || "").split("-").map((part) => Number(part)).filter(Number.isFinite);
  if (!parts.length || starters.length < 2) return [starters];
  const lines = [];
  let index = 0;
  lines.push(starters.slice(index, index + 1));
  index += 1;
  parts.forEach((count) => {
    lines.push(starters.slice(index, index + count));
    index += count;
  });
  if (index < starters.length) lines[lines.length - 1].push(...starters.slice(index));
  return lines;
}

function formationPlayerMatches(starter, row) {
  const starterName = formationFold(starter);
  const playerName = formationFold(row.player);
  if (!starterName || !playerName) return false;
  if (starterName.length > 2 && (playerName.includes(starterName) || starterName.includes(playerName))) return true;
  const starterTokens = starterName.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((token) => token.length > 1);
  const playerTokens = playerName.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((token) => token.length > 1);
  if (!starterTokens.length || !playerTokens.length) return false;
  return starterTokens.every((token) => playerTokens.includes(token));
}

function formationReserves(team, starters) {
  const teamRows = (typeof rows !== "undefined" ? rows : []).filter((row) => row.team === team);
  return teamRows
    .filter((row) => !starters.some((starter) => formationPlayerMatches(starter, row)))
    .sort((a, b) => a.role.localeCompare(b.role) || a.player.localeCompare(b.player))
    .slice(0, 14);
}

function formationStarterLabel(team, starter) {
  const match = (typeof rows !== "undefined" ? rows : [])
    .filter((row) => row.team === team)
    .find((row) => formationPlayerMatches(starter, row));
  return match ? match.player : starter;
}

function formationPenaltyBox(team) {
  const takers = typeof penaltyTakers !== "undefined" ? penaltyTakers[team] || [] : [];
  if (!takers.length) return "";
  return '<div class="formation-penalties"><span>Gerarchia rigoristi</span><ol>' +
    takers.map((player, index) => '<li><b>' + (index + 1) + '</b><strong>' + player + '</strong></li>').join("") +
  '</ol></div>';
}

function renderFormationCard(team, group, isOpen = false) {
  const data = probableFormations[team] || {};
  const starters = data.starters || [];
  const lines = formationLines(data.module, starters);
  const reserves = formationReserves(team, starters);
  return '<details class="formation-card"' + (isOpen ? " open" : "") + ' style="--group-color:' + (groupColors[group] || "#00d084") + '">' +
    '<summary class="formation-card-head">' +
      '<div class="formation-team-title">' + formationFlag(team) + '<div><h3>' + team + '</h3><span>Girone ' + group + '</span></div></div>' +
      '<div class="formation-meta"><strong>' + (data.module || "Modulo n.d.") + '</strong><span>' + (data.coach || "Allenatore n.d.") + '</span></div><span class="formation-toggle" aria-hidden="true"></span>' +
    '</summary>' +
    '<div class="formation-card-body">' +
      '<div class="formation-pitch">' +
        lines.map((line, index) => '<div class="formation-line formation-line-' + index + '">' +
          line.map((player) => '<span class="formation-player">' + formationStarterLabel(team, player) + '</span>').join("") +
        '</div>').join("") +
      '</div>' +
      '<aside class="formation-side-panel">' +
        '<div class="formation-coach-box"><span>Allenatore</span><strong>' + (data.coach || "n.d.") + '</strong></div>' +
        formationPenaltyBox(team) +
        '<div class="formation-reserves"><span>Riserve</span><div>' +
          reserves.map((row) => '<small>' + row.player + '</small>').join("") +
        '</div></div>' +
      '</aside>' +
    '</div>' +
  '</details>';
}

function renderFormationGroup(group, teams, openCards = false) {
  return '<section class="formation-group">' +
    '<div class="formation-group-head" style="--group-color:' + (groupColors[group] || "#00d084") + '">' +
      '<h2>Girone ' + group + '</h2>' +
      '<span>' + teams.length + ' formazioni</span>' +
    '</div>' +
    '<div class="formation-grid">' + teams.map((team) => renderFormationCard(team, group, openCards)).join("") + '</div>' +
  '</section>';
}

function renderFormations() {
  const query = formationFold(formationsSearch.value.trim());
  const html = Object.entries(groupTeams).map(([group, teams]) => {
    const filtered = teams.filter((team) => {
      const data = probableFormations[team] || {};
      const fullStarters = (data.starters || []).map((starter) => formationStarterLabel(team, starter));
      return !query || formationFold([team, data.module, data.coach, ...fullStarters, ...(data.starters || [])].join(" ")).includes(query);
    });
    return filtered.length ? renderFormationGroup(group, filtered, Boolean(query)) : "";
  }).join("");
  formationsContent.innerHTML = html || '<div class="empty">Nessuna formazione trovata.</div>';
}

formationsSearch.addEventListener("input", renderFormations);
renderFormations();
