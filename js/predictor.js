const predictionKey = "mondiale-2026-manual-prediction-v2";
const standingsKey = "mondiale-2026-standings-v2";
const thirdStandingsKey = "mondiale-2026-third-standings-v1";

const r32Seeds = [
  ["1E", "3 ABCDF"], ["1I", "3 CDFGH"], ["2A", "2B"], ["1F", "2C"],
  ["2K", "2L"], ["1H", "2J"], ["1D", "3 BEFIJ"], ["1G", "3 AEHIJ"],
  ["1C", "2F"], ["2E", "2I"], ["1A", "3 CEFHI"], ["1L", "3 EHIJK"],
  ["1J", "2H"], ["2D", "2G"], ["1B", "3 EFGIJ"], ["1K", "3 DEIJL"],
];

const bracketRounds = [
  { id: "r32", title: "Sedicesimi", matches: 16, seeds: r32Seeds },
  { id: "r16", title: "Ottavi", matches: 8 },
  { id: "qf", title: "Quarti", matches: 4 },
  { id: "sf", title: "Semifinali", matches: 2 },
  { id: "final", title: "Finale", matches: 1 },
  { id: "champion", title: "Campione", matches: 1, champion: true },
];

const fixtures = [
["2026-06-11","Group A","Mexico vs South Africa","8pm","Mexico City, Mexico","group"],
["2026-06-12","Group A","South Korea vs Czech Republic","3am","Zapopan, Mexico","group"],
["2026-06-12","Group B","Canada vs Bosnia & Herzegovina","8pm","Toronto, Canada","group"],
["2026-06-13","Group D","USA vs Paraguay","2am","Los Angeles, USA","group"],
["2026-06-13","Group B","Qatar vs Switzerland","8pm","Santa Clara, USA","group"],
["2026-06-13","Group C","Brazil vs Morocco","11pm","New Jersey, USA","group"],
["2026-06-14","Group C","Haiti vs Scotland","2am","Foxborough, USA","group"],
["2026-06-14","Group D","Australia vs Turkey","5am","Vancouver, Canada","group"],
["2026-06-14","Group E","Germany vs Curacao","6pm","Houston, USA","group"],
["2026-06-14","Group F","Netherlands vs Japan","9pm","Arlington, USA","group"],
["2026-06-15","Group E","Ivory Coast vs Ecuador","12am","Philadelphia, USA","group"],
["2026-06-15","Group F","Sweden vs Tunisia","3am","Guadalupe, Mexico","group"],
["2026-06-15","Group H","Spain vs Cape Verde","5pm","Atlanta, USA","group"],
["2026-06-15","Group G","Belgium vs Egypt","8pm","Seattle, USA","group"],
["2026-06-15","Group H","Saudi Arabia vs Uruguay","11pm","Miami, USA","group"],
["2026-06-16","Group G","Iran vs New Zealand","2am","Los Angeles, USA","group"],
["2026-06-16","Group I","France vs Senegal","8pm","New Jersey, USA","group"],
["2026-06-16","Group I","Iraq vs Norway","11pm","Foxborough, USA","group"],
["2026-06-17","Group J","Argentina vs Algeria","2am","Kansas City, USA","group"],
["2026-06-17","Group J","Austria vs Jordan","5am","Santa Clara, USA","group"],
["2026-06-17","Group K","Portugal vs DR Congo","6pm","Houston, USA","group"],
["2026-06-17","Group L","England vs Croatia","9pm","Arlington, USA","group"],
["2026-06-18","Group L","Ghana vs Panama","12am","Toronto, Canada","group"],
["2026-06-18","Group K","Uzbekistan vs Colombia","3am","Mexico City, Mexico","group"],
["2026-06-18","Group A","Czech Republic vs South Africa","5pm","Atlanta, USA","group"],
["2026-06-18","Group B","Switzerland vs Bosnia & Herzegovina","8pm","Los Angeles, USA","group"],
["2026-06-18","Group B","Canada vs Qatar","11pm","Vancouver, Canada","group"],
["2026-06-19","Group A","Mexico vs South Korea","2am","Zapopan, Mexico","group"],
["2026-06-19","Group D","USA vs Australia","8pm","Seattle, USA","group"],
["2026-06-19","Group C","Scotland vs Morocco","11pm","Foxborough, USA","group"],
["2026-06-20","Group C","Brazil vs Haiti","1.30am","Philadelphia, USA","group"],
["2026-06-20","Group D","Turkey vs Paraguay","4am","Santa Clara, USA","group"],
["2026-06-20","Group F","Netherlands vs Sweden","6pm","Houston, USA","group"],
["2026-06-20","Group E","Germany vs Ivory Coast","9pm","Toronto, Canada","group"],
["2026-06-21","Group E","Ecuador vs Curacao","1am","Kansas City, USA","group"],
["2026-06-21","Group F","Tunisia vs Japan","5am","Guadalupe, Mexico","group"],
["2026-06-21","Group H","Spain vs Saudi Arabia","5pm","Atlanta, USA","group"],
["2026-06-21","Group G","Belgium vs Iran","8pm","Los Angeles, USA","group"],
["2026-06-21","Group H","Uruguay vs Cape Verde","11pm","Miami, USA","group"],
["2026-06-22","Group G","New Zealand vs Egypt","2am","Vancouver, Canada","group"],
["2026-06-22","Group J","Argentina vs Austria","6pm","Arlington, USA","group"],
["2026-06-22","Group I","France vs Iraq","10pm","Philadelphia, USA","group"],
["2026-06-23","Group I","Norway vs Senegal","1am","Toronto, Canada","group"],
["2026-06-23","Group J","Jordan vs Algeria","4am","Santa Clara, USA","group"],
["2026-06-23","Group K","Portugal vs Uzbekistan","6pm","Houston, USA","group"],
["2026-06-23","Group L","England vs Ghana","9pm","Foxborough, USA","group"],
["2026-06-24","Group L","Panama vs Croatia","12am","Foxborough, USA","group"],
["2026-06-24","Group K","Colombia vs DR Congo","3am","Zapopan, Mexico","group"],
["2026-06-24","Group B","Switzerland vs Canada","8pm","Vancouver, Canada","group"],
["2026-06-24","Group B","Bosnia & Herzegovina vs Qatar","8pm","Seattle, USA","group"],
["2026-06-24","Group C","Morocco vs Haiti","11pm","Atlanta, USA","group"],
["2026-06-24","Group C","Scotland vs Brazil","11pm","Miami, USA","group"],
["2026-06-25","Group A","South Africa vs South Korea","2am","Guadalupe, Mexico","group"],
["2026-06-25","Group A","Czech Republic vs Mexico","2am","Mexico City, Mexico","group"],
["2026-06-25","Group E","Curacao vs Ivory Coast","9pm","Philadelphia, USA","group"],
["2026-06-25","Group E","Ecuador vs Germany","9pm","New Jersey, USA","group"],
["2026-06-26","Group F","Tunisia vs Netherlands","12am","Kansas City, USA","group"],
["2026-06-26","Group F","Japan vs Sweden","12am","Arlington, USA","group"],
["2026-06-26","Group D","Turkey vs USA","3am","Los Angeles, USA","group"],
["2026-06-26","Group D","Paraguay vs Australia","3am","Santa Clara, USA","group"],
["2026-06-26","Group I","Norway vs France","8pm","Foxborough, USA","group"],
["2026-06-26","Group I","Senegal vs Iraq","8pm","Toronto, Canada","group"],
["2026-06-27","Group H","Cape Verde vs Saudi Arabia","1am","Houston, USA","group"],
["2026-06-27","Group H","Uruguay vs Spain","1am","Zapopan, Mexico","group"],
["2026-06-27","Group G","New Zealand vs Belgium","4am","Vancouver, Canada","group"],
["2026-06-27","Group G","Egypt vs Iran","4am","Seattle, USA","group"],
["2026-06-27","Group L","Panama vs England","10pm","New Jersey, USA","group"],
["2026-06-27","Group L","Croatia vs Ghana","10pm","Philadelphia, USA","group"],
["2026-06-28","Group K","Colombia vs Portugal","12.30am","Miami, USA","group"],
["2026-06-28","Group K","DR Congo vs Uzbekistan","12.30am","Atlanta, USA","group"],
["2026-06-28","Group J","Algeria vs Austria","3am","Kansas City, USA","group"],
["2026-06-28","Group J","Jordan vs Argentina","3am","Arlington, USA","group"],
["2026-06-28","Round of 32 - Match 73","Group A runners-up vs Group B runners-up","8pm","Los Angeles, USA","knockout"],
["2026-06-29","Round of 32 - Match 76","Group C winners vs Group F runners-up","6pm","Houston, USA","knockout"],
["2026-06-29","Round of 32 - Match 74","Group E winners vs Group A/B/C/D/F third place","9.30pm","Foxborough, USA","knockout"],
["2026-06-30","Round of 32 - Match 75","Group F winners vs Group C runners-up","2am","Guadalupe, Mexico","knockout"],
["2026-06-30","Round of 32 - Match 78","Group E runners-up vs Group I runners-up","6pm","Arlington, USA","knockout"],
["2026-06-30","Round of 32 - Match 77","Group I winners vs Group C/D/F/G/H third place","10pm","New Jersey, USA","knockout"],
["2026-07-01","Round of 32 - Match 79","Group A winners vs Group C/E/F/H/I third place","2am","Mexico City, Mexico","knockout"],
["2026-07-01","Round of 32 - Match 80","Group L winners vs Group E/H/I/J/K third place","5pm","Atlanta, USA","knockout"],
["2026-07-01","Round of 32 - Match 82","Group G winners vs Group A/E/H/I/J third place","9pm","Seattle, USA","knockout"],
["2026-07-02","Round of 32 - Match 81","Group D winners vs Group B/E/F/I/J third place","1am","Santa Clara, USA","knockout"],
["2026-07-02","Round of 32 - Match 84","Group H winners vs Group J runners-up","8pm","Los Angeles, USA","knockout"],
["2026-07-03","Round of 32 - Match 83","Group K runners-up vs Group L runners-up","12am","Toronto, Canada","knockout"],
["2026-07-03","Round of 32 - Match 85","Group B winners vs Group E/F/G/I/J third place","4am","Vancouver, Canada","knockout"],
["2026-07-03","Round of 32 - Match 88","Group D runners-up vs Group G runners-up","7pm","Arlington, USA","knockout"],
["2026-07-03","Round of 32 - Match 86","Group J winners vs Group H runners-up","11pm","Miami, USA","knockout"],
["2026-07-04","Round of 32 - Match 87","Group K winners vs Group D/E/I/J/L third place","2.30am","Kansas City, USA","knockout"],
["2026-07-04","Round of 16 - Match 90","Match 73 winners vs Match 75 winners","6pm","Houston, USA","knockout"],
["2026-07-04","Round of 16 - Match 89","Match 74 winners vs Match 77 winners","10pm","Philadelphia, USA","knockout"],
["2026-07-05","Round of 16 - Match 91","Match 76 winners vs Match 78 winners","9pm","New Jersey, USA","knockout"],
["2026-07-06","Round of 16 - Match 92","Match 79 winners vs Match 80 winners","1am","Mexico City, Mexico","knockout"],
["2026-07-06","Round of 16 - Match 93","Match 83 winners vs Match 84 winners","8pm","Arlington, USA","knockout"],
["2026-07-07","Round of 16 - Match 94","Match 81 winners vs Match 82 winners","1am","Seattle, USA","knockout"],
["2026-07-07","Round of 16 - Match 95","Match 86 winners vs Match 88 winners","5pm","Atlanta, USA","knockout"],
["2026-07-07","Round of 16 - Match 96","Match 85 winners vs Match 87 winners","9pm","Vancouver, Canada","knockout"],
["2026-07-09","Quarter-final - Match 97","Match 89 winners vs Match 90 winners","9pm","Foxborough, USA","knockout"],
["2026-07-10","Quarter-final - Match 98","Match 93 winners vs Match 94 winners","8pm","Los Angeles, USA","knockout"],
["2026-07-11","Quarter-final - Match 99","Match 91 winners vs Match 92 winners","10pm","Miami, USA","knockout"],
["2026-07-12","Quarter-final - Match 100","Match 95 winners vs Match 96 winners","2am","Kansas City, USA","knockout"],
["2026-07-14","Semi-final - Match 101","Match 97 winners vs Match 98 winners","8pm","Arlington, USA","knockout"],
["2026-07-15","Semi-final - Match 102","Match 99 winners vs Match 100 winners","8pm","Atlanta, USA","knockout"],
["2026-07-18","Third Place Playoff - Match 103","Match 101 losers vs Match 102 losers","10pm","Miami, USA","knockout"],
["2026-07-19","Final - Match 104","Match 101 winners vs Match 102 winners","8pm","New Jersey, USA","knockout"],
];

