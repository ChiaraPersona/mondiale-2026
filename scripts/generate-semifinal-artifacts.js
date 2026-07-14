const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const esc = (value) => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

const money = (value) => Number(value.toFixed(2));

const data = [
  {
    slug: "francia-spagna",
    matchId: "france-spain-2026-07-14",
    match: "Francia-Spagna",
    titleMatch: "Francia - Spagna",
    date: "14/07/2026 ore 21.00",
    displayDate: "14 luglio 2026, ore 21:00",
    round: "Semifinale",
    home: { name: "Francia", flag: "francia", formation: "4-2-3-1", line: "Maignan; Kounde, Upamecano, Saliba, Theo Hernandez; Tchouameni, Rabiot; Dembele, Olise, Doue; Mbappe.", pitch: [["Mbappe"], ["Dembele", "Olise", "Doue"], ["Tchouameni", "Rabiot"], ["Kounde", "Upamecano", "Saliba", "Theo"], ["Maignan"]] },
    away: { name: "Spagna", flag: "spagna", formation: "4-3-3", line: "Simon; Porro, Cubarsi, Laporte, Cucurella; Rodri, Fabian Ruiz, Olmo; Lamine Yamal, Oyarzabal, Nico Williams.", pitch: [["Oyarzabal"], ["Nico Williams", "Olmo", "Lamine Yamal"], ["Fabian Ruiz", "Rodri"], ["Cucurella", "Laporte", "Cubarsi", "Porro"], ["Simon"]] },
    headline: "La Francia ha piu strappi, la Spagna piu controllo: semifinale da dettagli, ritmo basso e colpi individuali.",
    deck: "A Dallas il tetto e la climatizzazione riducono quasi a zero caldo, umidita e temporali esterni. La partita quindi si sposta tutta su palleggio, transizioni e qualita nei trenta metri finali: Francia piu verticale, Spagna piu continua nel possesso.",
    scenario: "La Spagna puo tenere piu palla, ma la Francia ha il giocatore piu determinante se trova campo alle spalle dei terzini.",
    centralScore: "1-1, Spagna qualificata",
    basePick: "Spagna qualificata",
    baseSub: "Goal + Under 4,5 - Over tiri totali",
    probabilities: { home: 34, draw: 30, away: 36 },
    motivation: { home: 99, away: 99, risk: "Medio" },
    weather: "Dallas Stadium, denominazione FIFA dell'AT&T Stadium, Arlington. Altitudine circa 184 metri. Tetto retrattile e impianto climatizzato: con tetto chiuso temperatura interna attorno a 21-22 C, terreno stabile e impatto minimo di caldo, umidita, pioggia o vento.",
    stadium: "All'esterno sono attesi circa 32 C, umidita medio-alta e possibili temporali nel corso della giornata. La lettura assume condizioni interne controllate: gara tecnica, non condizionata dal meteo.",
    referee: "Ivan Barton (El Salvador)",
    refereeIntelligence: {
      name: "Ivan Barton",
      country: "El Salvador",
      assistants: ["David Moran", "Antonio Pupiro"],
      fourthOfficial: "Glenn Nyberg",
      profile: "Severita medio-alta: applica con decisione il regolamento FIFA, lascia giocare i contatti leggeri e punisce proteste, falli tattici e comportamento antisportivo quando la gara sale di intensita.",
      strengths: ["Regolamento FIFA applicato con fermezza", "Vantaggio lasciato sui contatti leggeri", "Buona disponibilita al supporto VAR", "Controllo deciso delle proteste"],
      favoredMarkets: ["Over 3,5 punti cartellini", "Entrambe almeno 1 punto cartellino", "Cartellino nel secondo tempo", "Ammonizione centrocampista", "Ammonizione difensore"],
      indicators: {
        refereeSeverity: "medio-alta",
        refereeDiscipline: "alta",
        refereeDialogue: "medio",
        refereeAdvantage: "medio",
        refereeVarConfidence: "alta",
        refereePenaltyBias: "media",
        refereeRedCardBias: "medio-alta"
      },
      adjustments: {
        secondHalfCardsBoost: 0.08,
        tacticalFoulsBoost: 0.07,
        dissentCardsBoost: 0.06,
        transitionCardsBoost: 0.07,
        rivalryAdjustment: 0.02,
        knockoutPressureAdjustment: 0.08,
        penaltyAdjustment: 0.01
      },
      forecast: {
        fouls: "23-28",
        cards: "4-6",
        penalty: "medio-bassa",
        redCard: "possibile ma non probabile"
      },
      modelImpact: "Aumenta leggermente cartellini nel secondo tempo, falli tattici, proteste e profili di centrocampo/difesa. Non aumenta artificialmente il rigore: Mbappe, Dembele, Lamine Yamal e Nico Williams restano il fattore primario."
    },
    lead: "Questa e una semifinale da leggere piu con la posizione che con il puro volume. La Spagna arriva con struttura, lato Yamal e capacita di tenere la palla anche nei momenti sporchi; la Francia arriva con Mbappe, Dembele e Olise, cioe con tre modi diversi di rompere una gara bloccata. Il risultato centrale resta 1-1, con Spagna avanti nella probabilita di qualificazione per continuita e gestione.",
    paragraphs: [
      "La Francia deve accettare fasi lunghe senza palla senza perdere aggressivita quando recupera. Se Mbappe riceve fronte alla porta o puo attaccare Cubarsi/Laporte in campo aperto, ogni transizione diventa una giocata da semifinale. Se invece la Spagna riesce a farla difendere bassa e larga, aumentano falli tattici, corner spagnoli e tiri da seconda linea.",
      "La Spagna deve evitare di trasformare il possesso in sterile sicurezza. Rodri e Fabian Ruiz sono il termometro: se puliscono la prima pressione, Lamine Yamal e Olmo possono ricevere tra le linee; se perdono il primo duello, la Francia corre meglio. Per questo la MyCombo non forza un segno secco nei novanta minuti: preferisce qualificazione, Goal controllato e mercati volume."
    ],
    form: "Peso alto alle partite a eliminazione diretta: Francia solida contro Marocco e Spagna matura contro Belgio. La semifinale riduce la distanza reale tra le squadre; il pareggio nei 90 resta molto vivo.",
    tacticalKey: "La chiave e il primo vantaggio territoriale: Spagna per possesso e corner, Francia per strappi e tiri in porta di Mbappe. Con ambiente climatizzato non c'e premio fisico al risparmio: chi tiene meglio le distanze puo alzare ritmo anche nella ripresa.",
    teamASection: "La Francia deve difendere in avanti quando puo e non lasciare a Rodri il tempo di girarsi. Rabiot e Tchouameni hanno una doppia funzione: proteggere il centro e liberare la prima uscita per Dembele/Olise. Se va sotto, ha abbastanza panchina per alzare il volume senza perdere talento.",
    teamBSection: "La Spagna deve manipolare il lato forte e poi cambiare gioco con pulizia. Lamine Yamal resta il punto di superiorita piu naturale, ma la vera partita e nel mezzo: Rodri, Fabian Ruiz e Olmo devono togliere alla Francia la possibilita di correre dopo ogni recupero.",
    shots: "Francia: 12-15 tiri, 4-6 in porta, 4-6 corner. Spagna: 13-16 tiri, 4-6 in porta, 4-7 corner. Proiezioni individuali: Mbappe 4-6 tiri e primo riferimento per tiri in porta; Lamine Yamal 2-4 tiri; Olise/Dembele 1-3; Oyarzabal 2-3.",
    cards: [
      ["Tchouameni", "Possibile primo ammonito", "Zona Rodri/Olmo: primo fallo tattico plausibile se la Spagna pulisce la pressione e la Francia deve fermare transizione centrale."],
      ["Cucurella", "Medio-alto", "Lato esposto agli strappi di Dembele e alle sovrapposizioni francesi."],
      ["Rodri", "Medio", "Dovra spezzare alcune transizioni francesi se il possesso si apre."],
      ["Theo Hernandez", "Medio", "Duello con Lamine Yamal: rischio intervento in ritardo se la Spagna isola il lato destro."],
      ["Fabian Ruiz", "Medio", "Pressione su Olise e seconde palle centrali: cartellino possibile se la gara diventa verticale."]
    ],
    valueErrors: [
      ["Pareggio nei 90 @ 3.20", "1X2 ESITO FINALE - X", "La lettura centrale resta 1-1: quota sopra 3 per lo scenario piu naturale nei tempi regolamentari."],
      ["Lamine Yamal migliore in campo @ 3.00", "MIGLIOR GIOCATORE IN CAMPO", "Prezzo minimo value per il giocatore che puo decidere ricevendo isolato sul lato forte spagnolo."],
      ["Over 4,5 punti cartellini @ 3.50", "U/O 4.5 PUNTI CARTELLINI - OVER", "Barton e la semifinale sostengono un finale disciplinare alto, ma resta mercato da sezione value."]
    ],
    quotePicks: {
      safe: [
        ["PASSAGGIO TURNO", "PASSAGGIO TURNO", "2", "Spagna qualificata"],
        ["GOAL/NOGOAL", "GOAL/NO GOAL", "GOAL", "Goal"],
        ["ENTRAMBE ALMENO X PUNTI CARTELLINI", "ENTRAMBE ALMENO 1 PUNTI CARTELLINI", "SI", "Entrambe almeno 1 punto cartellino"]
      ],
      balanced: [
        ["DRAW NO BET", "DRAW NO BET", "2", "Spagna Draw No Bet"],
        ["COMBO: GOAL/NOGOAL + U/O", "U/O 3.5 + GG/NG", "GOAL + UNDER", "Goal + Under 3,5"],
        ["U/O PUNTI CARTELLINI", "U/O 2.5 PUNTI CARTELLINI (MAX 2 PER GIOCATORE)", "OVER", "Over 2,5 punti cartellini"]
      ],
      aggressive: [
        ["DRAW NO BET", "DRAW NO BET", "2", "Spagna Draw No Bet"],
        ["COMBO: GOAL/NOGOAL + U/O", "U/O 4.5 + GG/NG", "GOAL + UNDER", "Goal + Under 4,5"],
        ["U/O TIRI TOTALI", "U/O 25.5 TIRI TOTALI", "OVER", "Over 25,5 tiri totali"],
        ["U/O PUNTI CARTELLINI", "U/O 3.5 PUNTI CARTELLINI (MAX 2 PER GIOCATORE)", "OVER", "Over 3,5 punti cartellini"],
        ["U/O CORNER", "U/O 10.5 CORNER", "UNDER", "Under 10,5 corner"]
      ]
    },
    quoteSummary: [["1", "2.35"], ["X", "3.20"], ["2", "3.10"], ["Passaggio Spagna", "2.20"], ["Goal", "1.60"]]
  },
  {
    slug: "inghilterra-argentina",
    matchId: "england-argentina-2026-07-15",
    match: "Inghilterra-Argentina",
    titleMatch: "Inghilterra - Argentina",
    date: "15/07/2026 ore 21.00",
    displayDate: "15 luglio 2026, ore 21:00",
    round: "Semifinale",
    home: { name: "Inghilterra", flag: "inghilterra", formation: "4-2-3-1", line: "Pickford; James, Stones, Guehi, Burn; Rice, Mainoo; Saka, Bellingham, Gordon; Kane.", pitch: [["Kane"], ["Gordon", "Bellingham", "Saka"], ["Rice", "Mainoo"], ["Burn", "Guehi", "Stones", "James"], ["Pickford"]] },
    away: { name: "Argentina", flag: "argentina", formation: "4-3-3", line: "Martinez; Molina, Romero, Lisandro Martinez, Tagliafico; De Paul, Enzo Fernandez, Mac Allister; Messi, Alvarez, Lautaro Martinez.", pitch: [["Alvarez"], ["Lautaro", "Messi"], ["Mac Allister", "Enzo", "De Paul"], ["Tagliafico", "Lisandro", "Romero", "Molina"], ["Martinez"]] },
    headline: "Inghilterra piu fisica, Argentina piu esperta: semifinale da margini stretti e momenti di campioni.",
    deck: "Ad Atlanta il Mercedes-Benz Stadium rende l'ambiente stabile se il tetto resta chiuso: umidita e temporali esterni pesano poco. Conta soprattutto la gestione emotiva: Kane e Bellingham contro Messi, Alvarez e Lautaro.",
    scenario: "L'Inghilterra ha piu struttura sui duelli, l'Argentina ha piu lettura dei momenti. Nei novanta minuti il margine e minimo.",
    centralScore: "2-1 Inghilterra",
    basePick: "Inghilterra qualificata",
    baseSub: "Goal + Under 4,5 - Over tiri totali",
    probabilities: { home: 38, draw: 29, away: 33 },
    motivation: { home: 99, away: 99, risk: "Medio-alto" },
    weather: "Mercedes-Benz Stadium, Atlanta. Altitudine circa 320 metri. Tetto retrattile e impianto climatizzato: con tetto chiuso condizioni interne molto stabili, circa 21-22 C, senza impatto rilevante di pioggia, vento o caldo.",
    stadium: "All'esterno sono attesi circa 30 C, umidita elevata, cielo variabile o nuvoloso e possibilita di pioggia o temporali. La lettura assume campo e temperatura interna controllati.",
    referee: "Ismail Elfath (USA)",
    refereeIntelligence: {
      name: "Ismail Elfath",
      country: "USA",
      assistants: ["Corey Parker", "Kyle Atkins"],
      fourthOfficial: "Maurizio Mariani",
      profile: "Severita media con forte capacita di gestione: dialoga molto, concede vantaggio, lascia correre nelle prime fasi e aumenta progressivamente la soglia disciplinare.",
      strengths: ["Dialogo alto con i giocatori", "Vantaggio concesso con continuita", "Esperienza VAR molto alta", "Decisioni importanti prese senza timore"],
      favoredMarkets: ["Over 3,5 punti cartellini", "Entrambe almeno 1 punto cartellino", "Piu cartellini dopo il 60'", "Argentina over 1,5 punti cartellini", "Rigore solo ad alta varianza"],
      indicators: {
        refereeSeverity: "media",
        refereeDiscipline: "media",
        refereeDialogue: "alta",
        refereeAdvantage: "alto",
        refereeVarConfidence: "molto alta",
        refereePenaltyBias: "medio-alta",
        refereeRedCardBias: "media"
      },
      adjustments: {
        secondHalfCardsBoost: 0.07,
        tacticalFoulsBoost: 0.06,
        dissentCardsBoost: 0.06,
        transitionCardsBoost: 0.05,
        rivalryAdjustment: 0.02,
        knockoutPressureAdjustment: 0.1,
        penaltyAdjustment: 0.04
      },
      forecast: {
        fouls: "22-27",
        cards: "4-6",
        penalty: "medio-alta",
        redCard: "possibile ma non probabile"
      },
      modelImpact: "Il contesto semifinale alza il rischio dopo il 60' e nel finale. Il rigore sale solo per profilo offensivo di Messi, Julian Alvarez, Saka, Bellingham, Kane e Palmer; nessun bias favorevole all'Argentina."
    },
    lead: "La partita ha due anime: Inghilterra piu verticale e fisica, Argentina piu elastica e capace di cambiare ritmo dentro la stessa azione. Il modello tiene l'Inghilterra appena avanti per struttura, palla inattiva e stato dei suoi leader offensivi, ma non cancella il peso argentino nei minuti finali.",
    paragraphs: [
      "Kane e Bellingham sono il centro della lettura inglese. Se l'Inghilterra riesce a portare Saka e Gordon in isolamento, l'Argentina deve scegliere se proteggere l'area o uscire forte sugli esterni. In entrambi i casi aumentano corner, tiri da seconda palla e falli tattici.",
      "L'Argentina ha piu talento nella gestione emotiva della gara: Messi puo abbassarsi, attirare pressione e liberare Alvarez o Lautaro. Il rischio per l'Inghilterra e difendere troppo presto un vantaggio; il rischio per l'Argentina e concedere fisicita e seconde palle a Rice, Bellingham e Kane."
    ],
    form: "Peso alto agli ultimi turni: Inghilterra sopravvissuta alla Norvegia con Bellingham decisivo, Argentina uscita forte dai supplementari contro la Svizzera. Le energie contano, ma in stadio climatizzato il fattore ambientale resta basso.",
    tacticalKey: "La chiave e chi controlla la zona tra trequarti e area. Se Bellingham riceve fronte alla porta, l'Inghilterra ha superiorita fisica; se Messi riceve tra le linee, l'Argentina puo rallentare e scegliere il colpo.",
    teamASection: "L'Inghilterra deve usare Kane come raccordo e finalizzatore, senza schiacciarlo solo contro i centrali argentini. Bellingham attacca il mezzo spazio, Rice protegge le transizioni e Saka forza uno contro uno che possono produrre corner e falli.",
    teamBSection: "L'Argentina deve sporcare il ritmo inglese. De Paul e Mac Allister sono fondamentali per non lasciare Rice libero di guidare il primo passaggio; Messi deve poter ricevere senza dover partire troppo lontano dalla porta. Alvarez e Lautaro danno profondita e presenza in area.",
    shots: "Inghilterra: 12-15 tiri, 4-6 in porta, 4-6 corner. Argentina: 11-14 tiri, 3-5 in porta, 4-6 corner. Proiezioni individuali: Kane 3-5 tiri, Bellingham 2-4, Messi 3-5, Alvarez/Lautaro 2-4 complessivi.",
    cards: [
      ["Romero", "Possibile primo ammonito", "Duelli diretti con Kane e attacchi inglesi sulle seconde palle: primo intervento forte molto plausibile."],
      ["Rice", "Medio-alto", "Possibile fallo tattico su Messi o ripartenze centrali."],
      ["De Paul", "Medio", "Pressione e duelli ripetuti con Bellingham e Gordon."],
      ["Tagliafico", "Medio", "Lato Saka/James: rischio cartellino se l'Inghilterra carica la corsia."],
      ["Bellingham", "Medio", "Pressing e proteste in gara emotiva: rischio disciplinare se l'Argentina abbassa il ritmo."]
    ],
    valueErrors: [
      ["Bellingham migliore in campo @ 3.75", "MIGLIOR GIOCATORE IN CAMPO", "Quota alta per il giocatore che puo decidere sia rifinitura sia inserimento."],
      ["Kane marcatore 1T @ 4.40", "KANE H. MARCATORE 1T", "Prezzo da errore se l'Inghilterra parte forte e attacca l'area su cross e piazzati."],
      ["Over 27,5 tiri totali @ 3.25", "U/O 27.5 TIRI TOTALI - OVER", "Linea alta ma prezzo largo per una gara con due squadre obbligate a produrre."]
    ],
    quotePicks: {
      safe: [
        ["PASSAGGIO TURNO", "PASSAGGIO TURNO", "1", "Inghilterra qualificata"],
        ["COMBO: GOAL/NOGOAL + U/O", "U/O 4.5 + GG/NG", "GOAL + UNDER", "Goal + Under 4,5"],
        ["ENTRAMBE ALMENO X PUNTI CARTELLINI", "ENTRAMBE ALMENO 1 PUNTI CARTELLINI", "SI", "Entrambe almeno 1 punto cartellino"]
      ],
      balanced: [
        ["DRAW NO BET", "DRAW NO BET", "1", "Inghilterra Draw No Bet"],
        ["COMBO: GOAL/NOGOAL + U/O", "U/O 3.5 + GG/NG", "GOAL + UNDER", "Goal + Under 3,5"],
        ["U/O PUNTI CARTELLINI", "U/O 3.5 PUNTI CARTELLINI (MAX 2 PER GIOCATORE)", "OVER", "Over 3,5 punti cartellini"]
      ],
      aggressive: [
        ["DRAW NO BET", "DRAW NO BET", "1", "Inghilterra Draw No Bet"],
        ["COMBO: GOAL/NOGOAL + U/O", "U/O 4.5 + GG/NG", "GOAL + UNDER", "Goal + Under 4,5"],
        ["U/O TIRI TOTALI", "U/O 24.5 TIRI TOTALI", "OVER", "Over 24,5 tiri totali"],
        ["U/O PUNTI CARTELLINI", "U/O 3.5 PUNTI CARTELLINI (MAX 2 PER GIOCATORE)", "OVER", "Over 3,5 punti cartellini"],
        ["U/O CORNER", "U/O 10.5 CORNER", "UNDER", "Under 10,5 corner"]
      ]
    },
    quoteSummary: [["1", "2.60"], ["X", "3.00"], ["2", "3.00"], ["Passaggio Inghilterra", "1.75"], ["Goal", "1.90"]]
  }
];

