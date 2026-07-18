const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relativePath), 'utf8'));
}

function findOdd(pool, info, outcome) {
  const row = pool.markets.find((market) =>
    market.stato === 1 && market.info === info && market.esito === outcome
  );
  if (!row) throw new Error(`Quota non trovata: ${pool.match} / ${info} / ${outcome}`);
  return row.quota;
}

const matches = [
  {
    slug: 'france-england-2026-07-18',
    italianSlug: 'francia-inghilterra',
    quoteFile: 'data/quote/francia-inghilterra-quote.json',
    match: 'Francia-Inghilterra',
    round: 'Finale 3° posto',
    date: '18 luglio 2026',
    time: '23:00',
    venue: 'Hard Rock Stadium (Miami)',
    referee: {
      name: 'Jesús Valenzuela',
      country: 'Venezuela',
      impact: 'Arbitro CONMEBOL esperto e storicamente severo sui cartellini. Il campione 2025/26 disponibile è però più contenuto: 146 falli, 21 gialli e 1 rosso in 7 gare, cioè 20,9 falli e 3,0 gialli a partita. La carriera resta vicina a 5 gialli di media: meglio privilegiare falli e duelli prima di alzare automaticamente l’Over cartellini.',
      indicators: { recentMatches: 7, foulsPerMatch: 20.9, yellowsPerMatch: 3.0, reds: 1, careerYellowsPerMatch: 4.97 },
      sources: [
        { label: 'FIFA · designazione ufficiale', url: 'https://ipt.fifa.com/refereeing/news/slavko-vincic-world-cup-2026-final-referee-spain-argentina' },
        { label: 'KickoffScore · campione 2025/26', url: 'https://kickoffscore.com/es/referees/jesus-valenzuela' },
        { label: 'PlayerStats · storico per competizione', url: 'https://playerstats.football/referee/726' }
      ]
    },
    environment: {
      surface: 'Erba naturale FIFA (Bermuda)',
      structure: 'Campo aperto, senza tetto',
      temperature: '29-31°C',
      humidity: '75-85%',
      weather: 'Possibili temporali e possibili ritardi per fulmini',
      operationalRisk: 'Caldo intenso: possibile calo del ritmo e gestione più prudente degli sforzi dopo l’ora di gioco.'
    },
    home: { name: 'Francia', flag: 'flags/francia.svg', key: 'france' },
    away: { name: 'Inghilterra', flag: 'flags/inghilterra.svg', key: 'england' },
    centralScore: '2-1',
    title: "La Francia ha più qualità nell'ultimo terzo; l'Inghilterra può trasformarla in una partita aperta.",
    deck: "Le formazioni probabili spingono verso una finale per il terzo posto più verticale delle semifinali: Mbappé guida la Francia, Kane e Bellingham tengono viva l'Inghilterra. Risultato centrale 2-1.",
    probabilities: 'Francia 49% · X 27% · Inghilterra 24%',
    winner: 'Francia terza classificata',
    formationHome: { shape: '4-2-3-1', players: 'Maignan; Gusto, Konaté, Lucas Hernandez, Theo Hernandez; Manu Koné, Kanté; Akliouche, Cherki, Thuram; Mbappé.' },
    formationAway: { shape: '4-2-3-1', players: "Pickford; Quansah, Konsa, Guéhi, O'Reilly; Mainoo, Eze; Madueke, Bellingham, Rashford; Kane." },
    analysis: [
      "La scelta francese di affiancare Koné a Kanté dà corsa e recupero, mentre Cherki può ricevere alle spalle di Mainoo ed Eze. Con Thuram e Akliouche larghi, Mbappé ha più spazio per attaccare il lato debole invece di dover costruire ogni azione.",
      "L'Inghilterra presenta una linea difensiva giovane e un doppio mediano meno protettivo del solito. Bellingham resta il raccordo decisivo: se riesce a ricevere dietro Kanté, può avvicinare Rashford e Kane e obbligare i centrali francesi a difendere correndo verso la propria porta.",
      "La quota di mercato vede correttamente la Francia avanti. Il profilo da terzo posto, però, riduce il valore dell'Under: entrambe hanno qualità offensiva, cambi profondi e meno incentivo a congelare la gara."
    ],
    key: "Cherki tra le linee contro Mainoo-Eze. Se l'Inghilterra non chiude quella ricezione, Mbappé potrà attaccare una difesa costretta a rompere la propria linea.",
    volumes: 'Francia 12-17 tiri, 4-7 nello specchio e 5-8 corner. Inghilterra 9-14 tiri, 3-6 nello specchio e 3-6 corner. Falli totali attesi: 21-27.',
    teamEvidence: [
      { team: 'Francia', sample: '6 gare pre-semifinale', averages: '18,3 tiri · 7,8 in porta · 6,8 corner · 9,8 falli fatti · 9,7 subiti', latest: 'Semifinale con la Spagna: 10 tiri, 3 in porta, 7 corner, 11 falli fatti e 12 subiti.', reading: 'Il volume offensivo del torneo è alto, ma la semifinale mostra che contro un possesso organizzato la Francia può produrre meno tiri senza perdere la spinta sui corner.' },
      { team: 'Inghilterra', sample: '5 gare pre-semifinale', averages: '16,0 tiri · 6,4 in porta · 6,2 corner · 10,8 falli fatti · 15,6 subiti', latest: 'Ultime due a eliminazione: 14 tiri e 4 corner con la Norvegia; 5 tiri e 2 corner con l’Argentina. In semifinale 11 falli fatti e 15 subiti.', reading: 'La dispersione è ampia: se subisce il possesso francese può restare sotto 10 tiri, ma Bellingham e Rashford possono far salire falli subiti e transizioni.' }
    ],
    cards: [
      ['Mainoo', 'Possibile primo ammonito', 'Zona di Cherki e transizioni francesi da interrompere.'],
      ['Manu Koné', 'Medio-alto', 'Pressione aggressiva su Bellingham.'],
      ['Guéhi', 'Medio-alto', 'Duelli in campo aperto con Mbappé.'],
      ['Kanté', 'Medio', 'Coperture preventive sulle ricezioni inglesi.'],
      ["O'Reilly", 'Medio', 'Lato esposto alle combinazioni francesi.']
    ],
    picks(pool) { return [
      ['Francia vincente terzo posto', findOdd(pool, 'VINCENTE FINALE TER.POSTO', '1')],
      ['Over 2,5', findOdd(pool, 'U/O 2.5', 'OVER')],
      ['Goal', findOdd(pool, 'GOAL/NO GOAL', 'GOAL')],
      ['Mbappé Over 1,5 tiri in porta incl. TS', findOdd(pool, 'MBAPPE K. U/O 1.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER')]
    ]; },
    valueErrors(pool) { return [
      ['Pareggio nei 90 minuti', findOdd(pool, 'ESITO FINALE 1X2', 'X'), 'Copre la gara aperta ma equilibrata prima di eventuali supplementari.'],
      ['Inghilterra nei 90 minuti', findOdd(pool, 'ESITO FINALE 1X2', '2'), 'Quota alta rispetto alla capacità di Kane e Bellingham di punire una Francia sbilanciata.'],
      ['Francia + No Goal', findOdd(pool, 'ESITO FINALE 1X2 + GOAL/NOGOAL', '1 + NOGOAL'), 'Scenario alternativo se la Francia segna presto e controlla meglio del previsto.']
    ]; }
  },
  {
    slug: 'spain-argentina-2026-07-19',
    italianSlug: 'spagna-argentina',
    quoteFile: 'data/quote/spagna-argentina-quote.json',
    match: 'Spagna-Argentina',
    round: 'Finale',
    date: '19 luglio 2026',
    time: '21:00',
    venue: 'MetLife Stadium (New York/New Jersey)',
    referee: {
      name: 'Slavko Vinčić',
      country: 'Slovenia',
      impact: 'Arbitro internazionale dal 2010, con finali di Europa League 2022 e Champions League 2024. I tracker recenti lo collocano intorno a 19-24 falli e circa 2,3-3,0 gialli a partita nei campioni 2025/26 e Mondiale: profilo da gestione selettiva più che da Over cartellini automatico.',
      indicators: { internationalSince: 2010, recentFoulsRange: '19-24', recentYellowsRange: '2,3-3,0', worldCupMatchesSample: 3 },
      sources: [
        { label: 'FIFA · profilo e designazione finale', url: 'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/vincic-to-take-charge-of-world-cup-final' },
        { label: 'UEFA · esperienza nelle finali', url: 'https://www.uefa.com/news-media/news/0275-152a0f2b7068-25705fc4aef9-1000--unique-europa-league-hat-trick-for-seville-final-referee-v/' },
        { label: 'KickoffScore · campione 2025/26', url: 'https://kickoffscore.com/referees/s-vincic' },
        { label: 'FootyMetrics · campione Mondiale 2026', url: 'https://www.footymetrics.com/referees/681-slavko-vincic' }
      ]
    },
    environment: {
      surface: 'Erba naturale FIFA',
      structure: 'Campo aperto, ottime condizioni',
      temperature: '26-28°C',
      humidity: 'Medio-alta',
      weather: 'Possibili rovesci',
      operationalRisk: 'Qualità dell’aria da monitorare per l’eventuale fumo degli incendi canadesi.'
    },
    home: { name: 'Spagna', flag: 'flags/spagna.svg', key: 'spain' },
    away: { name: 'Argentina', flag: 'flags/argentina.svg', key: 'argentina' },
    centralScore: '1-1 nei 90 minuti',
    title: "La Spagna può comandare il campo; l'Argentina può vincere il momento decisivo.",
    deck: "Le probabili confermano il duello tra controllo spagnolo e resilienza argentina. La Spagna parte leggermente avanti nei 90 minuti, ma Messi e la struttura a cinque centrocampisti rendono l'Argentina più forte se la finale resta in equilibrio.",
    probabilities: 'Spagna 39% · X 34% · Argentina 27%',
    winner: 'Argentina alza la coppa',
    formationHome: { shape: '4-2-3-1', players: 'Unai Simón; Pedro Porro, Cubarsí, Laporte, Cucurella; Rodri, Fabián Ruiz; Lamine Yamal, Dani Olmo, Baena; Oyarzabal.' },
    formationAway: { shape: '4-1-3-2', players: 'Emiliano Martínez; Molina, Romero, Lisandro Martínez, Tagliafico; Paredes; Enzo Fernández, Mac Allister, De Paul; Messi; Julián Álvarez.' },
    analysis: [
      "La Spagna conserva la struttura che le permette di occupare stabilmente la metà campo rivale. Rodri e Fabián Ruiz danno il primo controllo, Dani Olmo riceve tra le linee e Lamine Yamal può isolare Tagliafico. Oyarzabal offre più mobilità che peso d'area.",
      "L'Argentina aggiunge De Paul e protegge Paredes con una linea interna molto stretta. Messi può partire dietro Álvarez senza dover seguire il terzino; Molina ed Enzo devono invece assorbire il lato forte di Yamal e Porro.",
      "Il mercato rende la Spagna favorita nei 90 minuti, ma il pareggio a 3,05 è coerente con una finale in cui entrambe vorranno evitare la prima perdita centrale. L'Under 2,5 resta la base più solida delle quote principali."
    ],
    key: "Rodri contro Messi dopo la perdita del pallone. Se la Spagna impedisce la prima ricezione argentina può accumulare territorio; se Messi riceve fronte alla porta, Álvarez attacca immediatamente lo spazio dietro Laporte e Cubarsí.",
    volumes: 'Spagna 11-16 tiri, 4-7 nello specchio e 4-7 corner. Argentina 11-16 tiri, 4-6 nello specchio e 3-6 corner. Falli totali attesi: 23-29.',
    teamEvidence: [
      { team: 'Spagna', sample: '6 gare pre-semifinale', averages: '20,3 tiri nelle 5 righe complete · 6,7 in porta · 7,3 corner · 11,3 falli fatti · 9,8 subiti', latest: 'Semifinale con la Francia: 10 tiri, 2 in porta, 1 corner, 12 falli fatti e 11 subiti.', reading: 'Il dato torneo resta dominante, ma l’ultima gara segnala un possibile calo di volume quando la Spagna sceglie controllo e protezione del risultato.' },
      { team: 'Argentina', sample: '5 gare pre-semifinale', averages: '15,0 tiri · 6,4 in porta · 4,6 corner · 11,8 falli fatti · 11,4 subiti', latest: 'Ultime due disponibili: 22 tiri, 7 in porta e 8 corner con la Svizzera; 15 tiri, 5 in porta e 6 corner con l’Inghilterra. In semifinale 15 falli fatti e 11 subiti.', reading: 'Il 4-1-3-2 non è soltanto difensivo: Messi, Álvarez e gli inserimenti di Enzo/Mac Allister sostengono una previsione più alta di tiri e corner rispetto alla prima bozza.' }
    ],
    cards: [
      ['Leandro Paredes', 'Possibile primo ammonito', 'Zona di Olmo e copertura delle uscite di Messi.'],
      ['Nahuel Molina', 'Medio-alto', 'Duello continuo con Lamine Yamal.'],
      ['Marc Cucurella', 'Medio-alto', 'Interventi preventivi su Messi e Álvarez.'],
      ['Cristian Romero', 'Medio', 'Aggressività in anticipo su Oyarzabal.'],
      ['Rodri', 'Medio', 'Fallo tattico possibile sulle transizioni argentine.']
    ],
    picks(pool) { return [
      ['Under 2,5', findOdd(pool, 'U/O 2.5', 'UNDER')],
      ['Primo tempo Under 1,5', findOdd(pool, '1 TEMPO: U/O 1.5', 'UNDER')],
      ['Messi Over 0,5 tiri in porta incl. TS', findOdd(pool, 'MESSI L. U/O 0.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER')],
      ['Lamine Yamal Over 0,5 tiri in porta incl. TS', findOdd(pool, 'YAMAL L. U/O 0.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER')]
    ]; },
    valueErrors(pool) { return [
      ['Pareggio nei 90 minuti', findOdd(pool, 'ESITO FINALE 1X2', 'X'), 'È il risultato centrale della lettura e supera la soglia 3,00.'],
      ['Argentina nei 90 minuti', findOdd(pool, 'ESITO FINALE 1X2', '2'), 'Scenario di valore se Messi elude la pressione di Rodri.'],
      ['X + Goal', findOdd(pool, 'ESITO FINALE 1X2 + GOAL/NOGOAL', 'X + GOAL'), 'Traduce direttamente il risultato centrale 1-1.']
    ]; }
  }
];

