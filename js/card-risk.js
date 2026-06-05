const cardRiskRoot = document.getElementById("card-risk-content");
const cardRiskTop = document.getElementById("card-risk-top");
const cardRiskFormulaRoot = document.getElementById("card-risk-formula");

function cardRiskTone(value) {
  if (value >= 85) return "is-extreme";
  if (value >= 70) return "is-high";
  if (value >= 55) return "is-medium";
  return "is-low";
}

function cardRiskRow(player, index) {
  const clubLine = [player.club, player.lega].filter(Boolean).join(" - ");

  return `
    <article class="card-risk-row ${cardRiskTone(player.rischio_cartellino)}">
      <span class="card-risk-position">${index + 1}</span>
      <div class="card-risk-player">
        <strong>${player.giocatore}</strong>
        <small>Girone ${player.gruppo} - ${player.squadra}</small>
        <small class="card-risk-club">${clubLine}</small>
      </div>
      <div class="card-risk-metrics">
        <span><b>${player.ammonizioni_stagionali}</b> gialli</span>
        <span><b>${player.espulsioni_stagionali}</b> rossi</span>
        <span><b>${player.media_falli_partita}</b> falli</span>
      </div>
      <strong class="card-risk-score">${player.rischio_cartellino}</strong>
    </article>`;
}

function cardRiskGroup(group, players) {
  return `
    <details class="card-risk-group">
      <summary>
        <span>Girone ${group}</span>
        <strong>${players.length} giocatori</strong>
      </summary>
      <div>${players.map((player, index) => cardRiskRow(player, index)).join("")}</div>
    </details>`;
}

function renderCardRisk() {
  if (!cardRiskRoot || typeof cardRiskPlayers === "undefined") return;
  const sorted = [...cardRiskPlayers].sort((a, b) =>
    b.rischio_cartellino - a.rischio_cartellino ||
    b.espulsioni_stagionali - a.espulsioni_stagionali ||
    b.ammonizioni_stagionali - a.ammonizioni_stagionali ||
    b.media_falli_partita - a.media_falli_partita ||
    a.giocatore.localeCompare(b.giocatore)
  );
  const byGroup = sorted.reduce((groups, player) => {
    groups[player.gruppo] = groups[player.gruppo] || [];
    groups[player.gruppo].push(player);
    return groups;
  }, {});

  if (cardRiskTop) {
    cardRiskTop.innerHTML = sorted.slice(0, 16).map((player, index) => cardRiskRow(player, index)).join("");
  }

  cardRiskRoot.innerHTML = Object.keys(byGroup)
    .sort()
    .map((group) => cardRiskGroup(group, byGroup[group]))
    .join("");

  if (cardRiskFormulaRoot && typeof cardRiskFormula !== "undefined") {
    cardRiskFormulaRoot.textContent = cardRiskFormula.description;
  }
}

renderCardRisk();