let standings = {};
let thirdRankings = [];
let prediction = {};
let activeSeed = "";

const allTeams = Object.values(groupTeams).flat();

function flagImg(team, className = "mini-flag") {
  return teamFlags[team] ? `<img class="${className}" src="${teamFlags[team]}" alt="" loading="lazy">` : "";
}

function loadStandings() {
  const saved = JSON.parse(localStorage.getItem(standingsKey) || "{}");
  standings = Object.fromEntries(Object.entries(groupTeams).map(([group, teams]) => [group, saved[group] || [...teams]]));
}

function saveStandings() {
  localStorage.setItem(standingsKey, JSON.stringify(standings));
}

function currentThirds() {
  return Object.entries(standings).map(([group, teams]) => ({ group, team: teams[2] })).filter((item) => item.team);
}

function normalizeThirdRankings(saved = []) {
  const current = currentThirds();
  const byGroup = new Map(current.map((item) => [item.group, item]));
  const ordered = saved
    .map((item) => byGroup.get(item.group))
    .filter(Boolean);
  const seen = new Set(ordered.map((item) => item.group));
  return [...ordered, ...current.filter((item) => !seen.has(item.group))];
}

function loadThirdRankings() {
  const saved = JSON.parse(localStorage.getItem(thirdStandingsKey) || "[]");
  thirdRankings = normalizeThirdRankings(saved);
}