const myComboDefinitions = {
  'france-england-2026-07-18': {
    safe: [
      ['VINCENTE FINALE TER.POSTO', '1', 'Francia vincente terzo posto', 'esito'],
      ['GOAL/NO GOAL', 'GOAL', 'Goal', 'esito'],
      ['MBAPPE K. U/O 1.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER', 'Mbappé Over 1,5 tiri in porta incl. TS', 'giocatore'],
      ['MBAPPE K. - KANE H. 1X2 TIRI IN PORTA INC TS', '1', 'Mbappé più tiri in porta di Kane incl. TS', 'giocatore']
    ],
    balancedAdd: [
      ['SQUADRA 1: U/O 4.5 TIRI IN PORTA', 'OVER', 'Francia Over 4,5 tiri in porta', 'volume'],
      ['BELLINGHAM JUDE U/O 0.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER', 'Bellingham almeno 1 tiro in porta incl. TS', 'giocatore']
    ],
    aggressiveAdd: [
      ['KANE H. U/O 2.5 SOMMA TIRI TOTALI E SUO SOST. INCL. T.S.', 'OVER', 'Kane Over 2,5 tiri totali incl. TS', 'giocatore'],
      ['RASHFORD M. U/O 1.5 SOMMA TIRI TOTALI E SUO SOST. INCL. T.S.', 'OVER', 'Rashford Over 1,5 tiri totali incl. TS', 'giocatore']
    ]
  },
  'spain-argentina-2026-07-19': {
    safe: [
      ['U/O 2.5', 'UNDER', 'Under 2,5', 'esito'],
      ['1 TEMPO: U/O 1.5', 'UNDER', 'Primo tempo Under 1,5', 'esito'],
      ['MESSI L. U/O 0.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER', 'Messi almeno 1 tiro in porta incl. TS', 'giocatore'],
      ['YAMAL L. U/O 0.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER', 'Lamine Yamal almeno 1 tiro in porta incl. TS', 'giocatore'],
      ['OYARZABAL M. U/O 0.5 SOMMA TIRI IN PORTA INC PALI E TRAVERSE E SUO SOST. INCL. T.S.', 'OVER', 'Oyarzabal almeno 1 tiro in porta incl. TS', 'giocatore']
    ],
    balancedAdd: [
      ['U/O 3.5 CORNER SQUADRA 1', 'OVER', 'Spagna Over 3,5 corner', 'volume'],
      ['U/O 2.5 CORNER SQUADRA 2', 'OVER', 'Argentina Over 2,5 corner', 'volume']
    ],
    aggressiveAdd: [
      ['MESSI L. U/O 2.5 SOMMA TIRI TOTALI E SUO SOST. INCL. T.S.', 'OVER', 'Messi Over 2,5 tiri totali incl. TS', 'giocatore'],
      ['YAMAL L. U/O 2.5 SOMMA TIRI TOTALI E SUO SOST. INCL. T.S.', 'OVER', 'Lamine Yamal Over 2,5 tiri totali incl. TS', 'giocatore']
    ]
  }
};

