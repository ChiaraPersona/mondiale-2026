const teamStatsData = [
  {
    team: "Spagna",
    group: "H",
    flag: "flags/spagna.svg",
    summary: "Volume offensivo altissimo contro blocchi bassi, piu controllato nelle gare fisiche o da eliminazione diretta.",
    analyzedMatches: [
      {
        match: "Spagna 0-0 Capo Verde",
        context: "Avversario molto difensivo, Spagna dominante ma poco concreta.",
        stats: [
          ["Tiri", "27"],
          ["Tiri in porta", "7"],
          ["Corner", "11"],
          ["Falli commessi", "10"],
          ["Falli subiti", "1"],
          ["Cartellini gialli", "1"],
          ["xG", "2.10"],
          ["Possesso", "74%"]
        ]
      },
      {
        match: "Spagna 4-0 Arabia Saudita",
        context: "Partita dominata e indirizzata presto.",
        stats: [
          ["Tiri", "22"],
          ["Tiri in porta", "8"],
          ["Corner", "6"],
          ["Falli commessi", "10"],
          ["Falli subiti", "2"],
          ["Cartellini gialli", "0"],
          ["xG", "2.30"],
          ["Possesso", "67%"]
        ]
      },
      {
        match: "Uruguay 0-1 Spagna",
        context: "Partita tesa, avversario fisico, qualificazione/primo posto.",
        stats: [
          ["Tiri", "5-6"],
          ["Tiri in porta", "1"],
          ["Corner", "6"],
          ["Falli commessi", "14"],
          ["Falli subiti", "14"],
          ["Cartellini gialli", "1"],
          ["xG", "0.53-0.86"],
          ["Possesso", "67-68%"]
        ]
      },
      {
        match: "Spagna 3-0 Austria",
        context: "Eliminazione diretta, dominio netto.",
        stats: [
          ["Tiri", "22-23"],
          ["Tiri in porta", "10"],
          ["Corner", "9"],
          ["Falli commessi", "8"],
          ["Falli subiti", "15"],
          ["Cartellini gialli", "0"],
          ["xG", "2.25-2.84"],
          ["Possesso", "64-65%"]
        ]
      },
      {
        match: "Portogallo 0-1 Spagna",
        context: "Eliminazione diretta, partita chiusa e tattica.",
        stats: [
          ["Tiri", "15"],
          ["Tiri in porta", "6"],
          ["Corner", "7"],
          ["Falli commessi", "13"],
          ["Falli subiti", "9"],
          ["Cartellini gialli", "1"],
          ["xG", "1.60-1.69"],
          ["Possesso", "55-56%"]
        ]
      }
    ],
    averages: [
      ["Tiri totali medi", "18.4"],
      ["Tiri in porta medi", "6.4"],
      ["Corner medi", "7.8"],
      ["Falli commessi medi", "11.0"],
      ["Falli subiti medi", "8.2"],
      ["Cartellini gialli medi", "0.6"],
      ["Possesso medio", "65-66%"],
      ["xG medio", "circa 1.75-1.90"]
    ],
    modelReading: "La Spagna aumenta tantissimo volume offensivo contro squadre basse e difensive, mentre contro squadre forti o aggressive il volume cala ma resta ordinato. Prende pochi cartellini, concede poco e mantiene sempre un possesso alto. Per Spagna-Belgio usare come riferimento principale le partite contro Portogallo e Uruguay, non quelle contro Capo Verde o Arabia Saudita.",
    estimateTitle: "Stima per Spagna-Belgio",
    estimate: [
      ["Tiri Spagna", "12-16"],
      ["Tiri in porta Spagna", "4-6"],
      ["Corner Spagna", "5-8"],
      ["Falli commessi Spagna", "10-14"],
      ["Falli subiti Spagna", "8-14"],
      ["Cartellini Spagna", "0-2"]
    ],
    playerStatsNotes: [
      "Le statistiche dei calciatori sono salvate partita per partita. Le medie non devono essere considerate da sole, ma sempre insieme a minuti giocati, ruolo, titolarità, tipo di avversario, stato della partita, importanza della gara e contesto tattico.",
      "Per i mercati tiri e tiri in porta, dare priorità a: minuti previsti, posizione in campo, tiri/90, tiri in porta/90, avversario affrontato e probabilità che la squadra debba attaccare. Per i mercati falli/cartellini, dare priorità a ruolo, duelli diretti, falli commessi/90, falli subiti/90, arbitro e intensità prevista della partita."
    ],
    playerMatches: [
      {
        team: "Spagna",
        match: "Portogallo 0-1 Spagna",
        competition: "Mondiale 2026",
        round: "Ottavi di finale",
        date: "2026-07-06",
        context: {
          matchType: "Eliminazione diretta",
          opponentLevel: "Élite",
          opponentStyle: "Tecnica, organizzata, possesso medio-alto",
          gameState: "Partita equilibrata, pochi spazi, gol nel recupero",
          modelWeight: "Molto alto"
        },
        players: [
          { name: "Lamine Yamal", roleGroup: "attackers", role: "Esterno offensivo", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da valutare per mercati tiri/tiri in porta e falli subiti." },
          { name: "Mikel Oyarzabal", roleGroup: "attackers", role: "Punta / esterno", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da leggere insieme a titolarita, presenza in area e volume tiri." },
          { name: "Nico Williams", roleGroup: "attackers", role: "Esterno offensivo", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Profilo utile per dribbling, cross, falli subiti e duelli diretti." },
          { name: "Dani Olmo", roleGroup: "attackers", role: "Trequartista / esterno", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da monitorare per rifinitura, passaggi chiave, tiri e posizione tra le linee." },
          { name: "Álex Baena", roleGroup: "attackers", role: "Esterno / trequartista", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da pesare su minuti effettivi, calci piazzati, cross e passaggi chiave." },
          { name: "Ferran Torres", roleGroup: "attackers", role: "Esterno / punta", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Profilo ad alta varianza: priorita a minuti, ruolo e tocchi in area." },
          { name: "Pedri", roleGroup: "midfielders", role: "Centrocampista", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da leggere per controllo, passaggi chiave, falli subiti e continuita nei minuti." },
          { name: "Rodri", roleGroup: "midfielders", role: "Mediano", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Base di controllo: importante per duelli, falli commessi e gestione del ritmo." },
          { name: "Fabián Ruiz", roleGroup: "midfielders", role: "Centrocampista", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da valutare su inserimenti, tiri da seconda linea, tocchi e duelli." },
          { name: "Mikel Merino", roleGroup: "midfielders", role: "Centrocampista", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Utile per lettura fisica: duelli, falli, contrasti e inserimenti." },
          { name: "Martín Zubimendi", roleGroup: "midfielders", role: "Mediano", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da usare soprattutto per rotazioni, titolarità e impatto disciplinare." },
          { name: "Marc Cucurella", roleGroup: "defenders", role: "Terzino sinistro", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da monitorare per cross, falli commessi, duelli e rischio cartellino." },
          { name: "Pedro Porro", roleGroup: "defenders", role: "Terzino destro", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Profilo da leggere su cross, tiri occasionali, falli e duelli sulla fascia." },
          { name: "Pau Cubarsí", roleGroup: "defenders", role: "Difensore centrale", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da valutare per tocchi, duelli difensivi, falli e gestione pressione." },
          { name: "Robin Le Normand", roleGroup: "defenders", role: "Difensore centrale", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da leggere su duelli, contrasti, falli commessi e cartellini." },
          { name: "Dani Vivian", roleGroup: "defenders", role: "Difensore centrale", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Indicatore utile se titolare: duelli aerei, falli e rischio ammonizione." },
          { name: "Álex Grimaldo", roleGroup: "defenders", role: "Terzino / esterno sinistro", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Da pesare su cross, piazzati, passaggi chiave e posizione media." },
          { name: "Unai Simón", roleGroup: "defenders", role: "Portiere", minutes: null, shots: null, shotsOnTarget: null, xG: null, assists: null, xA: null, keyPasses: null, touches: null, touchesInBox: null, crosses: null, successfulDribbles: null, foulsCommitted: null, foulsWon: null, tackles: null, duelsWon: null, yellowCards: null, rating: null, contextNote: "Per il portiere privilegiare rating, tocchi, gestione pressione e cartellini solo se rilevanti." }
        ]
      }
    ]
  },
  { team: "Belgio", group: "G", flag: "flags/belgio.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] },
  { team: "Argentina", group: "J", flag: "flags/argentina.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] },
  { team: "Svizzera", group: "B", flag: "flags/svizzera.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] },
  {
    team: "Francia",
    group: "I",
    flag: "flags/francia.svg",
    summary: "Attacco ad alto volume e alta precisione nello specchio: Mbappe, Olise e Dembele sono i riferimenti principali.",
    analyzedMatches: [
      {
        match: "Francia 3-0 Svezia",
        context: "Sedicesimi/eliminazione diretta. Svezia fisica e compatta: Francia dominante, ottimo riferimento per volume offensivo.",
        stats: [
          ["Tiri", "25"],
          ["Tiri in porta", "12"],
          ["Corner", "n/d"],
          ["Falli commessi", "14"],
          ["Falli subiti", "10"],
          ["Cartellini gialli", "0"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Paraguay 0-1 Francia",
        context: "Ottavi/eliminazione diretta. Paraguay difensivo e fisico: partita chiusa, molto utile per leggere Francia contro blocchi bassi.",
        stats: [
          ["Tiri", "15"],
          ["Tiri in porta", "5"],
          ["Corner", "n/d"],
          ["Falli commessi", "11"],
          ["Falli subiti", "13"],
          ["Cartellini gialli", "3"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Francia 3-1 Senegal",
        context: "Fase a gironi contro squadra atletica e verticale: Francia molto concreta negli ultimi metri.",
        stats: [
          ["Tiri", "11"],
          ["Tiri in porta", "8"],
          ["Corner", "n/d"],
          ["Falli commessi", "5"],
          ["Falli subiti", "9"],
          ["Cartellini gialli", "0"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Francia 3-0 Iraq",
        context: "Fase a gironi contro avversario inferiore: utile per volume offensivo, meno predittiva contro Marocco.",
        stats: [
          ["Tiri", "19"],
          ["Tiri in porta", "5"],
          ["Corner", "n/d"],
          ["Falli commessi", "8"],
          ["Falli subiti", "4"],
          ["Cartellini gialli", "0"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Norvegia 1-4 Francia",
        context: "Fase a gironi contro avversario forte e verticale: buon riferimento per gestione di transizioni e duelli.",
        stats: [
          ["Tiri", "18"],
          ["Tiri in porta", "9"],
          ["Corner", "n/d"],
          ["Falli commessi", "11"],
          ["Falli subiti", "9"],
          ["Cartellini gialli", "1"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      }
    ],
    averages: [
      ["Tiri totali medi", "17.6"],
      ["Tiri in porta medi", "7.8"],
      ["Corner medi", "n/d"],
      ["Falli commessi medi", "9.8"],
      ["Falli subiti medi", "9.0"],
      ["Cartellini gialli medi", "0.8"],
      ["Possesso medio", "n/d"],
      ["xG medio", "n/d"]
    ],
    modelReading: "La Francia abbina volume e qualita nello specchio: 17.6 tiri e 7.8 tiri in porta medi nelle cinque partite analizzate. Contro avversari compatti il volume resta buono ma la partita puo diventare piu stretta; contro squadre aperte o fisiche la Francia trova piu campo per Mbappe, Dembele e Olise. Per Francia-Marocco pesare soprattutto Paraguay, Brasile-Marocco e Paesi Bassi-Marocco come riferimenti di gara chiusa e ad alta qualita.",
    estimateTitle: "Stima Francia-Marocco - Francia",
    estimate: [
      ["Tiri Francia", "13-18"],
      ["Tiri in porta Francia", "5-8"],
      ["Corner Francia", "n/d"],
      ["Falli commessi Francia", "8-12"],
      ["Falli subiti Francia", "9-13"],
      ["Cartellini Francia", "0-2"],
      ["Gol attesi modello", "1-2"]
    ],
    playerStatsNotes: [],
    playerMatches: []
  },
  {
    team: "Marocco",
    group: "C",
    flag: "flags/marocco.svg",
    summary: "Squadra compatta e competitiva contro avversari forti, con molti falli subiti e transizioni affidate a Hakimi, Saibari e Brahim.",
    analyzedMatches: [
      {
        match: "Paesi Bassi 1-1 Marocco",
        context: "Sedicesimi/eliminazione diretta. Avversario tecnico e forte: partita equilibrata, riferimento molto alto per Francia-Marocco.",
        stats: [
          ["Tiri", "11"],
          ["Tiri in porta", "5"],
          ["Corner", "n/d"],
          ["Falli commessi", "15"],
          ["Falli subiti", "18"],
          ["Cartellini gialli", "1"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Canada 0-3 Marocco",
        context: "Ottavi/eliminazione diretta. Marocco dominante contro avversario fisico: utile per gestione vantaggio e produzione offensiva.",
        stats: [
          ["Tiri", "5"],
          ["Tiri in porta", "4"],
          ["Corner", "n/d"],
          ["Falli commessi", "14"],
          ["Falli subiti", "24"],
          ["Cartellini gialli", "4"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Brasile 1-1 Marocco",
        context: "Fase a gironi contro avversario elite: ottimo riferimento per tenuta difensiva e transizioni contro qualita superiore.",
        stats: [
          ["Tiri", "14"],
          ["Tiri in porta", "3"],
          ["Corner", "n/d"],
          ["Falli commessi", "14"],
          ["Falli subiti", "16"],
          ["Cartellini gialli", "0"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Scozia 0-1 Marocco",
        context: "Fase a gironi contro avversario fisico e diretto: Marocco avanti presto e poi in controllo.",
        stats: [
          ["Tiri", "12"],
          ["Tiri in porta", "2"],
          ["Corner", "n/d"],
          ["Falli commessi", "8"],
          ["Falli subiti", "11"],
          ["Cartellini gialli", "1"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      },
      {
        match: "Marocco 4-2 Haiti",
        context: "Fase a gironi aperta e meno simile al quarto: utile per volume offensivo, peso modello piu basso.",
        stats: [
          ["Tiri", "22"],
          ["Tiri in porta", "11"],
          ["Corner", "n/d"],
          ["Falli commessi", "10"],
          ["Falli subiti", "18"],
          ["Cartellini gialli", "0"],
          ["Possesso", "n/d"],
          ["xG", "n/d"]
        ]
      }
    ],
    averages: [
      ["Tiri totali medi", "12.8"],
      ["Tiri in porta medi", "5.0"],
      ["Corner medi", "n/d"],
      ["Falli commessi medi", "12.2"],
      ["Falli subiti medi", "17.4"],
      ["Cartellini gialli medi", "1.2"],
      ["Possesso medio", "n/d"],
      ["xG medio", "n/d"]
    ],
    modelReading: "Il Marocco resta leggibile come squadra da gara stretta: concede pochi riferimenti puliti, subisce molti falli e porta spesso la partita sul piano fisico. Contro Brasile e Paesi Bassi ha retto contro qualita alta; contro Canada e Haiti ha convertito bene quando ha trovato campo. Per Francia-Marocco i riferimenti principali sono Brasile e Paesi Bassi, piu del match con Haiti.",
    estimateTitle: "Stima Francia-Marocco - Marocco",
    estimate: [
      ["Tiri Marocco", "8-13"],
      ["Tiri in porta Marocco", "3-5"],
      ["Corner Marocco", "n/d"],
      ["Falli commessi Marocco", "11-16"],
      ["Falli subiti Marocco", "14-20"],
      ["Cartellini Marocco", "1-3"],
      ["Gol attesi modello", "0-1"]
    ],
    playerStatsNotes: [],
    playerMatches: []
  },
  { team: "Inghilterra", group: "L", flag: "flags/inghilterra.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] },
  { team: "Norvegia", group: "I", flag: "flags/norvegia.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] }
];
