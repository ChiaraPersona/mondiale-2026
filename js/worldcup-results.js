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
  13: {
    status: "Finale",
    home: 0,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/capo-verde-MocyWdm7/spagna-bLyo6mco/?mid=Iiqjm5Pq",
    sources: [
      "https://www.diretta.it/partita/calcio/capo-verde-MocyWdm7/spagna-bLyo6mco/?mid=Iiqjm5Pq",
      "https://www.theguardian.com/football/live/2026/jun/15/spain-v-cape-verde-world-cup-2026-live",
      "https://www.managingmadrid.com/real-madrid-cf-players/108084/marc-cucurella-impresses-despite-spains-0-0-draw-with-cape-verde",
    ],
    scorers: {
      "Spagna": [],
      "Capo Verde": [],
    },
    notes: [
      "Capo Verde strappa uno storico 0-0 al debutto mondiale contro la Spagna.",
      "Spagna dominante nel possesso ma poco incisiva; Vozinha e Pico Lopes protagonisti difensivi.",
    ],
  },
  14: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/belgio-GbB957na/egitto-bejDn7NN/?mid=dG7zgzd5",
    sources: [
      "https://www.diretta.it/partita/calcio/belgio-GbB957na/egitto-bejDn7NN/?mid=dG7zgzd5",
      "https://www.theguardian.com/football/2026/jun/15/belgium-egypt-world-cup-2026-group-g-match-report",
    ],
    scorers: {
      "Belgio": ["Autogol Mohamed Hany"],
      "Egitto": ["Emam Ashour"],
    },
    notes: [
      "Egitto avanti con Emam Ashour su assist di Salah.",
      "Lukaku entra e forza l'autogol di Mohamed Hany che salva il Belgio.",
    ],
  },
  15: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/arabia-saudita-biSY8ox4/uruguay-xMk44orG/?mid=Olnboqfd",
    sources: [
      "https://www.diretta.it/partita/calcio/arabia-saudita-biSY8ox4/uruguay-xMk44orG/?mid=Olnboqfd",
      "https://www.theguardian.com/football/live/2026/jun/15/saudi-arabia-v-uruguay-world-cup-2026-live",
    ],
    scorers: {
      "Arabia Saudita": ["Abdulelah Al-Amri"],
      "Uruguay": ["Maxi Araujo"],
    },
    notes: [
      "Arabia Saudita avanti con Al-Amri dopo corner e respinta corta.",
      "Uruguay pareggia all'80' con Maxi Araujo dopo una ripresa di maggiore pressione.",
    ],
  },
  16: {
    status: "Finale",
    home: 2,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/iran-xrRx85iA/nuova-zelanda-rLctHkpU/?mid=4tBriEQH",
    sources: [
      "https://www.diretta.it/partita/calcio/iran-xrRx85iA/nuova-zelanda-rLctHkpU/?mid=4tBriEQH",
      "https://www.theguardian.com/football/live/2026/jun/16/fifa-world-cup-2026-live-iran-v-new-zealand-updates-irn-vs-nzl-group-f-match-score-latest",
    ],
    scorers: {
      "Iran": ["Ramin Rezaeian", "Mohammad Mohebi"],
      "Nuova Zelanda": ["Eli Just", "Eli Just"],
    },
    notes: [
      "Nuova Zelanda due volte avanti con Eli Just, entrambe su servizio di Chris Wood.",
      "Iran reagisce due volte con Rezaeian e Mohebi in una gara aperta e intensa.",
    ],
  },
  17: {
    status: "Finale",
    home: 3,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/francia-QkGeVG1n/senegal-hOIsJLJr/?mid=ALxYcMw2",
    sources: [
      "https://www.diretta.it/partita/calcio/francia-QkGeVG1n/senegal-hOIsJLJr/?mid=ALxYcMw2",
      "https://www.nytimes.com/athletic/6429568/2026/06/16/france-senegal-world-cup-2026-live-updates-result/",
      "https://www.theguardian.com/football/2026/jun/16/kylian-mbappe-france-senegal-world-cup-football",
    ],
    scorers: {
      "Francia": ["Kylian Mbappe", "Bradley Barcola", "Kylian Mbappe"],
      "Senegal": ["Ibrahim Mbaye"],
    },
    notes: [
      "Francia piu concreta negli ultimi metri: doppietta di Mbappe e gol di Barcola.",
      "Senegal vivo fisicamente ma punito dalla qualita francese nelle transizioni.",
    ],
  },
  18: {
    status: "Finale",
    home: 1,
    away: 4,
    source: "https://www.diretta.it/partita/calcio/iraq-K8aAGt6r/norvegia-8rP6JO0H/?mid=n9TEVLhA",
    sources: [
      "https://www.diretta.it/partita/calcio/iraq-K8aAGt6r/norvegia-8rP6JO0H/?mid=n9TEVLhA",
      "https://www.theguardian.com/football/2026/jun/16/erling-haaland-iraq-norway-world-cup-football",
      "https://www.nytimes.com/athletic/6429963/2026/06/16/iraq-norway-live-updates-world-cup-2026-result/",
    ],
    scorers: {
      "Iraq": ["Aymen Hussein"],
      "Norvegia": ["Erling Haaland", "Leo Ostigard", "Autogol Iraq", "Erling Haaland"],
    },
    notes: [
      "Norvegia dominante con doppietta di Haaland e grande peso sui piazzati.",
      "Iraq accorcia con Hussein ma non regge ritmo e fisicita norvegese.",
    ],
  },
  19: {
    status: "Finale",
    home: 3,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/algeria-nc87N1BR/argentina-f9OppQjp/?mid=UP9bEsOr",
    sources: [
      "https://www.diretta.it/partita/calcio/algeria-nc87N1BR/argentina-f9OppQjp/?mid=UP9bEsOr",
      "https://www.bbc.com/sport/football/live/c0qgylzndq0t",
      "https://www.theguardian.com/football/2026/jun/17/lionel-messi-argentina-algeria-world-cup-football",
    ],
    scorers: {
      "Argentina": ["Lionel Messi", "Lionel Messi", "Lionel Messi"],
      "Algeria": [],
    },
    notes: [
      "Argentina controlla il debutto nel Gruppo J con tripletta di Messi.",
      "Algeria ordinata a tratti ma senza abbastanza uscita pulita sotto pressione.",
    ],
  },
  20: {
    status: "Finale",
    home: 3,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/austria-naHiWdnt/giordania-vNcmJoU2/?mid=OO27CLhe",
    sources: [
      "https://www.diretta.it/partita/calcio/austria-naHiWdnt/giordania-vNcmJoU2/?mid=OO27CLhe",
      "https://www.theguardian.com/football/2026/jun/17/austria-jordan-world-cup-football",
      "https://www.bbc.com/sport/football/live/cn77yxzqynvt",
    ],
    scorers: {
      "Austria": ["Romano Schmid", "Autogol Yazan Al-Arab", "Marko Arnautovic"],
      "Giordania": ["Ali Olwan"],
    },
    notes: [
      "Austria parte forte e indirizza la gara, poi la chiude con Arnautovic.",
      "Giordania trova il gol con Olwan ma resta troppo fragile nelle palle sporche.",
    ],
  },
  21: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/dr-congo-phn9mm8H/portogallo-WvJrjFVN/?mid=4zTHJLbM",
    sources: [
      "https://www.diretta.it/partita/calcio/dr-congo-phn9mm8H/portogallo-WvJrjFVN/?mid=4zTHJLbM",
      "https://www.theguardian.com/football/2026/jun/17/portugal-dr-congo-world-cup-2026-group-k-match-report",
    ],
    scorers: {
      "Portogallo": ["Joao Neves"],
      "RD Congo": ["Yoane Wissa"],
    },
    notes: [
      "Portogallo avanti al 6' con Joao Neves, poi raggiunto da Wissa nel recupero del primo tempo.",
      "RD Congo compatta e pericolosa in transizione; il Portogallo domina il possesso ma produce un solo tiro in porta.",
    ],
  },
  22: {
    status: "Finale",
    home: 4,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/croazia-K8aznggo/inghilterra-j9N9ZNFA/?mid=b5qGuKMs",
    sources: [
      "https://www.diretta.it/partita/calcio/croazia-K8aznggo/inghilterra-j9N9ZNFA/?mid=b5qGuKMs",
      "https://www.theguardian.com/football/2026/jun/17/england-4-2-croatia-world-cup-2026-group-l-player-ratings",
    ],
    scorers: {
      "Inghilterra": ["Harry Kane", "Jude Bellingham", "Harry Kane", "Marcus Rashford"],
      "Croazia": ["Martin Baturina", "Petar Musa"],
    },
    notes: [
      "Inghilterra molto efficace in attacco: doppietta di Kane, gol di Bellingham e Rashford.",
      "Croazia pericolosa con Baturina e Musa, ma la difesa non regge il ritmo e la profondita inglese.",
    ],
  },
  23: {
    status: "Finale",
    home: 1,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/ghana-nNBjHale/panama-OWKqbCfi/?mid=jD1Nwbif",
    sources: [
      "https://www.diretta.it/partita/calcio/ghana-nNBjHale/panama-OWKqbCfi/?mid=jD1Nwbif",
      "https://timesofindia.indiatimes.com/sports/football/fifa-world-cup/ghana-vs-panama-fifa-world-cup-match-result-yirenkyis-stoppage-time-strike-rescues-ghana-as-black-stars-break-panama-hearts/articleshow/131815764.cms",
    ],
    scorers: {
      "Ghana": ["Caleb Yirenkyi"],
      "Panama": [],
    },
    notes: [
      "Gara bloccata e povera di occasioni, decisa da Yirenkyi nel recupero.",
      "Ghana ottiene tre punti pesanti ma mostra ancora limiti nella produzione offensiva.",
    ],
  },
  24: {
    status: "Finale",
    home: 1,
    away: 3,
    source: "https://www.diretta.it/partita/calcio/colombia-G02s4PCS/uzbekistan-EZYKKRMc/?mid=jaMlPbx1",
    sources: [
      "https://www.diretta.it/partita/calcio/colombia-G02s4PCS/uzbekistan-EZYKKRMc/?mid=jaMlPbx1",
      "https://www.theguardian.com/football/live/2026/jun/18/fifa-world-cup-2026-live-uzbekistan-v-colombia-updates-uzb-vs-col-group-k-match-score-latest",
    ],
    scorers: {
      "Uzbekistan": ["Abbosbek Fayzullaev"],
      "Colombia": ["Daniel Munoz", "Luis Diaz", "Jaminton Campaz"],
    },
    notes: [
      "Colombia concreta nei momenti decisivi con Munoz, Luis Diaz e Campaz.",
      "Uzbekistan coraggioso nella ripresa e in gol con Fayzullaev, ma punito dagli errori individuali.",
    ],
  },
  25: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/repubblica-ceca-6LHwBDGU/sudafrica-W2ijYvlr/?mid=8nrACRTs",
    sources: [
      "https://www.diretta.it/partita/calcio/repubblica-ceca-6LHwBDGU/sudafrica-W2ijYvlr/?mid=8nrACRTs",
      "https://www.theguardian.com/football/live/2026/jun/18/czechia-v-south-africa-world-cup-live",
    ],
    scorers: {
      "Repubblica Ceca": ["Michal Sadilek"],
      "Sudafrica": ["Teboho Mokoena"],
    },
    cards: {
      yellow: [
        { team: "Repubblica Ceca", player: "Ladislav Krejci" },
        { team: "Sudafrica", player: "Teboho Mokoena" },
      ],
    },
    notes: [
      "Repubblica Ceca avanti al 5' con Sadilek, ma troppo passiva dopo il vantaggio.",
      "Mokoena, migliore del Sudafrica, pareggia su rigore all'83'; entrambe restano obbligate a vincere l'ultima partita.",
    ],
  },
};

function worldCupResultFor(matchNumber) {
  return worldCupResults[Number(matchNumber)] || null;
}
