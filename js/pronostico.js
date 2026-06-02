const predictionGroupsKey = "mondiale-2026-pronostico-gironi-v1";
const predictionThirdsKey = "mondiale-2026-pronostico-terze-v1";
const predictionBracketKey = "mondiale-2026-pronostico-tabellone-v1";

const roundOf32Seeds = [
  ["1E", "3 ABCDF"], ["1I", "3 CDFGH"], ["2A", "2B"], ["1F", "2C"],
  ["2K", "2L"], ["1H", "2J"], ["1D", "3 BEFIJ"], ["1G", "3 AEHIJ"],
  ["1C", "2F"], ["2E", "2I"], ["1A", "3 CEFHI"], ["1L", "3 EHIJK"],
  ["1J", "2H"], ["2D", "2G"], ["1B", "3 EFGIJ"], ["1K", "3 DEIJL"],
];

const bracketRounds = {
  r32: { size: 16, previous: null },
  r16: { size: 8, previous: "r32" },
  qf: { size: 4, previous: "r16" },
  sf: { size: 2, previous: "qf" },
  final: { size: 1, previous: "sf" },
};

let predictionGroups = {};
let predictionThirds = [];
let predictionBracket = {};

function loadPredictionGroups() {
  const saved = JSON.parse(localStorage.getItem(predictionGroupsKey) || "{}");
  predictionGroups = Object.fromEntries(
    Object.entries(groupTeams).map(([group, teams]) => {
      const savedTeams = Array.isArray(saved[group]) ? saved[group] : [];
      const validSaved = savedTeams.filter((team) => teams.includes(team));
      const missingTeams = teams.filter((team) => !validSaved.includes(team));
      return [group, [...validSaved, ...missingTeams]];
    })
  );
}

function savePredictionGroups() {
  localStorage.setItem(predictionGroupsKey, JSON.stringify(predictionGroups));
}

function currentThirds() {
  return Object.entries(predictionGroups)
    .map(([group, teams]) => ({ group, team: teams[2] }))
    .filter(({ team }) => Boolean(team));
}

function normalizePredictionThirds(saved = []) {
  const thirds = currentThirds();
  const byGroup = new Map(thirds.map((item) => [item.group, item]));
  const ordered = saved.map((item) => byGroup.get(item.group)).filter(Boolean);
  const usedGroups = new Set(ordered.map((item) => item.group));
  return [...ordered, ...thirds.filter((item) => !usedGroups.has(item.group))];
}

function loadPredictionThirds() {
  const saved = JSON.parse(localStorage.getItem(predictionThirdsKey) || "[]");
  predictionThirds = normalizePredictionThirds(saved);
}

function savePredictionThirds() {
  localStorage.setItem(predictionThirdsKey, JSON.stringify(predictionThirds.map(({ group }) => ({ group }))));
}

function loadPredictionBracket() {
  predictionBracket = JSON.parse(localStorage.getItem(predictionBracketKey) || "{}");
}

function savePredictionBracket() {
  localStorage.setItem(predictionBracketKey, JSON.stringify(predictionBracket));
}

function flagMarkup(team) {
  const src = teamFlags[team];
  return src ? `<img class="prediction-team-flag" src="${src}" alt="" loading="lazy">` : "";
}

function seedGroups(seed) {
  return seed.match(/[A-L]/g) || [];
}

function teamFromSeed(seed) {
  const place = seed.trim()[0];
  const groups = seedGroups(seed);
  if (!groups.length) return "";
  if (place === "1") return predictionGroups[groups[0]]?.[0] || "";
  if (place === "2") return predictionGroups[groups[0]]?.[1] || "";
  if (place === "3") {
    const allowedGroups = new Set(groups);
    return predictionThirds.find(({ group }) => allowedGroups.has(group))?.team || "";
  }
  return "";
}

function bracketKey(round, index) {
  return `${round}-${index}`;
}

