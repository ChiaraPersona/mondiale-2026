const teamStatsSearch = document.getElementById("team-stats-search");
const teamStatsContent = document.getElementById("team-stats-content");
const teamStatsEmpty = document.getElementById("team-stats-empty");

function renderTeamStats() {
  if (teamStatsContent) teamStatsContent.innerHTML = "";
  if (teamStatsEmpty) teamStatsEmpty.style.display = "block";
}

if (teamStatsSearch) {
  teamStatsSearch.addEventListener("input", renderTeamStats);
}

renderTeamStats();
