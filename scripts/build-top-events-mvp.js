const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputRoot = path.join(root, "data", "mvp");

const plans = {
  "brasile-giappone": {
    file: "brasile-giappone-quote.json",
    match: "Brasile - Giappone",
    context: {
      esito: {
        strength: "Brasile superiore per talento, profondità e forma recente.",
        risk: "Il precedente del 2025 e l'organizzazione giapponese aumentano il rischio sorpresa.",
      },
      goal: {
        strength: "L'analisi privilegia un punteggio controllato, con 2-1 e 2-0 come scenari centrali.",
        risk: "Un gol precoce può aprire la partita e cambiare rapidamente il ritmo.",
      },
      corner: {
        strength: "Proiezione di 9-12 corner, con Brasile previsto a 6-8.",
        risk: "Il volume dipende da quanto a lungo il Giappone riesce a tenere il blocco ordinato.",
      },
      tiri: {
        strength: "Brasile proiettato a 14-18 tiri; Vinícius, Cunha e Rayan sono i riferimenti offensivi.",
        risk: "Minutaggio, sostituzioni e andamento del punteggio possono ridurre i volumi individuali.",
      },
      cartellini: {
        strength: "Casemiro e i mediani giapponesi sono esposti alle transizioni e ai falli tattici.",
        risk: "La stima arbitrale è moderata e un dominio pulito del Brasile può ridurre i cartellini.",
      },
    },
    specs: [
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "1", "esito", "Brasile vincente nei tempi regolamentari."],
      ["DOPPIA CHANCE", /DOPPIA CHANCE/, "1X", "esito", "Copertura sul Brasile in una gara che l'analisi considera favorevole."],
      ["PASSAGGIO TURNO", /PASSAGGIO TURNO/, "1", "esito", "Brasile qualificato, coerente con il verdetto finale."],
      ["UNDER/OVER", /U\/O 3\.5$/, "UNDER", "goal", "Under 3,5 è il mercato gol preferito dall'analisi."],
      ["UNDER/OVER", /U\/O 2\.5$/, "UNDER", "goal", "Scenario compatibile con 2-0 o gara bloccata; più esposto del 3,5."],
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "GOAL", "goal", "Il 2-1 centrale e la pericolosità giapponese rendono il Goal plausibile."],
      ["U/O CORNER", /U\/O 8\.5 CORNER/, "OVER", "corner", "La proiezione totale 9-12 sostiene l'Over 8,5."],
      ["U/O CORNER", /U\/O 11\.5 CORNER/, "UNDER", "corner", "Copertura sul limite alto della proiezione 9-12."],
      ["U/O CORNER SQUADRA X", /U\/O 4\.5 CORNER SQUADRA 1/, "OVER", "corner", "Il Brasile è proiettato a 6-8 corner."],
      ["U/O CORNER SQUADRA X", /U\/O 5\.5 CORNER SQUADRA 1/, "OVER", "corner", "Linea vicina alla parte bassa della proiezione brasiliana."],
      ["U/O CORNER SQUADRA X", /U\/O 2\.5 CORNER SQUADRA 2/, "OVER", "corner", "Il Giappone è proiettato a 3-5 corner."],
      ["1X2 CORNER", /CALCI ANGOLO 1X2 T\.R\./, "1", "corner", "Il vantaggio territoriale rende il Brasile favorito nel confronto corner."],
      ["PRIMA A X CORNER", /PRIMA A 2 CALCI D'ANGOLO/, "TEAM 1", "corner", "Avvio territoriale brasiliano coerente con il copione atteso."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 13\.5 TIRI TOTALI/, "OVER", "tiri", "La proiezione Brasile 14-18 sostiene questa soglia."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 14\.5 TIRI TOTALI/, "OVER", "tiri", "Linea interna alla proiezione 14-18, con rischio medio."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 1: U\/O 4\.5 TIRI IN PORTA/, "OVER", "tiri", "Il Brasile è proiettato a 5-7 conclusioni nello specchio."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 7\.5 TIRI TOTALI/, "OVER", "tiri", "Il Giappone è proiettato a 8-11 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /VINICIUS JUNIOR U\/O 2\.5/, "OVER", "tiri", "Vinícius è il candidato principale a 3+ tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /VINICIUS JUNIOR U\/O 3\.5/, "OVER", "tiri", "Variante più aggressiva sul principale finalizzatore brasiliano."],
      ["U/O  TIRI IN PORTA GIOCATORE (DUO) INC PALI TRAVERSE INC TS", /VINICIUS JUNIOR U\/O 1\.5/, "OVER", "tiri", "Il ruolo di Vinícius sostiene almeno due conclusioni nello specchio o sui legni."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /MATHEUS CUNHA U\/O 2\.5/, "OVER", "tiri", "Cunha è indicato nella fascia 2-4 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /MATHEUS CUNHA U\/O 3\.5/, "OVER", "tiri", "Soglia alta ma ancora dentro la proiezione individuale."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /RAYAN U\/O 1\.5/, "OVER", "tiri", "Rayan è proiettato fra 2 e 4 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /RAYAN U\/O 2\.5/, "OVER", "tiri", "Linea centrale della proiezione 2-4."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /UEDA AYASE U\/O 1\.5/, "OVER", "tiri", "Ueda è il riferimento giapponese indicato per 2+ tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /UEDA AYASE U\/O 2\.5/, "OVER", "tiri", "Alternativa più ambiziosa sul terminale offensivo giapponese."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /DOAN R\. U\/O 1\.5/, "OVER", "tiri", "Doan è stimato nella fascia 1-3 tiri."],
      ["U/O  TIRI IN PORTA GIOCATORE (DUO) INC PALI TRAVERSE INC TS", /MATHEUS CUNHA U\/O 0\.5/, "OVER", "tiri", "Una conclusione nello specchio è coerente con la centralità di Cunha."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^CASEMIRO CARTELLINO/, "SI", "cartellini", "Casemiro è la prima scelta ammoniti dell'analisi."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^SANO K\. CARTELLINO/, "SI", "cartellini", "Sano è indicato tra i principali candidati giapponesi per i duelli centrali."],
    ],
  },
  "germania-paraguay": {
    file: "germania-paraguay-quote.json",
    match: "Germania - Paraguay",
    context: {
      esito: {
        strength: "Il divario tecnico, territoriale e produttivo è nettamente favorevole alla Germania.",
        risk: "Se il Paraguay mantiene lo 0-0 a lungo, pressione e nervosismo possono crescere.",
      },
      goal: {
        strength: "Il 2-0 è lo scenario centrale; l'Under 4,5 protegge sia il 3-0 sia il 3-1.",
        risk: "Il 4-1-4-1 con Ávalos aumenta la probabilità di un gol paraguayano e riduce la solidità del No Goal.",
      },
      corner: {
        strength: "Proiezione Germania 7-10 corner e Paraguay 1-3.",
        risk: "Un vantaggio tedesco molto precoce può ridurre la pressione territoriale nel finale.",
      },
      tiri: {
        strength: "Germania proiettata a 16-21 tiri; Havertz, Undav, Sané e Wirtz sono centrali, mentre Ávalos offre un riferimento al Paraguay.",
        risk: "Rotazioni offensive e punteggio già acquisito possono abbassare il minutaggio.",
      },
      cartellini: {
        strength: "Il Paraguay è esposto a molti duelli difensivi; Cubas, Cáceres e Alonso sono i nomi principali.",
        risk: "L'arbitro ha profilo medio e una partita poco combattuta può limitare le sanzioni.",
      },
    },
    specs: [
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "1", "esito", "Germania vincente, esito coerente con il divario indicato."],
      ["DOPPIA CHANCE", /DOPPIA CHANCE/, "1X", "esito", "Copertura prudente sulla favorita tedesca."],
      ["PASSAGGIO TURNO", /PASSAGGIO TURNO/, "1", "esito", "Germania qualificata, in linea con il verdetto dell'analisi."],
      ["UNDER/OVER", /U\/O 1\.5$/, "OVER", "goal", "La Germania è ritenuta in grado di segnare almeno due reti."],
      ["UNDER/OVER", /U\/O 2\.5$/, "UNDER", "goal", "Il 2-0 centrale rende l'Under 2,5 una variante prudente sul punteggio."],
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "GOAL", "goal", "Ávalos e il 4-1-4-1 rendono il gol paraguayano più credibile rispetto alla formazione prevista."],
      ["UNDER/OVER", /U\/O 4\.5$/, "UNDER", "goal", "Under 4,5 è il mercato gol preferito dopo le formazioni ufficiali."],
      ["U/O CORNER", /U\/O 8\.5 CORNER/, "OVER", "corner", "La proiezione totale 8-12 sostiene l'Over 8,5."],
      ["U/O CORNER", /U\/O 11\.5 CORNER/, "UNDER", "corner", "Il limite superiore della proiezione totale è 12."],
      ["U/O CORNER SQUADRA X", /U\/O 5\.5 CORNER SQUADRA 1/, "OVER", "corner", "Germania proiettata a 7-10 corner."],
      ["U/O CORNER SQUADRA X", /U\/O 6\.5 CORNER SQUADRA 1/, "OVER", "corner", "La linea 6,5 è immediatamente sotto la proiezione tedesca."],
      ["U/O CORNER SQUADRA X", /U\/O 3\.5 CORNER SQUADRA 2/, "UNDER", "corner", "Paraguay proiettato a 1-3 corner."],
      ["1X2 CORNER", /CALCI ANGOLO 1X2 T\.R\./, "1", "corner", "Il dominio territoriale favorisce la Germania nel confronto corner."],
      ["PRIMA A X CORNER", /PRIMA A 2 CALCI D'ANGOLO/, "TEAM 1", "corner", "Pressione tedesca attesa fin dai primi minuti."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 16\.5 TIRI TOTALI/, "OVER", "tiri", "Germania proiettata a 16-21 tiri: linea possibile ma non conservativa."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 17\.5 TIRI TOTALI/, "UNDER", "tiri", "L'assenza di Musiala abbassa il centro della proiezione tedesca a 16-21 tiri."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 1: U\/O 5\.5 TIRI IN PORTA/, "OVER", "tiri", "La proiezione tedesca è 6-8 tiri nello specchio."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /AVALOS G\. U\/O 1\.5/, "OVER", "tiri", "Ávalos titolare è il riferimento paraguayano indicato per 2+ tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /HAVERTZ K\. U\/O 2\.5/, "OVER", "tiri", "Havertz è proiettato a 3-5 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /HAVERTZ K\. U\/O 3\.5/, "OVER", "tiri", "Linea centrale della proiezione 3-5."],
      ["U/O  TIRI IN PORTA GIOCATORE (DUO) INC PALI TRAVERSE INC TS", /HAVERTZ K\. U\/O 1\.5/, "OVER", "tiri", "Havertz è il terminale principale dell'attacco tedesco."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /UNDAV D\. U\/O 2\.5/, "OVER", "tiri", "Undav titolare è stimato nella fascia 2-4 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /UNDAV D\. U\/O 3\.5/, "OVER", "tiri", "Variante più aggressiva sulla presenza aggiuntiva di Undav vicino a Havertz."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /SANE L\. U\/O 1\.5/, "OVER", "tiri", "Sané è stimato nella fascia 2-4 conclusioni."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /SANE L\. U\/O 2\.5/, "OVER", "tiri", "Linea centrale per un esterno chiamato ad attaccare il lato debole."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /WIRTZ F\. U\/O 1\.5/, "OVER", "tiri", "Wirtz è proiettato a 2-3 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /WIRTZ F\. U\/O 2\.5/, "OVER", "tiri", "Soglia alta ma ancora compresa nella proiezione individuale."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^CUBAS A\. CARTELLINO/, "SI", "cartellini", "Cubas è la prima scelta ammoniti dell'analisi."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^CACERES J\. CARTELLINO/, "SI", "cartellini", "Cáceres è esposto ai duelli laterali con gli esterni tedeschi."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^ALONSO J\. CARTELLINO/, "SI", "cartellini", "Alonso deve coprire Havertz e gli inserimenti centrali."],
    ],
  },
};

