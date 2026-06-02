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
  { name: "Adham Makhadmeh", country: "Giordania", confed: "AFC" },
  { name: "Ma Ning", country: "Cina", confed: "AFC" },
  { name: "Alireza Faghani", country: "Australia", confed: "AFC" },
  { name: "Yusuke Araki", country: "Giappone", confed: "AFC" },
  { name: "Abdulrahman Al Jassim", country: "Qatar", confed: "AFC" },
  { name: "Khalid Al Turais", country: "Arabia Saudita", confed: "AFC" },
  { name: "Omar Al Ali", country: "Emirati Arabi Uniti", confed: "AFC" },
  { name: "Ilgiz Tantashev", country: "Uzbekistan", confed: "AFC" },
  { name: "Mustapha Ghorbal", country: "Algeria", confed: "CAF" },
  { name: "Pierre Atcho", country: "Gabon", confed: "CAF" },
  { name: "Amin Mohamed", country: "Egitto", confed: "CAF" },
  { name: "Jalal Jayed", country: "Marocco", confed: "CAF" },
  { name: "Dahane Beida", country: "Mauritania", confed: "CAF" },
  { name: "Omar Abdulkadir Artan", country: "Somalia", confed: "CAF" },
  { name: "Abongile Tom", country: "Sudafrica", confed: "CAF" },
  { name: "Drew Fischer", country: "Canada", confed: "CONCACAF" },
  { name: "Juan Calderon", country: "Costa Rica", confed: "CONCACAF" },
  { name: "Hector Said Martinez", country: "Honduras", confed: "CONCACAF" },
  { name: "Oshane Nation", country: "Giamaica", confed: "CONCACAF" },
  { name: "Cesar Ramos", country: "Messico", confed: "CONCACAF" },
  { name: "Katia Garcia", country: "Messico", confed: "CONCACAF" },
  { name: "Ivan Barton", country: "El Salvador", confed: "CONCACAF" },
  { name: "Ismail Elfath", country: "Stati Uniti", confed: "CONCACAF" },
  { name: "Tori Penso", country: "Stati Uniti", confed: "CONCACAF" },
  { name: "Yael Falcon Perez", country: "Argentina", confed: "CONMEBOL" },
  { name: "Dario Herrera", country: "Argentina", confed: "CONMEBOL" },
  { name: "Facundo Tello", country: "Argentina", confed: "CONMEBOL" },
  { name: "Ramon Abatti", country: "Brasile", confed: "CONMEBOL" },
  { name: "Raphael Claus", country: "Brasile", confed: "CONMEBOL" },
  { name: "Wilton Sampaio", country: "Brasile", confed: "CONMEBOL" },
  { name: "Cristian Garay", country: "Cile", confed: "CONMEBOL" },
  { name: "Andres Rojas", country: "Colombia", confed: "CONMEBOL" },
  { name: "Juan Gabriel Benitez", country: "Paraguay", confed: "CONMEBOL" },
  { name: "Kevin Ortega", country: "Peru", confed: "CONMEBOL" },
  { name: "Gustavo Tejera", country: "Uruguay", confed: "CONMEBOL" },
  { name: "Jesus Valenzuela", country: "Venezuela", confed: "CONMEBOL" },
  { name: "Campbell-Kirk Kawana-Waugh", country: "Nuova Zelanda", confed: "OFC" },
  { name: "Michael Oliver", country: "Inghilterra", confed: "UEFA" },
  { name: "Anthony Taylor", country: "Inghilterra", confed: "UEFA" },
  { name: "Francois Letexier", country: "Francia", confed: "UEFA" },
  { name: "Clement Turpin", country: "Francia", confed: "UEFA" },
  { name: "Felix Zwayer", country: "Germania", confed: "UEFA" },
  { name: "Maurizio Mariani", country: "Italia", confed: "UEFA" },
  { name: "Danny Makkelie", country: "Olanda", confed: "UEFA" },
  { name: "Espen Eskas", country: "Norvegia", confed: "UEFA" },
  { name: "Szymon Marciniak", country: "Polonia", confed: "UEFA" },
  { name: "Joao Pinheiro", country: "Portogallo", confed: "UEFA" },
  { name: "Istvan Kovacs", country: "Romania", confed: "UEFA" },
  { name: "Slavko Vincic", country: "Slovenia", confed: "UEFA" },
  { name: "Alejandro Hernandez", country: "Spagna", confed: "UEFA" },
  { name: "Glenn Nyberg", country: "Svezia", confed: "UEFA" },
  { name: "Sandro Schaerer", country: "Svizzera", confed: "UEFA" },
];

let activeConfed = "Tutte";

const refereeContent = document.getElementById("referee-content");
const refereeEmpty = document.getElementById("referee-empty");
const refereeFilters = document.getElementById("referee-filters");
const refereeSearch = document.getElementById("referee-search");

function fold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function matchesReferee(referee, query) {
  if (!query) return true;
  return fold([referee.name, referee.country, referee.confed].join(" ")).includes(query);
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

function renderReferees() {
  const filtered = visibleReferees();
  refereeContent.innerHTML = "";
  refereeEmpty.style.display = filtered.length ? "none" : "block";

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
      '<article class="official" style="--group-color: ' + confedColors[referee.confed] + '">' +
        '<h3 class="official-name">' + referee.name + '</h3>' +
        '<div class="official-meta">' +
          '<span class="chip">' + referee.country + '</span>' +
          '<span class="chip">' + referee.confed + '</span>' +
        '</div>' +
      '</article>'
    )).join("");

    section.appendChild(grid);
    refereeContent.appendChild(section);
  }
}

refereeSearch.addEventListener("input", renderReferees);
makeFilters();
renderReferees();
