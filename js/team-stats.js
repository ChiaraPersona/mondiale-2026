const teamStatsSelect = document.getElementById("team-stats-select");
const teamStatsContent = document.getElementById("team-stats-content");
const teamStatsEmpty = document.getElementById("team-stats-empty");
let activeTeamStatsTab = "team";
let teamStatsPlayerFilters = {
  match: "all",
  role: "all",
  metric: "shots"
};
const normalizedPlayerStatsSources = [
  "data/player-stats/merged/spain-cape-verde-2026.json",
  "data/player-stats/merged/spain-saudi-arabia-2026.json",
  "data/player-stats/merged/uruguay-spain-2026.json",
  "data/player-stats/merged/portugal-spain-2026-07-06.json",
  "data/player-stats/merged/spain-austria-2026-07-02.json",
  "data/player-stats/merged/france-sweden-2026-06-30.json",
  "data/player-stats/merged/paraguay-france-2026-07-04.json",
  "data/player-stats/merged/france-senegal-2026-06-16.json",
  "data/player-stats/merged/france-iraq-2026-06-22.json",
  "data/player-stats/merged/norway-france-2026-06-26.json",
  "data/player-stats/merged/netherlands-morocco-2026-06-29.json",
  "data/player-stats/merged/canada-morocco-2026-07-04.json",
  "data/player-stats/merged/brazil-morocco-2026-06-13.json",
  "data/player-stats/merged/scotland-morocco-2026-06-19.json",
  "data/player-stats/merged/morocco-haiti-2026-06-24.json"
];
const matchContextSource = "data/player-stats/match-context.json";
let resolvedTeamStatsData = null;
let matchContextData = {};

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

function firstTeamStatValue(rows = [], labels = []) {
  const wanted = labels.map((label) => String(label).toLowerCase());
  const found = rows.find(([label]) => wanted.includes(String(label).toLowerCase()));
  return found?.[1] ?? "da inserire";
}

function renderTeamMainStatRows(rows = []) {
  const mainRows = [
    ["Tiri", firstTeamStatValue(rows, ["Tiri", "Tiri totali medi"])],
    ["Tiri in porta", firstTeamStatValue(rows, ["Tiri in porta", "Tiri in porta medi"])],
    ["Corner", firstTeamStatValue(rows, ["Corner", "Corner medi"])],
    ["Falli commessi", firstTeamStatValue(rows, ["Falli", "Falli medi", "Falli commessi"])],
    ["Falli subiti", firstTeamStatValue(rows, ["Falli subiti"])],
    ["Cartellini", firstTeamStatValue(rows, ["Cartellini", "Cartellini gialli", "Cartellini gialli medi"])],
    ["Possesso", firstTeamStatValue(rows, ["Possesso", "Possesso medio"])],
    ["xG", firstTeamStatValue(rows, ["xG", "xG medio"])]
  ];
  return renderStatRows(mainRows);
}

function getTeamStatsData() {
  if (Array.isArray(resolvedTeamStatsData)) return resolvedTeamStatsData;
  return Array.isArray(window.teamStatsData) ? window.teamStatsData : teamStatsData;
}

function renderEmptyValue(value) {
  return escapeTeamStats(value || "-");
}

function renderPlayerValue(value) {
  return value === null || value === undefined || value === "" ? "da inserire" : escapeTeamStats(value);
}

function renderDerivedPlayerValue(value) {
  return value === null || value === undefined || value === "" ? "n/d" : escapeTeamStats(value);
}

function renderContextValue(value) {
  return value === null || value === undefined || value === "" ? "n/d" : escapeTeamStats(value);
}

function cloneTeamStatsData() {
  return JSON.parse(JSON.stringify(Array.isArray(window.teamStatsData) ? window.teamStatsData : teamStatsData));
}

function normalizeTeamStatsName(value) {
  const names = {
    Spain: "Spagna",
    Portugal: "Portogallo",
    France: "Francia",
    Morocco: "Marocco",
    Sweden: "Svezia",
    Paraguay: "Paraguay",
    Senegal: "Senegal",
    Iraq: "Iraq",
    Norway: "Norvegia",
    Netherlands: "Paesi Bassi",
    Canada: "Canada",
    Brazil: "Brasile",
    Scotland: "Scozia",
    Haiti: "Haiti"
  };
  return names[value] || value;
}

