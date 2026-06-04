const codexRoleOrder = ["Portieri", "Difensori", "Centrocampisti", "Attaccanti"];
const codexRoundOf32Seeds = [
  ["1E", "3 ABCDF"], ["1I", "3 CDFGH"], ["2A", "2B"], ["1F", "2C"],
  ["2K", "2L"], ["1H", "2J"], ["1D", "3 BEFIJ"], ["1G", "3 AEHIJ"],
  ["1C", "2F"], ["2E", "2I"], ["1A", "3 CEFHI"], ["1L", "3 EHIJK"],
  ["1J", "2H"], ["2D", "2G"], ["1B", "3 EFGIJ"], ["1K", "3 DEIJL"],
];

const codexBracketMatchNumbers = {
  r32: [74, 77, 73, 76, 83, 84, 81, 82, 75, 78, 79, 80, 86, 88, 85, 87],
  r16: [89, 90, 93, 94, 91, 92, 95, 96],
  qf: [97, 98, 99, 100],
  sf: [101, 102],
  bronze: [103],
  final: [104],
};

const codexDependencies = {
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

const codexTranslations = {
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
  "Scotland": "Scozia",
  "Australia": "Australia",
  "Japan": "Giappone",
  "Tunisia": "Tunisia",
  "Uruguay": "Uruguay",
  "Iran": "Iran",
  "Senegal": "Senegal",
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
  "Curacao": "Curacao",
  "Iraq": "Iraq",
  "Uzbekistan": "Uzbekistan",
  "Colombia": "Colombia",
};

const codexNationalAliases = {
  "Algeria": ["algeria", "algerien"],
  "Arabia Saudita": ["arabia saudita", "saudi arabia", "saudi-arabien"],
  "Argentina": ["argentina", "argentinien"],
  "Australia": ["australia", "australien"],
  "Austria": ["austria", "osterreich", "österreich"],
  "Belgio": ["belgio", "belgium", "belgien"],
  "Bosnia ed Erzegovina": ["bosnia ed erzegovina", "bosnia & herzegovina", "bosnien und herzegowina"],
  "Brasile": ["brasile", "brazil", "brasilien"],
  "Canada": ["canada", "kanada"],
  "Capo Verde": ["capo verde", "cape verde", "kap verde"],
  "Colombia": ["colombia", "kolumbien"],
  "Corea del Sud": ["corea del sud", "south korea", "sudkorea", "südkorea"],
  "Costa d'Avorio": ["costa d avorio", "ivory coast", "elfenbeinkuste", "elfenbeinküste"],
  "Croazia": ["croazia", "croatia", "kroatien"],
  "Curacao": ["curacao", "curacao", "curaçao"],
  "Ecuador": ["ecuador"],
  "Egitto": ["egitto", "egypt", "agypten", "ägypten"],
  "Francia": ["francia", "france", "frankreich"],
  "Germania": ["germania", "germany", "deutschland"],
  "Ghana": ["ghana"],
  "Giappone": ["giappone", "japan"],
  "Giordania": ["giordania", "jordan", "jordanien"],
  "Haiti": ["haiti"],
  "Inghilterra": ["inghilterra", "england"],
  "Iran": ["iran"],
  "Iraq": ["iraq"],
  "Marocco": ["marocco", "morocco", "marokko"],
  "Messico": ["messico", "mexico", "mexiko"],
  "Norvegia": ["norvegia", "norway", "norwegen"],
  "Nuova Zelanda": ["nuova zelanda", "new zealand", "neuseeland"],
  "Olanda": ["olanda", "netherlands", "niederlande"],
  "Panama": ["panama"],
  "Paraguay": ["paraguay"],
  "Portogallo": ["portogallo", "portugal"],
  "Qatar": ["qatar", "katar"],
  "RD Congo": ["rd congo", "dr congo", "dr kongo", "democratic republic of congo"],
  "Repubblica Ceca": ["repubblica ceca", "czech republic", "tschechien"],
  "Scozia": ["scozia", "scotland", "schottland"],
  "Senegal": ["senegal"],
  "Spagna": ["spagna", "spain", "spanien"],
  "Stati Uniti": ["stati uniti", "usa", "united states", "vereinigte staaten"],
  "Sudafrica": ["sudafrica", "south africa", "sudafrika", "südafrika"],
  "Svezia": ["svezia", "sweden", "schweden"],
  "Svizzera": ["svizzera", "switzerland", "schweiz"],
  "Tunisia": ["tunisia", "tunesien"],
  "Turchia": ["turchia", "turkey", "turkei", "türkei"],
  "Uruguay": ["uruguay"],
  "Uzbekistan": ["uzbekistan", "usbekistan"],
};

const codexState = {
  strengths: {},
  groupTables: {},
  thirds: [],
  results: {},
};

function codexFold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function codexCompact(value) {
  return codexFold(value).replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

function codexNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function codexAverage(items, key) {
  const values = items.map((item) => codexNumber(item[key])).filter((value) => value !== null);
  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function codexClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function codexFlag(team) {
  const src = teamFlags[team];
  return src ? `<img class="prediction-team-flag" src="${src}" alt="" loading="lazy">` : "";
}

function codexEscape(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char]));
}