function quotePath(slug) {
  return path.join(root, "data", "quote", `${slug}-quote.json`);
}

function readQuote(slug) {
  return JSON.parse(fs.readFileSync(quotePath(slug), "utf8"));
}

function findEvent(markets, market, info, selection) {
  const hit = markets.find((item) =>
    item.mercato === market &&
    item.info === info &&
    item.esito === selection &&
    Number(item.quota) > 1
  );
  if (!hit) throw new Error(`Missing quote: ${market} | ${info} | ${selection}`);
  return hit;
}

function isRefereeMarket(event) {
  return /CARTELLINI|CARTELLINO|FALLI|RIGORE|ESPULSIONE/i.test(`${event.market} ${event.info}`);
}

function eventFromQuote(hit, displayName, reason, risk) {
  const base = {
    id: `event-${hit.selectionId}`,
    market: hit.mercato,
    info: hit.info,
    selection: hit.esito,
    odds: Number(hit.quota),
    selectionId: hit.selectionId,
    marketId: hit.marketId,
    category: /CARTELL|FALLI|ESPULS/.test(`${hit.mercato} ${hit.info}`) ? "cartellini" : /TIRI|CORNER/.test(hit.info) ? "volume" : "esito",
    class: Number(hit.quota) >= 3 ? "VALUE" : "CORE",
    reason,
    statEvidence: {
      type: "semifinal reading",
      source: "lettura tecnica, quote Sisal e dati torneo",
      confidence: "medium",
      reason
    },
    confidence: "medium",
    riskWarning: risk,
    whyIncluded: reason,
    displayName,
    marketType: hit.mercato
  };
  if (isRefereeMarket(base)) {
    base.refereeInfluence = {
      layer: "Referee Intelligence",
      impact: "limited",
      rankingBoost: 6,
      reason: "Aggiunge supporto disciplinare senza sovrascrivere scenario tecnico, quote e dati squadra."
    };
  }
  return base;
}

