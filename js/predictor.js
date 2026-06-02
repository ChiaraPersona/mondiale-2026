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

const teamPalette = document.getElementById("team-palette");
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

function groupLetterFromSeed(seed) {
  const match = String(seed || "").match(/[A-L]/);
  return match ? match[0] : "";
}

function eligibleTeamsForLabel(label) {
  if (!label) return [];
  const clean = String(label).replace(/\s+/g, " ").trim();
  if (/^[12][A-L]$/.test(clean)) {
    const group = clean.slice(1);
    return groupTeams[group] || [];
  }
  if (/^3\s/.test(clean)) {
    const letters = clean.replace(/^3\s*/, "").replace(/[^A-L]/g, "").split("");
    return letters.flatMap((group) => groupTeams[group] || []);
  }
  return Object.values(groupTeams).flat();
}

function eligibilityText(label) {
  const teams = eligibleTeamsForLabel(label);
  if (!label) return "Slot libero: puoi trascinare una vincente dalla fase precedente.";
  if (!teams.length) return "Nessuna squadra trovata per questo incastro.";
  return "Puoi scegliere: " + teams.join(", ");
}

function makeSlotHints(label) {
  const hint = document.createElement("div");
  hint.className = "slot-hint";
  hint.textContent = eligibilityText(label);
  return hint;
}

function showSlotHint(slot) {
  document.querySelectorAll(".drop-slot.show-hint").forEach((item) => {
    if (item !== slot) item.classList.remove("show-hint");
  });
  slot.classList.add("show-hint");
}

function hideSlotHint(slot) {
  if (!slot.matches(":hover") && document.activeElement !== slot) slot.classList.remove("show-hint");
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

function renderPalette() {
  teamPalette.innerHTML = "";
  Object.entries(groupTeams).forEach(([group, teams]) => {
    const card = document.createElement("article");
    card.className = "predictor-group";
    card.style.setProperty("--group-color", groupColors[group] || "#1f7a5b");
    card.innerHTML = '<h3>Girone ' + group + '</h3>';

    const list = document.createElement("div");
    list.className = "predictor-team-list";
    teams.forEach((team) => list.appendChild(makeTeamToken(team, "palette")));

    card.appendChild(list);
    teamPalette.appendChild(card);
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
  slot.tabIndex = 0;
  slot.dataset.seed = label;
  slot.title = eligibilityText(label);
  if (label) slot.innerHTML = '<span class="seed-label">' + label + '</span>';
  slot.appendChild(makeSlotHints(label));
  enableDropSlot(slot);

  return slot;
}

function enableDropSlot(slot) {
  slot.addEventListener("dragover", (event) => {
    event.preventDefault();
    slot.classList.add("is-over");
  });

  slot.addEventListener("dragleave", () => slot.classList.remove("is-over"));
  slot.addEventListener("mouseenter", () => showSlotHint(slot));
  slot.addEventListener("mouseleave", () => hideSlotHint(slot));
  slot.addEventListener("focus", () => showSlotHint(slot));
  slot.addEventListener("blur", () => slot.classList.remove("show-hint"));

  slot.addEventListener("drop", (event) => {
    event.preventDefault();
    slot.classList.remove("is-over");
    const payload = JSON.parse(event.dataTransfer.getData("text/plain") || "{}");
    if (payload.team) placeTeam(slot, payload.team, payload.fromSlot);
  });

  slot.addEventListener("click", () => {
    showSlotHint(slot);
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
  document.querySelectorAll(".final-stage .drop-slot").forEach((slot) => {
    slot.tabIndex = 0;
    slot.title = eligibilityText("");
    if (!slot.querySelector(".slot-hint")) slot.appendChild(makeSlotHints(""));
    enableDropSlot(slot);
  });
  loadPrediction();
}

clearButton.addEventListener("click", clearPrediction);
restoreButton.addEventListener("click", () => {
  document.querySelectorAll(".drop-slot").forEach(clearSlot);
  loadPrediction();
});

bootPredictor();
