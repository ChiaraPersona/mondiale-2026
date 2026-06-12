const predictionGroupsKey = "mondiale-2026-pronostico-gironi-v1";
const predictionThirdsKey = "mondiale-2026-pronostico-terze-v1";
const predictionBracketKey = "mondiale-2026-pronostico-tabellone-v1";
const predictionFixtureScoresKey = "mondiale-2026-pronostico-risultati-v1";

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
  bronze: { size: 1, previous: "sf" },
};

let predictionGroups = {};
let predictionThirds = [];
let predictionBracket = {};
let predictionFixtureScores = {};

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
  return Object.keys(groupTeams)
    .map((group) => ({ group, team: groupOrder(group)[2] }))
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

function loadPredictionFixtureScores() {
  predictionFixtureScores = JSON.parse(localStorage.getItem(predictionFixtureScoresKey) || "{}");
}

function savePredictionFixtureScores() {
  localStorage.setItem(predictionFixtureScoresKey, JSON.stringify(predictionFixtureScores));
}

function numericScore(value) {
  if (value === "" || value === undefined || value === null) return null;
  const number = Number(value);
  return Number.isInteger(number) && number >= 0 ? number : null;
}

function translatedTeam(name) {
  return fixtureTranslations[name] || name;
}

function fixtureTeams(match) {
  const parts = String(match || "").split(/\s+vs\s+/i);
  if (parts.length !== 2) return [];
  if (parts.some((part) => /Group|Match|winner|loser|runner|third/i.test(part))) return [];
  return parts.map((team) => translatedTeam(team.trim()));
}

function groupFixtures(group) {
  const fixtures = typeof worldCupFixtures !== "undefined" ? worldCupFixtures : [];
  return fixtures
    .map((fixture, index) => ({ fixture, number: index + 1 }))
    .filter(({ fixture }) => fixture[5] === "group" && fixture[1] === `Group ${group}`);
}

function fixtureRealResult(number) {
  return typeof worldCupResultFor === "function" ? worldCupResultFor(number) : null;
}

function fixtureRealScorers(number) {
  const real = fixtureRealResult(number);
  if (!real?.scorers) return [];
  return Object.values(real.scorers).flat().filter(Boolean);
}

