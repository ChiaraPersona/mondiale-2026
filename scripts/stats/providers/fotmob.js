const { fetchJson, fetchRenderedHtml, fetchText } = require("../lib/http");

const PROVIDER = "FotMob";

function matchIdFromHtml(html) {
  const candidates = [
    /matchId=(\d+)/i,
    /\/match\/(\d+)/i,
    /"matchId"\s*:\s*(\d+)/i
  ];
  for (const pattern of candidates) {
    const match = html.match(pattern);
    if (match) return match[1];
  }
  return null;
}

function matchIdFromUrl(url) {
  const direct = String(url).match(/\/match(?:es)?\/(\d+)/i);
  return direct ? direct[1] : null;
}

async function scrape({ url, matchId, usePlaywright }) {
  const rawArtifacts = [];
  const errors = [];
  let html = null;

  const page = await fetchText(url);
  html = page.text;
  rawArtifacts.push({
    kind: "html",
    label: "fotmob-page-html",
    suggestedFileName: `${matchId}.fotmob.html`,
    content: html
  });

  if (usePlaywright) {
    const rendered = await fetchRenderedHtml(url);
    if (rendered.html) {
      html = rendered.html;
      rawArtifacts.push({
        kind: "html",
        label: "fotmob-rendered-html",
        suggestedFileName: `${matchId}.fotmob.rendered.html`,
        content: rendered.html
      });
    } else {
      errors.push(rendered.error);
    }
  }

  const fotmobMatchId = matchIdFromUrl(url) || matchIdFromHtml(html);
  let apiJson = null;
  if (fotmobMatchId) {
    const apiUrl = `https://www.fotmob.com/api/matchDetails?matchId=${fotmobMatchId}`;
    const api = await fetchJson(apiUrl);
    apiJson = api.json;
    rawArtifacts.push({
      kind: "json",
      label: "fotmob-match-details-api",
      suggestedFileName: `${matchId}.fotmob.match-details.json`,
      content: apiJson || api.text
    });
    if (!apiJson) errors.push(`FotMob API non parsabile (${api.status || "status sconosciuto"}).`);
  } else {
    errors.push("MatchId FotMob non trovato nella pagina.");
  }

  return {
    provider: PROVIDER,
    sourceUrl: url,
    matchId,
    fetchedAt: new Date().toISOString(),
    rawArtifacts,
    errors,
    extracted: null,
    notes: [
      "FotMob raw salvato. Il normalizzatore usa solo blocchi playerStats/lineup se disponibili nel JSON raw; non stima campi mancanti."
    ]
  };
}

module.exports = {
  PROVIDER,
  scrape
};
