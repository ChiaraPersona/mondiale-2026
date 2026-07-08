const { fetchJson } = require("../lib/http");
const { emptyPlayer, statMap } = require("../lib/schema");

const PROVIDER = "ESPN";

function eventIdFromUrl(url) {
  const gameId = String(url).match(/gameId[=/](\d+)/i);
  if (gameId) return gameId[1];

  const lastNumber = String(url).match(/(\d{5,})(?!.*\d)/);
  return lastNumber ? lastNumber[1] : null;
}

function apiUrlFromUrl(url) {
  const eventId = eventIdFromUrl(url);
  if (!eventId) return null;
  return `https://site.web.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=${eventId}`;
}

function mapEspnPlayer(entry) {
  const stats = statMap(entry.stats);
  const player = {
    ...emptyPlayer(PROVIDER),
    name: entry.athlete?.displayName || entry.athlete?.fullName || "",
    role: entry.position?.displayName || null,
    starter: typeof entry.starter === "boolean" ? entry.starter : null,
    shots: stats.totalShots,
    shotsOnTarget: stats.shotsOnTarget,
    goals: stats.totalGoals,
    assists: stats.goalAssists,
    foulsCommitted: stats.foulsCommitted,
    foulsWon: stats.foulsSuffered,
    yellowCards: stats.yellowCards,
    redCards: stats.redCards
  };

  return player;
}

function scoreFromHeader(header) {
  const competitors = header?.competitions?.[0]?.competitors || [];
  if (competitors.length < 2) return null;
  const home = competitors.find((item) => item.homeAway === "home") || competitors[0];
  const away = competitors.find((item) => item.homeAway === "away") || competitors[1];
  if (home.score === undefined || away.score === undefined) return null;
  return `${home.score}-${away.score}`;
}

function extractMatchMeta(json, matchId) {
  const competition = json?.header?.competitions?.[0];
  const competitors = competition?.competitors || [];
  const home = competitors.find((item) => item.homeAway === "home");
  const away = competitors.find((item) => item.homeAway === "away");

  return {
    matchId,
    competition: json?.header?.league?.name || "World Cup 2026",
    round: competition?.notes?.[0]?.headline || null,
    date: competition?.date ? competition.date.slice(0, 10) : null,
    homeTeam: home?.team?.displayName || null,
    awayTeam: away?.team?.displayName || null,
    score: scoreFromHeader(json?.header)
  };
}

async function scrape({ url, matchId }) {
  const apiUrl = apiUrlFromUrl(url);
  if (!apiUrl) {
    return {
      provider: PROVIDER,
      sourceUrl: url,
      matchId,
      rawArtifacts: [],
      errors: ["Impossibile ricavare gameId ESPN dall'URL."],
      extracted: null
    };
  }

  const response = await fetchJson(apiUrl);
  const json = response.json;
  const rawArtifacts = [
    {
      kind: "json",
      label: "espn-summary-api",
      suggestedFileName: `${matchId}.espn.summary.json`,
      content: json || response.text
    }
  ];

  if (!json) {
    return {
      provider: PROVIDER,
      sourceUrl: url,
      apiUrl,
      matchId,
      rawArtifacts,
      errors: [`ESPN API non parsabile: ${response.parseError || response.status}`],
      extracted: null
    };
  }

  const teams = {};
  for (const teamRoster of json.rosters || []) {
    const teamName = teamRoster.team?.displayName;
    if (!teamName) continue;
    teams[teamName] = {
      players: (teamRoster.roster || []).map(mapEspnPlayer).filter((player) => player.name)
    };
  }

  return {
    provider: PROVIDER,
    sourceUrl: url,
    apiUrl,
    matchId,
    fetchedAt: new Date().toISOString(),
    rawArtifacts,
    errors: [],
    extracted: {
      ...extractMatchMeta(json, matchId),
      provider: PROVIDER,
      teams
    }
  };
}

module.exports = {
  PROVIDER,
  scrape
};
