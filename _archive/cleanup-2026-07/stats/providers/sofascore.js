const { fetchJson, fetchRenderedHtml, fetchText } = require("../lib/http");

const PROVIDER = "SofaScore";

function eventIdFromUrl(url) {
  const hashId = String(url).match(/#id:(\d+)/i);
  if (hashId) return hashId[1];

  const lastNumber = String(url).match(/(\d{5,})(?!.*\d)/);
  return lastNumber ? lastNumber[1] : null;
}

async function scrape({ url, matchId, usePlaywright }) {
  const rawArtifacts = [];
  const errors = [];
  const eventId = eventIdFromUrl(url);

  const page = await fetchText(url);
  rawArtifacts.push({
    kind: "html",
    label: "sofascore-page-html",
    suggestedFileName: `${matchId}.sofascore.html`,
    content: page.text
  });

  if (usePlaywright) {
    const rendered = await fetchRenderedHtml(url);
    if (rendered.html) {
      rawArtifacts.push({
        kind: "html",
        label: "sofascore-rendered-html",
        suggestedFileName: `${matchId}.sofascore.rendered.html`,
        content: rendered.html
      });
    } else {
      errors.push(rendered.error);
    }
  }

  if (!eventId) {
    errors.push("EventId SofaScore non ricavato dall'URL.");
  } else {
    for (const [label, apiUrl] of [
      ["sofascore-event", `https://www.sofascore.com/api/v1/event/${eventId}`],
      ["sofascore-lineups", `https://www.sofascore.com/api/v1/event/${eventId}/lineups`],
      ["sofascore-statistics", `https://www.sofascore.com/api/v1/event/${eventId}/statistics`]
    ]) {
      const api = await fetchJson(apiUrl);
      rawArtifacts.push({
        kind: "json",
        label,
        suggestedFileName: `${matchId}.${label}.json`,
        content: api.json || api.text
      });
      if (!api.json) errors.push(`${label} non parsabile (${api.status || "status sconosciuto"}).`);
    }
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
      "SofaScore raw salvato. Il normalizzatore usa lineups/player statistics solo se presenti negli endpoint salvati."
    ]
  };
}

module.exports = {
  PROVIDER,
  scrape
};
