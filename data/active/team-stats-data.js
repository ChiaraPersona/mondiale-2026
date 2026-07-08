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
          ["Falli", "10"],
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
          ["Falli", "10"],
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
          ["Falli", "14"],
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
          ["Falli", "8"],
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
          ["Falli", "13"],
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
      ["Falli medi", "11.0"],
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
      ["Falli Spagna", "10-14"],
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
  { team: "Francia", group: "I", flag: "flags/francia.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] },
  { team: "Marocco", group: "C", flag: "flags/marocco.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] },
  { team: "Inghilterra", group: "L", flag: "flags/inghilterra.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] },
  { team: "Norvegia", group: "I", flag: "flags/norvegia.svg", summary: "Struttura pronta per statistiche squadra e calciatori.", analyzedMatches: [], averages: [], modelReading: "Dati da inserire.", estimateTitle: "Stime prossimo match", estimate: [], playerStatsNotes: [], playerMatches: [] }
];
