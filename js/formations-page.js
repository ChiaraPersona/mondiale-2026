const formationsContent = document.getElementById("formations-content");
const formationsHighlights = document.getElementById("formations-highlights");
const formationsSearch = document.getElementById("formations-search");
const formationsTier = document.getElementById("formations-tier");
const formationsConfed = document.getElementById("formations-confed");
const formationsModule = document.getElementById("formations-module");
const formationsSort = document.getElementById("formations-sort");

function formationFold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function formationEscape(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function formationFlag(team) {
  const src = teamFlags[team];
  return src ? '<img class="formation-flag" src="' + src + '" alt="Bandiera ' + formationEscape(team) + '" loading="lazy">' : "";
}

function formationSlug(value) {
  return formationFold(value).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formationImage(team) {
  const src = "assets/formations/" + formationSlug(team) + ".png";
  return '<figure class="formation-image-wrap"><img src="' + src + '" alt="Probabile formazione ' + formationEscape(team) + '" loading="lazy"></figure>';
}

function formationMeta(team) {
  const base = formationInsights[team] || {};
  const fallbackTaker = (typeof penaltyTakers !== "undefined" ? penaltyTakers[team] || [] : [])[0] || "";
  const data = probableFormations[team] || {};
  return {
    tier: base.tier || "mid_tier",
    confed: base.confed || "n.d.",
    worldCupIndex: base.worldCupIndex || 70,
    captain: base.captain || data.starters?.[0] || "n.d.",
    penaltyTaker: base.penaltyTaker || fallbackTaker || "n.d.",
    mainStriker: base.mainStriker || data.starters?.[10] || "n.d.",
    starPlayer: base.starPlayer || base.keyPlayers?.[0] || data.starters?.[10] || "n.d.",
    keyPlayers: base.keyPlayers || [],
    bettingAngles: base.bettingAngles || [],
    insight: base.insight || "Profilo da aggiornare con nuove gerarchie e dati recenti.",
  };
}

function formationLines(module, starters) {
  const parts = String(module || "").split("-").map((part) => Number(part)).filter(Number.isFinite);
  if (!parts.length || starters.length < 2) return [{ label: "XI", players: starters }];
  const lines = [];
  let index = 0;
  lines.push({ label: "Portiere", players: starters.slice(index, index + 1) });
  index += 1;
  const labels = ["Difesa", parts.length === 4 ? "Mediana" : "Centrocampo", parts.length > 2 ? "Trequarti" : "Attacco", "Attacco"];
  parts.forEach((count, partIndex) => {
    lines.push({ label: labels[partIndex] || "Linea", players: starters.slice(index, index + count) });
    index += count;
  });
  if (index < starters.length) lines[lines.length - 1].players.push(...starters.slice(index));
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
    .slice(0, 18);
}

function formationStarterLabel(team, starter) {
  const match = (typeof rows !== "undefined" ? rows : [])
    .filter((row) => row.team === team)
    .find((row) => formationPlayerMatches(starter, row));
  return match ? match.player : starter;
}

function formationRoleInitial(role) {
  if (role === "Portieri") return "P";
  if (role === "Difensori") return "D";
  if (role === "Centrocampisti") return "C";
  if (role === "Attaccanti") return "A";
  return "";
}

function formationPlayerRole(team, starter) {
  const match = (typeof rows !== "undefined" ? rows : [])
    .filter((row) => row.team === team)
    .find((row) => formationPlayerMatches(starter, row));
  return match ? formationRoleInitial(match.role) : "";
}

function formationPenaltyBox(team) {
  const takers = typeof penaltyTakers !== "undefined" ? penaltyTakers[team] || [] : [];
  if (!takers.length) return "";
  return '<div class="formation-penalties"><span>Gerarchia rigoristi</span><ol>' +
    takers.map((player, index) => '<li><b>' + (index + 1) + '</b><strong>' + formationEscape(player) + '</strong></li>').join("") +
  '</ol></div>';
}

function formationChips(items, className = "") {
  return (items || []).map((item) => '<span class="' + className + '">' + formationEscape(item) + '</span>').join("");
}

function formationCardSearchText(team) {
  const data = probableFormations[team] || {};
  const meta = formationMeta(team);
  const fullStarters = (data.starters || []).map((starter) => formationStarterLabel(team, starter));
  return [team, data.module, data.coach, meta.tier, meta.confed, meta.captain, meta.penaltyTaker, meta.mainStriker, meta.starPlayer, ...meta.keyPlayers, ...meta.bettingAngles, ...fullStarters, ...(data.starters || [])].join(" ");
}

function renderFormationCard(team, group, isOpen = false) {
  const data = probableFormations[team] || {};
  const meta = formationMeta(team);
  const starters = data.starters || [];
  const reserves = formationReserves(team, starters);
  const tierLabel = formationTierLabels[meta.tier] || meta.tier;
  return '<details class="formation-card formation-tier-' + formationEscape(meta.tier) + '"' + (isOpen ? " open" : "") + ' style="--group-color:' + (groupColors[group] || "#00d084") + '">' +
    '<summary class="formation-card-head">' +
      '<div class="formation-team-title">' + formationFlag(team) + '<div><h3>' + formationEscape(team) + '</h3><span>Girone ' + formationEscape(group) + ' &middot; ' + formationEscape(meta.confed) + '</span></div></div>' +
      '<div class="formation-meta"><strong>' + formationEscape(data.module || "Modulo n.d.") + '</strong><span>' + formationEscape(data.coach || "Allenatore n.d.") + '</span></div>' +
      '<div class="formation-index"><strong>' + meta.worldCupIndex + '</strong><span>Index</span></div>' +
      '<span class="formation-tier-badge">' + formationEscape(tierLabel) + '</span>' +
      '<span class="formation-toggle" aria-hidden="true"></span>' +
    '</summary>' +
    '<div class="formation-card-body">' +
      formationImage(team) +
      '<aside class="formation-side-panel">' +
        '<div class="formation-coach-box"><span>Allenatore</span><strong>' + formationEscape(data.coach || "n.d.") + '</strong></div>' +
        '<div class="formation-facts">' +
          '<p><span>Capitano</span><strong>' + formationEscape(meta.captain) + '</strong></p>' +
          '<p><span>Star player</span><strong>' + formationEscape(meta.starPlayer) + '</strong></p>' +
          '<p><span>Attaccante</span><strong>' + formationEscape(meta.mainStriker) + '</strong></p>' +
        '</div>' +
        formationPenaltyBox(team) +
        '<div class="formation-key-box"><span>Giocatori chiave</span><div>' + formationChips(meta.keyPlayers, "formation-key-chip") + '</div></div>' +
        '<div class="formation-market-box"><span>Mercati consigliati</span><div>' + formationChips(meta.bettingAngles, "formation-market-chip") + '</div></div>' +
        '<div class="formation-insight"><span>Insight</span><p>' + formationEscape(meta.insight) + '</p></div>' +
        '<div class="formation-reserves"><span>Riserve</span><div>' +
          reserves.map((row) => '<small><b>' + formationRoleInitial(row.role) + '</b>' + formationEscape(row.player) + '</small>').join("") +
        '</div></div>' +
      '</aside>' +
    '</div>' +
  '</details>';
}
function getAllFormationTeams() {
  return Object.entries(groupTeams).flatMap(([group, teams]) => teams.map((team) => ({ team, group })));
}

function filteredFormationTeams() {
  const query = formationFold(formationsSearch.value.trim());
  const tier = formationsTier.value;
  const confed = formationsConfed.value;
  const module = formationsModule.value;
  const sort = formationsSort.value;
  let teams = getAllFormationTeams().filter(({ team }) => {
    const data = probableFormations[team] || {};
    const meta = formationMeta(team);
    if (tier && meta.tier !== tier) return false;
    if (confed && meta.confed !== confed) return false;
    if (module && data.module !== module) return false;
    return !query || formationFold(formationCardSearchText(team)).includes(query);
  });

  if (sort === "index-desc") {
    teams = teams.sort((a, b) => formationMeta(b.team).worldCupIndex - formationMeta(a.team).worldCupIndex || a.team.localeCompare(b.team));
  } else if (sort === "team") {
    teams = teams.sort((a, b) => a.team.localeCompare(b.team));
  }
  return teams;
}

function renderFormationGroup(group, teams, openCards = false) {
  return '<section class="formation-group">' +
    '<div class="formation-group-head" style="--group-color:' + (groupColors[group] || "#00d084") + '">' +
      '<h2>Girone ' + formationEscape(group) + '</h2>' +
      '<span>' + teams.length + ' formazioni</span>' +
    '</div>' +
    '<div class="formation-grid">' + teams.map((team) => renderFormationCard(team, group, openCards)).join("") + '</div>' +
  '</section>';
}

function renderFlatFormationGrid(teams, openCards = false) {
  return '<section class="formation-group">' +
    '<div class="formation-group-head"><h2>Risultati filtrati</h2><span>' + teams.length + ' formazioni</span></div>' +
    '<div class="formation-grid">' + teams.map(({ team, group }) => renderFormationCard(team, group, openCards)).join("") + '</div>' +
  '</section>';
}

function renderHighlightList(title, kicker, items) {
  return '<article class="formation-highlight-card"><span>' + formationEscape(kicker) + '</span><h3>' + formationEscape(title) + '</h3><div>' +
    items.map((item) => '<small>' + formationEscape(item) + '</small>').join("") +
  '</div></article>';
}

function renderFormationHighlights() {
  const teams = getAllFormationTeams().map(({ team }) => ({ team, ...formationMeta(team) }));
  const topFavorites = teams.filter((team) => team.tier === "favorite").sort((a, b) => b.worldCupIndex - a.worldCupIndex).slice(0, 7).map((team) => team.team + " · " + team.worldCupIndex);
  const darkHorses = teams.filter((team) => team.tier === "dark_horse").sort((a, b) => b.worldCupIndex - a.worldCupIndex).slice(0, 8).map((team) => team.team + " · " + team.worldCupIndex);
  const bestStrikers = teams.sort((a, b) => b.worldCupIndex - a.worldCupIndex).map((team) => team.mainStriker).filter(Boolean).slice(0, 12);
  formationsHighlights.innerHTML =
    renderHighlightList("Top favorite", "Indice forza", topFavorites) +
    renderHighlightList("Dark horse da monitorare", "Possibili sorprese", darkHorses) +
    renderHighlightList("Top rigoristi", "Dal dischetto", formationSpotlights.penaltyTakers) +
    renderHighlightList("Top giovani", "Rivelazioni", formationSpotlights.youngPlayers) +
    renderHighlightList("Migliori attaccanti", "Riferimenti offensivi", bestStrikers) +
    renderHighlightList("Squadre sottovalutate", "Valore nascosto", formationSpotlights.underratedTeams) +
    renderHighlightList("Coppie offensive", "Combinazioni gol", formationSpotlights.attackingPairs);
}

function populateFormationFilters() {
  const teams = getAllFormationTeams().map(({ team }) => ({ team, data: probableFormations[team] || {}, meta: formationMeta(team) }));
  const tiers = [...new Set(teams.map((item) => item.meta.tier))];
  const confeds = [...new Set(teams.map((item) => item.meta.confed))].sort();
  const modules = [...new Set(teams.map((item) => item.data.module).filter(Boolean))].sort();
  tiers.forEach((tier) => formationsTier.insertAdjacentHTML("beforeend", '<option value="' + formationEscape(tier) + '">' + formationEscape(formationTierLabels[tier] || tier) + '</option>'));
  confeds.forEach((confed) => formationsConfed.insertAdjacentHTML("beforeend", '<option value="' + formationEscape(confed) + '">' + formationEscape(confed) + '</option>'));
  modules.forEach((module) => formationsModule.insertAdjacentHTML("beforeend", '<option value="' + formationEscape(module) + '">' + formationEscape(module) + '</option>'));
}

function renderFormations() {
  const teams = filteredFormationTeams();
  const queryActive = Boolean(formationsSearch.value.trim() || formationsTier.value || formationsConfed.value || formationsModule.value || formationsSort.value !== "group");
  if (!teams.length) {
    formationsContent.innerHTML = '<div class="empty">Nessuna formazione trovata.</div>';
    return;
  }
  if (formationsSort.value !== "group") {
    formationsContent.innerHTML = renderFlatFormationGrid(teams, queryActive);
    return;
  }
  const byGroup = teams.reduce((acc, item) => {
    acc[item.group] = acc[item.group] || [];
    acc[item.group].push(item.team);
    return acc;
  }, {});
  formationsContent.innerHTML = Object.entries(groupTeams).map(([group]) => (
    byGroup[group]?.length ? renderFormationGroup(group, byGroup[group], queryActive) : ""
  )).join("");
}

populateFormationFilters();
renderFormationHighlights();
[formationsSearch, formationsTier, formationsConfed, formationsModule, formationsSort].forEach((control) => {
  control.addEventListener("input", renderFormations);
  control.addEventListener("change", renderFormations);
});
renderFormations();
