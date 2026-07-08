const teamStatsSelect = document.getElementById("team-stats-select");
const teamStatsContent = document.getElementById("team-stats-content");
const teamStatsEmpty = document.getElementById("team-stats-empty");
let activeTeamStatsTab = "team";
let teamStatsPlayerFilters = {
  match: "all",
  role: "all",
  metric: "shots"
};

function escapeTeamStats(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderStatRows(rows = []) {
  return rows.map(([label, value]) => `
    <div class="team-stats-row">
      <span>${escapeTeamStats(label)}</span>
      <strong>${escapeTeamStats(value)}</strong>
    </div>
  `).join("");
}

function getTeamStatsData() {
  return Array.isArray(window.teamStatsData) ? window.teamStatsData : teamStatsData;
}

function renderEmptyValue(value) {
  return escapeTeamStats(value || "-");
}

function renderPlayerValue(value) {
  return value === null || value === undefined || value === "" ? "da inserire" : escapeTeamStats(value);
}

function selectedAttr(currentValue, optionValue) {
  return currentValue === optionValue ? " selected" : "";
}

function renderTeamSelector(stats = []) {
  if (!teamStatsSelect) return;

  const currentValue = teamStatsSelect.value;
  teamStatsSelect.innerHTML = stats.map((team, index) => `
    <option value="${index}">${escapeTeamStats(team.team)}</option>
  `).join("");

  if (stats[currentValue]) {
    teamStatsSelect.value = currentValue;
  }
}

function renderAnalyzedMatches(matches = []) {
  if (!matches.length) return "";

  return `
    <details class="team-stats-matches" open>
      <summary>Partite analizzate</summary>
      <div class="team-stats-match-list">
        ${matches.map((match) => `
          <article class="team-stats-match-item">
            <h5>${escapeTeamStats(match.match)}</h5>
            <p>${escapeTeamStats(match.context)}</p>
            <div class="team-stats-table">
              ${renderStatRows(match.stats)}
            </div>
          </article>
        `).join("")}
      </div>
    </details>
  `;
}

function renderTeamStatsPanel(team) {
  return `
    <div class="team-stats-section-grid">
      <section class="team-stats-section">
        <h4>Medie da mostrare</h4>
        <div class="team-stats-table">
          ${team.averages?.length ? renderStatRows(team.averages) : '<div class="team-stats-row"><span>Dati</span><strong>da inserire</strong></div>'}
        </div>
      </section>

      <section class="team-stats-section" style="--section-color: var(--gold); --section-rgb: 245, 200, 75;">
        <h4>Lettura del modello</h4>
        <div class="team-stats-panel-copy">
          <p>${escapeTeamStats(team.modelReading)}</p>
        </div>
      </section>
    </div>
  `;
}

function flattenPlayerMatchRows(team) {
  return (team.playerMatches || []).flatMap((match) => (match.players || []).map((player) => ({
    ...player,
    team: match.team || team.team,
    match: match.match,
    round: match.round,
    date: match.date,
    matchContext: match.context || {}
  })));
}

function playerMetricValue(row, metric) {
  if (metric === "cards") return row.yellowCards;
  return row[metric];
}

function renderPlayerFilterControls(team, rows) {
  const matchOptions = [...new Set((team.playerMatches || []).map((match) => match.match).filter(Boolean))];
  const roleOptions = [
    ["attackers", "Attaccanti / esterni offensivi"],
    ["midfielders", "Centrocampisti"],
    ["defenders", "Difensori e portiere"]
  ];
  const metricOptions = [
    ["shots", "tiri"],
    ["shotsOnTarget", "tiri in porta"],
    ["foulsCommitted", "falli commessi"],
    ["foulsWon", "falli subiti"],
    ["cards", "cartellini"],
    ["keyPasses", "passaggi chiave"],
    ["touchesInBox", "tocchi in area"]
  ];

  return `
    <div class="team-stats-player-controls" aria-label="Filtri statistiche calciatori">
      <label>
        <span>Partita</span>
        <select data-team-stats-player-filter="match">
          <option value="all"${selectedAttr(teamStatsPlayerFilters.match, "all")}>Tutte le partite</option>
          ${matchOptions.map((match) => `<option value="${escapeTeamStats(match)}"${selectedAttr(teamStatsPlayerFilters.match, match)}>${escapeTeamStats(match)}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Ruolo</span>
        <select data-team-stats-player-filter="role">
          <option value="all"${selectedAttr(teamStatsPlayerFilters.role, "all")}>Tutti i ruoli</option>
          ${roleOptions.map(([value, label]) => `<option value="${value}"${selectedAttr(teamStatsPlayerFilters.role, value)}>${escapeTeamStats(label)}</option>`).join("")}
        </select>
      </label>
      <label>
        <span>Statistica principale</span>
        <select data-team-stats-player-filter="metric">
          ${metricOptions.map(([value, label]) => `<option value="${value}"${selectedAttr(teamStatsPlayerFilters.metric, value)}>${escapeTeamStats(label)}</option>`).join("")}
        </select>
      </label>
      <strong>${escapeTeamStats(rows.length)} righe partita-calciatore</strong>
    </div>
  `;
}

function renderPlayerContextBoxes(team) {
  const notes = team.playerStatsNotes?.length ? team.playerStatsNotes : [
    "Le statistiche dei calciatori sono salvate partita per partita. Le medie non devono essere considerate da sole, ma sempre insieme a minuti giocati, ruolo, titolarità, tipo di avversario, stato della partita, importanza della gara e contesto tattico.",
    "Per i mercati tiri e tiri in porta, dare priorità a minuti previsti, posizione in campo, avversario affrontato e probabilità che la squadra debba attaccare."
  ];

  return `
    <div class="team-stats-player-info-grid">
      ${notes.map((note) => `<p class="team-stats-player-note">${escapeTeamStats(note)}</p>`).join("")}
    </div>
  `;
}

function renderMatchContextSummary(team) {
  const selectedMatch = teamStatsPlayerFilters.match;
  const matches = selectedMatch === "all"
    ? (team.playerMatches || [])
    : (team.playerMatches || []).filter((match) => match.match === selectedMatch);

  if (!matches.length) return "";

  return `
    <div class="team-stats-player-match-context">
      ${matches.map((match) => `
        <article>
          <span>${escapeTeamStats(match.competition || "Mondiale 2026")} - ${escapeTeamStats(match.round || "")}</span>
          <h5>${escapeTeamStats(match.match)}</h5>
          <small>${escapeTeamStats(match.date || "Data da inserire")}</small>
          <dl>
            <div><dt>Tipo partita</dt><dd>${escapeTeamStats(match.context?.matchType || "da inserire")}</dd></div>
            <div><dt>Livello avversario</dt><dd>${escapeTeamStats(match.context?.opponentLevel || "da inserire")}</dd></div>
            <div><dt>Stile avversario</dt><dd>${escapeTeamStats(match.context?.opponentStyle || "da inserire")}</dd></div>
            <div><dt>Stato gara</dt><dd>${escapeTeamStats(match.context?.gameState || "da inserire")}</dd></div>
            <div><dt>Peso modello</dt><dd>${escapeTeamStats(match.context?.modelWeight || "da inserire")}</dd></div>
          </dl>
        </article>
      `).join("")}
    </div>
  `;
}

function renderPlayerTable(rows, metric) {
  const columns = [
    ["name", "Calciatore"],
    ["role", "Ruolo"],
    ["match", "Partita"],
    ["minutes", "Minuti"],
    ["shots", "Tiri totali"],
    ["shotsOnTarget", "Tiri in porta"],
    ["xG", "xG"],
    ["assists", "Assist"],
    ["xA", "xA"],
    ["keyPasses", "Passaggi chiave"],
    ["touches", "Tocchi"],
    ["touchesInBox", "Tocchi in area"],
    ["crosses", "Cross"],
    ["successfulDribbles", "Dribbling riusciti"],
    ["foulsCommitted", "Falli commessi"],
    ["foulsWon", "Falli subiti"],
    ["tackles", "Contrasti"],
    ["duelsWon", "Duelli vinti"],
    ["yellowCards", "Cartellini gialli"],
    ["rating", "Rating"],
    ["contextNote", "Note contesto"]
  ];

  if (!rows.length) {
    return '<div class="team-stats-waiting">Nessun calciatore disponibile con questi filtri.</div>';
  }

  return `
    <div class="team-stats-player-table-wrap">
      <table class="team-stats-player-table">
        <thead>
          <tr>
            ${columns.map(([key, label]) => `<th class="${key === metric || (metric === "cards" && key === "yellowCards") ? "is-active-metric" : ""}">${escapeTeamStats(label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((player) => `
            <tr>
              ${columns.map(([key]) => {
                const isMetric = key === metric || (metric === "cards" && key === "yellowCards");
                return `<td class="${isMetric ? "is-active-metric" : ""}">${renderPlayerValue(player[key])}</td>`;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPlayerGroup(title, group, rows, metric) {
  if (teamStatsPlayerFilters.role !== "all" && teamStatsPlayerFilters.role !== group) return "";

  const groupRows = rows.filter((row) => row.roleGroup === group);

  return `
    <section class="team-stats-player-group">
      <h4>${escapeTeamStats(title)}</h4>
      ${renderPlayerTable(groupRows, metric)}
    </section>
  `;
}

function renderPlayersPanel(team) {
  let rows = flattenPlayerMatchRows(team);
  const metric = teamStatsPlayerFilters.metric;

  if (teamStatsPlayerFilters.match !== "all") {
    rows = rows.filter((row) => row.match === teamStatsPlayerFilters.match);
  }

  rows = rows.sort((a, b) => {
    const aValue = Number(playerMetricValue(a, metric));
    const bValue = Number(playerMetricValue(b, metric));
    if (!Number.isFinite(aValue) && !Number.isFinite(bValue)) return a.name.localeCompare(b.name);
    if (!Number.isFinite(aValue)) return 1;
    if (!Number.isFinite(bValue)) return -1;
    return bValue - aValue;
  });

  return `
    <section class="team-stats-player-panel">
      ${renderPlayerContextBoxes(team)}
      ${renderPlayerFilterControls(team, rows)}
      ${renderMatchContextSummary(team)}
      ${renderPlayerGroup("Attaccanti / esterni offensivi", "attackers", rows, metric)}
      ${renderPlayerGroup("Centrocampisti", "midfielders", rows, metric)}
      ${renderPlayerGroup("Difensori e portiere", "defenders", rows, metric)}
    </section>
  `;
}

function renderContextPanel(team) {
  return renderAnalyzedMatches(team.analyzedMatches) || `
    <section class="team-stats-waiting">Nessun contesto partita disponibile per questa squadra.</section>
  `;
}

function renderEstimatePanel(team) {
  return `
    <div class="team-stats-section-grid team-stats-section-grid-single">
      <section class="team-stats-section" style="--section-color: var(--gold); --section-rgb: 245, 200, 75;">
        <h4>${escapeTeamStats(team.estimateTitle || "Stime prossimo match")}</h4>
        <div class="team-stats-table">
          ${renderStatRows(team.estimate)}
        </div>
      </section>
    </div>
  `;
}

function renderTeamStatsTabs() {
  const tabs = [
    ["team", "Statistiche squadra"],
    ["players", "Statistiche calciatori"],
    ["context", "Contesto partite"],
    ["estimate", "Stime prossimo match"]
  ];

  return `
    <div class="team-stats-tabs" role="tablist" aria-label="Sezioni statistiche squadra">
      ${tabs.map(([id, label]) => `
        <button
          type="button"
          class="team-stats-tab${activeTeamStatsTab === id ? " is-active" : ""}"
          data-team-stats-tab="${id}"
          role="tab"
          aria-selected="${activeTeamStatsTab === id ? "true" : "false"}"
        >${escapeTeamStats(label)}</button>
      `).join("")}
    </div>
  `;
}

function renderActivePanel(team) {
  if (activeTeamStatsTab === "players") return renderPlayersPanel(team);
  if (activeTeamStatsTab === "context") return renderContextPanel(team);
  if (activeTeamStatsTab === "estimate") return renderEstimatePanel(team);
  return renderTeamStatsPanel(team);
}

function renderTeamCard(team) {
  return `
    <article class="team-stats-card">
      <header class="team-stats-card-head">
        <div>
          <h3>${escapeTeamStats(team.team)}</h3>
          <p>${escapeTeamStats(team.summary)}</p>
        </div>
      </header>

      <div class="team-stats-meta">
        ${team.flag ? `<img class="team-stats-group-flag" src="${escapeTeamStats(team.flag)}" alt="">` : ""}
        ${team.group ? `<span>Gruppo <strong>${escapeTeamStats(team.group)}</strong></span>` : ""}
        <span><strong>${escapeTeamStats(team.analyzedMatches?.length || 0)}</strong> partite analizzate</span>
      </div>

      ${renderTeamStatsTabs()}
      <div class="team-stats-tab-panel">
        ${renderActivePanel(team)}
      </div>
    </article>
  `;
}

function renderTeamStats() {
  const stats = getTeamStatsData();
  const selectedIndex = Number(teamStatsSelect?.value || 0);
  const selectedTeam = stats[selectedIndex] || stats[0];

  if (teamStatsContent) {
    teamStatsContent.innerHTML = selectedTeam ? renderTeamCard(selectedTeam) : "";
    teamStatsContent.querySelectorAll("[data-team-stats-tab]").forEach((button) => {
      button.addEventListener("click", () => {
        activeTeamStatsTab = button.dataset.teamStatsTab;
        renderTeamStats();
      });
    });
    teamStatsContent.querySelectorAll("[data-team-stats-player-filter]").forEach((select) => {
      select.addEventListener("change", () => {
        teamStatsPlayerFilters[select.dataset.teamStatsPlayerFilter] = select.value;
        renderTeamStats();
      });
    });
  }

  if (teamStatsEmpty) {
    teamStatsEmpty.style.display = selectedTeam ? "none" : "block";
    teamStatsEmpty.textContent = "Nessuna statistica squadra disponibile.";
  }
}

if (teamStatsSelect) {
  renderTeamSelector(getTeamStatsData());
  teamStatsSelect.addEventListener("change", () => {
    activeTeamStatsTab = "team";
    teamStatsPlayerFilters = { match: "all", role: "all", metric: "shots" };
    renderTeamStats();
  });
}

renderTeamStats();