function quoteEvent(pool, [info, selection, displayName, category]) {
  const row = pool.markets.find((market) => market.stato === 1 && market.info === info && market.esito === selection);
  if (!row) throw new Error(`Evento MyCombo non trovato: ${pool.match} / ${info} / ${selection}`);
  if (row.quota < 1.2 || row.quota > 1.6) throw new Error(`Quota MyCombo fuori banda: ${displayName} @ ${row.quota}`);
  return {
    id: `event-${row.selectionId}`,
    market: row.mercato,
    info: row.info,
    selection: row.esito,
    odds: row.quota,
    selectionId: row.selectionId,
    marketId: row.marketId,
    category,
    class: 'CORE',
    displayName,
    marketType: row.mercato,
    reason: 'Evento coerente con formazioni probabili, scenario tecnico e volume previsto.'
  };
}

function portfolio(name, definitions, pool, targetOdds, risk) {
  const events = definitions.map((definition) => quoteEvent(pool, definition));
  const finalOdds = Number(events.reduce((total, event) => total * event.odds, 1).toFixed(2));
  return { name, events, finalOdds, targetOdds, averageRisk: risk };
}

function buildPortfolios(match, pool) {
  const definition = myComboDefinitions[match.slug];
  return [
    portfolio('Safe', definition.safe, pool, 'circa 5', 'medio'),
    portfolio('Balanced', [...definition.safe, ...definition.balancedAdd], pool, 'circa 10', 'medio-alto'),
    portfolio('Aggressive', [...definition.safe, ...definition.balancedAdd, ...definition.aggressiveAdd], pool, 'circa 20', 'alto')
  ];
}