function findMarket(markets, [market, infoPattern, selection]) {
  return markets.find(item =>
    item.mercato === market &&
    infoPattern.test(String(item.info || "")) &&
    String(item.esito) === selection
  );
}

function build(plan) {
  const payload = JSON.parse(
    fs.readFileSync(path.join(root, "data", "quote", plan.file), "utf8")
  );
  const events = plan.specs.map(spec => {
    const source = findMarket(payload.markets, spec);
    if (!source) {
      throw new Error(`${plan.match}: mercato non trovato: ${spec[0]} / ${spec[1]} / ${spec[2]}`);
    }
    const category = spec[3];
    return {
      mercato: `${source.mercato} — ${source.info}`,
      selezione: source.esito,
      quota: Number(source.quota),
      categoria: category,
      motivo: spec[4],
      puntiDiForza: [plan.context[category].strength],
      possibiliCriticita: [plan.context[category].risk],
    };
  });

  if (events.length !== 30) throw new Error(`${plan.match}: attesi 30 eventi, trovati ${events.length}`);
  const destination = path.join(
    outputRoot,
    plan.file.replace(/-quote\.json$/i, ""),
    "top-events.json"
  );
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, `${JSON.stringify({ match: plan.match, events }, null, 2)}\n`, "utf8");
  console.log(`${plan.match}: 30 eventi -> ${path.relative(root, destination)}`);
}

Object.values(plans).forEach(build);
