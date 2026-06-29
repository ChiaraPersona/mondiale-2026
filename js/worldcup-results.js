const worldCupResults = {
  1: {
    status: "Finale",
    home: 2,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/messico-O6iHcNkd/sudafrica-W2ijYvlr/?mid=h4EoUB7T",
    sources: [
      "https://www.diretta.it/partita/calcio/messico-O6iHcNkd/sudafrica-W2ijYvlr/?mid=h4EoUB7T",
      "https://nypost.com/2026/06/11/sports/mexico-south-africa-2026-world-cup-saw-three-red-cards/",
      "https://www.thetimes.com/sport/football/world-cup/article/mexico-south-africa-2026-world-cup-result-score-lmdj70rv2",
    ],
    scorers: {
      "Messico": ["Julian Quinones", "Raul Jimenez"],
      "Sudafrica": [],
    },
    cards: {
      yellow: [
        { team: "Messico", player: "Brian Gutierrez" },
        { team: "Sudafrica", player: "Teboho Mokoena" },
        { team: "Sudafrica", player: "Nkosinathi Sibisi" },
      ],
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
  26: {
    status: "Finale",
    home: 4,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/bosnia-erzegovina-fqe7WYTr/svizzera-rHJ2vy1B/?mid=djmY6NcJ",
    sources: [
      "https://www.diretta.it/partita/calcio/bosnia-erzegovina-fqe7WYTr/svizzera-rHJ2vy1B/?mid=djmY6NcJ",
    ],
    scorers: {
      "Svizzera": ["Johan Manzambi", "Ruben Vargas", "Johan Manzambi", "Granit Xhaka"],
      "Bosnia ed Erzegovina": ["Ermin Mahmic"],
    },
    cards: {
      yellow: [
        { team: "Svizzera", player: "Nico Elvedi" },
        { team: "Bosnia ed Erzegovina", player: "Amar Dedic" },
        { team: "Bosnia ed Erzegovina", player: "Edin Dzeko" },
      ],
      red: [
        { team: "Bosnia ed Erzegovina", player: "Tarik Muharemovic" },
      ],
    },
    notes: [
      "Svizzera-Bosnia resta bloccata fino al 74', poi la Svizzera dilaga con la doppietta di Manzambi, Vargas e il rigore finale di Xhaka.",
      "Il rosso a Muharemovic all'80' spezza definitivamente l'equilibrio; Mahmic segna il momentaneo 3-1 nel recupero.",
      "Svizzera superiore: 13-5 nei tiri, 7-3 in porta, 2,06-0,23 negli xG e 62% di possesso.",
    ],
  },
  27: {
    status: "Finale",
    home: 6,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/canada-x4toKORL/qatar-zqzHL77i/?mid=67vLrBMM",
    sources: [
      "https://www.diretta.it/partita/calcio/canada-x4toKORL/qatar-zqzHL77i/?mid=67vLrBMM",
    ],
    scorers: {
      "Canada": ["Cyle Larin", "Jonathan David", "Jonathan David", "Nathan Saliba", "Autogol Mohammad Al Mannai", "Jonathan David"],
      "Qatar": [],
    },
    cards: {
      yellow: [
        { team: "Canada", player: "Derek Cornelius" },
        { team: "Qatar", player: "Ahmed Fathi" },
      ],
      red: [
        { team: "Qatar", player: "Homam Ahmed Al-Amin" },
        { team: "Qatar", player: "Assim Madibo" },
      ],
    },
    notes: [
      "Canada travolge il Qatar 6-0: tripletta di Jonathan David, reti di Larin e Saliba più l'autogol di Al Mannai.",
      "Dominio canadese totale: 32-2 nei tiri, 10-0 in porta, 4,60-0,22 negli xG e 79% di possesso.",
      "Qatar rimane in nove uomini dopo le espulsioni di Al-Amin al 33' e Madibo al 53'.",
    ],
  },
  28: {
    status: "Finale",
    home: 1,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/corea-del-sud-K6Gs7P6G/messico-O6iHcNkd/?mid=On5HOkVj",
    sources: [
      "https://www.diretta.it/partita/calcio/corea-del-sud-K6Gs7P6G/messico-O6iHcNkd/?mid=On5HOkVj",
    ],
    scorers: {
      "Messico": ["Luis Romo"],
      "Corea del Sud": [],
    },
    cards: {
      yellow: [
        { team: "Corea del Sud", player: "Lee Kang-In" },
        { team: "Corea del Sud", player: "Paik Seung-Ho" },
      ],
    },
    notes: [
      "Luis Romo decide al 50' una partita molto equilibrata e porta il Messico alla seconda vittoria consecutiva.",
      "La Corea del Sud produce più possesso e più xG, ma il Messico è più preciso: 4-2 nei tiri in porta.",
      "Statistiche complessive: tiri 8-9, xG 0,52-0,91 e possesso 42%-58%.",
    ],
  },
  29: {
    status: "Finale",
    home: 2,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/australia-xSrf6qMM/usa-fuitL4CF/?mid=S0aAVubs",
    sources: [
      "https://www.diretta.it/partita/calcio/australia-xSrf6qMM/usa-fuitL4CF/?mid=S0aAVubs",
    ],
    scorers: {
      "Stati Uniti": ["Autogol Cameron Burgess", "Alex Freeman"],
      "Australia": [],
    },
    cards: {
      yellow: [
        { team: "Stati Uniti", player: "Antonee Robinson" },
        { team: "Stati Uniti", player: "Folarin Balogun" },
        { team: "Stati Uniti", player: "Chris Richards" },
        { team: "Australia", player: "Jordan Bos" },
        { team: "Australia", player: "Alessandro Circati" },
        { team: "Australia", player: "Harry Souttar" },
        { team: "Australia", player: "Alessandro Italiano" },
      ],
    },
    notes: [
      "USA vincono 2-0 con l'autogol di Burgess e la rete di Alex Freeman.",
      "Partita meno ricca di tiri del previsto: 10-5 complessivi e 2-2 nello specchio; xG 1,08-0,34.",
      "USA superiori nei corner 7-4; Australia piu ammonita, quattro gialli contro tre.",
    ],
  },
  30: {
    status: "Finale",
    home: 0,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/marocco-IDKYO3R8/scozia-fZRU25WH/?mid=nRafcAyG",
    sources: [
      "https://www.diretta.it/partita/calcio/marocco-IDKYO3R8/scozia-fZRU25WH/?mid=nRafcAyG",
    ],
    scorers: {
      "Scozia": [],
      "Marocco": ["Ismael Saibari"],
    },
    cards: {
      yellow: [
        { team: "Scozia", player: "Andy Robertson" },
        { team: "Marocco", player: "Issa Diop" },
      ],
    },
    notes: [
      "Saibari segna al 2' e il Marocco gestisce fino allo 0-1 finale.",
      "Scozia senza tiri in porta: 6-12 nei tentativi, 0-2 nello specchio e xG 0,52-1,00.",
      "Marocco avanti anche nei corner 5-2 e nel possesso 59%-41%.",
    ],
  },
  31: {
    status: "Finale",
    home: 3,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/brasile-I9l9aqLq/haiti-nk4v10Z1/?mid=IRyRv2Ll",
    sources: [
      "https://www.diretta.it/partita/calcio/brasile-I9l9aqLq/haiti-nk4v10Z1/?mid=IRyRv2Ll",
    ],
    scorers: {
      "Brasile": ["Matheus Cunha", "Matheus Cunha", "Vinicius Junior"],
      "Haiti": [],
    },
    cards: {
      yellow: [
        { team: "Brasile", player: "Douglas Santos" },
        { team: "Haiti", player: "Carlens Arcus" },
        { team: "Haiti", player: "Frantzdy Pierrot" },
        { team: "Haiti", player: "Danley Jean Jacques" },
      ],
    },
    notes: [
      "Brasile chiude la gara nel primo tempo: doppietta di Cunha e gol di Vinicius Junior.",
      "Vittoria efficiente con 8-7 nei tiri, 5-3 nello specchio e xG 1,75-0,23.",
      "Corner in parita 4-4; Haiti riceve tre dei quattro cartellini.",
    ],
  },
  32: {
    status: "Finale",
    home: 0,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/paraguay-YaNlqp6j/turchia-QeijuHo5/?mid=KnyuOLXH",
    sources: [
      "https://www.diretta.it/partita/calcio/paraguay-YaNlqp6j/turchia-QeijuHo5/?mid=KnyuOLXH",
    ],
    scorers: {
      "Turchia": [],
      "Paraguay": ["Matias Galarza"],
    },
    cards: {
      yellow: [
        { team: "Turchia", player: "Eren Elmali" },
        { team: "Paraguay", player: "Matias Galarza" },
      ],
      red: [
        { team: "Paraguay", player: "Miguel Almiron" },
      ],
    },
    notes: [
      "Galarza segna al 2' e il Paraguay resiste fino allo 0-1 nonostante il rosso ad Almiron nel recupero del primo tempo.",
      "Turchia dominante ma inefficace: 32-7 nei tiri, 5-2 in porta, 12-0 nei corner e xG 2,17-0,33.",
      "Il risultato smentisce il pronostico sul segno, ma conferma nettamente Turchia piu corner e la lettura disciplinare su Barton.",
    ],
  },
  33: {
    status: "Finale",
    home: 5,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/olanda-WYintcWb/svezia-OQyqbHWB/?mid=0rAjVxuo",
    sources: [
      "https://www.diretta.it/partita/calcio/olanda-WYintcWb/svezia-OQyqbHWB/?mid=0rAjVxuo",
    ],
    scorers: {
      "Olanda": ["Brian Brobbey", "Brian Brobbey", "Cody Gakpo", "Cody Gakpo", "Crysencio Summerville"],
      "Svezia": ["Anthony Elanga"],
    },
    notes: [
      "Olanda travolgente nel punteggio: doppiette di Brobbey e Gakpo, poi il quinto gol di Summerville.",
      "Elanga segna per la Svezia, che produce otto tiri in porta contro i sette olandesi ma paga una differenza enorme nella finalizzazione.",
      "La Svezia ottiene anche piu corner: il 5-1 nasce soprattutto dall'efficienza offensiva olandese.",
    ],
  },
  34: {
    status: "Finale",
    home: 2,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/costa-d-avorio-G2FRjBgn/germania-ptQide1O/?mid=SMzorJsm",
    sources: [
      "https://www.diretta.it/partita/calcio/costa-d-avorio-G2FRjBgn/germania-ptQide1O/?mid=SMzorJsm",
    ],
    scorers: {
      "Germania": ["Deniz Undav", "Deniz Undav"],
      "Costa d'Avorio": ["Franck Kessie"],
    },
    notes: [
      "Kessie porta avanti la Costa d'Avorio, poi Undav ribalta la partita con una doppietta e il 2-1 al 90+4'.",
      "Germania superiore per tiri 16-9, tiri in porta 7-2, corner 8-3 e xG 1,89-1,22.",
      "Confermati Germania vincente, Under 3,5, Multigol 2-4 e Germania piu corner; il risultato centrale 2-0 non viene preso.",
    ],
  },
  35: {
    status: "Finale",
    home: 0,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/curacao-bLLGpOkQ/ecuador-8tbm8Tri/?mid=p2XLmuKP",
    sources: [
      "https://www.diretta.it/partita/calcio/curacao-bLLGpOkQ/ecuador-8tbm8Tri/?mid=p2XLmuKP",
    ],
    scorers: {
      "Ecuador": [],
      "Curacao": [],
    },
    cards: {
      yellow: [
        { team: "Ecuador", player: "Jordy Alcivar" },
        { team: "Curacao", player: "Leandro Bacuna" },
        { team: "Curacao", player: "Juninho Bacuna" },
        { team: "Curacao", player: "Livano Comenencia" },
        { team: "Curacao", player: "Jurien Gaari" },
        { team: "Curacao", player: "Gervane Kastaneer" },
      ],
    },
    notes: [
      "Room ferma l'Ecuador con 15 parate e consente a Curacao di conquistare uno 0-0 inatteso.",
      "Dominio ecuadoriano senza gol: 27-10 nei tiri, 15-3 nello specchio, 9-0 nei corner, 75% di possesso e xG 2,84-0,50.",
      "Sbagliati vincente Ecuador, Over 2,5 e risultato; confermati No Goal, Under 4,5, Ecuador piu corner e Curacao piu ammonita.",
    ],
  },
  36: {
    status: "Finale",
    home: 0,
    away: 4,
    source: "https://www.diretta.it/partita/calcio/giappone-ULXPdOUj/tunisia-QqZVYk95/?mid=SzGJdIdt",
    sources: [
      "https://www.diretta.it/partita/calcio/giappone-ULXPdOUj/tunisia-QqZVYk95/?mid=SzGJdIdt",
    ],
    scorers: {
      "Tunisia": [],
      "Giappone": ["Daichi Kamada", "Ayase Ueda", "Junya Ito", "Ayase Ueda"],
    },
    notes: [
      "Giappone in controllo dall'inizio: Kamada apre al 4', Ueda segna una doppietta e Junya Ito completa il 4-0.",
      "Superiorita netta: 11-2 nei tiri, 5-0 nello specchio, 5-3 nei corner, 62% di possesso e xG 2,13-0,04.",
      "Confermati Giappone vincente, No Goal, Ueda in porta e Giappone piu corner; sbagliati Under 2,5 e Multigol 1-3.",
    ],
  },
  37: {
    status: "Finale",
    home: 4,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/arabia-saudita-biSY8ox4/spagna-bLyo6mco/?mid=CASh7QGF",
    sources: [
      "https://www.diretta.it/partita/calcio/arabia-saudita-biSY8ox4/spagna-bLyo6mco/?mid=CASh7QGF",
      "https://www.theguardian.com/football/2026/jun/21/spain-saudi-arabia-world-cup-match-report",
    ],
    scorers: {
      "Spagna": ["Yeremy Pino", "Martin Zubimendi", "Lamine Yamal", "Lamine Yamal"],
      "Arabia Saudita": [],
    },
    notes: [
      "Spagna vince 4-0: Pino apre, Zubimendi raddoppia e Yamal chiude con una doppietta.",
      "Dopo lo 0-0 con Capo Verde, la Spagna ritrova efficacia e sale a quattro punti nel Gruppo H.",
      "Confermati Spagna vincente, No Goal, Multigol 2-4 e Spagna piu corner; l'Under 3,5 e il risultato esatto 2-0 saltano per il quarto gol.",
    ],
  },
  38: {
    status: "Finale",
    home: 0,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/belgio-GbB957na/iran-xrRx85iA/?mid=fBZ09etn",
    sources: [
      "https://www.diretta.it/partita/calcio/belgio-GbB957na/iran-xrRx85iA/?mid=fBZ09etn",
      "https://www.theguardian.com/football/2026/jun/21/belgium-iran-world-cup-match-report",
    ],
    scorers: {
      "Belgio": [],
      "Iran": [],
    },
    cards: {
      red: [
        { team: "Belgio", player: "Nathan Ngoy" },
      ],
    },
    notes: [
      "Belgio fermato sullo 0-0 dall'Iran e ancora senza vittorie dopo due giornate.",
      "Beiranvand decisivo nel finale; Ngoy espulso nel recupero dopo revisione VAR.",
      "Confermati Under 3,5 e No Goal; sbagliati Belgio vincente, Multigol 2-4 e risultato 2-0.",
    ],
  },
  39: {
    status: "Finale",
    home: 2,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/capo-verde-MocyWdm7/uruguay-xMk44orG/?mid=4pPp9nn3",
    sources: [
      "https://www.diretta.it/partita/calcio/capo-verde-MocyWdm7/uruguay-xMk44orG/?mid=4pPp9nn3",
      "https://www.theguardian.com/football/2026/jun/21/uruguay-cape-verde-world-cup-match-report",
    ],
    scorers: {
      "Uruguay": ["Rodrigo Bentancur", "Darwin Nunez"],
      "Capo Verde": ["Nuno Moreira", "Helio Varela"],
    },
    notes: [
      "Capo Verde rimonta due volte l'Uruguay e conquista il secondo pareggio del torneo.",
      "Bentancur e Darwin Nunez segnano per l'Uruguay; Nuno Moreira e Helio Varela rispondono per Capo Verde.",
      "Smentiti Uruguay vincente, Under 2,5, No Goal e Multigol 1-3: la partita termina 2-2.",
    ],
  },
  40: {
    status: "Finale",
    home: 1,
    away: 3,
    source: "https://www.diretta.it/partita/calcio/egitto-bejDn7NN/nuova-zelanda-rLctHkpU/?mid=QeaikheU",
    sources: [
      "https://www.diretta.it/partita/calcio/egitto-bejDn7NN/nuova-zelanda-rLctHkpU/?mid=QeaikheU",
      "https://www.theguardian.com/football/2026/jun/21/new-zealand-egypt-world-cup-match-report",
    ],
    scorers: {
      "Nuova Zelanda": ["Kosta Barbarouses"],
      "Egitto": ["Ahmed Zizo", "Mohamed Salah", "Trezeguet"],
    },
    notes: [
      "Nuova Zelanda avanti con Barbarouses, poi Egitto in rimonta con Zizo, Salah e Trezeguet.",
      "L'Egitto sale a quattro punti e guida il Gruppo G dopo due giornate.",
      "Confermati Egitto vincente, Goal e Multigol 2-4; il risultato 1-2 e l'Under 3,5 saltano per il terzo gol egiziano.",
    ],
  },
  41: {
    status: "Finale",
    home: 2,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/argentina-f9OppQjp/austria-naHiWdnt/?mid=Cpq2Y2FE",
    sources: [
      "https://www.diretta.it/partita/calcio/argentina-f9OppQjp/austria-naHiWdnt/?mid=Cpq2Y2FE",
      "https://www.theguardian.com/football/2026/jun/22/argentina-austria-world-cup-match-report",
    ],
    scorers: {
      "Argentina": ["Lionel Messi", "Lionel Messi"],
      "Austria": [],
    },
    notes: [
      "Argentina vince 2-0 con una doppietta di Messi e si qualifica ai sedicesimi con una giornata d'anticipo.",
      "Messi sbaglia un rigore sullo 0-0, poi segna entrambe le reti; l'Argentina controlla circa l'80% del possesso.",
      "Pronostico pienamente centrato: risultato esatto 2-0, Argentina vincente, No Goal, Under 3,5, Multigol 2-4 e Messi 2+ tiri.",
    ],
  },
  42: {
    status: "Finale",
    home: 3,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/francia-QkGeVG1n/iraq-K8aAGt6r/?mid=KMRMTaNM",
    sources: [
      "https://www.diretta.it/partita/calcio/francia-QkGeVG1n/iraq-K8aAGt6r/?mid=KMRMTaNM",
      "https://www.theguardian.com/football/2026/jun/23/france-iraq-world-cup-group-i-match-report",
    ],
    scorers: {
      "Francia": ["Kylian Mbappe", "Kylian Mbappe", "Ousmane Dembele"],
      "Iraq": [],
    },
    notes: [
      "Francia vince 3-0 con una doppietta di Mbappe e il gol di Dembele, qualificandosi con una giornata d'anticipo.",
      "Superiorita francese: 15-6 nei tiri, 8-3 nei corner e xG 2,03-0,35.",
      "Pronostico quasi pieno: risultato esatto 3-0, Francia vincente, No Goal e Multigol 3-5.",
    ],
  },
  43: {
    status: "Finale",
    home: 3,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/norvegia-8rP6JO0H/senegal-hOIsJLJr/?mid=xSUJLPV8",
    sources: [
      "https://www.diretta.it/partita/calcio/norvegia-8rP6JO0H/senegal-hOIsJLJr/?mid=xSUJLPV8",
      "https://www.theguardian.com/football/2026/jun/23/norway-senegal-world-cup-group-i-match-report",
    ],
    scorers: {
      "Norvegia": ["Marcus Holmgren Pedersen", "Erling Haaland", "Erling Haaland"],
      "Senegal": ["Ismaila Sarr", "Ismaila Sarr"],
    },
    notes: [
      "Norvegia vince 3-2: Pedersen apre e Haaland firma una doppietta; Sarr segna entrambe le reti del Senegal.",
      "La Norvegia sale a sei punti e si qualifica insieme alla Francia; il Senegal resta a zero.",
      "Confermati Norvegia vincente, Goal e Over 2,5; il Multigol 2-4 e il risultato 2-1 saltano per il quinto gol.",
      "Il primo ammonito non e indicato nelle cronache verificate: previsione Pape Gueye ancora da confrontare con il referto completo.",
    ],
  },
  44: {
    status: "Finale",
    home: 1,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/algeria-nc87N1BR/giordania-vNcmJoU2/?mid=dx1FAaN7",
    sources: [
      "https://www.diretta.it/partita/calcio/algeria-nc87N1BR/giordania-vNcmJoU2/?mid=dx1FAaN7",
      "https://www.theguardian.com/football/live/2026/jun/22/jordan-v-algeria-world-cup-2026-live",
    ],
    scorers: {
      "Giordania": ["Nizar Al-Rashdan"],
      "Algeria": ["Nadhir Benbouali", "Amine Gouiri"],
    },
    notes: [
      "Algeria rimonta e vince 2-1: Al-Rashdan porta avanti la Giordania, Benbouali e Gouiri ribaltano la partita.",
      "La squadra di Petkovic reagisce alla sconfitta con l'Argentina e torna pienamente in corsa nel Gruppo J.",
      "Pronostico esatto: Algeria vincente, Goal, Multigol 2-4 e risultato 1-2.",
    ],
  },
  45: {
    status: "Finale",
    home: 5,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/portogallo-WvJrjFVN/uzbekistan-EZYKKRMc/?mid=nRFcNx7D",
    sources: [
      "https://www.diretta.it/partita/calcio/portogallo-WvJrjFVN/uzbekistan-EZYKKRMc/?mid=nRFcNx7D",
      "https://www.theguardian.com/football/2026/jun/23/portugal-uzbekistan-world-cup-2026-group-k-match-report",
    ],
    scorers: {
      "Portogallo": ["Cristiano Ronaldo", "Cristiano Ronaldo", "Bruno Fernandes", "Pedro Neto", "Joao Felix"],
      "Uzbekistan": [],
    },
    notes: [
      "Portogallo dilaga 5-0 contro l'Uzbekistan, con Ronaldo decisivo e attacco finalmente molto piu verticale.",
      "Confermati Portogallo vincente, No Goal, Ronaldo 2+ tiri e Portogallo piu corner; sbagliati Under 4,5, Multigol 2-4 e risultato 2-0.",
    ],
  },
  46: {
    status: "Finale",
    home: 0,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/ghana-nNBjHale/inghilterra-j9N9ZNFA/?mid=KhgvzGjJ",
    sources: [
      "https://www.diretta.it/partita/calcio/ghana-nNBjHale/inghilterra-j9N9ZNFA/?mid=KhgvzGjJ",
      "https://www.theguardian.com/football/2026/jun/23/england-ghana-world-cup-2026-group-l-match-report",
    ],
    scorers: {
      "Inghilterra": [],
      "Ghana": [],
    },
    notes: [
      "Inghilterra e Ghana chiudono 0-0: la superiorita inglese non si traduce in gol.",
      "Confermati No Goal e Under 4,5; sbagliati Inghilterra vincente, Multigol 2-4, Kane 2+ tiri se non confermato dal referto e risultato 2-0.",
    ],
  },
  47: {
    status: "Finale",
    home: 0,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/croazia-K8aznggo/panama-OWKqbCfi/?mid=CSkWyxM6",
    sources: [
      "https://www.diretta.it/partita/calcio/croazia-K8aznggo/panama-OWKqbCfi/?mid=CSkWyxM6",
      "https://www.theguardian.com/football/2026/jun/24/panama-croatia-world-cup-2026-group-l-match-report",
    ],
    scorers: {
      "Panama": [],
      "Croazia": ["Ante Budimir"],
    },
    notes: [
      "Croazia batte Panama 1-0 con Budimir e torna in piena corsa nel Gruppo L.",
      "Confermati Croazia vincente, Under 3,5, Multigol 1-3 e Budimir 2+ tiri se confermato dal referto; il 2-0 centrale non entra.",
    ],
  },
  48: {
    status: "Finale",
    home: 1,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/colombia-G02s4PCS/dr-congo-phn9mm8H/?mid=K0YnEaMq",
    sources: [
      "https://www.diretta.it/partita/calcio/colombia-G02s4PCS/dr-congo-phn9mm8H/?mid=K0YnEaMq",
      "https://www.theguardian.com/football/2026/jun/24/colombia-dr-congo-world-cup-2026-group-k-match-report",
    ],
    scorers: {
      "Colombia": ["Daniel Munoz"],
      "DR Congo": [],
    },
    notes: [
      "Colombia batte DR Congo 1-0 con gol di Daniel Munoz.",
      "Confermati Colombia vincente, No Goal, Under 3,5, Multigol 1-3 e Colombia piu corner; il 2-0 centrale non entra.",
    ],
  },
  49: {
    status: "Finale",
    home: 2,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/canada-x4toKORL/svizzera-rHJ2vy1B/?mid=2wQjwkpp",
    sources: [
      "https://www.diretta.it/partita/calcio/canada-x4toKORL/svizzera-rHJ2vy1B/?mid=2wQjwkpp",
    ],
    scorers: {
      "Svizzera": [],
      "Canada": [],
    },
    notes: [
      "Svizzera batte Canada 2-1 nella terza giornata del Gruppo B.",
      "Per la lettura sono confermati Goal e Under 3,5; il pareggio centrale 1-1 non entra.",
    ],
  },
  50: {
    status: "Finale",
    home: 3,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/bosnia-erzegovina-fqe7WYTr/qatar-zqzHL77i/?mid=jRyHEZGP",
    sources: [
      "https://www.diretta.it/partita/calcio/bosnia-erzegovina-fqe7WYTr/qatar-zqzHL77i/?mid=jRyHEZGP",
    ],
    scorers: {
      "Bosnia ed Erzegovina": [],
      "Qatar": [],
    },
    notes: [
      "Bosnia-Erzegovina batte Qatar 3-1 e conferma la superiorita indicata dal pronostico.",
      "Presi Bosnia vincente, Over 1,5 e Multigol 2-4; il 2-1 centrale diventa 3-1.",
    ],
  },
  51: {
    status: "Finale",
    home: 4,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/haiti-nk4v10Z1/marocco-IDKYO3R8/?mid=n7TsyKKD",
    sources: [
      "https://www.diretta.it/partita/calcio/haiti-nk4v10Z1/marocco-IDKYO3R8/?mid=n7TsyKKD",
    ],
    scorers: {
      "Marocco": [],
      "Haiti": [],
    },
    notes: [
      "Marocco batte Haiti 4-2 in una gara molto piu aperta del previsto.",
      "Preso il segno Marocco; sbagliati No Goal e risultato centrale 3-0.",
    ],
  },
  52: {
    status: "Finale",
    home: 0,
    away: 3,
    source: "https://www.diretta.it/partita/calcio/brasile-I9l9aqLq/scozia-fZRU25WH/?mid=EgVZxtj1",
    sources: [
      "https://www.diretta.it/partita/calcio/brasile-I9l9aqLq/scozia-fZRU25WH/?mid=EgVZxtj1",
    ],
    scorers: {
      "Scozia": [],
      "Brasile": [],
    },
    notes: [
      "Brasile batte Scozia 3-0 e chiude senza subire gol.",
      "Presi Brasile vincente, No Goal, Under 4,5 e Multigol 2-4; il risultato centrale 0-2 resta stretto.",
    ],
  },
  53: {
    status: "Finale",
    home: 1,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/corea-del-sud-K6Gs7P6G/sudafrica-W2ijYvlr/?mid=4rr4ngNc",
    sources: [
      "https://www.diretta.it/partita/calcio/corea-del-sud-K6Gs7P6G/sudafrica-W2ijYvlr/?mid=4rr4ngNc",
    ],
    scorers: {
      "Sudafrica": [],
      "Corea del Sud": [],
    },
    notes: [
      "Sudafrica batte Corea del Sud 1-0 e smentisce la lettura favorevole alla Corea.",
      "Sbagliati X2, Over 1,5, Goal e risultato centrale 1-2.",
    ],
  },
  54: {
    status: "Finale",
    home: 0,
    away: 3,
    source: "https://www.diretta.it/partita/calcio/messico-O6iHcNkd/repubblica-ceca-6LHwBDGU/?mid=GCoIA5bf",
    sources: [
      "https://www.diretta.it/partita/calcio/messico-O6iHcNkd/repubblica-ceca-6LHwBDGU/?mid=GCoIA5bf",
    ],
    scorers: {
      "Repubblica Ceca": [],
      "Messico": [],
    },
    notes: [
      "Messico batte Repubblica Ceca 3-0 e conferma la superiorita indicata dalle quote.",
      "Presi X2, Messico vincente, Over 1,5 e Multigol 2-4; sbagliato il Goal previsto.",
    ],
  },
  55: {
    status: "Finale",
    home: 0,
    away: 2,
    source: "https://www.diretta.it/partita/calcio/costa-d-avorio-G2FRjBgn/curacao-bLLGpOkQ/?mid=d2S1vysC",
    sources: [
      "https://www.diretta.it/partita/calcio/costa-d-avorio-G2FRjBgn/curacao-bLLGpOkQ/?mid=d2S1vysC",
    ],
    scorers: {
      "Curacao": [],
      "Costa d'Avorio": ["Nicolas Pepe", "Nicolas Pepe"],
    },
    notes: [
      "Costa d'Avorio batte Curacao 2-0 con una doppietta di Nicolas Pepe.",
      "Pronostico centrato: risultato esatto 0-2, Costa d'Avorio vincente, No Goal e Multigol 1-3.",
      "Confermata anche la lettura sul peso offensivo di Pepe nel 4-4-2 ivoriano.",
    ],
  },
  56: {
    status: "Finale",
    home: 2,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/ecuador-8tbm8Tri/germania-ptQide1O/?mid=zmvgtcCa",
    sources: [
      "https://www.diretta.it/partita/calcio/ecuador-8tbm8Tri/germania-ptQide1O/?mid=zmvgtcCa",
    ],
    scorers: {
      "Ecuador": ["Jose Angulo", "Gonzalo Plata"],
      "Germania": ["Leroy Sane"],
    },
    cards: {
      yellow: [
        { team: "Ecuador", player: "Piero Hincapie" },
        { team: "Ecuador", player: "Alan Franco" },
        { team: "Ecuador", player: "Gonzalo Plata" },
        { team: "Germania", player: "Aleksandar Pavlovic" },
      ],
    },
    notes: [
      "Ecuador batte Germania 2-1: Sane apre, poi Angulo e Plata ribaltano la partita.",
      "Il turnover e la qualificazione gia acquisita della Germania pesano piu del previsto nella lettura finale.",
      "Presi Goal e fascia Multigol 2-4; sbagliati Germania vincente, risultato centrale 1-2 e primo ammonito.",
    ],
  },
  58: {
    status: "Finale",
    home: 1,
    away: 3,
    source: "https://www.diretta.it/",
    sources: [
      "https://www.diretta.it/",
    ],
    scorers: {
      "Tunisia": [],
      "Olanda": [],
    },
    notes: [
      "Olanda batte Tunisia 3-1 con dominio territoriale netto: possesso 71%-29%, tiri 20-10 e tocchi in area 44-11.",
      "xG 1,84-0,62 per l'Olanda, ma xGOT 2,22-0,94 per la Tunisia: partita vinta dagli olandesi nel volume e nella gestione.",
      "Dati Diretta.it verificati e inseriti nello storico del modello.",
    ],
  },
  59: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/giappone-ULXPdOUj/svezia-OQyqbHWB/?mid=Sl2xgtXi",
    sources: [
      "https://www.diretta.it/partita/calcio/giappone-ULXPdOUj/svezia-OQyqbHWB/?mid=Sl2xgtXi",
    ],
    scorers: {
      "Giappone": ["Daizen Maeda"],
      "Svezia": ["Anthony Elanga"],
    },
    notes: [
      "Giappone e Svezia chiudono 1-1: Maeda porta avanti il Giappone, Elanga pareggia per la Svezia.",
      "Il risultato smentisce il segno Giappone vincente ma conferma Goal, Over 1,5 e lo scenario alternativo 1-1 indicato nella lettura.",
      "Giappone secondo nel Gruppo F; Svezia qualificata tra le migliori terze.",
    ],
  },
  60: {
    status: "Finale",
    home: 3,
    away: 2,
    source: "https://www.diretta.it/",
    sources: [
      "https://www.diretta.it/",
    ],
    scorers: {
      "Turchia": [],
      "Stati Uniti": [],
    },
    notes: [
      "Turchia batte Stati Uniti 3-2 in una partita ad altissimo volume offensivo: xG 3,00-2,12 e grandi occasioni 5-4.",
      "USA avanti per tiri, 18-9, tiri in porta, 7-3, corner, 9-2, e possesso 53%-47%, ma meno efficienti nel rapporto gol/xG.",
      "Dati Diretta.it verificati e inseriti nello storico del modello.",
    ],
  },
  61: {
    status: "Finale",
    home: 0,
    away: 0,
    source: "https://www.diretta.it/",
    sources: [
      "https://www.diretta.it/",
    ],
    scorers: {
      "Paraguay": [],
      "Australia": [],
    },
    notes: [
      "Paraguay e Australia chiudono 0-0: gara povera di grandi occasioni, 0-0 anche nel dato Diretta.it.",
      "Australia produce piu volume: xG 0,55-0,24, tiri 12-7, tiri in porta 5-2 e possesso 56%-44%.",
      "Dati Diretta.it verificati e inseriti nello storico del modello.",
    ],
  },
  62: {
    status: "Finale",
    home: 1,
    away: 4,
    source: "https://www.diretta.it/partita/calcio/francia-QkGeVG1n/norvegia-8rP6JO0H/?mid=bsJSJ30L",
    sources: [
      "https://www.diretta.it/partita/calcio/francia-QkGeVG1n/norvegia-8rP6JO0H/?mid=bsJSJ30L",
    ],
    scorers: {
      "Norvegia": [],
      "Francia": [],
    },
    notes: [
      "Francia batte Norvegia 4-1 e conferma la lettura favorevole ai francesi.",
      "Presi Francia vincente, Over 2,5, Francia segna e Goal; mancato soltanto il risultato esatto 1-3.",
    ],
  },
  63: {
    status: "Finale",
    home: 5,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/iraq-K8aAGt6r/senegal-hOIsJLJr/?mid=j5IhOwop",
    sources: [
      "https://www.diretta.it/partita/calcio/iraq-K8aAGt6r/senegal-hOIsJLJr/?mid=j5IhOwop",
    ],
    scorers: {
      "Senegal": [],
      "Iraq": [],
    },
    notes: [
      "Senegal batte Iraq 5-0 e conferma nettamente la lettura pre-partita.",
      "Presi Senegal vincente, No Goal e Over 2,5; mancato soltanto il risultato esatto 3-0.",
    ],
  },
  64: {
    status: "Finale",
    home: 0,
    away: 0,
    source: "https://www.diretta.it/partita/calcio/arabia-saudita-biSY8ox4/capo-verde-MocyWdm7/?mid=487Xar9k",
    sources: [
      "https://www.diretta.it/partita/calcio/arabia-saudita-biSY8ox4/capo-verde-MocyWdm7/?mid=487Xar9k",
    ],
    scorers: {
      "Capo Verde": [],
      "Arabia Saudita": [],
    },
    notes: [
      "Capo Verde e Arabia Saudita chiudono 0-0 nell'ultima giornata del Gruppo H.",
    ],
  },
  65: {
    status: "Finale",
    home: 0,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/spagna-bLyo6mco/uruguay-xMk44orG/?mid=8xM154oS",
    sources: [
      "https://www.diretta.it/partita/calcio/spagna-bLyo6mco/uruguay-xMk44orG/?mid=8xM154oS",
    ],
    scorers: {
      "Uruguay": [],
      "Spagna": ["Alex Baena"],
    },
    notes: [
      "Spagna batte Uruguay 1-0 con il gol di Alex Baena al 42'.",
      "La Spagna chiude il Gruppo H con una vittoria; Uruguay eliminato.",
    ],
  },
  66: {
    status: "Finale",
    home: 1,
    away: 5,
    source: "https://www.diretta.it/partita/calcio/belgio-GbB957na/nuova-zelanda-rLctHkpU/?mid=jwT97ZAb",
    sources: [
      "https://www.diretta.it/partita/calcio/belgio-GbB957na/nuova-zelanda-rLctHkpU/?mid=jwT97ZAb",
    ],
    scorers: {
      "Nuova Zelanda": ["Eli Just"],
      "Belgio": [
        "Leandro Trossard",
        "Leandro Trossard",
        "Kevin De Bruyne",
        "Romelu Lukaku",
        "Alexis Saelemaekers",
      ],
    },
    notes: [
      "Belgio batte Nuova Zelanda 5-1 e conquista il primo posto nel Gruppo G.",
      "Trossard firma una doppietta; segnano anche De Bruyne, Lukaku e Saelemaekers. Just realizza il gol neozelandese.",
    ],
  },
  67: {
    status: "Finale",
    home: 1,
    away: 1,
    source: "https://www.diretta.it/partita/calcio/egitto-bejDn7NN/iran-xrRx85iA/?mid=OjRH5DuB",
    sources: [
      "https://www.diretta.it/partita/calcio/egitto-bejDn7NN/iran-xrRx85iA/?mid=OjRH5DuB",
    ],
    scorers: {
      "Egitto": ["Mahmoud Saber"],
      "Iran": ["Ramin Rezaeian"],
    },
    notes: [
      "Egitto e Iran pareggiano 1-1: Saber apre al 5', Rezaeian risponde al 14'.",
      "L'Egitto si qualifica ai sedicesimi come secondo del Gruppo G.",
    ],
  },
  68: {
    status: "Finale", home: 0, away: 2,
    source: "https://www.diretta.it/partita/calcio/inghilterra-j9N9ZNFA/panama-OWKqbCfi/?mid=YZajsXcn",
    sources: ["https://www.diretta.it/partita/calcio/inghilterra-j9N9ZNFA/panama-OWKqbCfi/?mid=YZajsXcn"],
    scorers: { "Panama": [], "Inghilterra": [] },
    notes: ["Inghilterra batte Panama 2-0.", "Confermati Inghilterra vincente, No Goal e Inghilterra 2+ gol; saltano Over 2,5 e risultato esatto 0-3."],
  },
  69: {
    status: "Finale", home: 2, away: 1,
    source: "https://www.diretta.it/partita/calcio/croazia-K8aznggo/ghana-nNBjHale/?mid=6mbbuBSb",
    sources: ["https://www.diretta.it/partita/calcio/croazia-K8aznggo/ghana-nNBjHale/?mid=6mbbuBSb"],
    scorers: { "Croazia": [], "Ghana": [] },
    notes: ["Croazia batte Ghana 2-1.", "Confermato il segno Croazia; saltano risultato esatto 1-0, Under 2,5 e No Goal."],
  },
  70: {
    status: "Finale", home: 0, away: 0,
    source: "https://www.diretta.it/partita/calcio/colombia-G02s4PCS/portogallo-WvJrjFVN/?mid=vL2qotaK",
    sources: ["https://www.diretta.it/partita/calcio/colombia-G02s4PCS/portogallo-WvJrjFVN/?mid=vL2qotaK"],
    scorers: { "Colombia": [], "Portogallo": [] },
    notes: ["Colombia e Portogallo chiudono 0-0.", "Confermato X2; saltano Portogallo vincente, Goal, Over 2,5 e risultato esatto 1-2."],
  },
  71: {
    status: "Finale", home: 3, away: 1,
    source: "https://www.diretta.it/partita/calcio/dr-congo-phn9mm8H/uzbekistan-EZYKKRMc/?mid=hEWfCwid",
    sources: ["https://www.diretta.it/partita/calcio/dr-congo-phn9mm8H/uzbekistan-EZYKKRMc/?mid=hEWfCwid"],
    scorers: { "RD Congo": [], "Uzbekistan": ["Eldor Shomurodov"] },
    notes: ["RD Congo rimonta l'Uzbekistan e vince 3-1 dopo il vantaggio di Shomurodov.", "Confermato il segno RD Congo; saltano Under 2,5, No Goal e risultato esatto 1-0."],
  },
  72: {
    status: "Finale", home: 3, away: 3,
    source: "https://www.diretta.it/partita/calcio/algeria-nc87N1BR/austria-naHiWdnt/?mid=4rOtRK7l",
    sources: ["https://www.diretta.it/partita/calcio/algeria-nc87N1BR/austria-naHiWdnt/?mid=4rOtRK7l"],
    scorers: { "Algeria": [], "Austria": [] },
    notes: ["Algeria e Austria pareggiano 3-3.", "Confermato X2; saltano Under 2,5, No Goal e risultato esatto 0-1."],
  },
  73: {
    status: "Finale", home: 0, away: 1,
    source: "https://www.diretta.it/partita/calcio/canada-x4toKORL/sudafrica-W2ijYvlr/?mid=EZmXxG15",
    sources: ["https://www.diretta.it/partita/calcio/canada-x4toKORL/sudafrica-W2ijYvlr/?mid=EZmXxG15"],
    scorers: { "Sudafrica": [], "Canada": ["Stephen Eustáquio"] },
    notes: ["Canada batte Sudafrica 1-0 e si qualifica agli ottavi di finale.", "Stephen Eustáquio decide la partita al 92'."],
  },
};

function worldCupResultFor(matchNumber) {
  return worldCupResults[Number(matchNumber)] || null;
}