function buildPortfolio(name, picks, quote, reason, risk) {
  const events = picks.map(([market, info, selection, displayName]) =>
    eventFromQuote(findEvent(quote.markets, market, info, selection), displayName, reason, risk)
  );
  const finalOdds = money(events.reduce((total, event) => total * Number(event.odds), 1));
  return {
    name,
    events,
    finalOdds,
    targetOdds: name === "Safe" ? "circa 5" : name === "Balanced" ? "circa 10" : "circa 20",
    averageRisk: name === "Safe" ? "medio" : name === "Balanced" ? "medio-alto" : "alto",
    motivation: reason
  };
}

function article(config, portfolios) {
  const comboRows = portfolios.map((portfolio) => `<div><b>${esc(portfolio.name)} <em>@ ${portfolio.finalOdds.toFixed(2)}</em></b><small>${portfolio.events.map((event) => `${esc(event.displayName)} @${event.odds}`).join(" &middot; ")}</small></div>`).join("");
  const quoteRows = config.quoteSummary.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("");
  const cards = config.cards.map(([name, risk, text]) => `<li><b>${esc(name)}</b><strong>${esc(risk)}</strong><small>${esc(text)}</small></li>`).join("");
  const values = config.valueErrors.map(([name, market, text]) => `<li><b>${esc(name)}</b><span>${esc(market)}</span><small>${esc(text)}</small></li>`).join("");
  const referee = config.refereeIntelligence;
  const refereeMarkets = referee.favoredMarkets.map((item) => `<li>${esc(item)}</li>`).join("");
  const refereeStrengths = referee.strengths.map((item) => `<li>${esc(item)}</li>`).join("");
  const refereeStats = [
    ["Severita", referee.indicators.refereeSeverity],
    ["VAR", referee.indicators.refereeVarConfidence],
    ["Disciplina", referee.indicators.refereeDiscipline],
    ["Falli previsti", referee.forecast.fouls],
    ["Cartellini previsti", referee.forecast.cards],
    ["Rigore", referee.forecast.penalty],
    ["Espulsione", referee.forecast.redCard]
  ].map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join("");
  const formation = (team) => `<article class="match-formation-card"><header><img src="flags/${team.flag}.svg" alt=""><div><strong>${esc(team.name)}</strong><span>Modulo ${esc(team.formation)} &middot; probabile</span></div></header><div class="football-pitch" aria-label="Formazione probabile ${esc(team.name)}">${team.pitch.map((row) => `<div class="pitch-row">${row.map((name) => `<span>${esc(name)}</span>`).join("")}</div>`).join("")}</div><div class="formation-bench"><b>Nota</b><span>Formazione probabile: da aggiornare alle ufficiali.</span></div></article>`;

  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <base href="../">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Lettura ${esc(config.match)}</title>
  <link rel="stylesheet" href="css/styles.css?v=20260714-semifinals">
</head>
<body class="reading-page">
<header><div class="topbar"><img class="site-emblem" src="assets/world-cup-2026-logo.png" alt=""><div><h1>Lettura</h1><p class="sub">Pronostici raccontati come una partita, prima che cominci.</p></div></div><nav class="page-links" aria-label="Sezioni"><a class="page-link" href="index.html">Home</a><a class="page-link" href="statistiche-squadre.html">Statistiche squadre</a><a class="page-link" href="arbitri.html">Arbitri</a><a class="page-link active" href="lettura.html">Lettura</a><a class="page-link" href="storia.html">Storia</a><a class="page-link utility-link" href="metodo-fonti.html">Metodo e fonti</a></nav></header>
<main class="reading-main"><nav class="reading-article-nav"><a href="lettura.html">Tutte le letture</a></nav><article class="reading-article" data-mycombo-slug="${esc(config.matchId)}">
<header class="reading-hero"><div class="reading-kicker">${esc(config.round)} &middot; Scheda prepartita</div><div class="reading-match"><div class="reading-team"><img src="flags/${config.home.flag}.svg" alt=""><strong>${esc(config.home.name)}</strong></div><div class="reading-versus"><b>${esc(config.titleMatch)}</b><small>Mondiale 2026 &middot; ${esc(config.displayDate)}</small></div><div class="reading-team is-away"><img src="flags/${config.away.flag}.svg" alt=""><strong>${esc(config.away.name)}</strong></div></div><h2>${esc(config.headline)}</h2><p class="reading-deck">${esc(config.deck)}</p><div class="reading-meta"><span>Arbitro: ${esc(config.referee)}</span><span>Risultato centrale: ${esc(config.centralScore)}</span><span>MyCombo: pubblicate</span></div></header>
<section class="reading-summary"><div><span>Risultato centrale</span><strong>${esc(config.centralScore)}</strong><small>Stima indipendente dalle quote</small></div><div><span>Scenario</span><strong>${esc(config.scenario)}</strong><small>La direzione principale della lettura</small></div><div><span>Scelta base</span><strong>${esc(config.basePick)}</strong><small>${esc(config.baseSub)}</small></div></section>
<div class="round16-info-grid"><section class="round16-info-box round16-formations"><span>1</span><h2>Formazioni probabili</h2><div class="round16-formation"><h3>${esc(config.home.name)} <span>${esc(config.home.formation)}</span></h3><p>${esc(config.home.line)}</p><small>Probabile, da aggiornare alle ufficiali.</small></div><div class="round16-formation"><h3>${esc(config.away.name)} <span>${esc(config.away.formation)}</span></h3><p>${esc(config.away.line)}</p><small>Probabile, da aggiornare alle ufficiali.</small></div></section><section class="round16-info-box"><span>2</span><h2>Meteo</h2><p>${esc(config.weather)}</p></section><section class="round16-info-box"><span>3</span><h2>Stadio</h2><p>${esc(config.stadium)}</p></section><section class="round16-info-box"><span>4</span><h2>Referee Intelligence</h2><p><strong>${esc(config.referee)}</strong></p><p>${esc(referee.profile)}</p><div class="round16-severity"><span>Severita</span><strong>${esc(referee.indicators.refereeSeverity)}</strong></div></section></div>
<div class="reading-layout"><div class="reading-copy"><section><p class="reading-lead">${esc(config.lead)}</p>${config.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}<p>Le probabilita stimate nei novanta minuti sono ${config.probabilities.home}% ${esc(config.home.name)}, ${config.probabilities.draw}% pareggio e ${config.probabilities.away}% ${esc(config.away.name)}. Le quote vengono confrontate con questa distribuzione soltanto dopo la costruzione dello scenario.</p></section><section><h3>Forma e precedenti pesati</h3><p>${esc(config.form)}</p><p>Non do peso decisivo ai precedenti lontani: rose, cicli tecnici e contesto mondiale rendono piu affidabili forma recente, qualita degli undici, compatibilita tattica e dati delle partite gia giocate.</p></section><section class="match-formations"><h3>Formazioni probabili</h3><div class="match-formation-grid">${formation(config.home)}${formation(config.away)}</div><p class="formation-disclaimer">Le formazioni sono probabili: le MyCombo usano mercati squadra e giocatore con prudenza fino alle ufficiali.</p></section><section><h3>La partita di ${esc(config.home.name)}</h3><p>${esc(config.teamASection)}</p></section><blockquote><strong>La chiave</strong>${esc(config.tacticalKey)}</blockquote><section><h3>La partita di ${esc(config.away.name)}</h3><p>${esc(config.teamBSection)}</p></section><section><h3>Referee Intelligence</h3><p>${esc(referee.modelImpact)}</p><p><strong>Mercati favoriti dall'arbitraggio:</strong> ${esc(referee.favoredMarkets.join(", "))}.</p></section><section><h3>Stato motivazionale playoff</h3><p><strong>${esc(config.home.name)} ${config.motivation.home}/100.</strong> Motivazione massima da semifinale mondiale.</p><p><strong>${esc(config.away.name)} ${config.motivation.away}/100.</strong> Pressione competitiva altissima e margine minimo per gli errori.</p><p>Rischio sorpresa: <strong>${esc(config.motivation.risk)}</strong>. La qualita delle due squadre rende il dettaglio piu importante del nome favorito.</p></section><section><h3>Tiri e corner previsti</h3><p>${esc(config.shots)}</p><p>Le analisi dei calciatori servono come filtro per MyCombo: volume tiri, tiri in porta, falli commessi/subiti e probabilita di minutaggio. Non trasformo pero la lettura in una tabella tecnica: il pronostico resta prima di tutto una lettura del copione partita.</p></section><section><h3>Possibili ammoniti</h3><p>La gerarchia combina ruolo, zona di campo, avversario diretto e profilo arbitrale; i singoli restano piu volatili dei mercati squadra.</p><ol class="reading-card-ranking">${cards}</ol></section><blockquote><strong>La scelta</strong>${esc(config.basePick)} &middot; ${esc(config.baseSub)}</blockquote><section><h3>Verdetto preliminare</h3><p>La Safe resta vicina allo scenario principale; la Balanced aggiunge un mercato disciplinare sostenuto dal nuovo layer arbitrale; l'Aggressive accetta piu varianza ma rimane dentro mercati realmente presenti nelle quote Sisal. Gli errori di quota sono riportati sotto le MyCombo.</p></section></div><aside class="reading-sidebar"><section class="reading-data-panel"><span>Probabilita nei 90 minuti</span><div class="reading-probability"><div><b>${config.probabilities.home}%</b><small>${esc(config.home.name)}</small></div><div><b>${config.probabilities.draw}%</b><small>Pareggio</small></div><div><b>${config.probabilities.away}%</b><small>${esc(config.away.name)}</small></div></div></section><section class="reading-data-panel"><span>Stato motivazionale</span><dl class="reading-stat-list"><div><dt>${esc(config.home.name)}</dt><dd>${config.motivation.home}/100</dd></div><div><dt>${esc(config.away.name)}</dt><dd>${config.motivation.away}/100</dd></div><div><dt>Rischio sorpresa</dt><dd>${esc(config.motivation.risk)}</dd></div></dl></section><section class="reading-data-panel"><span>Arbitro</span><dl class="reading-stat-list">${refereeStats}</dl></section><section class="reading-data-panel"><span>Punti forti arbitraggio</span><ul class="reading-picks">${refereeStrengths}</ul></section><section class="reading-data-panel"><span>Mercati favoriti arbitro</span><ul class="reading-picks">${refereeMarkets}</ul></section><section class="reading-data-panel"><span>Volume previsto</span><dl class="reading-stat-list"><div><dt>${esc(config.home.name)}</dt><dd>12-15 tiri</dd></div><div><dt>${esc(config.away.name)}</dt><dd>11-16 tiri</dd></div><div><dt>Totale</dt><dd>24-30 tiri</dd></div></dl></section><section class="reading-data-panel"><span>Gerarchia ammoniti</span><ol class="reading-card-ranking">${cards}</ol></section><section class="reading-data-panel"><span>Gerarchia giocate</span><ol class="reading-card-ranking"><li><b>1. ${esc(config.basePick)}</b><small>Scelta principale</small></li><li><b>2. ${esc(config.baseSub)}</b><small>Mercati complementari</small></li><li><b>3. Over punti cartellini</b><small>Mercato disciplinare</small></li></ol></section><section class="reading-data-panel"><span>Metodo</span><p>Scenario e probabilita nascono da qualita, assetto tattico, forma, ambiente, referee intelligence e quote usate solo dopo per valutare il prezzo.</p></section><section class="reading-data-panel"><span>Quote ricevute</span><dl class="reading-stat-list">${quoteRows}</dl></section><section class="reading-data-panel"><span>MyCombo &middot; quote aggiornate</span><div class="reading-mycombo">${comboRows}</div></section><section class="reading-data-panel"><span>3 possibili errori di quota</span><ul class="reading-picks">${values}</ul></section></aside></div><footer class="reading-note"><strong>Nota</strong><p>Le MyCombo sono generate da mercati reali Sisal presenti in data/quote. Il layer arbitrale sposta solo leggermente ranking e motivazione dei mercati disciplinari, senza sovrascrivere dati squadra, calciatori e scenario tecnico.</p></footer></article></main><script src="js/nav.js?v=20260714-referee-intel"></script></body></html>
`;
}

function readingJson(config, portfolios) {
  return {
    matchId: config.matchId,
    match: config.match,
    round: config.round,
    date: config.date,
    status: "ready",
    sourceQuote: `data/quote/${config.slug}-quote.json`,
    prediction: {
      centralScore: config.centralScore,
      basePick: config.basePick,
      probabilities: config.probabilities,
      scenario: config.scenario
    },
    environment: {
      weather: config.weather,
      stadium: config.stadium
    },
    referee: {
      name: config.refereeIntelligence.name,
      country: config.refereeIntelligence.country,
      assistants: config.refereeIntelligence.assistants,
      fourthOfficial: config.refereeIntelligence.fourthOfficial
    },
    refereeIntelligence: config.refereeIntelligence,
    formations: {
      [config.home.name]: config.home.line,
      [config.away.name]: config.away.line
    },
    cardHierarchy: config.cards.map(([player, risk, note], index) => ({
      rank: index + 1,
      player,
      risk,
      note,
      possibleFirstBooked: index === 0
    })),
    portfolios: portfolios.map((portfolio) => ({
      name: portfolio.name,
      finalOdds: portfolio.finalOdds,
      events: portfolio.events.map((event) => ({
        displayName: event.displayName,
        market: event.market,
        info: event.info,
        selection: event.selection,
        odds: event.odds,
        selectionId: event.selectionId,
        marketId: event.marketId
      }))
    }))
  };
}

function myComboJson(config, quote, portfolios) {
  const payload = {
    matchId: config.matchId,
    match: config.match,
    date: config.date,
    completion: 100,
    status: "ready",
    sourceQuote: `data/quote/${config.slug}-quote.json`,
    sourceReading: `data/readings/${config.matchId}.json`,
    sourcePlayerStats: "data/active/team-stats-data.js",
    refereeIntelligence: config.refereeIntelligence,
    safe: portfolios[0],
    balanced: portfolios[1],
    aggressive: portfolios[2],
    portfolios,
    topEvents: portfolios.flatMap((portfolio) => portfolio.events).slice(0, 8),
    quoteErrorAnalysis: {
      generatedAt: new Date().toISOString(),
      model: "semifinal-reading-v1",
      events: config.valueErrors.map(([displayName, market, reason], index) => ({
        id: `${config.slug}-quote-error-${index + 1}`,
        displayName,
        market,
        reason,
        minimumOdds: 3,
        sourceQuote: `data/quote/${config.slug}-quote.json`
      }))
    },
    qualityNotes: [
      `Quote flat rows lette: ${quote.totalMarkets}`,
      "Ambiente stadio incluso nella lettura.",
      "Referee Intelligence integrata con peso limitato sui mercati disciplinari.",
      "Formazioni probabili da aggiornare alle ufficiali."
    ]
  };
  return payload;
}

for (const config of data) {
  const quote = readQuote(config.slug);
  const portfolios = [
    buildPortfolio("Safe", config.quotePicks.safe, quote, "Coerente con lo scenario principale della semifinale; il mercato disciplinare riceve solo un supporto leggero dal profilo arbitrale.", "Evento correlato allo scenario principale."),
    buildPortfolio("Balanced", config.quotePicks.balanced, quote, "Aggiunge disciplina senza uscire dal copione tecnico: arbitro e pressione semifinale sostengono cartellini, non cambiano il pronostico.", "Portafoglio con correlazione moderata tra esito, gol e disciplina."),
    buildPortfolio("Aggressive", config.quotePicks.aggressive, quote, "Cerca prezzo alto su lettura di gara stretta e su profili ammonizione coerenti con duelli e arbitro.", "Alta varianza: usare solo come giocata aggressiva.")
  ];

  fs.writeFileSync(path.join(root, "data", "mycombo", `${config.matchId}.json`), JSON.stringify(myComboJson(config, quote, portfolios), null, 2) + "\n");
  fs.writeFileSync(path.join(root, "data", "mycombo", `${config.slug}.json`), JSON.stringify(myComboJson(config, quote, portfolios), null, 2) + "\n");
  fs.writeFileSync(path.join(root, "data", "readings", `${config.matchId}.json`), JSON.stringify(readingJson(config, portfolios), null, 2) + "\n");
  fs.writeFileSync(path.join(root, "letture", `lettura-${config.slug}.html`), article(config, portfolios));
  console.log(`${config.slug}: ${portfolios.map((item) => `${item.name} @${item.finalOdds}`).join(", ")}`);
}
