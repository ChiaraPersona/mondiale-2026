const roleOrder = ["Portieri", "Difensori", "Centrocampisti", "Attaccanti"];
let activeGroup = "Tutti";

const tabs = document.getElementById("tabs");
const content = document.getElementById("content");
const search = document.getElementById("search");
const empty = document.getElementById("empty");

function fold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function flagImg(team, className) {
  const src = teamFlags[team];
  return src ? '<img class="' + className + '" src="' + src + '" alt="Bandiera ' + team + '" loading="lazy">' : "";
}

function makeTabs() {
  ["Tutti", ...Object.keys(groupTeams)].forEach((group) => {
    const button = document.createElement("button");
    button.className = "tab" + (group === activeGroup ? " active" : "");
    button.style.setProperty("--group-color", groupColors[group] || "#1d2329");
    if (group === "Tutti") {
      button.innerHTML = '<div class="tab-title">Tutti i gironi</div><div class="tab-all">48 nazionali e ' + rows.length + ' calciatori</div>';
    } else {
      button.innerHTML = '<div class="tab-title">Girone ' + group + '</div><div class="tab-teams">' + groupTeams[group].map((team) => '<div class="tab-team">' + flagImg(team, "tab-flag") + '<span>' + team + '</span></div>').join("") + '</div>';
    }
    button.addEventListener("click", () => {
      activeGroup = group;
      document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
      button.classList.add("active");
      render();
    });
    tabs.appendChild(button);
  });
}

function matches(row, query) {
  if (!query) return true;
  const haystack = fold([row.group, row.team, row.role, row.player, row.club, row.clubCountry, row.league, row.status].join(" "));
  return haystack.includes(query);
}

function visibleRows() {
  const query = fold(search.value.trim());
  return rows.filter((row) => (activeGroup === "Tutti" || row.group === activeGroup) && matches(row, query));
}

function render() {
  const filtered = visibleRows();
  content.innerHTML = "";
  empty.style.display = filtered.length ? "none" : "block";

  const groups = activeGroup === "Tutti" ? Object.keys(groupTeams) : [activeGroup];
  for (const group of groups) {
    const groupRows = filtered.filter((row) => row.group === group);
    if (!groupRows.length) continue;

    const section = document.createElement("section");
    section.style.setProperty("--group-color", groupColors[group] || "#1f7a5b");
    section.innerHTML = '<div class="group-title"><h2>Girone ' + group + '</h2><span class="badge">' + groupRows.length + ' calciatori</span></div>';
    const grid = document.createElement("div");
    grid.className = "team-grid";

    for (const team of groupTeams[group]) {
      const teamRows = groupRows.filter((row) => row.team === team);
      if (!teamRows.length) continue;
      const status = teamRows.some((row) => row.status !== "Ufficiale") ? teamRows.find((row) => row.status !== "Ufficiale").status : "Ufficiale";
      const card = document.createElement("article");
      card.className = "team";
      card.style.setProperty("--group-color", groupColors[group] || "#1f7a5b");
      card.innerHTML = '<div class="team-head"><div><div class="team-name-row">' + flagImg(team, "flag") + '<h3>' + team + '</h3></div><div class="sub">Girone ' + group + '</div></div><span class="badge ' + (status === "Ufficiale" ? "" : "warn") + '">' + status + ' &middot; ' + teamRows.length + '</span></div>';

      for (const role of roleOrder) {
        const roleRows = teamRows.filter((row) => row.role === role).sort((a, b) => a.player.localeCompare(b.player));
        if (!roleRows.length) continue;
        const roleBlock = document.createElement("div");
        roleBlock.className = "role";
        roleBlock.dataset.role = role;
        roleBlock.innerHTML = '<div class="role-title">' + role + '</div><div class="players">' + roleRows.map((row) => {
          const club = row.club ? row.club : "Club non indicato";
          const country = row.clubCountry ? row.clubCountry : "Non indicato";
          const league = row.league ? row.league : "Non indicata";
          const age = row.age || "n.d.";
          const caps = row.caps || "n.d.";
          const worldCups = row.worldCupsPlayed || "n.d.";
          return '<div class="player"><div class="name">' + row.player + '</div><div class="club">' + club + ' <span class="country">(' + country + ' &middot; ' + league + ')</span></div><div class="bio"><span class="chip">Et&agrave;: ' + age + '</span><span class="chip">Presenze: ' + caps + '</span><span class="chip">Mondiali: ' + worldCups + '</span></div></div>';
        }).join("") + '</div>';
        card.appendChild(roleBlock);
      }
      grid.appendChild(card);
    }
    section.appendChild(grid);
    content.appendChild(section);
  }
}

search.addEventListener("input", render);
makeTabs();
render();