function codexTeamFromFixtureName(name) {
  return codexTranslations[name] || name;
}

function codexFixtureTeams(match) {
  const parts = String(match || "").split(/\s+vs\s+/i);
  if (parts.length !== 2) return [];
  if (parts.some((part) => /Group|Match|winner|loser|runner|third/i.test(part))) return [];
  return parts.map((team) => codexTeamFromFixtureName(team.trim()));
}

function codexTeamMatches(team) {
  const record = (typeof teamStatsData !== "undefined" ? teamStatsData : []).find((item) => item.team === team);
  return record?.matches || [];
}

function codexRecentForm(matches) {
  if (!matches.length) return 0;
  const points = matches.reduce((total, match) => {
    const score = String(match.score || "").match(/(\d+)\s*-\s*(\d+)/);
    if (!score) return total;
    const own = Number(score[1]);
    const other = Number(score[2]);
    if (own > other) return total + 3;
    if (own === other) return total + 1;
    return total;
  }, 0);
  return points / (matches.length * 3);
}

function codexPlayerRecord(row) {
  const stats = typeof playerStats !== "undefined" ? playerStats : {};
  const base = codexFold(`${row.team}::${row.player}`);
  const roleKey = `${base}::${codexFold(row.role)}`;
  return stats[roleKey] || stats[base] || {};
}

function codexOutfieldRows(team) {
  return (typeof rows !== "undefined" ? rows : []).filter((row) => row.team === team && row.role !== "Portieri");
}

function codexGoalkeeperRows(team) {
  return (typeof rows !== "undefined" ? rows : []).filter((row) => row.team === team && row.role === "Portieri");
}

function codexTeamInsight(team) {
  return typeof teamInsights !== "undefined" ? teamInsights[team] || {} : {};
}

