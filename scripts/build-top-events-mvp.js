const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const outputRoot = path.join(root, "data", "mvp");
const requestedMatch = process.argv[2];

const plans = {
  "olanda-marocco": {
    file: "olanda-marocco-quote.json",
    match: "Olanda - Marocco",
    context: {
      esito: {
        strength: "Partita equilibrata: l'Olanda ha un vantaggio contenuto, mentre il pareggio resta centrale nella lettura.",
        risk: "Il Marocco ha struttura e qualità nelle transizioni sufficienti per impedire un esito netto.",
      },
      goal: {
        strength: "Il risultato guida 1-1 e la proiezione contenuta sostengono Under 3,5 e Under 2,5.",
        risk: "Il Goal resta plausibile: un gol precoce può rendere la partita più aperta.",
      },
      corner: {
        strength: "La proiezione complessiva di 9-11 corner sostiene le linee centrali del mercato.",
        risk: "Non emerge un vantaggio territoriale abbastanza ampio per forzare i corner di una singola squadra.",
      },
      tiri: {
        strength: "Olanda 11-15 tiri e Marocco 9-13; Brobbey, Malen, Saibari e Brahim Diaz sono i riferimenti più coerenti.",
        risk: "I mercati individuali dipendono da titolarità, ruolo, minutaggio e sostituzioni.",
      },
      cartellini: {
        strength: "Bouaddi e De Jong sono esposti ai duelli centrali in una gara a eliminazione diretta.",
        risk: "Il cartellino individuale resta un evento ad alta varianza, sensibile alle decisioni arbitrali.",
      },
    },
    specs: [
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "X", "esito", "Il pareggio è l'esito guida della lettura nei tempi regolamentari."],
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "1", "esito", "L'Olanda parte con un vantaggio contenuto nei tempi regolamentari."],
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "2", "esito", "Il successo del Marocco rappresenta lo scenario alternativo indicato dalla lettura."],
      ["DOPPIA CHANCE", /DOPPIA CHANCE MULTIESITI/, "1X", "esito", "Copertura prudente sull'Olanda in una partita molto equilibrata."],
      ["PASSAGGIO TURNO", /PASSAGGIO TURNO/, "1", "esito", "L'Olanda conserva un vantaggio contenuto nella qualificazione."],
      ["PASSAGGIO TURNO", /PASSAGGIO TURNO/, "2", "esito", "Il Marocco conserva possibilità concrete di qualificazione in una gara equilibrata."],
      ["UNDER/OVER", /U\/O 3\.5$/, "UNDER", "goal", "Under 3,5 protegge gli scenari centrali 1-0, 1-1 e 1-2."],
      ["UNDER/OVER", /U\/O 2\.5$/, "UNDER", "goal", "Under 2,5 è la linea principale indicata dallo studio."],
      ["MULTIGOAL", /MULTIGOAL MULTIESITI 16 ESITI/, "2-4", "goal", "Il Multigol 2-4 concilia il risultato guida 1-1 con l'incertezza sulla soglia dei 2,5 gol."],
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "GOAL", "goal", "Il risultato guida 1-1 rende il Goal coerente pur in una gara contenuta."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "OVER", "corner", "La proiezione di 9-11 corner sostiene l'Over 8,5."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "UNDER", "corner", "Scenario prudente se la partita resta bloccata e con pochi attacchi completati."],
      ["U/O CORNER", /U\/O 10\.5 CORNER$/, "UNDER", "corner", "La parte alta della proiezione sostiene l'Under 10,5."],
      ["U/O CORNER", /U\/O 10\.5 CORNER$/, "OVER", "corner", "Variante aggressiva sulla parte superiore della proiezione corner."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 10\.5 TIRI TOTALI/, "OVER", "tiri", "L'Olanda è proiettata a 11-15 tiri totali."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 11\.5 TIRI TOTALI/, "OVER", "tiri", "Soglia interna alla proiezione olandese di 11-15 tiri."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 1: U\/O 3\.5 TIRI IN PORTA/, "OVER", "tiri", "La proiezione olandese di 4-6 tiri in porta sostiene la soglia."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 8\.5 TIRI TOTALI/, "OVER", "tiri", "Il Marocco è proiettato a 9-13 tiri totali."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 9\.5 TIRI TOTALI/, "OVER", "tiri", "Soglia interna alla proiezione marocchina di 9-13 tiri."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 2: U\/O 3\.5 TIRI IN PORTA/, "OVER", "tiri", "La proiezione marocchina di 3-5 tiri in porta rende la linea plausibile."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /BROBBEY B\. U\/O 1\.5/, "OVER", "tiri", "Brobbey è indicato nella fascia 2-4 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /BROBBEY B\. U\/O 2\.5/, "OVER", "tiri", "Variante più aggressiva sul riferimento centrale olandese."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /GAKPO C\. U\/O 1\.5/, "OVER", "tiri", "Gakpo è titolare alle spalle di Brobbey e può produrre almeno due tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /GAKPO C\. U\/O 2\.5/, "OVER", "tiri", "Variante più aggressiva sul volume di Gakpo nel 3-4-2-1 ufficiale."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /SAIBARI I\. U\/O 1\.5/, "OVER", "tiri", "Saibari è il riferimento marocchino indicato per 2+ tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /SAIBARI I\. U\/O 2\.5/, "OVER", "tiri", "Variante più ambiziosa sulla proiezione 2-4 di Saibari."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /BRAHIM DIAZ U\/O 1\.5/, "OVER", "tiri", "Brahim Diaz è proiettato nella fascia 2-3 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /BRAHIM DIAZ U\/O 2\.5/, "OVER", "tiri", "Variante più aggressiva sulla proiezione individuale di Brahim Diaz."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^BOUADDI A\. CARTELLINO/, "SI", "cartellini", "Bouaddi è la prima scelta ammoniti dello studio."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^DE JONG FRENKIE CARTELLINO/, "SI", "cartellini", "De Jong è la prima alternativa nei duelli centrali."],
    ],
  },
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
  "francia-svezia": {
    file: "francia-svezia-quote.json",
    match: "Francia - Svezia",
    context: {
      esito: {
        strength: "La Francia ha un vantaggio netto per qualità, profondità e produzione offensiva; il 3-1 è il risultato guida.",
        risk: "Il 3-4-3 svedese conserva una minaccia concreta con Isak, Gyökeres ed Elanga.",
      },
      goal: {
        strength: "Il risultato guida 3-1 e gli undici offensivi sostengono Over 2,5 e almeno una rete svedese.",
        risk: "Tchouaméni aumenta la protezione francese e può riportare la gara verso uno scenario da porta inviolata.",
      },
      corner: {
        strength: "La proiezione di 9-13 corner, con forte pressione francese, sostiene le linee centrali.",
        risk: "Un vantaggio francese precoce può ridurre ritmo e volume nella ripresa.",
      },
      tiri: {
        strength: "Francia 18-23 tiri e Svezia 6-9; Mbappé, Dembélé, Barcola, Olise, Isak e Gyökeres sono i riferimenti.",
        risk: "Rotazioni, sostituzioni e punteggio acquisito possono ridurre i volumi individuali.",
      },
      cartellini: {
        strength: "Lagerbielke e Karlström sono esposti alle accelerazioni francesi e ai falli tattici.",
        risk: "Makkelie ha una media contenuta di 3,31 gialli, quindi i cartellini individuali restano selezioni prudenti.",
      },
    },
    specs: [
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "1", "esito", "Francia vincente, coerente con il divario tecnico e il 3-1 guida."],
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "X", "esito", "Il pareggio è lo scenario alternativo se la Francia non converte il volume."],
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "2", "esito", "Successo svedese come scenario sorpresa ad alta quota."],
      ["DOPPIA CHANCE", /DOPPIA CHANCE MULTIESITI/, "1X", "esito", "Copertura molto prudente sulla Francia."],
      ["PASSAGGIO TURNO", /PASSAGGIO TURNO/, "1", "esito", "Francia qualificata, in linea con il verdetto della lettura."],
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "GOAL", "goal", "Il 3-1 centrale e il tridente svedese sostengono entrambe a segno."],
      ["UNDER/OVER", /U\/O 2\.5$/, "OVER", "goal", "La Francia può produrre da sola gran parte della linea."],
      ["UNDER/OVER", /U\/O 2\.5$/, "UNDER", "goal", "Copertura se Tchouaméni e il controllo francese comprimono la gara."],
      ["UNDER/OVER", /U\/O 3\.5$/, "OVER", "goal", "Il 3-1 guida contiene quattro reti."],
      ["UNDER/OVER", /U\/O 3\.5$/, "UNDER", "goal", "Protegge gli scenari alternativi 2-0 e 3-0."],
      ["UNDER/OVER", /U\/O 4\.5$/, "UNDER", "goal", "Linea larga coerente con tutti gli scenari principali."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "OVER", "corner", "La proiezione totale 9-13 sostiene l'Over 8,5."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "UNDER", "corner", "Variante prudente se la Svezia non riesce a uscire."],
      ["U/O CORNER", /U\/O 10\.5 CORNER$/, "OVER", "corner", "Variante sulla parte alta della proiezione totale."],
      ["U/O CORNER", /U\/O 10\.5 CORNER$/, "UNDER", "corner", "Copertura sulla zona centrale della proiezione corner."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 15\.5 TIRI TOTALI/, "OVER", "tiri", "Francia proiettata a 18-23 tiri."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 16\.5 TIRI TOTALI/, "OVER", "tiri", "Linea sotto la proiezione francese."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 1: U\/O 6\.5 TIRI IN PORTA/, "OVER", "tiri", "Francia proiettata a 7-10 tiri nello specchio."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 6\.5 TIRI TOTALI/, "OVER", "tiri", "Svezia proiettata a 6-9 conclusioni."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 7\.5 TIRI TOTALI/, "OVER", "tiri", "Linea centrale della proiezione svedese."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 2: U\/O 2\.5 TIRI IN PORTA/, "OVER", "tiri", "Isak e Gyökeres rendono plausibili almeno tre tiri in porta."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /MBAPPE K\. U\/O 3\.5/, "OVER", "tiri", "Mbappé è proiettato a 4-6 tiri."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /MBAPPE K\. U\/O 4\.5/, "OVER", "tiri", "Variante aggressiva sul principale terminale francese."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /DEMBELE OUSMANE U\/O 2\.5/, "OVER", "tiri", "Dembélé è proiettato a 2-4 conclusioni."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /BARCOLA B\. U\/O 1\.5/, "OVER", "tiri", "Barcola può produrre almeno due tiri attaccando la profondità."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /ISAK A\. U\/O 1\.5/, "OVER", "tiri", "Isak è uno dei due terminali principali della Svezia."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /GYOKERES V\. U\/O 1\.5/, "OVER", "tiri", "Gyökeres può produrre almeno due conclusioni anche con poco possesso."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^LAGERBIELKE G\. CARTELLINO/, "SI", "cartellini", "Lagerbielke è la prima scelta ammoniti, pur con fiducia moderata da Makkelie."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^KARLSTROM J\. CARTELLINO/, "SI", "cartellini", "Karlström è esposto alle ricezioni centrali francesi."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^LINDELOF V\. CARTELLINO/, "SI", "cartellini", "Lindelöf può essere costretto a coperture profonde su Mbappé."],
    ],
  },
  "messico-ecuador": {
    file: "messico-ecuador-quote.json",
    match: "Messico - Ecuador",
    context: {
      esito: {
        strength: "Continuità recente e contesto favoreiscono il Messico, ma il pareggio resta centrale in una gara equilibrata.",
        risk: "L'Ecuador concede poco e ha struttura sufficiente per portare la partita ai supplementari.",
      },
      goal: {
        strength: "Il risultato guida 1-0, l'Under 2,5 a 1,36 e il No Goal a 1,57 indicano una partita a punteggio contenuto.",
        risk: "L'Ecuador ha prodotto 2,84 xG e 27 tiri contro Curaçao: la scarsa conversione non equivale ad assenza di occasioni.",
      },
      corner: {
        strength: "La proiezione di 8-11 corner sostiene le linee centrali 7,5 e 8,5.",
        risk: "Un lungo equilibrio posizionale può ridurre il numero di attacchi completati sulle corsie.",
      },
      tiri: {
        strength: "Messico proiettato a 11-15 tiri ed Ecuador a 8-12; i volumi squadra sono più stabili dei singoli.",
        risk: "Assetto e minutaggio restano provvisori fino alle formazioni ufficiali.",
      },
      cartellini: {
        strength: "Vinčić ha una media di 4,10 gialli e Caicedo presenta il profilo disciplinare più esposto.",
        risk: "Il cartellino individuale resta volatile e dipende dallo sviluppo dei duelli.",
      },
    },
    specs: [
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "1", "esito", "Messico vincente, coerente con il risultato guida 1-0."],
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "X", "esito", "Il pareggio copre gli scenari alternativi 0-0 e 1-1."],
      ["DOPPIA CHANCE", /DOPPIA CHANCE MULTIESITI/, "1X", "esito", "Copertura strutturale sul Messico senza escludere il pareggio."],
      ["DOPPIA CHANCE", /DOPPIA CHANCE MULTIESITI/, "12", "esito", "Variante se una gara bloccata viene decisa da un episodio."],
      ["PASSAGGIO TURNO", /PASSAGGIO TURNO/, "1", "esito", "Messico qualificato, in linea con il vantaggio contenuto della lettura."],
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "NOGOAL", "goal", "Il risultato guida 1-0 e la quota sostengono il No Goal."],
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "GOAL", "goal", "Copertura per lo scenario alternativo 1-1."],
      ["UNDER/OVER", /U\/O 1\.5$/, "OVER", "goal", "Copre i risultati 1-1 e 2-0 senza richiedere una gara aperta."],
      ["UNDER/OVER", /U\/O 2\.5$/, "UNDER", "goal", "È il mercato principale della lettura e delle quote."],
      ["UNDER/OVER", /U\/O 2\.5$/, "OVER", "goal", "Variante aggressiva se arriva un gol precoce."],
      ["UNDER/OVER", /U\/O 3\.5$/, "UNDER", "goal", "Linea larga coerente con tutti gli scenari centrali."],
      ["U/O CORNER", /U\/O 6\.5 CORNER$/, "OVER", "corner", "La proiezione totale 8-11 rende prudente la linea 6,5."],
      ["U/O CORNER", /U\/O 7\.5 CORNER$/, "OVER", "corner", "La linea è appena sotto la proiezione centrale."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "UNDER", "corner", "Copertura sulla parte bassa della proiezione."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "OVER", "corner", "Variante sulla parte alta della proiezione."],
      ["U/O CORNER", /U\/O 10\.5 CORNER$/, "UNDER", "corner", "Il limite superiore previsto è vicino a undici corner."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 10\.5 TIRI TOTALI/, "OVER", "tiri", "Messico proiettato a 11-15 conclusioni."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 11\.5 TIRI TOTALI/, "OVER", "tiri", "Linea interna alla proiezione messicana."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 13\.5 TIRI TOTALI/, "UNDER", "tiri", "Copertura se l'Ecuador comprime il possesso messicano."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 1: U\/O 3\.5 TIRI IN PORTA/, "OVER", "tiri", "Messico proiettato a 4-6 tiri nello specchio."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 7\.5 TIRI TOTALI/, "OVER", "tiri", "Ecuador proiettato a 8-12 conclusioni."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 9\.5 TIRI TOTALI/, "OVER", "tiri", "Linea centrale della proiezione ecuadoriana."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 11\.5 TIRI TOTALI/, "UNDER", "tiri", "Copertura sulla parte alta della proiezione."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 2: U\/O 2\.5 TIRI IN PORTA/, "OVER", "tiri", "Ecuador proiettato a 3-5 tiri in porta."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /GIMENEZ S\. U\/O 1\.5/, "OVER", "tiri", "Giménez è il riferimento centrale del Messico."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /QUINONES J\. U\/O 1\.5/, "OVER", "tiri", "Quiñones può produrre almeno due conclusioni partendo largo."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /ALVARADO R\. U\/O 1\.5/, "OVER", "tiri", "Alvarado è proiettato nella fascia 1-3 tiri."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^MOISES CAICEDO CARTELLINO/, "SI", "cartellini", "Caicedo è la prima scelta ammoniti per ruolo e storico disciplinare."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^ORDONEZ J\. CARTELLINO/, "SI", "cartellini", "Ordóñez è esposto ai duelli con Giménez."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^ALVAREZ EDSON CARTELLINO/, "SI", "cartellini", "Álvarez deve proteggere le transizioni centrali dell'Ecuador."],
    ],
  },
  "costa-avorio-norvegia": {
    file: "costa-avorio-norvegia-quote.json",
    match: "Costa D'Avorio - Norvegia",
    context: {
      esito: {
        strength: "La Norvegia conserva un vantaggio offensivo contenuto grazie a Haaland, Sørloth e Ødegaard; l'1-2 è il risultato guida.",
        risk: "La Costa d'Avorio arriva con maggiore continuità difensiva e può portare la gara su margini molto ridotti.",
      },
      goal: {
        strength: "Il risultato guida 1-2 e le probabili formazioni sostengono Goal e una fascia centrale di tre reti.",
        risk: "La buona tenuta ivoriana e una fase iniziale prudente possono comprimere il punteggio.",
      },
      corner: {
        strength: "La proiezione complessiva di 9-12 corner sostiene Over 8,5 e Under 10,5 come linee centrali.",
        risk: "Un vantaggio precoce può ridurre ritmo e pressione territoriale nella ripresa.",
      },
      tiri: {
        strength: "Costa d'Avorio 10-14 tiri e Norvegia 12-16; Haaland, Pépé, Diallo e Nusa sono i riferimenti principali.",
        risk: "I mercati individuali dipendono da conferma degli undici, ruolo effettivo e minutaggio.",
      },
      cartellini: {
        strength: "Valenzuela ha una media di 5,01 gialli; Oulai e Sangaré sono esposti ai duelli centrali con Ødegaard e Nusa.",
        risk: "Il cartellino individuale resta un evento volatile anche con un arbitro dal profilo severo.",
      },
    },
    specs: [
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "2", "esito", "Norvegia vincente, coerente con il risultato guida 1-2."],
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "X", "esito", "L'1-1 resta l'alternativa principale in una gara equilibrata."],
      ["1X2 ESITO FINALE", /ESITO FINALE 1X2/, "1", "esito", "La forma recente rende credibile anche lo scenario sorpresa ivoriano."],
      ["DOPPIA CHANCE", /DOPPIA CHANCE MULTIESITI/, "X2", "esito", "Copertura prudente sulla Norvegia senza escludere il pareggio."],
      ["PASSAGGIO TURNO", /PASSAGGIO TURNO/, "2", "esito", "Norvegia qualificata, in linea con il verdetto della lettura."],
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "GOAL", "goal", "Il risultato guida 1-2 sostiene entrambe le squadre a segno."],
      ["UNDER/OVER", /U\/O 2\.5$/, "OVER", "goal", "Il risultato centrale contiene tre reti."],
      ["UNDER/OVER", /U\/O 2\.5$/, "UNDER", "goal", "Copertura per una gara più fisica e bloccata del previsto."],
      ["UNDER/OVER", /U\/O 3\.5$/, "UNDER", "goal", "Under 3,5 protegge gli scenari 0-1, 1-1 e 1-2."],
      ["UNDER/OVER", /U\/O 3\.5$/, "OVER", "goal", "Variante aggressiva se il tridente norvegese apre presto la partita."],
      ["UNDER/OVER", /U\/O 4\.5$/, "UNDER", "goal", "Linea larga coerente con tutti gli scenari centrali."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "OVER", "corner", "La proiezione totale 9-12 sostiene l'Over 8,5."],
      ["U/O CORNER", /U\/O 8\.5 CORNER$/, "UNDER", "corner", "Variante prudente se la partita resta posizionale."],
      ["U/O CORNER", /U\/O 10\.5 CORNER$/, "UNDER", "corner", "La parte centrale della proiezione sostiene l'Under 10,5."],
      ["U/O CORNER", /U\/O 10\.5 CORNER$/, "OVER", "corner", "Variante aggressiva sulla parte alta della proiezione corner."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 9\.5 TIRI TOTALI/, "OVER", "tiri", "Costa d'Avorio proiettata a 10-14 tiri."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 1: U\/O 10\.5 TIRI TOTALI/, "OVER", "tiri", "Linea interna alla proiezione ivoriana."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 1: U\/O 3\.5 TIRI IN PORTA/, "OVER", "tiri", "Costa d'Avorio proiettata a 3-5 tiri nello specchio."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 11\.5 TIRI TOTALI/, "OVER", "tiri", "Norvegia proiettata a 12-16 tiri."],
      ["U/O TIRI TOTALI SQUADRA X", /SQUADRA 2: U\/O 12\.5 TIRI TOTALI/, "OVER", "tiri", "Linea centrale della proiezione norvegese."],
      ["U/O TIRI IN PORTA SQUADRA X", /SQUADRA 2: U\/O 4\.5 TIRI IN PORTA/, "OVER", "tiri", "Norvegia proiettata a 4-7 tiri in porta."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /HAALAND E\. U\/O 2\.5/, "OVER", "tiri", "Haaland è proiettato a 3-5 conclusioni."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /HAALAND E\. U\/O 3\.5/, "OVER", "tiri", "Variante più ambiziosa sul terminale norvegese."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /PEPE N\. U\/O 1\.5/, "OVER", "tiri", "Pépé è indicato per almeno due conclusioni."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /PEPE N\. U\/O 2\.5/, "OVER", "tiri", "Variante aggressiva sulla mobilità offensiva di Pépé."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /DIALLO TRAORE A\. U\/O 1\.5/, "OVER", "tiri", "Diallo può produrre almeno due tiri partendo dalla trequarti."],
      ["U/O TIRI TOTALI GIOCATORE (DUO) INC TS", /NUSA A\. U\/O 1\.5/, "OVER", "tiri", "Nusa è uno dei principali sbocchi norvegesi nell'uno contro uno."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^INAO OULAI C\. R\. CARTELLINO/, "SI", "cartellini", "Oulai è la prima scelta ammoniti con Valenzuela."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^SANGARE I\. CARTELLINO/, "SI", "cartellini", "Sangaré è esposto ai duelli centrali e alle transizioni norvegesi."],
      ["CARTELLINO SI/NO (DUO) INC TS", /^AJER K\. CARTELLINO/, "SI", "cartellini", "Ajer può essere esposto ai movimenti di Pépé e Diallo."],
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
      ["GOAL/NOGOAL", /GOAL\/NO GOAL/, "NOGOAL", "goal", "Il 2-0 centrale sostiene il No Goal, pur con rischio aumentato dalla presenza di Ávalos."],
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
      selectionId: source.selectionId,
      marketId: source.marketId,
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

const selectedPlans = requestedMatch
  ? [plans[requestedMatch]].filter(Boolean)
  : Object.values(plans);

if (!selectedPlans.length) throw new Error(`Piano top-events non trovato: ${requestedMatch}`);
selectedPlans.forEach(build);
