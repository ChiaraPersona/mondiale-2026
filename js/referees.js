const confedColors = {
  AFC: "#2f6f9f",
  CAF: "#1f7a5b",
  CONCACAF: "#c79a3a",
  CONMEBOL: "#c84747",
  OFC: "#147c86",
  UEFA: "#4f6fad",
};

const confedLabels = {
  AFC: "AFC",
  CAF: "CAF",
  CONCACAF: "CONCACAF",
  CONMEBOL: "CONMEBOL",
  OFC: "OFC",
  UEFA: "UEFA",
};

const referees = [
  { name: "Adham Makhadmeh", country: "Giordania", confed: "AFC", stats: { fixtures: 111, yellowCards: 337, redCards: 6, yellowPerGame: 3.04, source: "https://playerstats.football/referee/783" } },
  { name: "Ma Ning", country: "Cina", confed: "AFC", stats: { fixtures: 308, yellowCards: 1040, redCards: 44, yellowPerGame: 3.38, source: "https://playerstats.football/referee/779" } },
  { name: "Alireza Faghani", country: "Australia", confed: "AFC", stats: { fixtures: 437, yellowCards: 1579, redCards: 37, yellowPerGame: 3.61, source: "https://playerstats.football/referee/661" } },
  { name: "Yusuke Araki", country: "Giappone", confed: "AFC", stats: { fixtures: 287, yellowCards: 731, redCards: 18, yellowPerGame: 2.55, source: "https://playerstats.football/referee/808" } },
  { name: "Abdulrahman Al Jassim", country: "Qatar", confed: "AFC", stats: { fixtures: 274, yellowCards: 1045, redCards: 21, yellowPerGame: 3.81, source: "https://playerstats.football/referee/550" } },
  { name: "Khalid Al Turais", country: "Arabia Saudita", confed: "AFC", stats: { fixtures: 25, yellowCards: 107, redCards: 2, yellowPerGame: 4.28, source: "https://www.transfermarkt.it/khalid-saleh-al-turais/profil/schiedsrichter/15131", scope: "Transfermarkt 2025/26 - tutte le competizioni" } },
  { name: "Omar Al Ali", country: "Emirati Arabi Uniti", confed: "AFC", stats: { fixtures: 209, yellowCards: 792, redCards: 38, yellowPerGame: 3.79, source: "https://playerstats.football/referee/1297" } },
  { name: "Ilgiz Tantashev", country: "Uzbekistan", confed: "AFC", stats: { fixtures: 270, yellowCards: 940, redCards: 24, yellowPerGame: 3.48, source: "https://playerstats.football/referee/780" } },
  { name: "Mustapha Ghorbal", country: "Algeria", confed: "CAF", stats: { fixtures: 182, yellowCards: 704, redCards: 21, yellowPerGame: 3.87, source: "https://playerstats.football/referee/569" } },
  { name: "Pierre Atcho", country: "Gabon", confed: "CAF", stats: { fixtures: 4, yellowCards: 5, redCards: 0, yellowPerGame: 1.25, source: "https://www.transfermarkt.co.uk/pierre-atcho/profil/schiedsrichter/35863", scope: "Transfermarkt 2025/26 - CAF Champions League" } },
  { name: "Amin Mohamed", country: "Egitto", confed: "CAF", stats: { fixtures: 152, yellowCards: 607, redCards: 16, yellowPerGame: 3.99, source: "https://playerstats.football/referee/812" } },
  { name: "Jalal Jayed", country: "Marocco", confed: "CAF", stats: { fixtures: 100, yellowCards: 388, redCards: 10, yellowPerGame: 3.88, source: "https://playerstats.football/referee/551" } },
  { name: "Dahane Beida", country: "Mauritania", confed: "CAF", stats: { fixtures: 46, yellowCards: 174, redCards: 5, yellowPerGame: 3.78, source: "https://playerstats.football/referee/815" } },
  { name: "Omar Abdulkadir Artan", country: "Somalia", confed: "CAF", stats: { fixtures: 3, yellowCards: 12, redCards: 0, yellowPerGame: 4.00, source: "https://www.transfermarkt.com/omar-abdulkadir-artan/bilanz/schiedsrichter/44909", scope: "Transfermarkt record by club - campione disponibile" } },
  { name: "Abongile Tom", country: "Sudafrica", confed: "CAF", stats: { fixtures: 218, yellowCards: 915, redCards: 21, yellowPerGame: 4.20, source: "https://playerstats.football/referee/578" } },
  { name: "Drew Fischer", country: "Canada", confed: "CONCACAF", stats: { fixtures: 253, yellowCards: 847, redCards: 27, yellowPerGame: 3.35, source: "https://playerstats.football/referee/490" } },
  { name: "Juan Calderón", country: "Costa Rica", confed: "CONCACAF", stats: { fixtures: 174, yellowCards: 651, redCards: 29, yellowPerGame: 3.74, source: "https://playerstats.football/referee/1068" } },
  { name: "Héctor Said Martínez", country: "Honduras", confed: "CONCACAF", stats: { fixtures: 165, yellowCards: 688, redCards: 30, yellowPerGame: 4.17, source: "https://playerstats.football/referee/1071" } },
  { name: "Oshane Nation", country: "Giamaica", confed: "CONCACAF", stats: { fixtures: 175, yellowCards: 661, redCards: 25, yellowPerGame: 3.78, source: "https://playerstats.football/referee/1059" } },
  { name: "César Ramos", country: "Messico", confed: "CONCACAF", stats: { fixtures: 393, yellowCards: 1643, redCards: 97, yellowPerGame: 4.18, source: "https://playerstats.football/referee/837" } },
  { name: "Katia García", country: "Messico", confed: "CONCACAF", stats: { fixtures: 79, yellowCards: 256, redCards: 7, yellowPerGame: 3.24, source: "https://playerstats.football/referee/47" } },
  { name: "Iván Barton", country: "El Salvador", confed: "CONCACAF", stats: { fixtures: 185, yellowCards: 932, redCards: 38, yellowPerGame: 5.04, source: "https://playerstats.football/referee/1101" } },
  { name: "Ismail Elfath", country: "Stati Uniti", confed: "CONCACAF", stats: { fixtures: 293, yellowCards: 1048, redCards: 31, yellowPerGame: 3.58, source: "https://playerstats.football/referee/473" } },
  { name: "Tori Penso", country: "Stati Uniti", confed: "CONCACAF", stats: { fixtures: 127, yellowCards: 437, redCards: 6, yellowPerGame: 3.44, source: "https://playerstats.football/referee/42" } },
  { name: "Yael Falcón Pérez", country: "Argentina", confed: "CONMEBOL", stats: { fixtures: 303, yellowCards: 1570, redCards: 45, yellowPerGame: 5.18, source: "https://playerstats.football/referee/859" } },
  { name: "Darío Herrera", country: "Argentina", confed: "CONMEBOL", stats: { fixtures: 469, yellowCards: 2296, redCards: 85, yellowPerGame: 4.90, source: "https://playerstats.football/referee/656" } },
  { name: "Facundo Tello", country: "Argentina", confed: "CONMEBOL", stats: { fixtures: 393, yellowCards: 1804, redCards: 80, yellowPerGame: 4.59, source: "https://playerstats.football/referee/915" } },
  { name: "Ramon Abatti", country: "Brasile", confed: "CONMEBOL", stats: { fixtures: 312, yellowCards: 1490, redCards: 63, yellowPerGame: 4.78, source: "https://playerstats.football/referee/43" } },
  { name: "Raphael Claus", country: "Brasile", confed: "CONMEBOL", stats: { fixtures: 595, yellowCards: 2251, redCards: 93, yellowPerGame: 3.78, source: "https://playerstats.football/referee/426" } },
  { name: "Wilton Sampaio", country: "Brasile", confed: "CONMEBOL", stats: { fixtures: 541, yellowCards: 2378, redCards: 77, yellowPerGame: 4.40, source: "https://playerstats.football/referee/511" } },
  { name: "Cristian Garay", country: "Cile", confed: "CONMEBOL", stats: { fixtures: 245, yellowCards: 1076, redCards: 62, yellowPerGame: 4.39, source: "https://playerstats.football/referee/33" } },
  { name: "Andrés Rojas", country: "Colombia", confed: "CONMEBOL", stats: { fixtures: 385, yellowCards: 1835, redCards: 70, yellowPerGame: 4.77, source: "https://playerstats.football/referee/1112" } },
  { name: "Juan Gabriel Benítez", country: "Paraguay", confed: "CONMEBOL", stats: { fixtures: 272, yellowCards: 1254, redCards: 55, yellowPerGame: 4.61, source: "https://playerstats.football/referee/725" } },
  { name: "Kevin Ortega", country: "Perù", confed: "CONMEBOL", stats: { fixtures: 294, yellowCards: 1450, redCards: 64, yellowPerGame: 4.93, source: "https://playerstats.football/referee/727" } },
  { name: "Gustavo Tejera", country: "Uruguay", confed: "CONMEBOL", stats: { fixtures: 322, yellowCards: 1641, redCards: 37, yellowPerGame: 5.10, source: "https://playerstats.football/referee/1102" } },
  { name: "Jesús Valenzuela", country: "Venezuela", confed: "CONMEBOL", stats: { fixtures: 355, yellowCards: 1777, redCards: 50, yellowPerGame: 5.01, source: "https://playerstats.football/referee/726" } },
  { name: "Campbell-Kirk Kawana-Waugh", country: "Nuova Zelanda", confed: "OFC", stats: { fixtures: 84, yellowCards: 293, redCards: 9, yellowPerGame: 3.49, source: "https://www.transfermarkt.com/new-zealand-premiership/schiedsrichter/wettbewerb/NZL1/saison_id/all/plus/1", scope: "Transfermarkt all-time - New Zealand Premiership" } },
  { name: "Michael Oliver", country: "Inghilterra", confed: "UEFA", stats: { fixtures: 713, yellowCards: 2359, redCards: 56, yellowPerGame: 3.31, source: "https://playerstats.football/referee/223" } },
  { name: "Anthony Taylor", country: "Inghilterra", confed: "UEFA", stats: { fixtures: 726, yellowCards: 2603, redCards: 69, yellowPerGame: 3.59, source: "https://playerstats.football/referee/226" } },
  { name: "François Letexier", country: "Francia", confed: "UEFA", stats: { fixtures: 408, yellowCards: 1449, redCards: 62, yellowPerGame: 3.55, source: "https://playerstats.football/referee/217" } },
  { name: "Clément Turpin", country: "Francia", confed: "UEFA", stats: { fixtures: 568, yellowCards: 1845, redCards: 103, yellowPerGame: 3.25, source: "https://playerstats.football/referee/208" } },
  { name: "Felix Zwayer", country: "Germania", confed: "UEFA", stats: { fixtures: 557, yellowCards: 2266, redCards: 46, yellowPerGame: 4.07, source: "https://playerstats.football/referee/411" } },
  { name: "Maurizio Mariani", country: "Italia", confed: "UEFA", stats: { fixtures: 377, yellowCards: 1421, redCards: 48, yellowPerGame: 3.77, source: "https://playerstats.football/referee/333" } },
  { name: "Danny Makkelie", country: "Olanda", confed: "UEFA", stats: { fixtures: 686, yellowCards: 2272, redCards: 72, yellowPerGame: 3.31, source: "https://playerstats.football/referee/207" } },
  { name: "Espen Eskås", country: "Norvegia", confed: "UEFA", stats: { fixtures: 366, yellowCards: 1058, redCards: 16, yellowPerGame: 2.89, source: "https://playerstats.football/referee/23" } },
  { name: "Szymon Marciniak", country: "Polonia", confed: "UEFA", stats: { fixtures: 677, yellowCards: 2769, redCards: 70, yellowPerGame: 4.09, source: "https://playerstats.football/referee/513" } },
  { name: "João Pinheiro", country: "Portogallo", confed: "UEFA", stats: { fixtures: 390, yellowCards: 1721, redCards: 39, yellowPerGame: 4.41, source: "https://playerstats.football/referee/332" } },
  { name: "István Kovács", country: "Romania", confed: "UEFA", stats: { fixtures: 465, yellowCards: 2078, redCards: 48, yellowPerGame: 4.47, source: "https://playerstats.football/referee/159" } },
  { name: "Slavko Vinčić", country: "Slovenia", confed: "UEFA", stats: { fixtures: 444, yellowCards: 1819, redCards: 39, yellowPerGame: 4.10, source: "https://playerstats.football/referee/512" } },
  { name: "Alejandro Hernández", country: "Spagna", confed: "UEFA", stats: { fixtures: 298, yellowCards: 1545, redCards: 86, yellowPerGame: 5.18, source: "https://it.whoscored.com/referees/229/show/alejandro-jos%C3%A9-hern%C3%A1ndez-hern%C3%A1ndez" } },
  { name: "Glenn Nyberg", country: "Svezia", confed: "UEFA", stats: { fixtures: 441, yellowCards: 1315, redCards: 23, yellowPerGame: 2.98, source: "https://playerstats.football/referee/206" } },
  { name: "Sandro Schärer", country: "Svizzera", confed: "UEFA", stats: { fixtures: 382, yellowCards: 1560, redCards: 36, yellowPerGame: 4.08, source: "https://playerstats.football/referee/173" } },
];