function codexCleanNameTokens(value) {
  return codexFold(value).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function codexStarterMatchesPlayer(starter, player) {
  const starterName = codexFold(starter);
  const playerName = codexFold(player);
  if (!starterName || !playerName) return false;
  if (starterName.length > 2 && (playerName.includes(starterName) || starterName.includes(playerName))) return true;
  const starterTokens = codexCleanNameTokens(starter).filter((token) => token.length > 1);
  const playerTokens = codexCleanNameTokens(player).filter((token) => token.length > 1);
  if (!starterTokens.length || !playerTokens.length) return false;
  if (starterTokens.length === 1) return playerTokens.includes(starterTokens[0]);
  return starterTokens.every((token) => playerTokens.includes(token));
}

function codexIsProbableStarter(row) {
  const starters = codexTeamInsight(row.team).starters || [];
  return starters.some((starter) => codexStarterMatchesPlayer(starter, row.player));
}

function codexIsNationalMatch(match) {
  const competition = codexCompact(match.competition || match.competitionName || "");
  return [
    "freundschaft", "international", "welt", "world", "qualification", "qualific", "qualifier",
    "nations league", "euro", "africa cup", "asian cup", "concacaf", "copa america"
  ].some((token) => competition.includes(token));
}

function codexTeamSideInMatch(team, match) {
  const aliases = (codexNationalAliases[team] || [team]).map(codexCompact);
  const home = codexCompact(match.homeTeam || match.home || "");
  const away = codexCompact(match.awayTeam || match.away || "");
  if (aliases.some((alias) => alias && (home.includes(alias) || alias.includes(home)))) return "home";
  if (aliases.some((alias) => alias && (away.includes(alias) || alias.includes(away)))) return "away";
  return "";
}

function codexGoalsConcededInMatch(team, match) {
  const homeScore = codexNumber(match.homeScore);
  const awayScore = codexNumber(match.awayScore);
  if (homeScore === null || awayScore === null) return null;
  const side = codexTeamSideInMatch(team, match);
  if (side === "home") return awayScore;
  if (side === "away") return homeScore;
  return null;
}

function codexNationalGoalkeeperSample(team, recent) {
  if (recent.nationalGoalkeeper?.sample?.length) {
    return recent.nationalGoalkeeper.sample
      .map((match) => ({
        conceded: codexNumber(match.goalsConceded) ?? codexGoalsConcededInMatch(team, match),
        rating: codexNumber(match.rating),
      }))
      .filter((item) => item.conceded !== null);
  }
  return (recent.sample || [])
    .filter(codexIsNationalMatch)
    .map((match) => ({
      conceded: codexGoalsConcededInMatch(team, match),
      rating: codexNumber(match.rating),
    }))
    .filter((item) => item.conceded !== null);
}

function codexPlayerScore(team) {
  const players = codexOutfieldRows(team);
  if (!players.length) return 50;
  const scored = players.map((row) => {
    const recent = codexPlayerRecord(row).recent15 || {};
    const rating = codexNumber(recent.averageRating) || 6.2;
    const apps = codexNumber(recent.appearances) || 0;
    const goals = codexNumber(recent.goals) || 0;
    const assists = codexNumber(recent.assists) || 0;
    const availability = codexClamp(apps / 15, 0, 1);
    return (rating - 6) * 18 + goals * 1.8 + assists * 1.2 + availability * 4;
  }).sort((a, b) => b - a);
  const best = scored.slice(0, 14);
  return 45 + best.reduce((total, value) => total + value, 0) / Math.max(best.length, 1);
}

function codexGoalkeeperScore(team) {
  const keepers = codexGoalkeeperRows(team);
  if (!keepers.length) return 50;
  const scored = keepers.map((row) => {
    const recent = codexPlayerRecord(row).recent15 || {};
    const rating = codexNumber(recent.averageRating) || 6.2;
    const nationalSample = codexNationalGoalkeeperSample(team, recent);
    const nationalConceded = nationalSample.length
      ? nationalSample.reduce((total, item) => total + item.conceded, 0) / nationalSample.length
      : null;
    const nationalRatingValues = nationalSample.map((item) => item.rating).filter((value) => value !== null);
    const nationalRating = nationalRatingValues.length
      ? nationalRatingValues.reduce((total, value) => total + value, 0) / nationalRatingValues.length
      : null;
    const generalConceded = codexNumber(recent.goalsConcededPerGame);
    const nationalWeight = nationalSample.length >= 8 ? 0.75 : nationalSample.length >= 3 ? 0.6 : nationalSample.length > 0 ? 0.25 : 0;
    const conceded = nationalConceded === null
      ? generalConceded
      : generalConceded === null
        ? nationalConceded
        : nationalConceded * nationalWeight + generalConceded * (1 - nationalWeight);
    const blendedRating = nationalRating === null ? rating : nationalRating * nationalWeight + rating * (1 - nationalWeight);
    const apps = codexNumber(recent.appearances) || 0;
    const availability = codexClamp(apps / 15, 0, 1);
    const concededScore = conceded === null ? 0 : codexClamp(1.55 - conceded, -1.2, 1.2) * 12;
    return 50 + (blendedRating - 6.2) * 12 + concededScore + availability * 5;
  }).sort((a, b) => b - a);
  return scored[0] || 50;
}

function codexTeamStrength(team) {
  const matches = codexTeamMatches(team);
  const xgFor = codexAverage(matches, "xgFor") ?? 1.25;
  const xgAgainst = codexAverage(matches, "xgAgainst") ?? 1.15;
  const shotsFor = codexAverage(matches, "shotsFor") ?? 10;
  const shotsAgainst = codexAverage(matches, "shotsAgainst") ?? 10;
  const sotFor = codexAverage(matches, "shotsOnTargetFor") ?? 4;
  const sotAgainst = codexAverage(matches, "shotsOnTargetAgainst") ?? 4;
  const possession = codexAverage(matches, "possession") ?? 50;
  const form = codexRecentForm(matches);
  const players = codexPlayerScore(team);
  const goalkeepers = codexGoalkeeperScore(team);
  const attack = 50 + xgFor * 9 + sotFor * 2.2 + shotsFor * 0.45 + (players - 50) * 0.55;
  const control = possession * 0.35 + form * 18;
  const resistance = 52 - xgAgainst * 11 - sotAgainst * 2.6 - shotsAgainst * 0.65 + (goalkeepers - 50) * 0.55;
  const total = attack * 0.45 + control * 0.2 + resistance * 0.35;
  return {
    team,
    total,
    attack,
    control,
    resistance,
    playerScore: players,
    goalkeeperScore: goalkeepers,
    form,
    xgFor,
    xgAgainst,
  };
}

function codexBuildStrengths() {
  codexState.strengths = Object.fromEntries(Object.values(groupTeams).flat().map((team) => [team, codexTeamStrength(team)]));
}

function codexExpectedGoals(team, opponent, knockout = false) {
  const own = codexState.strengths[team];
  const other = codexState.strengths[opponent];
  if (!own || !other) return 1;
  const strengthEdge = (own.total - other.total) / 34;
  const attackPressure = (own.attack - 62) / 80;
  const defensivePressure = (50 - other.resistance) / 90;
  const raw = (knockout ? 0.8 : 0.96) + strengthEdge + attackPressure + defensivePressure - (knockout ? 0.24 : 0);
  return codexClamp(raw, 0.05, 2.7);
}

function codexGoalsFromExpected(expected) {
  if (expected < 0.55) return 0;
  if (expected < 1.65) return 1;
  if (expected < 2.55) return 2;
  if (expected < 3.2) return 3;
  return 4;
}

function codexHashNumber(value) {
  return String(value || "").split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function codexScoreMatch(teamA, teamB, knockout = false) {
  const matchupHash = Math.abs(codexHashNumber(`${teamA}-${teamB}-${knockout ? "ko" : "group"}`));
  const tempo = ((matchupHash % 9) - 4) * 0.045 - (knockout ? 0.04 : 0);
  const tilt = (((Math.floor(matchupHash / 9) % 7) - 3) * 0.035);
  const expectedA = codexClamp(codexExpectedGoals(teamA, teamB, knockout) + tempo + tilt, 0.05, 2.7);
  const expectedB = codexClamp(codexExpectedGoals(teamB, teamA, knockout) + tempo - tilt, 0.05, 2.7);
  let goalsA = codexGoalsFromExpected(expectedA);
  let goalsB = codexGoalsFromExpected(expectedB);
  if (Math.abs(expectedA - expectedB) > 0.45 && goalsA === goalsB) {
    if (expectedA > expectedB) goalsA += 1;
    else goalsB += 1;
  }
  goalsA = codexClamp(goalsA, 0, 4);
  goalsB = codexClamp(goalsB, 0, 4);
  let winner = "";
  let note = "";
  if (goalsA > goalsB) winner = teamA;
  if (goalsB > goalsA) winner = teamB;
  if (knockout && goalsA === goalsB) {
    winner = codexState.strengths[teamA].total >= codexState.strengths[teamB].total ? teamA : teamB;
    note = `${winner} vince dopo extra time`;
  }
  return { teamA, teamB, goalsA, goalsB, winner, note, expectedA, expectedB };
}

function codexBlankRows(group) {
  return (groupTeams[group] || []).map((team, order) => ({
    team,
    order,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    points: 0,
  }));
}

function codexApplyGroupResult(table, result) {
  const home = table[result.teamA];
  const away = table[result.teamB];
  if (!home || !away) return;
  home.played += 1;
  away.played += 1;
  home.gf += result.goalsA;
  home.ga += result.goalsB;
  away.gf += result.goalsB;
  away.ga += result.goalsA;
  if (result.goalsA > result.goalsB) {
    home.wins += 1;
    home.points += 3;
    away.losses += 1;
  } else if (result.goalsB > result.goalsA) {
    away.wins += 1;
    away.points += 3;
    home.losses += 1;
  } else {
    home.draws += 1;
    away.draws += 1;
    home.points += 1;
    away.points += 1;
  }
}

function codexSortTable(rows) {
  return rows.sort((a, b) =>
    b.points - a.points ||
    (b.gf - b.ga) - (a.gf - a.ga) ||
    b.gf - a.gf ||
    codexState.strengths[b.team].total - codexState.strengths[a.team].total ||
    a.order - b.order
  );
}

function codexSimulateGroups() {
  const tables = Object.fromEntries(Object.keys(groupTeams).map((group) => [
    group,
    Object.fromEntries(codexBlankRows(group).map((row) => [row.team, row])),
  ]));
  const fixtures = (typeof worldCupFixtures !== "undefined" ? worldCupFixtures : []).slice(0, 72);
  fixtures.forEach((fixture, index) => {
    const teams = codexFixtureTeams(fixture[2]);
    if (teams.length !== 2) return;
    const result = codexScoreMatch(teams[0], teams[1], false);
    codexState.results[index + 1] = { ...result, fixture };
    const group = fixture[1].replace("Group ", "");
    codexApplyGroupResult(tables[group], result);
  });
  codexState.groupTables = Object.fromEntries(Object.entries(tables).map(([group, table]) => [
    group,
    codexSortTable(Object.values(table)),
  ]));
  codexState.thirds = codexSortTable(Object.entries(codexState.groupTables).map(([group, table]) => ({
    ...table[2],
    group,
  })));
}

function codexSeedGroups(seed) {
  return seed.match(/[A-L]/g) || [];
}

function codexTeamFromSeed(seed) {
  const place = seed.trim()[0];
  const groups = codexSeedGroups(seed);
  if (place === "1") return codexState.groupTables[groups[0]]?.[0]?.team || "";
  if (place === "2") return codexState.groupTables[groups[0]]?.[1]?.team || "";
  if (place === "3") {
    const allowed = new Set(groups);
    return codexState.thirds.find((row) => allowed.has(row.group))?.team || "";
  }
  return "";
}

function codexRoundForMatch(matchNumber) {
  for (const [round, numbers] of Object.entries(codexBracketMatchNumbers)) {
    const index = numbers.indexOf(matchNumber);
    if (index !== -1) return { round, index };
  }
  return null;
}

function codexParticipants(matchNumber) {
  const fixture = worldCupFixtures[matchNumber - 1];
  const directTeams = codexFixtureTeams(fixture?.[2]);
  if (directTeams.length === 2) return directTeams;
  if (matchNumber >= 73 && matchNumber <= 88) {
    const location = codexRoundForMatch(matchNumber);
    return codexRoundOf32Seeds[location.index].map((seed) => codexTeamFromSeed(seed));
  }
  return (codexDependencies[matchNumber] || []).map((dependency) => {
    const previous = codexState.results[dependency.match];
    if (!previous) return "";
    if (dependency.result === "winner") return previous.winner;
    return previous.teamA === previous.winner ? previous.teamB : previous.teamA;
  });
}

function codexSimulateKnockout() {
  [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104]
    .forEach((matchNumber) => {
      const [teamA, teamB] = codexParticipants(matchNumber);
      if (!teamA || !teamB) return;
      const result = codexScoreMatch(teamA, teamB, true);
      codexState.results[matchNumber] = { ...result, fixture: worldCupFixtures[matchNumber - 1] };
    });
}

function codexScorerWeight(row) {
  const recent = codexPlayerRecord(row).recent15 || {};
  const apps = codexNumber(recent.appearances) || 0;
  const goals = codexNumber(recent.goals) || 0;
  const assists = codexNumber(recent.assists) || 0;
  const rating = codexNumber(recent.averageRating) || 6.25;
  const roleBase = row.role === "Attaccanti" ? 1.35 : row.role === "Centrocampisti" ? 0.72 : 0.22;
  const starterBonus = codexIsProbableStarter(row) ? 1.18 : 0.9;
  const goalRate = goals / Math.max(apps, 5);
  const assistSupport = assists / Math.max(apps, 6);
  const ratingLift = codexClamp((rating - 6.15) / 1.25, 0, 1.25);
  const availability = codexClamp(apps / 15, 0.35, 1);
  return Math.max(0.05, roleBase * starterBonus * availability * (0.82 + goalRate * 4.8 + assistSupport * 1.1 + ratingLift * 0.45));
}

function codexScorerPool(team) {
  return codexOutfieldRows(team)
    .map((row) => ({ row, weight: codexScorerWeight(row) }))
    .sort((a, b) => b.weight - a.weight || a.row.player.localeCompare(b.row.player))
    .slice(0, 12);
}

function codexPickScorer(team, goalIndex, matchNumber) {
  const pool = codexScorerPool(team);
  if (!pool.length) return null;
  const totalWeight = pool.reduce((total, item) => total + item.weight, 0);
  const hash = Math.abs(codexHashNumber(`${team}-${matchNumber}-${goalIndex}`));
  let cursor = (hash % 10000) / 10000 * totalWeight;
  for (const item of pool) {
    cursor -= item.weight;
    if (cursor <= 0) return item.row;
  }
  return pool[0].row;
}

function codexAddScorer(totals, team, matchNumber, goalIndex) {
  const row = codexPickScorer(team, goalIndex, matchNumber);
  if (!row) return;
  const key = `${row.team}::${row.player}`;
  if (!totals[key]) {
    const recent = codexPlayerRecord(row).recent15 || {};
    totals[key] = {
      player: row.player,
      team: row.team,
      role: row.role,
      goals: 0,
      matches: 0,
      recentGoals: codexNumber(recent.goals) || 0,
      recentApps: codexNumber(recent.appearances) || 0,
      rating: codexNumber(recent.averageRating),
      starter: codexIsProbableStarter(row),
    };
  }
  totals[key].goals += 1;
}

function codexProjectedScorers() {
  const totals = {};
  const teamMatches = {};
  Object.entries(codexState.results).forEach(([number, result]) => {
    const matchNumber = Number(number);
    if (!result?.teamA || !result?.teamB) return;
    teamMatches[result.teamA] = (teamMatches[result.teamA] || 0) + 1;
    teamMatches[result.teamB] = (teamMatches[result.teamB] || 0) + 1;
    for (let goal = 0; goal < result.goalsA; goal += 1) codexAddScorer(totals, result.teamA, matchNumber, goal);
    for (let goal = 0; goal < result.goalsB; goal += 1) codexAddScorer(totals, result.teamB, matchNumber, goal);
  });
  return Object.values(totals)
    .map((row) => ({ ...row, matches: teamMatches[row.team] || 0 }))
    .sort((a, b) =>
      b.goals - a.goals ||
      b.matches - a.matches ||
      (b.rating || 0) - (a.rating || 0) ||
      a.player.localeCompare(b.player)
    )
    .slice(0, 10);
}

function codexPhaseLabel(phase) {
  return String(phase || "")
    .replace(/^Group ([A-L])$/, "Girone $1")
    .replace(/^Round of 32 - Match (\d+)$/, "Sedicesimi - Partita $1")
    .replace(/^Round of 16 - Match (\d+)$/, "Ottavi - Partita $1")
    .replace(/^Quarter-final - Match (\d+)$/, "Quarti - Partita $1")
    .replace(/^Semi-final - Match (\d+)$/, "Semifinale - Partita $1")
    .replace(/^Third Place Playoff - Match (\d+)$/, "Finale 3&deg; posto - Partita $1")
    .replace(/^Final - Match (\d+)$/, "Finale - Partita $1");
}

function codexRenderResultCard(matchNumber) {
  const result = codexState.results[matchNumber];
  if (!result) return "";
  const phase = codexPhaseLabel(result.fixture?.[1]);
  const venue = result.fixture?.[4] || "";
  return `
    <article class="codex-match-card ${matchNumber > 72 ? "is-knockout" : ""}">
      <span class="fixture-number">${matchNumber}</span>
      <div>
        <b>${phase}</b>
        <strong>${codexFlag(result.teamA)}${codexEscape(result.teamA)} <span>${result.goalsA}-${result.goalsB}</span> ${codexFlag(result.teamB)}${codexEscape(result.teamB)}</strong>
        <small>${codexEscape(venue)}${result.note ? ` &middot; ${result.note}` : ""}</small>
      </div>
    </article>`;
}

function codexRenderMethod() {
  const goalkeeperCount = (typeof rows !== "undefined" ? rows : [])
    .filter((row) => row.role === "Portieri" && codexPlayerRecord(row).recent15?.goalsConcededPerGame !== undefined)
    .length;
  document.getElementById("codex-method").innerHTML = `
    <div><strong>48</strong><span>Nazionali</span></div>
    <div><strong>104</strong><span>Partite simulate</span></div>
    <div><strong>${goalkeeperCount}</strong><span>Portieri con media GS</span></div>`;
}

function codexRenderRanking() {
  const rows = Object.values(codexState.strengths).sort((a, b) => b.total - a.total).slice(0, 16);
  document.getElementById("codex-team-ranking").innerHTML = rows.map((row, index) => `
    <article class="codex-ranking-row">
      <span>${index + 1}</span>
      <strong>${codexFlag(row.team)}${codexEscape(row.team)}</strong>
      <small>${row.total.toFixed(1)}</small>
    </article>`).join("");
}

function codexRenderTopScorers() {
  const scorers = codexProjectedScorers();
  document.getElementById("codex-top-scorers").innerHTML = scorers.map((row, index) => {
    const rate = row.recentApps ? (row.recentGoals / row.recentApps).toFixed(2) : "n.d.";
    return `
      <article class="codex-scorer-row">
        <span>${index + 1}</span>
        <div>
          <strong>${codexEscape(row.player)} ${row.starter ? '<em>Probabile titolare</em>' : ""}</strong>
          <small>${codexFlag(row.team)}${codexEscape(row.team)} &middot; ${codexEscape(row.role)} &middot; ${row.matches} partite previste</small>
        </div>
        <div class="codex-scorer-goals">
          <strong>${row.goals}</strong>
          <small>gol previsti</small>
          <small>media recente ${rate}</small>
        </div>
      </article>`;
  }).join("");
}

function codexRenderGroupFixtures() {
  const root = document.getElementById("codex-group-fixtures");
  const byGroup = Object.keys(groupTeams).map((group) => {
    const cards = Object.entries(codexState.results)
      .filter(([number, result]) => Number(number) <= 72 && result.fixture?.[1] === `Group ${group}`)
      .map(([number]) => codexRenderResultCard(Number(number)))
      .join("");
    return `<section class="codex-group-results"><h3>Girone ${group}</h3><div>${cards}</div></section>`;
  }).join("");
  root.innerHTML = byGroup;
}

function codexStandingTable(group, table) {
  return `
    <article class="prediction-group-card" style="--group-color:${groupColors[group] || "#00d084"}">
      <div class="prediction-group-head"><span>Girone ${group}</span><small>Codex</small></div>
      <table class="prediction-group-table">
        <thead><tr><th>Pos</th><th>Squadra</th><th>PG</th><th>V</th><th>N</th><th>P</th><th>GF</th><th>GS</th><th>DR</th><th>Pt</th></tr></thead>
        <tbody>${table.map((row, index) => {
          const diff = row.gf - row.ga;
          return `<tr><td>${index + 1}</td><td><span class="prediction-team-name">${codexFlag(row.team)}${codexEscape(row.team)}</span></td><td>${row.played}</td><td>${row.wins}</td><td>${row.draws}</td><td>${row.losses}</td><td>${row.gf}</td><td>${row.ga}</td><td>${diff > 0 ? "+" : ""}${diff}</td><td><strong>${row.points}</strong></td></tr>`;
        }).join("")}</tbody>
      </table>
    </article>`;
}

function codexRenderStandings() {
  document.getElementById("codex-standings").innerHTML = Object.entries(codexState.groupTables)
    .map(([group, table]) => codexStandingTable(group, table))
    .join("");
}

function codexRenderThirds() {
  document.getElementById("codex-thirds").innerHTML = `
    <table class="prediction-group-table prediction-thirds-ranking">
      <thead><tr><th>Pos</th><th>Squadra</th><th>Gir</th><th>PG</th><th>DR</th><th>Pt</th></tr></thead>
      <tbody>${codexState.thirds.map((row, index) => {
        const diff = row.gf - row.ga;
        return `<tr class="${index < 8 ? "is-qualified-third" : "is-excluded-third"}"><td>${index + 1}</td><td><span class="prediction-team-name">${codexFlag(row.team)}${codexEscape(row.team)}</span></td><td>${row.group}</td><td>${row.played}</td><td>${diff > 0 ? "+" : ""}${diff}</td><td><strong>${row.points}</strong></td></tr>`;
      }).join("")}</tbody>
    </table>`;
}

function codexRenderKnockout() {
  const rounds = [
    ["Sedicesimi", codexBracketMatchNumbers.r32],
    ["Ottavi", codexBracketMatchNumbers.r16],
    ["Quarti", codexBracketMatchNumbers.qf],
    ["Semifinali", codexBracketMatchNumbers.sf],
    ["Finali", [...codexBracketMatchNumbers.bronze, ...codexBracketMatchNumbers.final]],
  ];
  document.getElementById("codex-knockout").innerHTML = rounds.map(([title, matches]) => `
    <section class="codex-knockout-round">
      <h3>${title}</h3>
      <div>${matches.map((matchNumber) => codexRenderResultCard(matchNumber)).join("")}</div>
    </section>`).join("");
}

function codexBoot() {
  codexBuildStrengths();
  codexSimulateGroups();
  codexSimulateKnockout();
  codexRenderMethod();
  codexRenderRanking();
  codexRenderTopScorers();
  codexRenderGroupFixtures();
  codexRenderStandings();
  codexRenderThirds();
  codexRenderKnockout();
}

codexBoot();
