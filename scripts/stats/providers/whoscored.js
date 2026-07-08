const { fetchRenderedHtml, fetchText } = require("../lib/http");

const PROVIDER = "WhoScored";

function findEmbeddedMatchData(html) {
  const patterns = [
    /matchCentreData\s*=\s*({[\s\S]*?});\s*<\/script>/i,
    /matchCentreData\s*:\s*({[\s\S]*?})\s*,\s*matchCentreEventTypeJson/i,
    /"matchCentreData"\s*:\s*({[\s\S]*?})\s*,\s*"formationIdNameMappings"/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (!match) continue;
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      return { parseError: error.message, rawSnippet: match[1].slice(0, 1000) };
    }
  }

  return null;
}

async function scrape({ url, matchId, usePlaywright }) {
  const rawArtifacts = [];
  const errors = [];
  const page = await fetchText(url);
  let html = page.text;

  rawArtifacts.push({
    kind: "html",
    label: "whoscored-page-html",
    suggestedFileName: `${matchId}.whoscored.html`,
    content: html
  });

  if (usePlaywright || !findEmbeddedMatchData(html)) {
    const rendered = await fetchRenderedHtml(url);
    if (rendered.html) {
      html = rendered.html;
      rawArtifacts.push({
        kind: "html",
        label: "whoscored-rendered-html",
        suggestedFileName: `${matchId}.whoscored.rendered.html`,
        content: html
      });
    } else {
      errors.push(rendered.error);
    }
  }

  const embedded = findEmbeddedMatchData(html);
  if (embedded) {
    rawArtifacts.push({
      kind: "json",
      label: "whoscored-embedded-match-centre-data",
      suggestedFileName: `${matchId}.whoscored.match-centre.json`,
      content: embedded
    });
  } else {
    errors.push("Nessun matchCentreData trovato in HTML/render.");
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
      "WhoScored raw salvato. Il parsing normalizzato viene applicato solo se matchCentreData e player stats sono presenti."
    ]
  };
}

module.exports = {
  PROVIDER,
  scrape
};
