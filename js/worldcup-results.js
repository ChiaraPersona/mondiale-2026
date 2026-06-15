const worldCupResults = {
  1: {
    status: "Finale",
    home: 2,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/messico-O6iHcNkd/sudafrica-W2ijYvlr/?mid=h4EoUB7T",
    sources: [
      "https://www.diretta.it/partita/calcio/messico-O6iHcNkd/sudafrica-W2ijYvlr/?mid=h4EoUB7T",
      "https://nypost.com/2026/06/11/sports/mexico-south-africa-2026-world-cup-saw-three-red-cards/",
    ],
    scorers: {
      "Messico": ["Julian Quinones", "Raul Jimenez"],
      "Sudafrica": [],
    },
    cards: {
      red: [
        { team: "Sudafrica", player: "Sphephelo Sithole" },
        { team: "Sudafrica", player: "Themba Zwane" },
        { team: "Messico", player: "Cesar Montes" },
      ],
    },
    notes: [
      "Messico subito a 3 punti nel Gruppo A.",
      "Partita molto sporca: tre rossi, due al Sudafrica e uno al Messico.",
    ],
  },
  2: {
    status: "Finale",
    home: 2,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/corea-del-sud-K6Gs7P6G/repubblica-ceca-6LHwBDGU/?mid=CGdvIm6K",
    sources: [
      "https://www.diretta.it/partita/calcio/corea-del-sud-K6Gs7P6G/repubblica-ceca-6LHwBDGU/?mid=CGdvIm6K",
      "https://www.theguardian.com/football/live/2026/jun/12/fifa-world-cup-2026-live-south-korea-v-czechia-updates-kor-vs-cze-group-a-match-score-latest",
    ],
    scorers: {
      "Corea del Sud": ["Hwang In-Beom", "Oh Hyeon-Gyu"],
      "Repubblica Ceca": ["Ladislav Krejci"],
    },
    notes: [
      "Corea del Sud in rimonta dopo lo svantaggio iniziale.",
      "Oh Hyeon-Gyu decisivo dalla panchina nel finale.",
    ],
  },
  3: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/bosnia-erzegovina-fqe7WYTr/canada-x4toKORL/?mid=OxkQ8qT6",
    sources: [
      "https://www.diretta.it/partita/calcio/bosnia-erzegovina-fqe7WYTr/canada-x4toKORL/?mid=OxkQ8qT6",
      "https://www.theguardian.com/football/live/2026/jun/12/canada-v-bosnia-and-herzegovina-world-cup-2026-live",
    ],
    scorers: {
      "Canada": ["Cyle Larin"],
      "Bosnia ed Erzegovina": ["Jovo Lukic"],
    },
    notes: [
      "Canada dominante a tratti ma poco pulito sotto porta.",
      "Bosnia avanti da corner, poi raggiunta nel finale.",
    ],
  },
  4: {
    status: "Finale",
    home: 4,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/paraguay-YaNlqp6j/usa-fuitL4CF/?mid=bo9vy2zK",
    sources: [
      "https://www.diretta.it/partita/calcio/paraguay-YaNlqp6j/usa-fuitL4CF/?mid=bo9vy2zK",
      "https://www.theguardian.com/football/live/2026/jun/12/usa-v-paraguay-world-cup-2026-live",
      "https://www.timesunion.com/sports/article/usmnt-vs-paraguay-live-updates-fifa-world-cup-22297881.php",
    ],
    scorers: {
      "Stati Uniti": ["Autogol Paraguay", "Folarin Balogun", "Folarin Balogun", "Gio Reyna"],
      "Paraguay": ["Mauricio"],
    },
    cards: {
      yellow: [
        { team: "Paraguay", player: "Juan Caceres" },
        { team: "Paraguay", player: "Miguel Almiron", note: "simulation after VAR review" },
      ],
    },
    notes: [
      "USA avanti 3-0 all'intervallo e poi in controllo fino al 4-1 finale.",
      "Balogun migliore in campo con doppietta; Pulisic decisivo nel primo tempo.",
    ],
  },
  5: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/qatar-zqzHL77i/svizzera-rHJ2vy1B/?mid=C8oCpXiA",
    sources: [
      "https://www.diretta.it/partita/calcio/qatar-zqzHL77i/svizzera-rHJ2vy1B/?mid=C8oCpXiA",
      "https://www.fourfourtwo.com/team/why-julen-lopetegui-would-have-been-delighted-with-defeat-against-switzerland-let-alone-a-win",
      "https://timesofindia.indiatimes.com/sports/football/fifa-world-cup/qatar-vs-switzerland-fifa-world-cup-match-result-qatar-secure-historic-first-world-cup-point-with-stoppage-time-equaliser/articleshow/131714804.cms",
    ],
    scorers: {
      "Qatar": ["Boualem Khoukhi"],
      "Svizzera": ["Breel Embolo"],
    },
    notes: [
      "Svizzera avanti su rigore di Embolo, ma spreca troppo dopo 27 tiri.",
      "Khoukhi pareggia in pieno recupero regalando al Qatar il primo punto mondiale.",
    ],
  },
  6: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/brasile-I9l9aqLq/marocco-IDKYO3R8/?mid=b5JayTEd",
    sources: [
      "https://www.diretta.it/partita/calcio/brasile-I9l9aqLq/marocco-IDKYO3R8/?mid=b5JayTEd",
      "https://www.theguardian.com/football/2026/jun/14/ayyoub-bouaddi-morocco-brazil-world-cup-football-vinicius-junior",
      "https://timesofindia.indiatimes.com/city/kolkata/after-brazil-hits-morocco-wall-city-fans-hope-for-quick-turnaround/articleshow/131727276.cms",
    ],
    scorers: {
      "Brasile": ["Vinicius Junior"],
      "Marocco": ["Ismael Saibari"],
    },
    notes: [
      "Marocco avanti con Saibari, Brasile salvato dalla giocata di Vinicius Junior.",
      "Bouaddi dominante in mezzo al campo: 88 tocchi, 11 duelli vinti e 93% passaggi.",
    ],
  },
  7: {
    status: "Finale",
    home: 0,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/haiti-nk4v10Z1/scozia-fZRU25WH/?mid=QBBoaW63",
    sources: [
      "https://www.diretta.it/partita/calcio/haiti-nk4v10Z1/scozia-fZRU25WH/?mid=QBBoaW63",
      "https://www.theguardian.com/football/2026/jun/14/scotland-celebrates-world-cup-haiti",
    ],
    scorers: {
      "Haiti": [],
      "Scozia": ["John McGinn"],
    },
    notes: [
      "Scozia torna a vincere una partita mondiale: decisivo McGinn con deviazione.",
      "Haiti resta viva a lungo e sfiora il pari con Frantzdy Pierrot.",
    ],
  },
  8: {
    status: "Finale",
    home: 2,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/australia-xSrf6qMM/turchia-QeijuHo5/?mid=nLNXPs35",
    sources: [
      "https://www.diretta.it/partita/calcio/australia-xSrf6qMM/turchia-QeijuHo5/?mid=nLNXPs35",
      "https://www.managingmadrid.com/real-madrid-cf-players/108958/australia-stun-turkiye-in-gulers-world-cup-debut",
    ],
    scorers: {
      "Australia": ["Nestory Irankunda", "Connor Metcalfe"],
      "Turchia": [],
    },
    notes: [
      "Australia sorprende la Turchia con Irankunda e Metcalfe.",
      "Patrick Beach decisivo con 8 parate nel debutto competitivo.",
    ],
  },
  9: {
    status: "Finale",
    home: 7,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/curacao-bLLGpOkQ/germania-ptQide1O/?mid=dtiRRcc6",
    sources: [
      "https://www.diretta.it/partita/calcio/curacao-bLLGpOkQ/germania-ptQide1O/?mid=dtiRRcc6",
      "https://www.bavarianfootballworks.com/bayern-munich-match-awards/216100/germany-vs-curacao-match-awards-player-ratings-german-national-team-felix-nmecha-jamal-musiala-nathaniel-brown",
      "https://www.managingmadrid.com/general/108971/germany-initiates-2026-world-cup-campaign-in-electrifying-form",
    ],
    scorers: {
      "Germania": ["Felix Nmecha", "Nico Schlotterbeck", "Kai Havertz", "Jamal Musiala", "Nathaniel Brown", "Deniz Undav", "Kai Havertz"],
      "Curacao": ["Livano Comenencia"],
    },
    notes: [
      "Germania travolgente, con Havertz doppietta e premio di migliore in campo.",
      "Comenencia segna il primo gol mondiale nella storia di Curacao.",
    ],
  },
  10: {
    status: "Finale",
    home: 2,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/giappone-ULXPdOUj/olanda-WYintcWb/?mid=4SV9xFBO",
    sources: [
      "https://www.diretta.it/partita/calcio/giappone-ULXPdOUj/olanda-WYintcWb/?mid=4SV9xFBO",
      "https://www.sbnation.com/fifa-world-cup/1118493/world-cup-2026-every-goal-from-the-netherlands-japan-thriller",
      "https://timesofindia.indiatimes.com/sports/football/fifa-world-cup/netherlands-vs-japan-highlights-daichi-kamadas-late-equalizer-rescues-samurai-blue-in-fifa-world-cup-thriller/articleshow/131730587.cms",
    ],
    scorers: {
      "Olanda": ["Virgil van Dijk", "Crysencio Summerville"],
      "Giappone": ["Keito Nakamura", "Daichi Kamada"],
    },
    notes: [
      "Olanda due volte avanti, Giappone sempre capace di rientrare.",
      "Kamada pareggia nel finale su corner deviato da Koki Ogawa.",
    ],
  },
  11: {
    status: "Finale",
    home: 1,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/costa-d-avorio-G2FRjBgn/ecuador-8tbm8Tri/?mid=h8pzQySI",
    sources: [
      "https://www.diretta.it/partita/calcio/costa-d-avorio-G2FRjBgn/ecuador-8tbm8Tri/?mid=h8pzQySI",
      "https://timesofindia.indiatimes.com/sports/football/fifa-world-cup/ivory-coast-vs-ecuador-fifa-world-cup-match-result-amad-diallos-90th-minute-strike-breaks-ecuador-hearts-in-ivory-coasts-winning-return/articleshow/131731472.cms",
    ],
    scorers: {
      "Costa d'Avorio": ["Amad Diallo"],
      "Ecuador": [],
    },
    notes: [
      "Amad Diallo decide al 90' il ritorno mondiale della Costa d'Avorio.",
      "Ecuador fermato dai legni e da una gara molto bloccata.",
    ],
  },
  12: {
    status: "Finale",
    home: 5,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/svezia-OQyqbHWB/tunisia-QqZVYk95/?mid=UaJKzaHN",
    sources: [
      "https://www.diretta.it/partita/calcio/svezia-OQyqbHWB/tunisia-QqZVYk95/?mid=UaJKzaHN",
      "https://www.theguardian.com/football/2026/jun/15/sweden-tunisia-world-cup-match-report",
    ],
    scorers: {
      "Svezia": ["Yasin Ayari", "Yasin Ayari", "Viktor Gyokeres", "Alexander Isak", "Mattias Svanberg"],
      "Tunisia": ["Omar Rekik"],
    },
    notes: [
      "Svezia dominante: doppietta Ayari, gol di Gyokeres, Isak e Svanberg.",
      "Tunisia disordinata e punita da errori difensivi; Rekik segna il gol della bandiera.",
    ],
  },
};

function worldCupResultFor(matchNumber) {
  return worldCupResults[Number(matchNumber)] || null;
}