function saveThirdRankings() {
  localStorage.setItem(thirdStandingsKey, JSON.stringify(thirdRankings.map(({ group }) => ({ group }))));
}

function loadPrediction() {
  prediction = JSON.parse(localStorage.getItem(predictionKey) || "{}");
}

function savePrediction() {
  localStorage.setItem(predictionKey, JSON.stringify(prediction));
}

function parseSeedGroups(seed) {
  const groups = seed.match(/[A-L]/g) || [];
  return [...new Set(groups)];
}

function eligibleTeams(seed) {
  if (!seed) return allTeams;
  const place = seed.trim()[0];
  const groups = parseSeedGroups(seed);
  if (!groups.length) return allTeams;
  if (place === "1") return [standings[groups[0]][0]];
  if (place === "2") return [standings[groups[0]][1]];
  if (place === "3") {
    const allowed = new Set(groups);
    return thirdRankings.filter(({ group }) => allowed.has(group)).map(({ team }) => team);
  }
  return allTeams;
}

function renderStandings() {
  const grid = document.getElementById("standings-grid");
  if (!grid) return;
  grid.innerHTML = Object.entries(standings).map(([group, teams]) => `
    <article class="standing-card ${activeSeed && parseSeedGroups(activeSeed).includes(group) ? "is-eligible" : ""}" data-group="${group}" style="--group-color:${groupColors[group] || "#00d084"}">
      <div class="standing-head"><strong>Girone ${group}</strong><span>${teams.length} squadre</span></div>
      <ol class="standing-list">
        ${teams.map((team, index) => `
          <li class="standing-team ${index < 2 ? "is-qualified" : index === 2 ? "is-third" : ""}">
            <span class="standing-pos">${index + 1}</span>${flagImg(team)}<b>${team}</b>
            <div class="standing-controls">
              <button type="button" data-move="up" data-group="${group}" data-index="${index}" ${index === 0 ? "disabled" : ""}>▲</button>
              <button type="button" data-move="down" data-group="${group}" data-index="${index}" ${index === teams.length - 1 ? "disabled" : ""}>▼</button>
            </div>
          </li>`).join("")}
      </ol>
    </article>`).join("");

  grid.querySelectorAll("button[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const group = button.dataset.group;
      const index = Number(button.dataset.index);
      const direction = button.dataset.move === "up" ? -1 : 1;
      const target = index + direction;
      [standings[group][index], standings[group][target]] = [standings[group][target], standings[group][index]];
      saveStandings();
      thirdRankings = normalizeThirdRankings(thirdRankings);
      saveThirdRankings();
      renderAll();
    });
  });
}

