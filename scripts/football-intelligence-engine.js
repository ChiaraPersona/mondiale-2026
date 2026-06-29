const fs = require("fs");
const path = require("path");
const { readEvents, writeEvents } = require("./lib/event-model");

const root = path.resolve(__dirname, "..");
const eventDirectory = path.join(root, "data", "events");
const outputDirectory = path.join(root, "data", "intelligence");
const requestedFile = process.argv[2];

const needsByCategory = Object.freeze({
  corner: { motivation: true, tactics: true, pressure: true, risks: true },
  cartellini: { pressure: true, risks: true, tactics: true },
  tiri: { players: true, tactics: true, form: true },
  goal: { tactics: true, form: true, motivation: true },
  esito: { motivation: true, form: true, tactics: true, absences: true },
  giocatori: { players: true, form: true, tactics: true },
});

const needFields = Object.freeze([
  "motivation",
  "form",
  "tactics",
  "pressure",
  "players",
  "absences",
  "risks",
]);

function decodeHtml(value) {
  return String(value ?? "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&middot;/gi, "·")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&agrave;/gi, "à")
    .replace(/&egrave;/gi, "è")
    .replace(/&igrave;/gi, "ì")
    .replace(/&ograve;/gi, "ò")
    .replace(/&ugrave;/gi, "ù")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)));
}

function plainText(html) {
  return decodeHtml(
    String(html ?? "")
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(?:p|li|div|h[1-6]|blockquote)>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  ).replace(/\s+/g, " ").trim();
}

function firstMatch(html, expression) {
  const match = html.match(expression);
  return match ? plainText(match[1]) : null;
}

function sentences(value) {
  return plainText(value)
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ü])/u)
    .map(sentence => sentence.trim())
    .filter(Boolean);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function matchingSentences(values, expression, limit = 6) {
  return unique(
    values.flatMap(value => sentences(value)).filter(sentence => expression.test(sentence))
  ).slice(0, limit);
}

