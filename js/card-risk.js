const cardRiskRoot = document.getElementById("card-risk-content");
const cardRiskTop = document.getElementById("card-risk-top");
const cardRiskFormulaRoot = document.getElementById("card-risk-formula");

function cardRiskNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function cardRiskFold(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function cardRiskPlayerStats(team, player) {
  if (typeof playerStats === "undefined") return null;
  const teamKey = cardRiskFold(team);
  const playerKey = cardRiskFold(player);

  return Object.values(playerStats).find((record) =>
    cardRiskFold(record?.team) === teamKey &&
    cardRiskFold(record?.player) === playerKey
  ) || null;
}

function cardRiskClamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function cardRiskNationalContext(team, player, baseScore) {
  const stats = cardRiskPlayerStats(team, player);
  const national = stats?.season2025_26 || {};
  const general = stats?.recent15 || {};
  const nationalApps = cardRiskNumber(national.appearances);
  const generalApps = cardRiskNumber(general.appearances);
  const nationalYellow = cardRiskNumber(national.yellowCards);
  const generalYellow = cardRiskNumber(general.yellowCards);
  const nationalRed = cardRiskNumber(national.redCards);
  const generalRed = cardRiskNumber(general.redCards);

  if (nationalApps < 3 || generalApps < 3) {
    return {
      score: baseScore,
      nationalApps,
      nationalYellow,
      nationalRed,
      adjusted: false,
    };
  }

  const nationalRate = (nationalYellow + nationalRed * 2) / nationalApps;
  const generalRate = (generalYellow + generalRed * 2) / generalApps;
  const ratio = generalRate > 0 ? nationalRate / generalRate : 1;
  // Il contesto nazionale corregge il profilo di club senza cancellarne
  // completamente aggressivita, ruolo e frequenza dei falli.
  const targetFactor = cardRiskClamp(ratio, 0.65, 1.15);
  const reliability = Math.min(1, nationalApps / 10);
  const factor = 1 + (targetFactor - 1) * reliability;

  return {
    score: Math.round(cardRiskClamp(baseScore * factor, 0, 100)),
    nationalApps,
    nationalYellow,
    nationalRed,
    nationalRate,
    generalRate,
    adjusted: true,
  };
}

function cardRiskScore(player) {
  if (Number.isFinite(Number(player.rischio_cartellino))) {
    return cardRiskNumber(player.rischio_cartellino);
  }

  if (typeof cardRiskFormula === "undefined") return 0;
  const weights = cardRiskFormula.weights || {};
  const score =
    cardRiskNumber(player.ammonizioni_stagionali) * cardRiskNumber(weights.ammonizioni_stagionali) +
    cardRiskNumber(player.espulsioni_stagionali) * cardRiskNumber(weights.espulsioni_stagionali) +
    cardRiskNumber(player.media_falli_partita) * cardRiskNumber(weights.media_falli_partita);

  return Math.min(100, Math.round(score));
}

function normalizeCardRiskPlayer(player, index) {
  const normalized = {
    gruppo: player.gruppo || player.group || "?",
    squadra: player.squadra || player.team,
    giocatore: player.giocatore || player.player,
    club: player.club || "",
    lega: player.lega || player.league || "",
    ammonizioni_stagionali: cardRiskNumber(player.ammonizioni_stagionali ?? player.yellowCards),
    espulsioni_stagionali: cardRiskNumber(player.espulsioni_stagionali ?? player.redCards),
    media_falli_partita: cardRiskNumber(player.media_falli_partita ?? player.foulsPerMatch),
    originalIndex: index,
  };

  normalized.rischio_base = cardRiskScore(normalized);
  normalized.contesto_nazionale = cardRiskNationalContext(
    normalized.squadra,
    normalized.giocatore,
    normalized.rischio_base
  );
  normalized.rischio_cartellino = normalized.contesto_nazionale.score;
  return normalized;
}

function validCardRiskPlayer(player) {
  return player.squadra && player.giocatore;
}

function cardRiskCompleteness(player) {
  return [
    player.gruppo !== "?",
    player.club,
    player.lega,
    player.rischio_cartellino,
  ].filter(Boolean).length;
}

function uniqueCardRiskPlayers(players) {
  const unique = new Map();

  players.forEach((player) => {
    const key = `${player.squadra}::${player.giocatore}`.toLowerCase();
    const current = unique.get(key);

    if (!current || cardRiskCompleteness(player) >= cardRiskCompleteness(current)) {
      unique.set(key, player);
    }
  });

  return [...unique.values()];
}

function cardRiskTone(value) {
  if (value >= 85) return "is-extreme";
  if (value >= 70) return "is-high";
  if (value >= 55) return "is-medium";
  return "is-low";
}

function cardRiskRow(player, index) {
  const clubLine = [player.club, player.lega].filter(Boolean).join(" - ");
  const national = player.contesto_nazionale || {};
  const nationalMetric = national.nationalApps
    ? `<span title="Cartellini nelle presenze recenti con la nazionale"><b>${national.nationalYellow}/${national.nationalApps}</b> in nazionale</span>`
    : "";
  const adjustment = national.adjusted && player.rischio_cartellino !== player.rischio_base
    ? `<small class="card-risk-context">Indice club ${player.rischio_base}, corretto sul rendimento in nazionale</small>`
    : "";

  return `
    <article class="card-risk-row ${cardRiskTone(player.rischio_cartellino)}">
      <span class="card-risk-position">${index + 1}</span>
      <div class="card-risk-player">
        <strong>${player.giocatore}</strong>
        <small>Girone ${player.gruppo} - ${player.squadra}</small>
        <small class="card-risk-club">${clubLine}</small>
        ${adjustment}
      </div>
      <div class="card-risk-metrics">
        <span><b>${player.ammonizioni_stagionali}</b> gialli club</span>
        ${nationalMetric}
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
  const sorted = uniqueCardRiskPlayers(cardRiskPlayers.map(normalizeCardRiskPlayer).filter(validCardRiskPlayer))
    .sort((a, b) =>
    b.rischio_cartellino - a.rischio_cartellino ||
    b.espulsioni_stagionali - a.espulsioni_stagionali ||
    b.ammonizioni_stagionali - a.ammonizioni_stagionali ||
    b.media_falli_partita - a.media_falli_partita ||
    a.giocatore.localeCompare(b.giocatore) ||
    a.originalIndex - b.originalIndex
  );

  if (!sorted.length) {
    const emptyMessage = "Nessun dato cartellini disponibile.";
    if (cardRiskTop) cardRiskTop.innerHTML = `<p class="data-confidence-note">${emptyMessage}</p>`;
    cardRiskRoot.innerHTML = "";
    return;
  }

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
    cardRiskFormulaRoot.textContent =
      cardRiskFormula.description +
      " Il valore viene poi corretto con la frequenza di cartellini nelle presenze recenti in nazionale, quando il campione e sufficiente.";
  }
}

renderCardRisk();