function renderThirdRankings() {
  const grid = document.getElementById("thirds-grid");
  if (!grid) return;
  thirdRankings = normalizeThirdRankings(thirdRankings);
  grid.innerHTML = `
    <ol class="third-ranking-list">
      ${thirdRankings.map(({ group, team }, index) => `
        <li class="third-ranking-team ${index < 8 ? "is-qualified" : "is-out"}" style="--group-color:${groupColors[group] || "#00d084"}">
          <span class="standing-pos">${index + 1}</span>
          ${flagImg(team)}
          <b>${team}</b>
          <small>Girone ${group}</small>
          <div class="standing-controls">
            <button type="button" data-third-move="up" data-index="${index}" ${index === 0 ? "disabled" : ""}>Su</button>
            <button type="button" data-third-move="down" data-index="${index}" ${index === thirdRankings.length - 1 ? "disabled" : ""}>Giu</button>
          </div>
        </li>`).join("")}
    </ol>
    <p class="third-ranking-note">Le prime otto sono evidenziate come qualificate.</p>`;

  grid.querySelectorAll("button[data-third-move]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      const direction = button.dataset.thirdMove === "up" ? -1 : 1;
      const target = index + direction;
      [thirdRankings[index], thirdRankings[target]] = [thirdRankings[target], thirdRankings[index]];
      saveThirdRankings();
      renderAll();
    });
  });
}