let activeConfed = "Tutte";

const refereeContent = document.getElementById("referee-content");
const refereeEmpty = document.getElementById("referee-empty");
const refereeFilters = document.getElementById("referee-filters");
const refereeSearch = document.getElementById("referee-search");
const refereeCardRanking = document.getElementById("referee-card-ranking");

function fold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matchesReferee(referee, query) {
  if (!query) return true;
  return fold([referee.name, referee.country, referee.confed].join(" ")).includes(query);
}

function refereeId(referee) {
  return "referee-" + fold(referee.name + "-" + referee.country)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function refereeNameClass(referee) {
  return "official-name" + (referee.name.length > 24 ? " official-name-long" : "");
}

function makeFilters() {
  ["Tutte", ...Object.keys(confedLabels)].forEach((confed) => {
    const button = document.createElement("button");
    button.className = "filter-button" + (confed === activeConfed ? " active" : "");
    button.textContent = confed === "Tutte" ? "Tutte" : confedLabels[confed];
    button.addEventListener("click", () => {
      activeConfed = confed;
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderReferees();
    });
    refereeFilters.appendChild(button);
  });
}

function visibleReferees() {
  const query = fold(refereeSearch.value.trim());
  return referees.filter((referee) => {
    const inConfed = activeConfed === "Tutte" || referee.confed === activeConfed;
    return inConfed && matchesReferee(referee, query);
  });
}


function renderRefereeStats(referee) {
  if (!referee.stats) {
    return '<div class="official-stat-list"><div class="official-stat-row"><span>Statistiche</span><strong>n.d.</strong></div></div>';
  }
  const totalCards = referee.stats.yellowCards + referee.stats.redCards;
  const cardsPerGame = totalCards / referee.stats.fixtures;

  return '<div class="official-stat-list">' +
    '<div class="official-stat-row"><span>Partite</span><strong>' + referee.stats.fixtures + '</strong></div>' +
    '<div class="official-stat-row"><span>Gialli</span><strong>' + referee.stats.yellowCards + '</strong></div>' +
    '<div class="official-stat-row"><span>Rossi</span><strong>' + referee.stats.redCards + '</strong></div>' +
    '<div class="official-stat-row"><span>Cartellini/partita</span><strong>' + cardsPerGame.toFixed(2) + '</strong></div>' +
    '<div class="official-stat-row"><span>Gialli/partita</span><strong>' + referee.stats.yellowPerGame.toFixed(2) + '</strong></div>' +
    '<a class="official-stat-source" href="' + referee.stats.source + '" target="_blank" rel="noreferrer">Fonte stats</a>' +
  '</div>';
}

function cardAverage(referee) {
  if (!referee.stats || !referee.stats.fixtures) return null;
  return (referee.stats.yellowCards + referee.stats.redCards) / referee.stats.fixtures;
}

function renderCardRanking(refereeList) {
  if (!refereeCardRanking) return;
  const ranked = refereeList
    .map((referee) => ({ referee, average: cardAverage(referee) }))
    .filter((item) => item.average !== null)
    .sort((a, b) => b.average - a.average || a.referee.name.localeCompare(b.referee.name));

  refereeCardRanking.innerHTML = ranked.length ? ranked.map(({ referee, average }, index) => (
    '<button class="card-ranking-item" type="button" data-referee-target="' + refereeId(referee) + '">' +
      '<span class="ranking-position">' + (index + 1) + '</span>' +
      '<div class="ranking-referee">' +
        '<strong>' + referee.name + '</strong>' +
        '<small>' + referee.country + '</small>' +
      '</div>' +
      '<div class="ranking-average">' +
        '<strong>' + average.toFixed(2) + '</strong>' +
        '<span>cartellini/partita</span>' +
      '</div>' +
    '</button>'
  )).join("") : '<div class="empty-inline">Nessuna statistica cartellini disponibile.</div>';
}

function focusRefereeCard(refereeIdValue) {
  const card = document.getElementById(refereeIdValue);
  if (!card) return;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.remove("is-highlighted");
  window.setTimeout(() => {
    card.classList.add("is-highlighted");
    window.setTimeout(() => card.classList.remove("is-highlighted"), 2600);
  }, 250);
}

function renderReferees() {
  const filtered = visibleReferees();
  refereeContent.innerHTML = "";
  refereeEmpty.style.display = filtered.length ? "none" : "block";
  renderCardRanking(filtered);

  const confeds = activeConfed === "Tutte" ? Object.keys(confedLabels) : [activeConfed];
  for (const confed of confeds) {
    const group = filtered
      .filter((referee) => referee.confed === confed)
      .sort((a, b) => a.country.localeCompare(b.country) || a.name.localeCompare(b.name));

    if (!group.length) continue;

    const section = document.createElement("section");
    section.style.setProperty("--group-color", confedColors[confed]);
    section.innerHTML = '<div class="confed-title"><h2>' + confedLabels[confed] + '</h2><span class="badge">' + group.length + ' arbitri</span></div>';

    const grid = document.createElement("div");
    grid.className = "official-grid";
    grid.innerHTML = group.map((referee) => (
      '<article class="official" id="' + refereeId(referee) + '" style="--group-color: ' + confedColors[referee.confed] + '">' +
        '<div class="official-head">' +
          '<span class="official-confed-mark">' + referee.confed + '</span>' +
          '<h3 class="' + refereeNameClass(referee) + '">' + referee.name + ' <span class="official-country-inline">- ' + referee.country + '</span></h3>' +
        '</div>' +
        '<div class="official-meta">' +
          renderRefereeStats(referee) +
        '</div>' +
      '</article>'
    )).join("");

    section.appendChild(grid);
    refereeContent.appendChild(section);
  }
}

refereeSearch.addEventListener("input", renderReferees);
refereeCardRanking.addEventListener("click", (event) => {
  const item = event.target.closest("[data-referee-target]");
  if (!item) return;
  focusRefereeCard(item.dataset.refereeTarget);
});
makeFilters();
renderReferees();