function sectionsFrom(html) {
  const sections = [];
  const expression = /<section\b[^>]*>([\s\S]*?)<\/section>/gi;
  let match;
  while ((match = expression.exec(html))) {
    const title = firstMatch(match[1], /<h3\b[^>]*>([\s\S]*?)<\/h3>/i);
    if (!title) continue;
    const paragraphs = [...match[1].matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(item => plainText(item[1]))
      .filter(Boolean);
    sections.push({ title, paragraphs, text: paragraphs.join(" ") });
  }
  return sections;
}

function findSection(sections, expression) {
  return sections.find(section => expression.test(section.title)) || null;
}

function teamParagraph(section, team, fallbackIndex) {
  if (!section) return null;
  return (
    section.paragraphs.find(paragraph =>
      paragraph.toLocaleLowerCase("it").includes(team.toLocaleLowerCase("it"))
    ) ||
    section.paragraphs[fallbackIndex] ||
    null
  );
}

function evidenceOrNull(values) {
  const result = unique(values);
  return result.length ? result : null;
}

function extractIntelligence(filename) {
  const sourcePath = path.join(root, filename);
  const html = fs.readFileSync(sourcePath, "utf8");
  const sections = sectionsFrom(html);

  const matchName = firstMatch(
    html,
    /<div\b[^>]*class=["'][^"']*reading-versus[^"']*["'][^>]*>[\s\S]*?<b>([\s\S]*?)<\/b>/i
  );
  const teams = [...html.matchAll(
    /<div\b[^>]*class=["'][^"']*reading-team[^"']*["'][^>]*>[\s\S]*?<strong>([\s\S]*?)<\/strong>/gi
  )].map(item => plainText(item[1])).slice(0, 2);

  if (!matchName || teams.length !== 2) {
    throw new Error(`${filename}: match o squadre non riconosciuti.`);
  }

  const [home, away] = teams;
  const kicker = firstMatch(html, /<div\b[^>]*class=["'][^"']*reading-kicker[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  const heroTitle = firstMatch(html, /<header\b[^>]*class=["'][^"']*reading-hero[^"']*["'][^>]*>[\s\S]*?<h2>([\s\S]*?)<\/h2>/i);
  const heroDeck = firstMatch(html, /<p\b[^>]*class=["'][^"']*reading-deck[^"']*["'][^>]*>([\s\S]*?)<\/p>/i);

  const motivationSection = findSection(sections, /motivaz/i);
  const formSection = findSection(sections, /forma recente/i);
  const homeTactics = findSection(sections, new RegExp(`partita (?:del|della) ${escapeRegex(home)}`, "i"));
  const awayTactics = findSection(sections, new RegExp(`partita (?:del|della) ${escapeRegex(away)}`, "i"));
  const formationSection = findSection(sections, /formazion|duelli/i);
  const verdictSection = findSection(sections, /verdetto finale/i);
  const volumeSection = findSection(sections, /tiri e corner/i);
  const disciplineSections = sections.filter(section => /ammon|disciplin|cartell/i.test(section.title));

  const coreTexts = [
    heroTitle,
    heroDeck,
    motivationSection?.text,
    homeTactics?.text,
    awayTactics?.text,
    verdictSection?.text,
  ].filter(Boolean);
  const tacticalTexts = [homeTactics?.text, awayTactics?.text, formationSection?.text].filter(Boolean);
  const allAnalysisTexts = sections.flatMap(section => section.paragraphs);

  const mustWin = matchingSentences(
    coreTexts,
    /\b(deve vincere|devono vincere|obbligat[oaie]|bisogno di (?:vincere|una vittoria)|urgenza di una risposta)\b/i
  );
  const canSettle = matchingSentences(
    coreTexts,
    /\b(può accontentarsi|possono accontentarsi|nulla da perdere|pressione (?:limitata|inferiore)|aspettative (?:già )?superate)\b/i
  );
  const balanced = matchingSentences(
    coreTexts,
    /\b(partita|gara|motivazione|linea)\b[^.?!]{0,80}\bequilibrat[oa]\b/i
  );

  const absenceEvidence = matchingSentences(
    allAnalysisTexts,
    /\b(assenz[ae]|assente|indisponibil[ei]|infortunat[oaie]|squalificat[oaie])\b/i,
    12
  );
  const turnoverEvidence = matchingSentences(
    allAnalysisTexts,
    /\b(turnover|rotazion[ei]|riposo|cambio massiccio|cambi nell'undici)\b/i,
    8
  );

  const keyPlayers = matchingSentences(
    tacticalTexts.concat(disciplineSections.map(section => section.text)),
    /\b(principale|chiave|può decidere|vantaggio individuale|scelta principale|più importante)\b/i,
    10
  );
  const playersToWatch = matchingSentences(
    [volumeSection?.text, ...disciplineSections.map(section => section.text)].filter(Boolean),
    /\b(candidat[oa]|profil[oi]|outsider|seguono|secondo nome|scelta principale|tiri|ammonit)\b/i,
    12
  );

  const cornerRisk = matchingSentences(
    [volumeSection?.text, homeTactics?.text, awayTactics?.text].filter(Boolean),
    /\bcorner\b/i,
    5
  );
  const cardRisk = matchingSentences(
    disciplineSections.map(section => section.text),
    /\b(cartellin[oi]|giall[oi]|ammonizion[ei]|rischio)\b/i,
    6
  );
  const goalRisk = matchingSentences(
    [heroTitle, heroDeck, verdictSection?.text].filter(Boolean),
    /\b(goleada|molti gol|pochi gol|almeno due reti|segnare|gol)\b/i,
    5
  );
  const upsetRisk = matchingSentences(
    [motivationSection?.text, heroTitle, heroDeck, verdictSection?.text].filter(Boolean),
    /\b(rischio sorpresa|sorpresa|sfavorit[oa]|favorit[oa])\b/i,
    5
  );

  const summary = unique([
    heroTitle,
    heroDeck && !/\b(quot[ae]|bookmaker|mercato)\b/i.test(heroDeck) ? heroDeck : null,
    verdictSection?.paragraphs[0],
  ]).slice(0, 3);

  return {
    match: matchName,
    motivation: {
      home: teamParagraph(motivationSection, home, 0),
      away: teamParagraph(motivationSection, away, 1),
    },
    pressure: {
      mustWin: evidenceOrNull(mustWin),
      canSettle: evidenceOrNull(canSettle),
      knockout: kicker && /eliminazione diretta/i.test(kicker) ? kicker : null,
      balanced: evidenceOrNull(balanced),
    },
    tactics: {
      offensiveApproach: {
        home: evidenceOrNull(matchingSentences([homeTactics?.text], /\b(attacc|offensiv|vertical|profondità|ampiezza|press)/i)),
        away: evidenceOrNull(matchingSentences([awayTactics?.text], /\b(attacc|offensiv|vertical|profondità|ripart|transizion|press)/i)),
      },
      defensiveApproach: {
        home: evidenceOrNull(matchingSentences([homeTactics?.text], /\b(difend|difensiv|proteg|copertur|blocco|chiud|scherm)/i)),
        away: evidenceOrNull(matchingSentences([awayTactics?.text], /\b(difend|difensiv|proteg|copertur|blocco|chiud|scherm)/i)),
      },
      expectedPossession: evidenceOrNull(matchingSentences(tacticalTexts, /\b(possesso|territorial|controllo del pallone|costruzione)\b/i)),
      expectedIntensity: evidenceOrNull(matchingSentences(tacticalTexts.concat(coreTexts), /\b(intensità|ritmo|pressing|pressione (?:alta|continua|selettiva|coordinata))\b/i)),
    },
    form: {
      home: teamParagraph(formSection, home, 0),
      away: teamParagraph(formSection, away, 1),
    },
    absences: {
      important: absenceEvidence,
      probableTurnover: turnoverEvidence.length ? turnoverEvidence : null,
    },
    players: {
      key: keyPlayers,
      watch: playersToWatch,
    },
    risks: {
      upset: evidenceOrNull(upsetRisk),
      cards: evidenceOrNull(cardRisk),
      manyCorners: evidenceOrNull(cornerRisk),
      manyGoals: evidenceOrNull(goalRisk),
    },
    summary,
  };
}

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function needsFor(category) {
  return Object.fromEntries(
    needFields.map(field => [field, Boolean(needsByCategory[category]?.[field])])
  );
}

function relevantBreakdown(intelligence, needs) {
  return Object.fromEntries(
    needFields
      .filter(field => needs[field])
      .map(field => [
        field,
        field === "risks"
          ? {
              ...(intelligence.risks || {}),
              probableTurnover: intelligence.absences?.probableTurnover ?? null,
            }
          : intelligence[field] ?? null,
      ])
  );
}

const files = requestedFile
  ? [requestedFile.replace(/^lettura-/, "").replace(/\.html$/i, "-events.json")]
  : fs.readdirSync(eventDirectory)
      .filter(filename => filename.toLowerCase().endsWith("-events.json"))
      .sort((a, b) => a.localeCompare(b, "it"));

if (!files.length) {
  throw new Error("Nessuna pagina lettura-*.html trovata.");
}

files.forEach(filename => {
  const base = filename.replace(/-events\.json$/i, "");
  const pageFilename = `lettura-${base}.html`;
  const sourcePath = path.join(root, pageFilename);
  if (!fs.existsSync(sourcePath)) throw new Error(`Pagina non trovata: ${pageFilename}`);

  const intelligence = extractIntelligence(pageFilename);
  const events = readEvents(path.join(eventDirectory, filename)).map(event => {
    const needs = needsFor(event.category);
    return {
      ...event,
      needs,
      breakdown: relevantBreakdown(intelligence, needs),
    };
  });
  const destination = path.join(outputDirectory, filename);
  writeEvents(destination, events);
  console.log(`${intelligence.match}: ${events.length} eventi -> data/intelligence/${filename}`);
});