function renderQualifiers() {
  const grid = document.getElementById("qualifiers-grid");
  if (!grid) return;
  const bestThirds = thirdRankings.slice(0, 8);
  const excludedThirds = thirdRankings.slice(8);
  grid.innerHTML = `
    <div class="qualifier-column"><h3>Prime</h3>${Object.entries(standings).map(([g,t]) => `<span>${g}: ${flagImg(t[0])}${t[0]}</span>`).join("")}</div>
    <div class="qualifier-column"><h3>Seconde</h3>${Object.entries(standings).map(([g,t]) => `<span>${g}: ${flagImg(t[1])}${t[1]}</span>`).join("")}</div>
    <div class="qualifier-column"><h3>Migliori terze</h3>${bestThirds.map(({group,team}) => `<span>${group}: ${flagImg(team)}${team}</span>`).join("")}</div>
    <div class="qualifier-column muted-column"><h3>Terze escluse</h3>${excludedThirds.map(({group,team}) => `<span>${group}: ${flagImg(team)}${team}</span>`).join("")}</div>`;
}

function teamOptions(seed = "", selected = "") {
  const eligible = new Set(eligibleTeams(seed));
  const base = seed ? [...eligible] : allTeams;
  const teams = selected && !eligible.has(selected) ? [selected, ...base] : base;
  return `<option value="">Scegli squadra</option>` + teams.map((team) => `<option value="${team}" ${selected === team ? "selected" : ""}>${team}</option>`).join("");
}