function roundParticipants(round, index) {
  if (round === "r32") {
    return roundOf32Seeds[index].map((seed) => ({ seed, team: teamFromSeed(seed) }));
  }

  const previous = bracketRounds[round].previous;
  const firstTeam = roundWinner(previous, index * 2);
  const secondTeam = roundWinner(previous, index * 2 + 1);
  return [
    { seed: "", team: firstTeam },
    { seed: "", team: secondTeam },
  ];
}

function roundWinner(round, index) {
  const teams = roundParticipants(round, index).map(({ team }) => team).filter(Boolean);
  const selected = predictionBracket[bracketKey(round, index)] || "";
  return teams.includes(selected) ? selected : "";
}

function pruneInvalidBracket() {
  let changed = false;

  Object.entries(bracketRounds).forEach(([round, config]) => {
    Array.from({ length: config.size }, (_, index) => {
      const key = bracketKey(round, index);
      const selected = predictionBracket[key];
      if (!selected) return;
      const teams = roundParticipants(round, index).map(({ team }) => team).filter(Boolean);
      if (!teams.includes(selected)) {
        delete predictionBracket[key];
        changed = true;
      }
    });
  });

  if (changed) savePredictionBracket();
}

function renderPredictionGroups() {
  const grid = document.getElementById("prediction-groups-grid");
  if (!grid) return;

  grid.innerHTML = Object.entries(predictionGroups).map(([group, teams]) => `
    <article class="prediction-group-card" style="--group-color:${groupColors[group] || "#00d084"}">
      <div class="prediction-group-head">
        <span>Girone ${group}</span>
        <small>${teams.length} squadre</small>
      </div>
      <table class="prediction-group-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Squadra</th>
            <th>Ordine</th>
          </tr>
        </thead>
        <tbody>
          ${teams.map((team, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>
                <span class="prediction-team-name">${flagMarkup(team)}${team}</span>
              </td>
              <td>
                <div class="prediction-order-controls">
                  <button type="button" data-group="${group}" data-index="${index}" data-move="up" aria-label="Sposta su" ${index === 0 ? "disabled" : ""}>&#8593;</button>
                  <button type="button" data-group="${group}" data-index="${index}" data-move="down" aria-label="Sposta giu" ${index === teams.length - 1 ? "disabled" : ""}>&#8595;</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </article>
  `).join("");

  grid.querySelectorAll("button[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.group;
      const index = Number(button.dataset.index);
      const direction = button.dataset.move === "up" ? -1 : 1;
      const target = index + direction;
      [predictionGroups[group][index], predictionGroups[group][target]] = [predictionGroups[group][target], predictionGroups[group][index]];
      savePredictionGroups();
      predictionThirds = normalizePredictionThirds(predictionThirds);
      savePredictionThirds();
      pruneInvalidBracket();
      renderPredictionThirds();
      renderPredictionBracket();
      renderPredictionGroups();
    });
  });
}

function renderPredictionThirds() {
  const table = document.getElementById("prediction-thirds-table");
  if (!table) return;
  predictionThirds = normalizePredictionThirds(predictionThirds);

  table.innerHTML = `
    <table class="prediction-group-table prediction-thirds-ranking">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Squadra</th>
          <th>Ordine</th>
        </tr>
      </thead>
      <tbody>
        ${predictionThirds.map(({ group, team }, index) => `
          <tr class="${index < 8 ? "is-qualified-third" : "is-excluded-third"}">
            <td>${index + 1}</td>
            <td>
              <span class="prediction-team-name">${flagMarkup(team)}${team}<small>Girone ${group}</small></span>
            </td>
            <td>
              <div class="prediction-order-controls">
                <button type="button" data-third-index="${index}" data-third-move="up" aria-label="Sposta su" ${index === 0 ? "disabled" : ""}>&#8593;</button>
                <button type="button" data-third-index="${index}" data-third-move="down" aria-label="Sposta giu" ${index === predictionThirds.length - 1 ? "disabled" : ""}>&#8595;</button>
              </div>
            </td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;

  table.querySelectorAll("button[data-third-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.thirdIndex);
      const direction = button.dataset.thirdMove === "up" ? -1 : 1;
      const target = index + direction;
      [predictionThirds[index], predictionThirds[target]] = [predictionThirds[target], predictionThirds[index]];
      savePredictionThirds();
      pruneInvalidBracket();
      renderPredictionThirds();
      renderPredictionBracket();
    });
  });
}