function render(match, picks, errors, portfolios) {
  const cardItems = match.cards.map(([player, risk, reason], index) => `<li><b>${player}</b><strong>${risk}</strong><small>${reason}</small>${index === 0 ? '' : ''}</li>`).join('');
  const pickItems = picks.map(([label, odd]) => `<li><b>${label}</b><strong>@ ${odd.toFixed(2)}</strong></li>`).join('');
  const errorItems = errors.map(([label, odd, reason]) => `<li><b>${label} @ ${odd.toFixed(2)}</b><small>${reason}</small></li>`).join('');
  const comboRows = portfolios.map((item) => `<div><b>${item.name} <em>@ ${item.finalOdds.toFixed(2)}</em></b><small>${item.events.map((event) => `${event.displayName} @${event.odds.toFixed(2)}`).join(' · ')}</small></div>`).join('');
  const environmentRows = `<div><dt>Superficie</dt><dd>${match.environment.surface}</dd></div><div><dt>Impianto</dt><dd>${match.environment.structure}</dd></div><div><dt>Temperatura</dt><dd>${match.environment.temperature}</dd></div><div><dt>Umidità</dt><dd>${match.environment.humidity}</dd></div>`;
  const evidenceBlocks = match.teamEvidence.map((item) => `<section><h3>${item.team}: corner, tiri e falli</h3><p><b>Medie (${item.sample}):</b> ${item.averages}.</p><p><b>Ultimo riferimento:</b> ${item.latest}</p><p>${item.reading}</p></section>`).join('');
  const refereeSources = match.referee.sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noopener">${source.label}</a></li>`).join('');
  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><base href="../"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pronostico ${match.match} | Mondiale 2026</title><link rel="stylesheet" href="css/styles.css?v=20260718-finals-1"></head>
<body class="reading-page"><header><div class="topbar"><img class="site-emblem" src="assets/world-cup-2026-logo.png" alt=""><div><h1>Lettura</h1><p class="sub">Pronostici raccontati come una partita, prima che cominci.</p></div></div><nav class="page-links"><a class="page-link" href="index.html">Home</a><a class="page-link" href="statistiche-squadre.html">Statistiche squadre</a><a class="page-link active" href="lettura.html">Lettura</a><a class="page-link" href="storia.html">Storia</a></nav></header>
<main class="reading-main"><nav class="reading-article-nav"><a href="lettura.html">Tutte le letture</a></nav><article class="reading-article">
<header class="reading-hero"><div class="reading-kicker">${match.round} · Formazioni probabili e quote aggiornate</div><div class="reading-match"><div class="reading-team"><img src="${match.home.flag}" alt=""><strong>${match.home.name}</strong></div><div class="reading-versus"><b>${match.home.name} - ${match.away.name}</b><small>${match.date} · ${match.venue} · ore ${match.time}</small></div><div class="reading-team is-away"><img src="${match.away.flag}" alt=""><strong>${match.away.name}</strong></div></div><h2>${match.title}</h2><p class="reading-deck">${match.deck}</p><div class="reading-meta"><span>Arbitro: ${match.referee.name}</span><span>Risultato centrale: ${match.centralScore}</span><span>Scelta: ${match.winner}</span></div></header>
<section class="reading-summary"><div><span>Probabilità nei 90'</span><strong>${match.probabilities}</strong><small>Stima Codex aggiornata alle probabili</small></div><div><span>Verdetto</span><strong>${match.winner}</strong><small>La gerarchia include eventuali supplementari e rigori</small></div><div><span>Risultato centrale</span><strong>${match.centralScore}</strong><small>Scenario guida della lettura</small></div></section>
<div class="round16-info-grid"><section class="round16-info-box round16-formations"><span>1</span><h2>Formazioni probabili</h2><div class="round16-formation"><h3>${match.home.name} <span>${match.formationHome.shape}</span></h3><p>${match.formationHome.players}</p></div><div class="round16-formation"><h3>${match.away.name} <span>${match.formationAway.shape}</span></h3><p>${match.formationAway.players}</p></div></section><section class="round16-info-box"><span>2</span><h2>Campo</h2><p><b>${match.venue}.</b> ${match.environment.surface}; ${match.environment.structure.toLowerCase()}.</p></section><section class="round16-info-box"><span>3</span><h2>Meteo</h2><p>${match.environment.temperature}, umidità ${match.environment.humidity.toLowerCase()}. ${match.environment.weather}. ${match.environment.operationalRisk}</p></section><section class="round16-info-box"><span>4</span><h2>Arbitro</h2><p><b>${match.referee.name} (${match.referee.country}).</b> ${match.referee.impact}</p></section></div>
<div class="reading-layout"><div class="reading-copy"><section><p class="reading-lead">${match.analysis[0]}</p><p>${match.analysis[1]}</p><p>${match.analysis[2]}</p></section><blockquote><strong>La chiave</strong>${match.key}</blockquote>${evidenceBlocks}<section><h3>Proiezione combinata</h3><p>${match.volumes}</p><p>Le stime combinano le medie del torneo disponibili nel repository con l’ultima gara a eliminazione diretta. Il campione non è uniforme per tutte le squadre: per questo vengono mostrate come intervalli, non come certezze.</p></section><section><h3>Ambiente e impatto sulla partita</h3><p>${match.environment.weather}. ${match.environment.operationalRisk}</p><p>Il campo è in ${match.environment.surface.toLowerCase()} e l’impianto è ${match.environment.structure.toLowerCase()}: il modello mantiene il volume previsto, ma considera possibili variazioni di ritmo legate alle condizioni.</p></section><section><h3>Referee Intelligence</h3><p><b>${match.referee.name} (${match.referee.country}).</b> ${match.referee.impact}</p><p>I numeri arbitrali sono un filtro secondario: falli fatti/subiti, ruolo e duello diretto restano più importanti per ordinare i possibili ammoniti.</p></section><section><h3>Gerarchia dei possibili ammoniti</h3><ol class="reading-card-ranking">${cardItems}</ol></section><section><h3>Verdetto</h3><p><b>Risultato centrale: ${match.centralScore}.</b> La scelta complessiva resta <b>${match.winner}</b>. Le quote servono a ordinare le giocate, non a forzare una previsione diversa dalla lettura tattica.</p></section></div>
<aside class="reading-sidebar"><section class="reading-data-panel"><span>Campo e condizioni</span><dl class="reading-stat-list">${environmentRows}</dl><p>${match.environment.weather}. ${match.environment.operationalRisk}</p></section><section class="reading-data-panel"><span>Arbitro</span><p><b>${match.referee.name}</b><br>${match.referee.country}</p><ul class="reading-picks">${refereeSources}</ul></section><section class="reading-data-panel"><span>Volume previsto</span><p>${match.volumes}</p></section><section class="reading-data-panel"><span>Quote chiave</span><ol class="reading-card-ranking">${pickItems}</ol></section><section class="reading-data-panel"><span>MyCombo · quote aggiornate</span><div class="reading-mycombo">${comboRows}</div></section><section class="reading-data-panel"><span>3 possibili errori di quota</span><ul class="reading-picks">${errorItems}</ul></section><section class="reading-data-panel"><span>Rischi del pronostico</span><ul class="reading-picks"><li>Le formazioni sono probabili, non ufficiali.</li><li>I campioni statistici delle squadre non hanno la stessa profondità.</li><li>Un gol precoce può cambiare ritmo, corner e volume falli.</li><li>I mercati inclusivi dei supplementari non sono confrontabili con quelli sui 90 minuti.</li></ul></section></aside></div>
<footer class="reading-note"><strong>Nota</strong><p>Lettura aggiornata il 18 luglio 2026 con le formazioni probabili fornite e le quote presenti in <code>${match.quoteFile}</code>.</p></footer></article></main><script src="js/nav.js?v=20260718-finals-1"></script></body></html>`;
}

for (const match of matches) {
  const pool = readJson(match.quoteFile);
  const picks = match.picks(pool);
  const valueErrors = match.valueErrors(pool);
  const portfolios = buildPortfolios(match, pool);
  if (valueErrors.some(([, odd]) => odd < 3)) throw new Error(`${match.match}: errore di quota sotto 3.00`);
  const reading = {
    matchId: match.slug,
    match: match.match,
    round: match.round,
    date: `${match.date} ore ${match.time}`,
    status: 'probable-lineups',
    lineupsStatus: 'formazioni probabili fornite il 18/07/2026',
    prediction: { centralScore: match.centralScore, winner: match.winner, probabilities90: match.probabilities },
    formations: { [match.home.key]: match.formationHome, [match.away.key]: match.formationAway },
    refereeIntelligence: match.referee,
    matchEnvironment: { venue: match.venue, ...match.environment },
    teamEvidence: match.teamEvidence,
    volumeForecast: match.volumes,
    cardHierarchy: match.cards.map(([player, risk], index) => ({ player, risk, possibleFirstBooked: index === 0 })),
    quoteSource: match.quoteFile,
    keyPicks: picks.map(([selection, odd]) => ({ selection, odd })),
    valueErrors: valueErrors.map(([selection, odd, reason]) => ({ selection, odd, reason })),
    portfolios: portfolios.map(({ name, finalOdds, targetOdds, events }) => ({ name, finalOdds, targetOdds, events }))
  };
  const myCombo = {
    matchId: match.slug,
    match: match.match,
    date: `${match.date} ore ${match.time}`,
    completion: 100,
    status: 'ready',
    sourceQuote: match.quoteFile,
    sourceReading: `data/readings/${match.slug}.json`,
    refereeIntelligence: match.referee,
    matchEnvironment: { venue: match.venue, ...match.environment },
    teamEvidence: match.teamEvidence,
    volumeForecast: match.volumes,
    safe: portfolios[0],
    balanced: portfolios[1],
    aggressive: portfolios[2],
    portfolios,
    topEvents: portfolios[2].events
  };
  fs.writeFileSync(path.join(ROOT, `data/readings/${match.slug}.json`), `${JSON.stringify(reading, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, `data/readings/${match.italianSlug}.json`), `${JSON.stringify(reading, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, `data/mycombo/${match.slug}.json`), `${JSON.stringify(myCombo, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, `data/mycombo/${match.italianSlug}.json`), `${JSON.stringify(myCombo, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, `letture/lettura-${match.italianSlug}.html`), render(match, picks, valueErrors, portfolios));
  console.log(`Generata ${match.match}: ${portfolios.map((item) => `${item.name} @${item.finalOdds}`).join(', ')}`);
}