function makeSlot(slotId, seed = "", label = "") {
  const selected = prediction[slotId] || "";
  return `<label class="manual-slot" data-seed="${seed}" data-slot="${slotId}">
    <span>${label || seed || "Squadra"}</span>
    <select data-slot="${slotId}" data-seed="${seed}">${teamOptions(seed, selected)}</select>
  </label>`;
}

function renderMatch(roundId, index, seeds = null, number = "", side = "") {
  const matchClass = `manual-match ${side ? `match-${side}` : ""}`.trim();
  return `<article class="${matchClass}">
    <div class="match-name">${number ? `Match ${number}` : `Partita ${index + 1}`}</div>
    ${makeSlot(`${roundId}-${index}-a`, seeds ? seeds[0] : "", seeds ? seeds[0] : "Squadra A")}
    ${makeSlot(`${roundId}-${index}-b`, seeds ? seeds[1] : "", seeds ? seeds[1] : "Squadra B")}
  </article>`;
}

function renderRoundColumn(roundId, title, matchIndexes, side) {
  const round = bracketRounds.find((item) => item.id === roundId);
  return `<section class="fifa-round fifa-round-${roundId} fifa-round-${side}">
    <h3>${title}</h3>
    <div class="fifa-round-matches">
      ${matchIndexes.map((matchIndex) => {
        const seeds = round.seeds ? round.seeds[matchIndex] : null;
        const number = roundId === "r32" ? matchIndex + 73 : "";
        return renderMatch(roundId, matchIndex, seeds, number, side);
      }).join("")}
    </div>
  </section>`;
}

function renderBracket() {
  const board = document.getElementById("manual-bracket");
  if (!board) return;
  board.innerHTML = `
    <div class="fifa-bracket-scroll">
      <div class="fifa-bracket-grid">
        <div class="fifa-bracket-wing fifa-bracket-left">
          ${renderRoundColumn("r32", "Sedicesimi", [0,1,2,3,4,5,6,7], "left")}
          ${renderRoundColumn("r16", "Ottavi", [0,1,2,3], "left")}
          ${renderRoundColumn("qf", "Quarti", [0,1], "left")}
          ${renderRoundColumn("sf", "Semifinale", [0], "left")}
        </div>
        <div class="fifa-final-column">
          <div class="fifa-trophy">26</div>
          <article class="manual-match final-match">
            <div class="match-name">Finale</div>
            ${makeSlot("final-0-a", "", "Finalista 1")}
            ${makeSlot("final-0-b", "", "Finalista 2")}
          </article>
          <article class="manual-match champion-match">
            <div class="match-name">Campione</div>
            ${makeSlot("champion-winner", "", "Vincitore")}
          </article>
        </div>
        <div class="fifa-bracket-wing fifa-bracket-right">
          ${renderRoundColumn("sf", "Semifinale", [1], "right")}
          ${renderRoundColumn("qf", "Quarti", [2,3], "right")}
          ${renderRoundColumn("r16", "Ottavi", [4,5,6,7], "right")}
          ${renderRoundColumn("r32", "Sedicesimi", [8,9,10,11,12,13,14,15], "right")}
        </div>
      </div>
    </div>`;

  board.querySelectorAll("select[data-slot]").forEach((select) => {
    select.addEventListener("focus", () => setActiveSeed(select.dataset.seed || ""));
    select.addEventListener("click", () => setActiveSeed(select.dataset.seed || ""));
    select.addEventListener("change", () => {
      prediction[select.dataset.slot] = select.value;
      savePrediction();
    });
  });
}