function roleGroupFromPlayer(role, playerName) {
  const roleText = String(role || "").toLowerCase();
  const nameText = String(playerName || "").toLowerCase();
  if (roleText.includes("goalkeeper") || roleText.includes("back") || roleText.includes("defender")) return "defenders";
  if (roleText.includes("midfielder")) return roleText.includes("attacking") ? "attackers" : "midfielders";
  if (roleText.includes("forward") || roleText.includes("attacker")) return "attackers";
  if (["ferran", "borja", "nico", "yamal", "oyarzabal", "olmo", "baena", "pino", "munoz"].some((name) => nameText.includes(name))) return "attackers";
  if (["rodri", "pedri", "merino", "ruiz", "zubimendi", "gavi"].some((name) => nameText.includes(name))) return "midfielders";
  if (["simon", "raya", "garcia", "laporte", "cubarsi", "cucurella", "porro", "pubill", "llorente", "grimaldo"].some((name) => nameText.includes(name))) return "defenders";
  return "midfielders";
}

function displayMatchName(normalized) {
  if (normalized.homeTeam && normalized.awayTeam && normalized.score) {
    return `${normalizeTeamStatsName(normalized.homeTeam)} ${normalized.score} ${normalizeTeamStatsName(normalized.awayTeam)}`;
  }
  return "Portogallo 0-1 Spagna";
}

function mapNormalizedPlayer(player, match, teamName) {
  const sourceLabel = player.source || player.sources?.shots || "Merged";
  return {
    ...player,
    roleGroup: roleGroupFromPlayer(player.role, player.name),
    match,
    team: teamName,
    successfulDribbles: player.dribblesCompleted,
    source: sourceLabel,
    contextNote: `Fonte: ${sourceLabel}; titolare: ${player.starter === null ? "da inserire" : (player.starter ? "si" : "no")}`
  };
}

function derivedPer90(player, statKey) {
  const minutes = Number(player.minutes);
  const value = Number(player[statKey]);
  if (!Number.isFinite(minutes) || minutes <= 0) return null;
  if (!Number.isFinite(value)) return null;
  return Math.round((value / minutes) * 90 * 100) / 100;
}

function withDerivedPlayerMetrics(player) {
  return {
    ...player,
    goalsPer90: derivedPer90(player, "goals"),
    assistsPer90: derivedPer90(player, "assists"),
    shotsPer90: derivedPer90(player, "shots"),
    shotsOnTargetPer90: derivedPer90(player, "shotsOnTarget"),
    foulsCommittedPer90: derivedPer90(player, "foulsCommitted"),
    foulsWonPer90: derivedPer90(player, "foulsWon"),
    yellowCardsPer90: derivedPer90(player, "yellowCards")
  };
}

function sumNullablePlayerField(rows, field) {
  let hasValue = false;
  const total = rows.reduce((sum, row) => {
    const value = Number(row[field]);
    if (!Number.isFinite(value)) return sum;
    hasValue = true;
    return sum + value;
  }, 0);
  return hasValue ? total : null;
}

function aggregatePlayerRows(rows) {
  const grouped = rows.reduce((groups, row) => {
    const key = row.name || "Giocatore da inserire";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
    return groups;
  }, new Map());

  const sumFields = [
    "minutes",
    "shots",
    "shotsOnTarget",
    "goals",
    "assists",
    "foulsCommitted",
    "foulsWon",
    "yellowCards",
    "redCards"
  ];

  return [...grouped.entries()].map(([name, playerRows]) => {
    const base = playerRows.find((row) => Number(row.minutes) > 0) || playerRows[0] || {};
    const aggregated = {
      ...base,
      name,
      match: "Tutte le partite",
      matchesCount: playerRows.length,
      starter: null,
      contextNote: `Totale su ${playerRows.length} partite; dati reali aggregati per calciatore.`
    };

    sumFields.forEach((field) => {
      aggregated[field] = sumNullablePlayerField(playerRows, field);
    });

    return withDerivedPlayerMetrics(aggregated);
  });
}

