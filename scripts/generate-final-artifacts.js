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
    venue: 'Miami Stadium',
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
    volumes: 'Francia 13-18 tiri, 5-8 nello specchio e 5-8 corner. Inghilterra 9-14 tiri, 3-6 nello specchio e 3-6 corner.',
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
    venue: 'New York New Jersey Stadium',
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
    volumes: 'Spagna 11-15 tiri, 3-6 nello specchio e 4-7 corner. Argentina 8-12 tiri, 3-5 nello specchio e 2-5 corner.',
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

function render(match, picks, errors) {
  const cardItems = match.cards.map(([player, risk, reason], index) => `<li><b>${player}</b><strong>${risk}</strong><small>${reason}</small>${index === 0 ? '' : ''}</li>`).join('');
  const pickItems = picks.map(([label, odd]) => `<li><b>${label}</b><strong>@ ${odd.toFixed(2)}</strong></li>`).join('');
  const errorItems = errors.map(([label, odd, reason]) => `<li><b>${label} @ ${odd.toFixed(2)}</b><small>${reason}</small></li>`).join('');
  return `<!doctype html>
<html lang="it"><head><meta charset="utf-8"><base href="../"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pronostico ${match.match} | Mondiale 2026</title><link rel="stylesheet" href="css/styles.css?v=20260718-finals-1"></head>
<body class="reading-page"><header><div class="topbar"><img class="site-emblem" src="assets/world-cup-2026-logo.png" alt=""><div><h1>Lettura</h1><p class="sub">Pronostici raccontati come una partita, prima che cominci.</p></div></div><nav class="page-links"><a class="page-link" href="index.html">Home</a><a class="page-link" href="statistiche-squadre.html">Statistiche squadre</a><a class="page-link active" href="lettura.html">Lettura</a><a class="page-link" href="storia.html">Storia</a></nav></header>
<main class="reading-main"><nav class="reading-article-nav"><a href="lettura.html">Tutte le letture</a></nav><article class="reading-article">
<header class="reading-hero"><div class="reading-kicker">${match.round} · Formazioni probabili e quote aggiornate</div><div class="reading-match"><div class="reading-team"><img src="${match.home.flag}" alt=""><strong>${match.home.name}</strong></div><div class="reading-versus"><b>${match.home.name} - ${match.away.name}</b><small>${match.date} · ${match.venue} · ore ${match.time}</small></div><div class="reading-team is-away"><img src="${match.away.flag}" alt=""><strong>${match.away.name}</strong></div></div><h2>${match.title}</h2><p class="reading-deck">${match.deck}</p><div class="reading-meta"><span>Formazioni probabili del 18 luglio</span><span>Risultato centrale: ${match.centralScore}</span><span>Scelta: ${match.winner}</span></div></header>
<section class="reading-summary"><div><span>Probabilità nei 90'</span><strong>${match.probabilities}</strong><small>Stima Codex aggiornata alle probabili</small></div><div><span>Verdetto</span><strong>${match.winner}</strong><small>La gerarchia include eventuali supplementari e rigori</small></div><div><span>Risultato centrale</span><strong>${match.centralScore}</strong><small>Scenario guida della lettura</small></div></section>
<div class="round16-info-grid"><section class="round16-info-box round16-formations"><span>1</span><h2>Formazioni probabili</h2><div class="round16-formation"><h3>${match.home.name} <span>${match.formationHome.shape}</span></h3><p>${match.formationHome.players}</p></div><div class="round16-formation"><h3>${match.away.name} <span>${match.formationAway.shape}</span></h3><p>${match.formationAway.players}</p></div></section><section class="round16-info-box"><span>2</span><h2>Volume previsto</h2><p>${match.volumes}</p></section><section class="round16-info-box"><span>3</span><h2>Quote</h2><p>Quote lette dal file locale fornito il 18 luglio 2026. Mercati con supplementari indicati esplicitamente.</p></section><section class="round16-info-box"><span>4</span><h2>Stato lettura</h2><p>Aggiornata sulle probabili mostrate; gli undici restano da confermare.</p></section></div>
<div class="reading-layout"><div class="reading-copy"><section><p class="reading-lead">${match.analysis[0]}</p><p>${match.analysis[1]}</p><p>${match.analysis[2]}</p></section><blockquote><strong>La chiave</strong>${match.key}</blockquote><section><h3>Gerarchia dei possibili ammoniti</h3><ol class="reading-card-ranking">${cardItems}</ol></section><section><h3>Verdetto</h3><p><b>Risultato centrale: ${match.centralScore}.</b> La scelta complessiva resta <b>${match.winner}</b>. Le quote servono a ordinare le giocate, non a forzare una previsione diversa dalla lettura tattica.</p></section><section><h3>3 possibili errori di quota</h3><ol class="reading-card-ranking">${errorItems}</ol></section></div>
<aside class="reading-sidebar"><section class="reading-data-panel"><span>Quote chiave</span><ol class="reading-card-ranking">${pickItems}</ol></section><section class="reading-data-panel"><span>Rischi del pronostico</span><ul class="reading-picks"><li>Le formazioni sono probabili, non ufficiali.</li><li>Un gol precoce può cambiare ritmo e volumi.</li><li>I mercati inclusivi dei supplementari non sono confrontabili con quelli sui 90 minuti.</li></ul></section></aside></div>
<footer class="reading-note"><strong>Nota</strong><p>Lettura aggiornata il 18 luglio 2026 con le formazioni probabili fornite e le quote presenti in <code>${match.quoteFile}</code>.</p></footer></article></main><script src="js/nav.js?v=20260718-finals-1"></script></body></html>`;
}

for (const match of matches) {
  const pool = readJson(match.quoteFile);
  const picks = match.picks(pool);
  const valueErrors = match.valueErrors(pool);
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
    cardHierarchy: match.cards.map(([player, risk], index) => ({ player, risk, possibleFirstBooked: index === 0 })),
    quoteSource: match.quoteFile,
    keyPicks: picks.map(([selection, odd]) => ({ selection, odd })),
    valueErrors: valueErrors.map(([selection, odd, reason]) => ({ selection, odd, reason }))
  };
  fs.writeFileSync(path.join(ROOT, `data/readings/${match.slug}.json`), `${JSON.stringify(reading, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, `data/readings/${match.italianSlug}.json`), `${JSON.stringify(reading, null, 2)}\n`);
  fs.writeFileSync(path.join(ROOT, `letture/lettura-${match.italianSlug}.html`), render(match, picks, valueErrors));
  console.log(`Generata ${match.match}`);
}