function renderThirdPlace() {
  const box = document.getElementById("third-place-bracket");
  if (!box) return;
  box.innerHTML = `
    <article class="manual-match bronze-match fifa-bronze-match">
      <div class="match-name">Finale 3° posto</div>
      ${makeSlot("bronze-a", "", "Perdente SF 1")}
      ${makeSlot("bronze-b", "", "Perdente SF 2")}
      ${makeSlot("bronze-winner", "", "Terzo classificato")}
    </article>`;
  box.querySelectorAll("select[data-slot]").forEach((select) => {
    select.addEventListener("focus", () => setActiveSeed(select.dataset.seed || ""));
    select.addEventListener("click", () => setActiveSeed(select.dataset.seed || ""));
    select.addEventListener("change", () => {
      prediction[select.dataset.slot] = select.value;
      savePrediction();
    });
  });
}

function setActiveSeed(seed) {
  activeSeed = seed;
  renderStandings();
}

function autoFillR32() {
  r32Seeds.forEach((seeds, index) => {
    prediction[`r32-${index}-a`] = eligibleTeams(seeds[0])[0] || "";
    prediction[`r32-${index}-b`] = eligibleTeams(seeds[1])[0] || "";
  });
  savePrediction();
  renderBracket();
}

function clearPrediction() {
  prediction = {};
  localStorage.removeItem(predictionKey);
  renderBracket();
  renderThirdPlace();
}

function ukToItaly(uk) {
  const match = uk.match(/(\d+)(?:\.(\d+))?(am|pm)/i);
  if (!match) return uk;
  let hour = Number(match[1]);
  const minute = match[2] ? Number(match[2]) : 0;
  const suffix = match[3].toLowerCase();
  if (suffix === "pm" && hour !== 12) hour += 12;
  if (suffix === "am" && hour === 12) hour = 0;
  hour = (hour + 1) % 24;
  return `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}`;
}

function formatDate(date) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

function renderCalendar() {
  const root = document.getElementById("full-calendar");
  const search = document.getElementById("fixture-search");
  const filter = document.getElementById("fixture-filter");
  if (!root || !search || !filter) return;

  function draw() {
    const q = search.value.trim().toLowerCase();
    const type = filter.value;
    const filtered = fixtures.filter(([date, phase, match, time, venue, kind]) => {
      const haystack = `${date} ${phase} ${match} ${venue}`.toLowerCase();
      return (type === "all" || kind === type) && (!q || haystack.includes(q));
    });
    const byDate = filtered.reduce((acc, item) => {
      acc[item[0]] = acc[item[0]] || [];
      acc[item[0]].push(item);
      return acc;
    }, {});
    root.innerHTML = Object.entries(byDate).map(([date, items]) => `
      <section class="fixture-day">
        <h3>${formatDate(date)}</h3>
        <div class="fixture-list">
          ${items.map(([_, phase, match, time, venue, kind], idx) => `
            <article class="fixture-card ${kind}">
              <span class="fixture-number">${kind === "knockout" ? "KO" : "G"}${idx + 1}</span>
              <div><b>${phase}</b><strong>${match}</strong><small>${ukToItaly(time)} · ${venue}</small></div>
            </article>`).join("")}
        </div>
      </section>`).join("") || `<div class="empty-inline">Nessuna partita trovata.</div>`;
  }
  search.addEventListener("input", draw);
  filter.addEventListener("change", draw);
  draw();
}

function renderAll() {
  renderStandings();
  renderThirdRankings();
  renderQualifiers();
  renderBracket();
  renderThirdPlace();
}

function bootPredictor() {
  loadStandings();
  loadThirdRankings();
  loadPrediction();
  renderAll();
  renderCalendar();
  document.getElementById("auto-fill-r32")?.addEventListener("click", autoFillR32);
  document.getElementById("clear-prediction")?.addEventListener("click", clearPrediction);
  document.getElementById("restore-prediction")?.addEventListener("click", () => { loadPrediction(); renderAll(); });
}

bootPredictor();