function bracketTeamButton(round, index, seed, team) {
  const selected = roundWinner(round, index) === team;
  const disabled = !team;
  return `
    <button class="prediction-bracket-team ${selected ? "is-selected" : ""} ${disabled ? "is-empty" : ""}" type="button" data-round="${round}" data-index="${index}" data-team="${team}" ${disabled ? "disabled" : ""}>
      <span class="prediction-bracket-seed">${seed || "Vincente"}</span>
      <span class="prediction-bracket-team-name">${team ? `${flagMarkup(team)}${team}` : "Da definire"}</span>
    </button>`;
}

function renderBracketMatch(round, index) {
  const participants = roundParticipants(round, index);
  return `
    <article class="prediction-bracket-match">
      ${participants.map(({ seed, team }) => bracketTeamButton(round, index, seed, team)).join("")}
    </article>`;
}

function bracketPlaceholder(label) {
  return `<div class="prediction-bracket-placeholder">${label}</div>`;
}

function renderRoundColumn(round, indexes) {
  return indexes.map((index) => renderBracketMatch(round, index)).join("");
}

function renderPredictionBracket() {
  const root = document.getElementById("prediction-bracket");
  if (!root) return;
  pruneInvalidBracket();
  const champion = roundWinner("final", 0);

  root.innerHTML = `
    <div class="prediction-bracket-board">
      <div class="prediction-bracket-title">
        <strong>WORLD CHAMPIONS</strong>
        <span>FIFA World Cup 2026</span>
      </div>

      <div class="prediction-bracket-grid">
        <div class="prediction-bracket-side prediction-bracket-left">
          <div class="prediction-bracket-round prediction-round-r32">${renderRoundColumn("r32", [0,1,2,3,4,5,6,7])}</div>
          <div class="prediction-bracket-round prediction-round-r16">${renderRoundColumn("r16", [0,1,2,3])}</div>
          <div class="prediction-bracket-round prediction-round-qf">${renderRoundColumn("qf", [0,1])}</div>
          <div class="prediction-bracket-round prediction-round-sf">${renderRoundColumn("sf", [0])}</div>
        </div>

        <div class="prediction-bracket-center">
          <div class="prediction-trophy-mark">26</div>
          ${renderBracketMatch("final", 0)}
          <div class="prediction-champion-box ${champion ? "has-champion" : ""}">
            <span>Campione</span>
            <strong>${champion ? `${flagMarkup(champion)}${champion}` : "Da scegliere"}</strong>
          </div>
          <span>Bronze winner</span>
          ${bracketPlaceholder("Terzo posto")}
        </div>

        <div class="prediction-bracket-side prediction-bracket-right">
          <div class="prediction-bracket-round prediction-round-sf">${renderRoundColumn("sf", [1])}</div>
          <div class="prediction-bracket-round prediction-round-qf">${renderRoundColumn("qf", [2,3])}</div>
          <div class="prediction-bracket-round prediction-round-r16">${renderRoundColumn("r16", [4,5,6,7])}</div>
          <div class="prediction-bracket-round prediction-round-r32">${renderRoundColumn("r32", [8,9,10,11,12,13,14,15])}</div>
        </div>
      </div>
    </div>`;

  root.querySelectorAll(".prediction-bracket-team:not(:disabled)").forEach((button) => {
    button.addEventListener("click", () => {
      predictionBracket[bracketKey(button.dataset.round, Number(button.dataset.index))] = button.dataset.team;
      pruneInvalidBracket();
      savePredictionBracket();
      renderPredictionBracket();
    });
  });
}

function bootPronostico() {
  loadPredictionGroups();
  loadPredictionThirds();
  loadPredictionBracket();
  renderPredictionGroups();
  renderPredictionThirds();
  renderPredictionBracket();
}

bootPronostico();