function scoreForMatchNumber(number) {
  const saved = predictionFixtureScores[number] || {};
  const real = fixtureRealResult(number);
  const realScorers = fixtureRealScorers(number);
  const savedScorers = scorerParts(saved.scorers);
  const seen = new Set();
  const scorers = [...realScorers, ...savedScorers].filter((name) => {
    const key = scorerKey(name);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    ...saved,
    home: saved.home !== undefined && saved.home !== "" ? saved.home : real?.home ?? saved.home ?? "",
    away: saved.away !== undefined && saved.away !== "" ? saved.away : real?.away ?? saved.away ?? "",
    scorers,
    real,
  };
}

function groupTable(group) {
  const teams = groupTeams[group] || [];
  const table = Object.fromEntries(teams.map((team, order) => [team, {
    team,
    order,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    gf: 0,
    ga: 0,
  }]));
  let hasScores = false;

  groupFixtures(group).forEach(({ fixture, number }) => {
    const teamsInMatch = fixtureTeams(fixture[2]);
    if (teamsInMatch.length !== 2) return;
    const score = scoreForMatchNumber(number);
    const home = numericScore(score.home);
    const away = numericScore(score.away);
    if (home === null || away === null) return;
    const [homeTeam, awayTeam] = teamsInMatch;
    if (!table[homeTeam] || !table[awayTeam]) return;
    hasScores = true;
    table[homeTeam].played += 1;
    table[awayTeam].played += 1;
    table[homeTeam].gf += home;
    table[homeTeam].ga += away;
    table[awayTeam].gf += away;
    table[awayTeam].ga += home;
    if (home > away) {
      table[homeTeam].points += 3;
      table[homeTeam].wins += 1;
      table[awayTeam].losses += 1;
    } else if (away > home) {
      table[awayTeam].points += 3;
      table[awayTeam].wins += 1;
      table[homeTeam].losses += 1;
    } else {
      table[homeTeam].points += 1;
      table[awayTeam].points += 1;
      table[homeTeam].draws += 1;
      table[awayTeam].draws += 1;
    }
  });

  if (!hasScores) return null;
  return Object.values(table).sort((a, b) =>
    b.points - a.points ||
    (b.gf - b.ga) - (a.gf - a.ga) ||
    b.gf - a.gf ||
    a.order - b.order
  );
}

function blankStandingRows(group) {
  return (predictionGroups[group] || groupTeams[group] || []).map((team, order) => ({
    team,
    order,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    points: 0,
    gf: 0,
    ga: 0,
  }));
}

function groupOrder(group) {
  const table = groupTable(group);
  return table ? table.map((row) => row.team) : (predictionGroups[group] || groupTeams[group] || []);
}

function currentThirdRanking() {
  const computed = Object.keys(groupTeams).map((group) => {
    const table = groupTable(group);
    return table ? { group, team: table[2]?.team, stats: table[2] } : null;
  }).filter((item) => item && item.team);

  if (!computed.length) return predictionThirds;
  const computedGroups = new Set(computed.map((item) => item.group));
  const manualFallback = predictionThirds.filter((item) => !computedGroups.has(item.group));
  return [...computed, ...manualFallback].sort((a, b) => {
    if (a.stats && b.stats) {
      return b.stats.points - a.stats.points ||
        (b.stats.gf - b.stats.ga) - (a.stats.gf - a.stats.ga) ||
        b.stats.gf - a.stats.gf ||
        a.group.localeCompare(b.group);
    }
    if (a.stats) return -1;
    if (b.stats) return 1;
    return 0;
  });
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
  if (place === "1") return groupOrder(groups[0])?.[0] || "";
  if (place === "2") return groupOrder(groups[0])?.[1] || "";
  if (place === "3") {
    const allowedGroups = new Set(groups);
    return currentThirdRanking().find(({ group }) => allowedGroups.has(group))?.team || "";
  }
  return "";
}

function bracketKey(round, index) {
  return `${round}-${index}`;
}

const bracketMatchNumbers = {
  r32: [74, 77, 73, 76, 83, 84, 81, 82, 75, 78, 79, 80, 86, 88, 85, 87],
  r16: [89, 90, 93, 94, 91, 92, 95, 96],
  qf: [97, 98, 99, 100],
  sf: [101, 102],
  final: [104],
  bronze: [103],
};

const matchDependencies = {
  89: [{ match: 74, result: "winner" }, { match: 77, result: "winner" }],
  90: [{ match: 73, result: "winner" }, { match: 75, result: "winner" }],
  91: [{ match: 76, result: "winner" }, { match: 78, result: "winner" }],
  92: [{ match: 79, result: "winner" }, { match: 80, result: "winner" }],
  93: [{ match: 83, result: "winner" }, { match: 84, result: "winner" }],
  94: [{ match: 81, result: "winner" }, { match: 82, result: "winner" }],
  95: [{ match: 86, result: "winner" }, { match: 88, result: "winner" }],
  96: [{ match: 85, result: "winner" }, { match: 87, result: "winner" }],
  97: [{ match: 89, result: "winner" }, { match: 90, result: "winner" }],
  98: [{ match: 93, result: "winner" }, { match: 94, result: "winner" }],
  99: [{ match: 91, result: "winner" }, { match: 92, result: "winner" }],
  100: [{ match: 95, result: "winner" }, { match: 96, result: "winner" }],
  101: [{ match: 97, result: "winner" }, { match: 98, result: "winner" }],
  102: [{ match: 99, result: "winner" }, { match: 100, result: "winner" }],
  103: [{ match: 101, result: "loser" }, { match: 102, result: "loser" }],
  104: [{ match: 101, result: "winner" }, { match: 102, result: "winner" }],
};

function bracketMatchNumber(round, index) {
  return bracketMatchNumbers[round]?.[index] || null;
}

function roundForMatchNumber(matchNumber) {
  for (const [round, numbers] of Object.entries(bracketMatchNumbers)) {
    const index = numbers.indexOf(matchNumber);
    if (index !== -1) return { round, index };
  }
  return null;
}

function teamForMatchDependency(dependency) {
  return dependency.result === "loser" ? loserForMatchNumber(dependency.match) : winnerForMatchNumber(dependency.match);
}

function participantsForMatchNumber(matchNumber) {
  const fixtureIndex = matchNumber - 1;
  const fixture = (typeof worldCupFixtures !== "undefined" ? worldCupFixtures : [])[fixtureIndex];
  if (!fixture) return [];
  const teams = fixtureTeams(fixture[2]);
  if (teams.length === 2) return teams.map((team) => ({ seed: "", team }));

  if (matchNumber >= 73 && matchNumber <= 88) {
    const bracketLocation = roundForMatchNumber(matchNumber);
    const seeds = bracketLocation ? roundOf32Seeds[bracketLocation.index] : [];
    return seeds.map((seed) => ({ seed, team: teamFromSeed(seed) }));
  }

  return (matchDependencies[matchNumber] || []).map((dependency) => ({
    seed: "",
    team: teamForMatchDependency(dependency),
  }));
}

function winnerForMatchNumber(matchNumber) {
  const teams = participantsForMatchNumber(matchNumber).map(({ team }) => team).filter(Boolean);
  const score = scoreForMatchNumber(matchNumber);
  const home = numericScore(score.home);
  const away = numericScore(score.away);
  if (teams.length === 2 && home !== null && away !== null && home !== away) {
    return home > away ? teams[0] : teams[1];
  }
  const bracketLocation = roundForMatchNumber(matchNumber);
  if (!bracketLocation) return "";
  const selected = predictionBracket[bracketKey(bracketLocation.round, bracketLocation.index)] || "";
  return teams.includes(selected) ? selected : "";
}

function loserForMatchNumber(matchNumber) {
  const teams = participantsForMatchNumber(matchNumber).map(({ team }) => team).filter(Boolean);
  const winner = winnerForMatchNumber(matchNumber);
  if (!winner || teams.length < 2) return "";
  return teams.find((team) => team !== winner) || "";
}

function roundParticipants(round, index) {
  const matchNumber = bracketMatchNumber(round, index);
  return matchNumber ? participantsForMatchNumber(matchNumber) : [];
}

function roundWinner(round, index) {
  const teams = roundParticipants(round, index).map(({ team }) => team).filter(Boolean);
  const matchNumber = bracketMatchNumber(round, index);
  const automatic = matchNumber ? winnerForMatchNumber(matchNumber) : "";
  if (automatic && teams.includes(automatic)) return automatic;
  const selected = predictionBracket[bracketKey(round, index)] || "";
  return teams.includes(selected) ? selected : "";
}

function roundLoser(round, index) {
  const teams = roundParticipants(round, index).map(({ team }) => team).filter(Boolean);
  const winner = roundWinner(round, index);
  if (!winner || teams.length < 2) return "";
  return teams.find((team) => team !== winner) || "";
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

  grid.innerHTML = Object.keys(groupTeams).map((group) => {
    const table = groupTable(group);
    const rows = table || blankStandingRows(group);
    return `
    <article class="prediction-group-card" style="--group-color:${groupColors[group] || "#00d084"}">
      <div class="prediction-group-head">
        <span>Girone ${group}</span>
        <small>${table ? "Da risultati" : "In attesa"}</small>
      </div>
      <table class="prediction-group-table">
        <thead>
          <tr>
            <th>Pos</th>
            <th>Squadra</th>
            <th>PG</th>
            <th>V</th>
            <th>N</th>
            <th>P</th>
            <th>GF</th>
            <th>GS</th>
            <th>DR</th>
            <th>Pt</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row, index) => {
            const team = row.team;
            const diff = row.gf - row.ga;
            return `
            <tr>
              <td>${index + 1}</td>
              <td>
                <span class="prediction-team-name">${flagMarkup(team)}${team}</span>
              </td>
              <td>${row.played}</td>
              <td>${row.wins}</td>
              <td>${row.draws}</td>
              <td>${row.losses}</td>
              <td>${row.gf}</td>
              <td>${row.ga}</td>
              <td>${diff > 0 ? "+" : ""}${diff}</td>
              <td><strong>${row.points}</strong></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </article>`;
  }).join("");
}

function renderPredictionThirds() {
  const table = document.getElementById("prediction-thirds-table");
  if (!table) return;
  predictionThirds = normalizePredictionThirds(predictionThirds);
  const ranking = currentThirdRanking();

  table.innerHTML = `
    <table class="prediction-group-table prediction-thirds-ranking">
      <thead>
        <tr>
          <th>Pos</th>
          <th>Squadra</th>
          <th>PG</th>
          <th>DR</th>
          <th>Pt</th>
        </tr>
      </thead>
      <tbody>
        ${ranking.map(({ group, team, stats }, index) => `
          <tr class="${index < 8 ? "is-qualified-third" : "is-excluded-third"}">
            <td>${index + 1}</td>
            <td>
              <span class="prediction-team-name">${flagMarkup(team)}${team}<small>Girone ${group}${stats ? ` · ${stats.points} pt` : ""}</small></span>
            </td>
            <td>${stats?.played || 0}</td>
            <td>${stats ? `${stats.gf - stats.ga > 0 ? "+" : ""}${stats.gf - stats.ga}` : "0"}</td>
            <td><strong>${stats?.points || 0}</strong></td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function bracketTeamButton(round, index, seed, team) {
  const selected = roundWinner(round, index) === team;
  const disabled = !team;
  const seedMarkup = seed ? `<span class="prediction-bracket-seed">${seed}</span>` : "";
  return `
    <button class="prediction-bracket-team ${seed ? "" : "no-seed"} ${selected ? "is-selected" : ""} ${disabled ? "is-empty" : ""}" type="button" data-round="${round}" data-index="${index}" data-team="${team}" ${disabled ? "disabled" : ""}>
      ${seedMarkup}
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
  const bronzeWinner = roundWinner("bronze", 0);

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
          ${renderBracketMatch("bronze", 0)}
          <div class="prediction-champion-box prediction-bronze-box ${bronzeWinner ? "has-champion" : ""}">
            <span>Bronzo</span>
            <strong>${bronzeWinner ? `${flagMarkup(bronzeWinner)}${bronzeWinner}` : "Da scegliere"}</strong>
          </div>
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

const fixtureTranslations = {
  "Mexico": "Messico",
  "South Africa": "Sudafrica",
  "South Korea": "Corea del Sud",
  "Czech Republic": "Repubblica Ceca",
  "Bosnia & Herzegovina": "Bosnia ed Erzegovina",
  "Switzerland": "Svizzera",
  "Brazil": "Brasile",
  "Morocco": "Marocco",
  "USA": "Stati Uniti",
  "Turkey": "Turchia",
  "Germany": "Germania",
  "Curacao": "Curacao",
  "Ivory Coast": "Costa d'Avorio",
  "Netherlands": "Olanda",
  "Sweden": "Svezia",
  "Spain": "Spagna",
  "Cape Verde": "Capo Verde",
  "Saudi Arabia": "Arabia Saudita",
  "Belgium": "Belgio",
  "Egypt": "Egitto",
  "New Zealand": "Nuova Zelanda",
  "France": "Francia",
  "Norway": "Norvegia",
  "Jordan": "Giordania",
  "Portugal": "Portogallo",
  "DR Congo": "RD Congo",
  "England": "Inghilterra",
  "Croatia": "Croazia",
  "Uzbekistan": "Uzbekistan",
  "Colombia": "Colombia",
  "Scotland": "Scozia",
  "Australia": "Australia",
  "Japan": "Giappone",
  "Tunisia": "Tunisia",
  "Uruguay": "Uruguay",
  "Iran": "Iran",
  "Senegal": "Senegal",
  "Iraq": "Iraq",
  "Argentina": "Argentina",
  "Algeria": "Algeria",
  "Austria": "Austria",
  "Ghana": "Ghana",
  "Panama": "Panama",
  "Qatar": "Qatar",
  "Haiti": "Haiti",
  "Paraguay": "Paraguay",
  "Ecuador": "Ecuador",
  "Canada": "Canada",
};

function escapeFixture(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char]));
}

function fixtureSearchText(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function fixtureKickoff(time) {
  const match = String(time || "").match(/^(\d{1,2})(?:[.:](\d{2}))?(am|pm)$/i);
  if (!match) return time;
  let hour = Number(match[1]);
  const minute = match[2] || "00";
  const suffix = match[3].toLowerCase();
  if (suffix === "pm" && hour !== 12) hour += 12;
  if (suffix === "am" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function fixtureDateLabel(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function fixturePhaseLabel(phase) {
  return String(phase || "")
    .replace(/^Group ([A-L])$/, "Girone $1")
    .replace(/^Round of 32 - Match (\d+)$/, "Sedicesimi - Partita $1")
    .replace(/^Round of 16 - Match (\d+)$/, "Ottavi - Partita $1")
    .replace(/^Quarter-final - Match (\d+)$/, "Quarti - Partita $1")
    .replace(/^Semi-final - Match (\d+)$/, "Semifinale - Partita $1")
    .replace(/^Third Place Playoff - Match (\d+)$/, "Finale 3° posto - Partita $1")
    .replace(/^Final - Match (\d+)$/, "Finale - Partita $1");
}

function fixtureMatchLabel(match) {
  return String(match || "")
    .replace(/\bvs\b/g, "vs")
    .replace(/\bwinners\b/g, "vincente")
    .replace(/\blosers\b/g, "perdente")
    .replace(/\brunners-up\b/g, "seconda")
    .replace(/\bwinner\b/g, "vincente")
    .replace(/\bthird place\b/g, "terza")
    .replace(/\bGroup ([A-L])\b/g, "Girone $1")
    .replace(/\bMatch (\d+)\b/g, "Partita $1")
    .replace(/\bMexico|South Africa|South Korea|Czech Republic|Bosnia & Herzegovina|Switzerland|Brazil|Morocco|USA|Turkey|Germany|Curacao|Ivory Coast|Netherlands|Sweden|Spain|Cape Verde|Saudi Arabia|Belgium|Egypt|New Zealand|France|Norway|Jordan|Portugal|DR Congo|England|Croatia|Uzbekistan|Colombia|Scotland|Australia|Japan|Tunisia|Uruguay|Iran|Senegal|Iraq|Argentina|Algeria|Austria|Ghana|Panama|Qatar|Haiti|Paraguay|Ecuador|Canada\b/g, (team) => fixtureTranslations[team] || team);
}

function fixtureScoreInput(number, side, label) {
  const saved = predictionFixtureScores[number] || {};
  const score = scoreForMatchNumber(number);
  const real = fixtureRealResult(number);
  const value = score[side] ?? "";
  return `
    <label class="fixture-score-field">
      <span>${label}</span>
      <input
        class="${real && (saved[side] === undefined || saved[side] === "") ? "is-real-result" : ""}"
        type="number"
        inputmode="numeric"
        min="0"
        max="99"
        step="1"
        value="${escapeFixture(value)}"
        data-fixture-score="${number}"
        data-fixture-side="${side}"
        aria-label="${escapeFixture(label)} partita ${number}"
      >
    </label>`;
}

const roleAbbreviations = {
  "Portieri": "P",
  "Difensori": "D",
  "Centrocampisti": "C",
  "Attaccanti": "A",
};

function cleanNameTokens(value) {
  return fixtureSearchText(value).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function playerMatchesName(reference, player) {
  const referenceName = fixtureSearchText(reference);
  const playerName = fixtureSearchText(player);
  if (!referenceName || !playerName) return false;
  if (referenceName.length > 2 && (playerName.includes(referenceName) || referenceName.includes(playerName))) return true;
  const referenceTokens = cleanNameTokens(reference).filter((token) => token.length > 1);
  const playerTokens = cleanNameTokens(player).filter((token) => token.length > 1);
  if (!referenceTokens.length || !playerTokens.length) return false;
  if (referenceTokens.length === 1) return playerTokens.includes(referenceTokens[0]) || playerTokens[playerTokens.length - 1] === referenceTokens[0];
  return referenceTokens.every((token) => playerTokens.includes(token));
}

function isPredictedStarter(row) {
  const insights = typeof teamInsights !== "undefined" ? teamInsights : {};
  const starters = insights[row.team]?.starters || [];
  return starters.some((starter) => playerMatchesName(starter, row.player));
}

function playerStatsRecord(row) {
  const stats = typeof playerStats !== "undefined" ? playerStats : {};
  const key = fixtureSearchText(`${row.team}::${row.player}`);
  const roleKey = `${key}::${fixtureSearchText(row.role)}`;
  return stats[roleKey] || stats[key] || {};
}

function playerGoalAverage(row) {
  if (row.role === "Portieri") return "";
  const recent = playerStatsRecord(row).recent15 || {};
  const goals = Number(recent.goals);
  const appearances = Number(recent.appearances);
  if (!Number.isFinite(goals) || !Number.isFinite(appearances) || appearances <= 0) return "";
  return (goals / appearances).toFixed(2);
}

function playerOptionLabel(row) {
  const role = roleAbbreviations[row.role] || "";
  const avg = playerGoalAverage(row);
  return `${role ? `${role} · ` : ""}${row.player}${avg ? ` · ${avg} gol/p` : ""}`;
}

function playerRowForScorer(matchNumber, name) {
  const teams = participantsForMatchNumber(matchNumber).map(({ team }) => team).filter(Boolean);
  const dataRows = typeof rows !== "undefined" ? rows : [];
  return dataRows.find((row) => teams.includes(row.team) && playerMatchesName(name, row.player));
}

function fixtureScorersField(number) {
  const saved = predictionFixtureScores[number] || {};
  const realScorers = fixtureRealScorers(number);
  const selectedScorers = scorerParts(saved.scorers);
  const teams = participantsForMatchNumber(number).map(({ team }) => team).filter(Boolean);
  const options = teams.map((team) => {
    const players = rosterForTeam(team);
    if (!players.length) return "";
    return `<optgroup label="${escapeFixture(team)}">${players.map((row) => `<option class="${row.starter ? "is-probable-starter" : ""}" value="${escapeFixture(row.player)}">${escapeFixture(playerOptionLabel(row))}</option>`).join("")}</optgroup>`;
  }).join("");
  return `
    <label class="fixture-scorers-field">
      <span>${realScorers.length ? "Marcatori reali/pronosticati" : "Marcatori pronosticati"}</span>
      <div class="fixture-scorer-picker">
        <select data-fixture-scorer-select="${number}" aria-label="Scegli marcatore partita ${number}" ${options ? "" : "disabled"}>
          <option value="">${options ? "Scegli un calciatore" : "Squadre da definire"}</option>
          ${options}
        </select>
        <button type="button" data-add-scorer="${number}" ${options ? "" : "disabled"}>+</button>
      </div>
      <div class="fixture-scorer-chips">
        ${realScorers.map((name) => `
          <span class="fixture-real-scorer">
            ${escapeFixture(playerRowForScorer(number, name) ? playerOptionLabel(playerRowForScorer(number, name)) : name)}
          </span>
        `).join("")}
        ${selectedScorers.length ? selectedScorers.map((name, index) => `
          <button type="button" class="${isPredictedStarter(playerRowForScorer(number, name) || {}) ? "is-probable-starter" : ""}" data-remove-scorer="${number}" data-scorer-index="${index}">
            ${escapeFixture(playerRowForScorer(number, name) ? playerOptionLabel(playerRowForScorer(number, name)) : name)} <span aria-hidden="true">&times;</span>
          </button>
        `).join("") : ""}
        ${!realScorers.length && !selectedScorers.length ? '<small>Nessun marcatore scelto</small>' : ""}
      </div>
    </label>`;
}

function scorerParts(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || "").trim()).filter(Boolean);
  return String(value || "")
    .split(/[\n,;]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function scorerKey(value) {
  return fixtureSearchText(value).replace(/\s+/g, " ").trim();
}

function rosterForTeam(team) {
  const dataRows = typeof rows !== "undefined" ? rows : [];
  const seen = new Set();
  return dataRows
    .filter((row) => row.team === team && row.player)
    .filter((row) => {
      const key = fixtureSearchText(row.player);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((row) => ({ ...row, starter: isPredictedStarter(row) }))
    .sort((a, b) => Number(b.starter) - Number(a.starter) || a.role.localeCompare(b.role) || a.player.localeCompare(b.player));
}

function renderPredictedTopScorers() {
  const root = document.getElementById("fixture-top-scorers");
  if (!root) return;

  const matchNumbers = new Set([
    ...Object.keys(typeof worldCupResults !== "undefined" ? worldCupResults : {}),
    ...Object.keys(predictionFixtureScores),
  ]);

  const scorers = Array.from(matchNumbers).reduce((table, matchNumber) => {
    scorerParts(scoreForMatchNumber(matchNumber).scorers).forEach((name) => {
      const key = scorerKey(name);
      if (!key) return;
      table[key] = table[key] || { name, goals: 0, matches: new Set() };
      table[key].goals += 1;
      table[key].matches.add(matchNumber);
    });
    return table;
  }, {});

  const ranking = Object.values(scorers)
    .sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
    .slice(0, 12);

  root.innerHTML = `
    <div>
      <span>Capocannoniere</span>
      <h3>Marcatori pronosticati</h3>
    </div>
    <div class="fixture-top-scorers-list">
      ${ranking.length ? ranking.map((row, index) => `
        <div class="fixture-top-scorer-row">
          <span>${index + 1}</span>
          <strong>${escapeFixture(row.name)}</strong>
          <small>${row.goals} gol · ${row.matches.size} partite</small>
        </div>
      `).join("") : '<p>Nessun marcatore inserito.</p>'}
    </div>`;
}

function renderWorldCupCalendar() {
  const groupRoot = document.getElementById("group-calendar");
  const knockoutRoot = document.getElementById("knockout-calendar");
  const search = document.getElementById("fixture-search");
  const filter = document.getElementById("fixture-filter");
  const fixtures = typeof worldCupFixtures !== "undefined" ? worldCupFixtures : [];
  const roots = [groupRoot, knockoutRoot].filter(Boolean);
  if (!roots.length || !search || !filter || !fixtures.length) return;

  function fixtureCalendarMarkup(targetKind) {
    const query = fixtureSearchText(search.value.trim());
    const kind = filter.value;
    const filtered = fixtures
      .map((fixture, index) => ({ fixture, number: index + 1 }))
      .filter(({ fixture }) => {
        const [date, phase, match, time, venue, fixtureKind] = fixture;
        const translated = `${date} ${fixturePhaseLabel(phase)} ${fixtureMatchLabel(match)} ${fixtureKickoff(time)} ${venue}`;
        return fixtureKind === targetKind && (kind === "all" || fixtureKind === kind) && (!query || fixtureSearchText(translated).includes(query));
      });

    const byDate = filtered.reduce((days, item) => {
      const date = item.fixture[0];
      days[date] = days[date] || [];
      days[date].push(item);
      return days;
    }, {});

    return Object.entries(byDate).map(([date, items]) => `
      <section class="fixture-day">
        <h3>${escapeFixture(fixtureDateLabel(date))}</h3>
        <div class="fixture-list">
          ${items.map(({ fixture, number }) => {
            const [, phase, match, time, venue, fixtureKind] = fixture;
            const real = fixtureRealResult(number);
            return `
              <article class="fixture-card ${fixtureKind} ${real ? "has-real-result" : ""}">
                <span class="fixture-number">${number}</span>
                <div class="fixture-card-body">
                  <div class="fixture-card-meta">
                    <b>${escapeFixture(fixturePhaseLabel(phase))}</b>
                    <strong>${escapeFixture(fixtureMatchLabel(match))}</strong>
                    <small>${escapeFixture(fixtureKickoff(time))} &middot; ${escapeFixture(venue)}</small>
                    ${real ? `<em class="fixture-real-result-badge">${escapeFixture(real.status || "Risultato reale")}: ${escapeFixture(real.home)}-${escapeFixture(real.away)}</em>` : ""}
                  </div>
                  <div class="fixture-score-box" aria-label="Risultato esatto pronosticato">
                    ${fixtureScoreInput(number, "home", "Casa")}
                    <span aria-hidden="true">-</span>
                    ${fixtureScoreInput(number, "away", "Trasferta")}
                  </div>
                  ${fixtureScorersField(number)}
                </div>
              </article>`;
          }).join("")}
        </div>
      </section>`).join("") || '<div class="empty-inline">Nessuna partita trovata.</div>';
  }

  function draw() {
    if (groupRoot) groupRoot.innerHTML = fixtureCalendarMarkup("group");
    if (knockoutRoot) knockoutRoot.innerHTML = fixtureCalendarMarkup("knockout");
  }

  search.addEventListener("input", draw);
  filter.addEventListener("change", draw);
  roots.forEach((root) => root.addEventListener("input", (event) => {
    const input = event.target.closest("[data-fixture-score]");
    if (!input) return;
    const number = input.dataset.fixtureScore;
    predictionFixtureScores[number] = predictionFixtureScores[number] || {};
    predictionFixtureScores[number][input.dataset.fixtureSide] = input.value;
    const prediction = predictionFixtureScores[number];
    if ((prediction.home || "") === "" && (prediction.away || "") === "" && !scorerParts(prediction.scorers).length) {
      delete predictionFixtureScores[number];
    }
    savePredictionFixtureScores();
    pruneInvalidBracket();
    renderPredictionGroups();
    renderPredictionThirds();
    renderPredictionBracket();
    renderPredictedTopScorers();
    draw();
  }));
  roots.forEach((root) => root.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-scorer]");
    const removeButton = event.target.closest("[data-remove-scorer]");
    if (!addButton && !removeButton) return;

    const number = addButton ? addButton.dataset.addScorer : removeButton.dataset.removeScorer;
    predictionFixtureScores[number] = predictionFixtureScores[number] || {};
    const scorers = scorerParts(predictionFixtureScores[number].scorers);

    if (addButton) {
      const select = root.querySelector(`[data-fixture-scorer-select="${number}"]`);
      if (!select || !select.value) return;
      scorers.push(select.value);
      select.value = "";
    } else {
      scorers.splice(Number(removeButton.dataset.scorerIndex), 1);
    }

    predictionFixtureScores[number].scorers = scorers;
    const prediction = predictionFixtureScores[number];
    if ((prediction.home || "") === "" && (prediction.away || "") === "" && !scorers.length) {
      delete predictionFixtureScores[number];
    }
    savePredictionFixtureScores();
    renderPredictedTopScorers();
    draw();
  }));
  draw();
  renderPredictedTopScorers();
}

function bootPronostico() {
  loadPredictionGroups();
  loadPredictionThirds();
  loadPredictionBracket();
  loadPredictionFixtureScores();
  renderPredictionGroups();
  renderPredictionThirds();
  renderPredictionBracket();
  renderWorldCupCalendar();
}

bootPronostico();
