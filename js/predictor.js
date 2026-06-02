const predictionKey = "mondiale-2026-prediction";

const bracketMatches = {
  left: [
    ["1E", "3 ABCDF"],
    ["1I", "3 CDFGH"],
    ["2A", "2B"],
    ["1F", "2C"],
    ["2K", "2L"],
    ["1H", "2J"],
    ["1D", "3 BEFIJ"],
    ["1G", "3 AEHIJ"],
  ],
  right: [
    ["1C", "2F"],
    ["2E", "2I"],
    ["1A", "3 CEFHI"],
    ["1L", "3 EHIJK"],
    ["1J", "2H"],
    ["2D", "2G"],
    ["1B", "3 EFGIJ"],
    ["1K", "3 DEIJL"],
  ],
};

const teamPaletteLeft = document.getElementById("team-palette-left");
const teamPaletteRight = document.getElementById("team-palette-right");
const leftBracket = document.getElementById("left-bracket");
const rightBracket = document.getElementById("right-bracket");
const clearButton = document.getElementById("clear-prediction");
const restoreButton = document.getElementById("restore-prediction");

let selectedTeam = null;
let savedPrediction = {};

function fold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function getTeamSlug(team) {
  return fold(team).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function makeTeamToken(team, source) {
  const token = document.createElement("button");
  token.className = "team-token";
  token.type = "button";
  token.draggable = true;
  token.dataset.team = team;
  token.dataset.source = source;
  token.setAttribute("aria-label", team);
  token.innerHTML = '<img src="' + teamFlags[team] + '" alt="" loading="lazy"><span>' + team + '</span>';

  token.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({
      team,
      source,
      fromSlot: token.closest(".drop-slot") ? token.closest(".drop-slot").dataset.slot : "",
    }));
    event.dataTransfer.effectAllowed = "copyMove";
  });

  token.addEventListener("click", () => {
    selectedTeam = team;
    document.querySelectorAll(".team-token.is-selected").forEach((item) => item.classList.remove("is-selected"));
    token.classList.add("is-selected");
  });

  return token;
}

function makePaletteGroup(group, teams) {
  const card = document.createElement("article");
  card.className = "predictor-group";
  card.style.setProperty("--group-color", groupColors[group] || "#1f7a5b");
  card.innerHTML = '<h3>Girone ' + group + '</h3>';

  const list = document.createElement("div");
  list.className = "predictor-team-list";
  teams.forEach((team) => list.appendChild(makeTeamToken(team, "palette")));

  card.appendChild(list);
  return card;
}

function renderPalette() {
  teamPaletteLeft.innerHTML = "";
  teamPaletteRight.innerHTML = "";

  const groups = Object.entries(groupTeams);
  const splitIndex = Math.ceil(groups.length / 2);

  groups.slice(0, splitIndex).forEach(([group, teams]) => {
    teamPaletteLeft.appendChild(makePaletteGroup(group, teams));
  });

  groups.slice(splitIndex).forEach(([group, teams]) => {
    teamPaletteRight.appendChild(makePaletteGroup(group, teams));
  });
}

function renderBracketSide(container, matches, side) {
  container.innerHTML = "";
  const rounds = [
    { name: "Sedicesimi", className: "round-32", count: 16 },
    { name: "Ottavi", className: "round-16", count: 8 },
    { name: "Quarti", className: "round-qf", count: 4 },
    { name: "Semifinali", className: "round-sf", count: 2 },
  ];

  rounds.forEach((round, roundIndex) => {
    const column = document.createElement("div");
    column.className = "bracket-round " + round.className;
    column.innerHTML = '<span class="round-label">' + round.name + '</span>';

    const slotCount = side === "left" ? round.count / 2 : round.count / 2;
    for (let i = 0; i < slotCount; i += 1) {
      const match = document.createElement("div");
      match.className = "prediction-match";

      if (roundIndex === 0) {
        const labels = matches[i];
        match.appendChild(makeDropSlot(side + "-r32-" + i + "-a", labels[0]));
        match.appendChild(makeDropSlot(side + "-r32-" + i + "-b", labels[1]));
      } else {
        match.appendChild(makeDropSlot(side + "-r" + roundIndex + "-" + i));
      }

      column.appendChild(match);
    }

    container.appendChild(column);
  });
}

function makeDropSlot(id, label = "") {
  const slot = document.createElement("div");
  slot.className = "drop-slot";
  slot.dataset.slot = id;
  slot.innerHTML = label ? '<span class="seed-label">' + label + '</span>' : "";
  enableDropSlot(slot);

  return slot;
}

function enableDropSlot(slot) {
  slot.addEventListener("dragover", (event) => {
    event.preventDefault();
    slot.classList.add("is-over");
  });

  slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));

  slot.addEventListener("drop", (event) => {
    event.preventDefault();
    slot.classList.remove("is-over");
    const payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
    if (payload.team) placeTeam(slot, payload.team, payload.fromSlot);
  });

  slot.addEventListener("click", () => {
    if (selectedTeam) {
      placeTeam(slot, selectedTeam);
    }
  });
}

function placeTeam(slot, team, fromSlot = "") {
  const previous = slot.querySelector(".team-token");
  const sourceSlot = fromSlot ? document.querySelector('[data-slot="' + fromSlot + '"]') : null;

  if (sourceSlot && sourceSlot !== slot) {
    clearSlot(sourceSlot);
  }

  if (previous) previous.remove();
  slot.appendChild(makeTeamToken(team, "slot"));
  savedPrediction[slot.dataset.slot] = team;
  savePrediction();
}

function clearSlot(slot) {
  const token = slot.querySelector(".team-token");
  if (token) token.remove();
  delete savedPrediction[slot.dataset.slot];
  const label = slot.querySelector(".seed-label");
  if (label) slot.prepend(label);
}

function clearPrediction() {
  document.querySelectorAll(".drop-slot").forEach(clearSlot);
  savedPrediction = {};
  savePrediction();
}

function savePrediction() {
  localStorage.setItem(predictionKey, JSON.stringify(savedPrediction));
}

function loadPrediction() {
  savedPrediction = JSON.parse(localStorage.getItem(predictionKey) || "{}");
  Object.entries(savedPrediction).forEach(([slotId, team]) => {
    const slot = document.querySelector('[data-slot="' + slotId + '"]');
    if (slot && teamFlags[team]) placeTeam(slot, team);
  });
}

function bootPredictor() {
  renderPalette();
  renderBracketSide(leftBracket, bracketMatches.left, "left");
  renderBracketSide(rightBracket, bracketMatches.right, "right");
  document.querySelectorAll(".final-stage .drop-slot").forEach(enableDropSlot);
  loadPrediction();
}

clearButton.addEventListener("click", clearPrediction);
restoreButton.addEventListener("click", () => {
  document.querySelectorAll(".drop-slot").forEach(clearSlot);
  loadPrediction();
});

bootPredictor();