async function loadMatchContextData() {
  try {
    const response = await fetch(matchContextSource, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    matchContextData = data && typeof data === "object" ? data : {};
  } catch (error) {
    matchContextData = {};
    console.warn(`Contesti partita non caricati da ${matchContextSource}: ${error.message}`);
  }
}

function contextForMatch(matchId, fallback = {}) {
  return matchContextData[matchId] || fallback || {};
}

function mergeNormalizedPlayerStats(stats, normalized, sourcePath) {
  if (!normalized?.teams) return stats;

  const matchName = displayMatchName(normalized);
  Object.entries(normalized.teams).forEach(([sourceTeamName, teamBlock]) => {
    const teamName = normalizeTeamStatsName(sourceTeamName);
    let team = stats.find((item) => item.team === teamName);
    if (!team) {
      team = {
        team: teamName,
        group: "",
        summary: "Statistiche calciatori importate dal JSON merged.",
        analyzedMatches: [],
        averages: [],
        modelReading: "Dati squadra da inserire.",
        estimateTitle: "Stime prossimo match",
        estimate: [],
        playerStatsNotes: [],
        playerMatches: []
      };
      stats.push(team);
    }

    const players = (teamBlock.players || []).map((player) => mapNormalizedPlayer(player, matchName, team.team));
    if (!players.length) return;

    const existing = team.playerMatches || [];
    const previousMatch = existing.find((match) => match.match === matchName) || {};
    const remainingMatches = existing.filter((match) => match.match !== matchName);

    team.playerMatches = [
      ...remainingMatches,
      {
        ...previousMatch,
        team: team.team,
        match: matchName,
        competition: normalized.competition || previousMatch.competition || "World Cup 2026",
        round: normalized.round || previousMatch.round || "Round of 16",
        date: normalized.date || previousMatch.date || null,
        provider: normalized.provider || "Merged",
        matchId: normalized.matchId || previousMatch.matchId || null,
        normalizedSource: sourcePath,
        context: contextForMatch(normalized.matchId, previousMatch.context),
        players
      }
    ];

    team.playerStatsMeta = {
      source: normalized.provider || "Merged",
      primarySource: normalized.providers?.espn?.completion ? "ESPN" : (normalized.provider || "Merged"),
      coverage: normalized.completion,
      unavailableAdvancedFields: ["xA", "tocchi", "tocchi area", "passaggi", "pass accuracy", "key passes", "cross", "dribbling", "tackle", "duelli", "rating"],
      providerSummary: normalized.providers || {}
    };
  });

  return stats;
}

async function loadNormalizedPlayerStats() {
  const stats = cloneTeamStatsData();

  for (const source of normalizedPlayerStatsSources) {
    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      mergeNormalizedPlayerStats(stats, await response.json(), source);
    } catch (error) {
      console.warn(`Statistiche normalizzate non caricate da ${source}: ${error.message}`);
    }
  }

  resolvedTeamStatsData = stats;
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
              ${renderTeamMainStatRows(match.stats)}
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
        <h4>Statistiche squadra principali</h4>
        <div class="team-stats-table">
          ${team.averages?.length ? renderTeamMainStatRows(team.averages) : '<div class="team-stats-row"><span>Dati</span><strong>da inserire</strong></div>'}
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
  return (team.playerMatches || []).flatMap((match) => (match.players || []).map((player) => withDerivedPlayerMetrics({
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
  const linkedSources = [...new Set((team.playerMatches || []).map((match) => match.normalizedSource).filter(Boolean))];
  const rowsLabel = teamStatsPlayerFilters.match === "all" ? "calciatori aggregati" : "righe partita-calciatore";
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
    ["cards", "cartellini"]
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
      ${linkedSources.length ? `<strong>JSON collegati: ${linkedSources.map(escapeTeamStats).join(" · ")}</strong>` : ""}
      <strong>${escapeTeamStats(rows.length)} ${escapeTeamStats(rowsLabel)}</strong>
    </div>
  `;
}

function renderPlayerStatsBadges(team) {
  const meta = team.playerStatsMeta;
  if (!meta) return "";

  const coverage = meta.coverage === null || meta.coverage === undefined ? "n/d" : `${meta.coverage}%`;
  return `
    <div class="team-stats-player-badges" aria-label="Copertura dati player stats">
      <span>Fonte principale: ${escapeTeamStats(meta.primarySource || "ESPN")}</span>
      <span>Copertura dati: ${escapeTeamStats(coverage)}</span>
      <span>Campi avanzati: nascosti dalla tabella principale</span>
    </div>
  `;
}

function renderPlayerContextBoxes(team) {
  let notes = team.playerStatsNotes?.length ? team.playerStatsNotes : [
    "Le statistiche dei calciatori sono salvate partita per partita. Le medie non devono essere considerate da sole, ma sempre insieme a minuti giocati, ruolo, titolarità, tipo di avversario, stato della partita, importanza della gara e contesto tattico.",
    "Per i mercati tiri e tiri in porta, dare priorità a minuti previsti, posizione in campo, avversario affrontato e probabilità che la squadra debba attaccare."
  ];

  if (team.playerStatsMeta?.primarySource === "ESPN" || team.playerMatches?.some((match) => match.provider === "ESPN")) {
    notes = [
      ...notes,
      "Fonte player stats: ESPN. La tabella principale mostra solo minuti, tiri, tiri in porta, gol, assist, falli, cartellini e metriche per 90 minuti. I campi avanzati restano nel JSON e non vengono mostrati qui."
    ];
  }

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
            <div><dt>Tipo partita</dt><dd>${renderContextValue(match.context?.matchType)}</dd></div>
            <div><dt>Livello avversario</dt><dd>${renderContextValue(match.context?.opponentLevel)}</dd></div>
            <div><dt>Stile avversario</dt><dd>${renderContextValue(match.context?.opponentStyle)}</dd></div>
            <div><dt>Stato gara</dt><dd>${renderContextValue(match.context?.gameState)}</dd></div>
            <div><dt>Peso modello</dt><dd>${renderContextValue(match.context?.modelWeight)}</dd></div>
          </dl>
        </article>
      `).join("")}
    </div>
  `;
}

function renderPlayerTable(rows, metric) {
  const columns = [
    ["name", "Calciatore"],
    ["minutes", "Minuti"],
    ["shots", "Tiri"],
    ["shotsOnTarget", "Tiri in porta"],
    ["goals", "Gol"],
    ["assists", "Assist"],
    ["foulsCommitted", "Falli commessi"],
    ["foulsWon", "Falli subiti"],
    ["yellowCards", "Gialli"],
    ["redCards", "Rossi"],
    ["goalsPer90", "Gol/90", true],
    ["assistsPer90", "Assist/90", true],
    ["shotsPer90", "Tiri/90", true],
    ["shotsOnTargetPer90", "Tiri porta/90", true],
    ["foulsCommittedPer90", "Falli comm./90", true],
    ["foulsWonPer90", "Falli subiti/90", true],
    ["yellowCardsPer90", "Gialli/90", true],
    ["contextNote", "Nota"]
  ];

  if (!rows.length) {
    return '<div class="team-stats-waiting">Nessun calciatore disponibile con questi filtri.</div>';
  }

  return `
    <div class="team-stats-player-table-wrap">
      <table class="team-stats-player-table">
        <thead>
          <tr>
            ${columns.map(([key, label, derived]) => `<th class="${key === metric || (metric === "cards" && key === "yellowCards") ? "is-active-metric" : ""}${derived ? " is-derived-metric" : ""}">${escapeTeamStats(label)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map((player) => `
            <tr>
              ${columns.map(([key, _label, derived]) => {
                const isMetric = key === metric || (metric === "cards" && key === "yellowCards");
                const classes = `${isMetric ? "is-active-metric" : ""}${derived ? " is-derived-metric" : ""}`;
                return `<td class="${classes}">${derived ? renderDerivedPlayerValue(player[key]) : renderPlayerValue(player[key])}</td>`;
              }).join("")}
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderPlayerRankings(rows) {
  const rankingDefinitions = [
    ["shots", "Più tiri"],
    ["shotsOnTarget", "Più tiri in porta"],
    ["foulsCommitted", "Più falli commessi"],
    ["foulsWon", "Più falli subiti"],
    ["yellowCards", "Più cartellini"]
  ];

  const cardValue = (row) => {
    const yellowCards = Number(row.yellowCards);
    const redCards = Number(row.redCards);
    return (Number.isFinite(yellowCards) ? yellowCards : 0) + (Number.isFinite(redCards) ? redCards : 0);
  };

  const metricValue = (row, key) => key === "yellowCards" ? cardValue(row) : Number(row[key]);
  const usedRows = rows.filter((row) => Number(row.minutes) > 0);

  return `
    <section class="team-stats-player-rankings" aria-label="Classifiche automatiche calciatori">
      ${rankingDefinitions.map(([key, title]) => {
        const ranked = usedRows
          .map((row) => ({ row, value: metricValue(row, key) }))
          .filter((item) => Number.isFinite(item.value) && item.value > 0)
          .sort((a, b) => b.value - a.value || String(a.row.name).localeCompare(String(b.row.name)))
          .slice(0, 5);

        return `
          <article>
            <h4>${escapeTeamStats(title)}</h4>
            ${ranked.length ? `
              <ol>
                ${ranked.map((item) => `
                  <li>
                    <span>${escapeTeamStats(item.row.name)}</span>
                    <strong>${escapeTeamStats(item.value)}</strong>
                  </li>
                `).join("")}
              </ol>
            ` : '<p>n/d</p>'}
          </article>
        `;
      }).join("")}
    </section>
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
  } else {
    rows = aggregatePlayerRows(rows);
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
      ${renderPlayerStatsBadges(team)}
      ${renderPlayerContextBoxes(team)}
      ${renderPlayerFilterControls(team, rows)}
      ${renderMatchContextSummary(team)}
      ${renderPlayerRankings(rows)}
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

async function initTeamStatsPage() {
  await loadMatchContextData();
  await loadNormalizedPlayerStats();

  if (teamStatsSelect) {
    renderTeamSelector(getTeamStatsData());
    teamStatsSelect.addEventListener("change", () => {
      activeTeamStatsTab = "team";
      teamStatsPlayerFilters = { match: "all", role: "all", metric: "shots" };
      renderTeamStats();
    });
  }

  renderTeamStats();
}

initTeamStatsPage();
