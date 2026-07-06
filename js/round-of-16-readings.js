(() => {
  const matches = {
    "canada-marocco": {
      teams: ["Canada", "Marocco"], flags: ["canada", "marocco"], high: true, officialFormations: true,
      formations: [
        ["Canada", "4-4-2", "Crépeau; Laryea, Bombito, De Fougerolles, Johnston; Ahmed, Eustáquio, Sigur, Buchanan; Oluwaseyi, Jonathan David."],
        ["Marocco", "4-2-3-1", "Bono; Hakimi, Issa Diop, El Hilali, Mazraoui; Bouaddi, El Aynaoui; Brahim Díaz, Ounahi, El Khannouss; Saibari."]
      ],
      weather: "Circa 33°C alle 12:00 locali, parzialmente soleggiato. Nel pomeriggio sono possibili temporali. Impatto medio-basso se il tetto è chiuso; alto solo in caso di gestione a tetto aperto.",
      stadium: "NRG Stadium, Houston. Impianto con tetto retrattile e aria condizionata, capienza circa 72.000. Campo in erba naturale installata per il Mondiale. Con condizioni interne controllate, caldo e umidità esterni avranno un impatto ridotto.",
      referee: "Michael Oliver (Inghilterra)", var: "Jarred Gillett", profile: "Arbitro esperto e autorevole: lascia giocare, ma non evita i cartellini nei contrasti duri.", severity: 70
    },
    "paraguay-francia": {
      teams: ["Paraguay", "Francia"], flags: ["paraguay", "francia"], high: true,
      formations: [
        ["Paraguay", "4-2-3-1", "Gatito Fernández; Rojas, Balbuena, Alderete, Espinoza; Cubas, Villasanti; Almirón, Enciso, Sosa; Sanabria."],
        ["Francia", "4-2-3-1", "Maignan; Koundé, Saliba, Upamecano, Theo Hernández; Koné, Camavinga; Dembélé, Olise, Barcola; Mbappé.", "Assente probabile: Tchouaméni."]
      ],
      weather: "Caldo estremo, intorno ai 34°C alle 17:00 locali dopo picchi oltre 38°C. Allerta caldo estremo e possibili temporali in serata. Impatto alto: ritmi più bassi, più pause e rischio di calo fisico.",
      stadium: "Lincoln Financial Field, Philadelphia. Stadio aperto, capienza circa 67.500, superficie HERO Hybrid Grass. Non climatizzato: il caldo può incidere fortemente.",
      referee: "Ilgiz Tantashev (Uzbekistan)", var: "Juan Lara", profile: "Arbitro internazionale con una gestione fisica abbastanza decisa.", severity: 68
    },
    "brasile-norvegia": {
      teams: ["Brasile", "Norvegia"], flags: ["brasile", "norvegia"], high: true, officialFormations: true,
      formations: [
        ["Brasile", "4-4-2", "Alisson; Danilo, Marquinhos, Gabriel, Douglas Santos; Rayan, Bruno Guimarães, Casemiro, Vinícius Júnior; Martinelli, Matheus Cunha."],
        ["Norvegia", "4-3-3", "Nyland; Ryerson, Ajer, Lysaker Heggem, Wolfe; Berge, Berg, Ødegaard; Sørloth, Haaland, Nusa."]
      ],
      weather: "Circa 26°C alle 16:00 locali, cielo nuvoloso con temporali indicati proprio nell’orario della partita. Allerta caldo nell’area. Impatto medio-alto, soprattutto per il rischio di interruzioni e un campo più pesante.",
      stadium: "MetLife Stadium, East Rutherford / New York-New Jersey Stadium. Stadio aperto, grande capienza, erba naturale temporanea per il Mondiale. Non climatizzato.",
      referee: "Ismail Elfath (USA)", profile: "Arbitro esperto, dalla gestione abbastanza fluida, ma discusso in alcune gare fisiche.", severity: 63
    },
    "messico-inghilterra": {
      teams: ["Messico", "Inghilterra"], flags: ["messico", "inghilterra"], high: true, officialFormations: true,
      formations: [
        ["Messico", "4-3-3", "Rangel; Sánchez, Montes, Vásquez, Gallardo; Mora, Lira, Romo; Alvarado, Jiménez, Quiñones."],
        ["Inghilterra", "4-2-3-1", "Pickford; O’Reilly, Guéhi, Konsa, Quansah; Rice, Anderson; Gordon, Bellingham, Saka; Kane."]
      ],
      weather: "Circa 17°C alle 18:00 locali, cielo nuvoloso, con temporali previsti tra pomeriggio e sera. Impatto alto per altitudine e possibile pioggia: pallone più veloce, recuperi più difficili e vantaggio ambientale per il Messico.",
      stadium: "Estadio Azteca, Città del Messico. Capienza circa 87.500, erba ibrida e altitudine di circa 2.200–2.240 metri. Non climatizzato: il fattore altitudine è molto importante.",
      referee: "Alireza Faghani (Australia/Iran)", profile: "Arbitro molto esperto, severo nella gestione disciplinare e molto presente nei momenti caldi.", severity: 75
    },
    "portogallo-spagna": {
      teams: ["Portogallo", "Spagna"], flags: ["portogallo", "spagna"], high: true,
      formations: [
        ["Portogallo", "4-2-3-1", "Diogo Costa; João Cancelo, Rúben Dias, Renato Veiga, Nuno Mendes; João Neves, Vitinha; Pedro Neto, Bruno Fernandes, Rafael Leão; Cristiano Ronaldo.", "Probabile formazione ricevuta il 6 luglio."],
        ["Spagna", "4-3-3", "Unai Simón; Pedro Porro, Pau Cubarsí, Aymeric Laporte, Marc Cucurella; Rodri, Pedri, Dani Olmo; Lamine Yamal, Mikel Oyarzabal, Álex Baena.", "Probabile formazione ricevuta il 6 luglio."]
      ],
      weather: "Esterno circa 35-37°C; interno circa 22-24°C. Con copertura completa e climatizzazione, il caldo esterno non dovrebbe incidere sulle condizioni di gioco.",
      stadium: "AT&T Stadium, Arlington (Dallas), Texas. Stadio completamente coperto e impianto climatizzato con temperatura interna controllata.",
      referee: "Anthony Taylor (Inghilterra)", profile: "Arbitro esperto, incline a lasciare intensità nei duelli ma pronto a sanzionare proteste e falli tattici ripetuti.", severity: 70
    },
    "stati-uniti-belgio": {
      teams: ["Stati Uniti", "Belgio"], flags: ["stati-uniti", "belgio"],
      formations: [
        ["USA", "4-3-3", "Freese; Freeman, Richards, Ream, Robinson; McKennie, Adams, Tillman; Dest, Balogun, Pulisic.", "Balogun è nuovamente disponibile dopo la revoca dell’espulsione ed è previsto titolare."],
        ["Belgio", "4-2-3-1", "Courtois; De Cuyper, Theate, Mechele, Castagne; Raskin, Tielemans; Doku, De Bruyne, Trossard; Lukaku.", "Probabile formazione ricevuta il 6 luglio."]
      ],
      weather: "Circa 20-22°C, clima generalmente mite e poco umido. Condizioni ideali per intensità, pressing e continuità di gioco.",
      stadium: "Seattle Stadium (Lumen Field), Seattle, Washington. Stadio all’aperto e non climatizzato.",
      referee: "Raphael Claus (Brasile)", profile: "Direzione generalmente dialogante, ma severa sui contrasti in ritardo e sulle interruzioni delle ripartenze.", severity: 67
    },
    "argentina-egitto": {
      teams: ["Argentina", "Egitto"], flags: ["argentina", "egitto"], high: true,
      formations: [
        ["Argentina", "4-4-2", "Emiliano Martínez; Molina, Romero, Lisandro Martínez, Tagliafico; De Paul, Mac Allister, Enzo Fernández, Almada; Messi, Lautaro Martínez.", "Probabile formazione ricevuta il 6 luglio."],
        ["Egitto", "4-2-3-1", "Shobeir; Mohamed Hany, Yasser Ibrahim, Ramy Rabia, Hafez; Hamdy Fathy, Marwan Attia; Salah, Emam Ashour, Zizo; Marmoush.", "Probabile formazione ricevuta il 6 luglio."]
      ],
      weather: "Circa 31-33°C, con possibile elevato irraggiamento solare durante la gara. Caldo e recupero fisico possono incidere soprattutto nella ripresa.",
      stadium: "Kansas City Stadium (Arrowhead Stadium), Kansas City, Missouri. Stadio all’aperto e non climatizzato.",
      referee: "Szymon Marciniak (Polonia)", profile: "Arbitro di grande esperienza, autorevole nella gestione delle gare a eliminazione diretta e attento ai contatti in area.", severity: 72
    },
    "svizzera-colombia": {
      teams: ["Svizzera", "Colombia"], flags: ["svizzera", "colombia"],
      formations: [
        ["Svizzera", "4-2-3-1", "Kobel; Widmer, Elvedi, Akanji, Ricardo Rodríguez; Freuler, Xhaka; Ndoye, Manzambi, Vargas; Embolo.", "Probabile formazione ricevuta il 6 luglio."],
        ["Colombia", "4-3-3", "Camilo Vargas; Daniel Muñoz, Davinson Sánchez, Jhon Lucumí, Johan Mojica; Jhon Arias, Jefferson Lerma, Suárez; Luis Díaz, James Rodríguez, Gustavo Puerta.", "Probabile formazione ricevuta il 6 luglio."]
      ],
      weather: "Esterno circa 33-35°C; interno circa 22-24°C grazie alla climatizzazione. Temperatura di gioco stabile e impatto ambientale basso.",
      stadium: "Atlanta Stadium (Mercedes-Benz Stadium), Atlanta, Georgia. Tetto retrattile e impianto completamente climatizzato.",
      referee: "Clément Turpin (Francia)", profile: "Arbitro tecnico e posizionale, tende a proteggere la fluidità ma interviene sui falli tattici evidenti.", severity: 65
    },
    "francia-marocco": {
      teams: ["Francia", "Marocco"], flags: ["francia", "marocco"], roundLabel: "Quarti di finale", achievement: "entrare tra le migliori quattro",
      formations: [
        ["Francia", "4-2-3-1", "Maignan; Koundé, Saliba, Upamecano, Digne; Manu Koné, Rabiot; Dembélé, Olise, Barcola; Mbappé."],
        ["Marocco", "4-2-3-1", "Bono; Hakimi, Issa Diop, Redouane Halhal, Mazraoui; Bouaddi, El Aynaoui; Brahim Díaz, Ounahi, El Khannouss; Saibari."]
      ],
      weather: "Previsione iniziale per Foxborough: giornata calda, circa 30°C di massima e 20-21°C in serata. Impatto medio, da aggiornare vicino al calcio d’inizio per umidità e rischio temporali.",
      stadium: "Gillette Stadium / Boston Stadium, Foxborough. Impianto aperto con superficie in erba naturale predisposta per il Mondiale: caldo e umidità possono incidere sul ritmo.",
      referee: null
    }
  };

  const readings = {
    "canada-marocco": {
      headline: "Il Marocco ha più qualità tra le linee, ma il Canada può trascinarlo in una partita fisica e molto stretta.",
      deck: "Il divario tecnico favorisce i nordafricani senza trasformare l’ottavo in una formalità. Il Canada ha corsa, profondità e un Jonathan David capace di punire ogni uscita sbagliata.",
      score: "0-1 Marocco", probabilities: ["18%", "29%", "53%"], labels: ["Canada", "Pareggio", "Marocco"],
      result: {
        score: "Canada 0-3 Marocco",
        winner: "Marocco qualificato",
        verdict: "Pronostico positivo",
        review: "Centrati Marocco qualificato e Under 3,5. Il risultato centrale 0-1 e l’Under 2,5 non entrano: Ounahi firma una doppietta e Rahimi completa il 3-0."
      },
      sections: [
        ["La lettura della partita", "Il Marocco parte avanti per qualità individuale, controllo del pallone e capacità di creare superiorità con Hakimi, Ounahi e Brahim Díaz. Il Canada, però, è costruito per sporcare la gara: due linee compatte, pressione sulle seconde palle e attacchi verticali verso David e Oluwaseyi. La probabilità marocchina nei novanta minuti resta quindi al 53%, non abbastanza alta da trattare il segno 2 come una certezza."],
        ["La chiave tattica", "Il duello decisivo è sulle corsie. Hakimi e Mazraoui possono fissare gli esterni canadesi e permettere al Marocco di occupare stabilmente la metà campo avversaria; Buchanan e Millar devono invece attaccare lo spazio alle loro spalle. Se il Canada recupera palla e trova subito David, la difesa marocchina sarà costretta a correre verso la propria porta. Se Bouaddi ed El Aynaoui controllano le seconde palle, il possesso del Marocco può diventare soffocante."],
        ["Ritmo e ambiente", "Il tetto dell’NRG Stadium è una variabile importante. Con stadio chiuso e aria condizionata l’impatto dei 33°C scende nettamente e la squadra tecnicamente più pulita viene favorita. A tetto aperto, caldo e possibili temporali aumenterebbero invece errori, pause e peso delle rotazioni."],
        ["Verdetto", "Scelgo il Marocco di misura, con 0-1 come risultato centrale e 1-1 come primo rischio. Under 3,5 è la base più stabile; Under 2,5 ha valore tecnico ma lascia meno margine. La vittoria canadese resta lo scenario meno probabile, non impossibile se David converte una delle poche transizioni disponibili."]
      ],
      volume: ["Canada 8-11 tiri", "Marocco 12-16 tiri", "Corner totali 8-11", "Cartellini 4-6"],
      picks: ["Under 3,5", "Marocco qualificato", "Under 2,5", "David 2+ tiri in porta: solo value ad alta varianza"]
    },
    "paraguay-francia": {
      headline: "La Francia ha un vantaggio enorme, ma il caldo di Philadelphia può abbassare ritmo e precisione.",
      deck: "Il Paraguay deve trasformare l’ottavo in una gara intermittente e fisica. La Francia può vincerla anche senza dominare per novanta minuti, grazie a profondità e qualità offensiva nettamente superiori.",
      score: "0-2 Francia", probabilities: ["5%", "16%", "79%"], labels: ["Paraguay", "Pareggio", "Francia"],
      result: {
        score: "Paraguay 0-1 Francia",
        winner: "Francia qualificata",
        verdict: "Pronostico positivo",
        review: "Centrati Francia vincente, Francia qualificata e Under 3,5. Non entrano il risultato centrale 0-2 e l’Over 1,5: decide Mbappé su rigore al 70’."
      },
      sections: [
        ["La lettura della partita", "La Francia possiede più soluzioni in ogni reparto e arriva al tiro con facilità anche contro blocchi bassi. Il Paraguay ha una sola strada credibile: densità centrale, falli tattici, piazzati e transizioni di Almirón ed Enciso. Il 79% francese nei tempi regolamentari nasce dal divario tecnico, non dalla quota molto bassa."],
        ["La chiave tattica", "Cubas e Villasanti devono proteggere la zona davanti ai centrali, ma così rischiano di lasciare libertà sugli esterni. Dembélé e Barcola possono allargare il blocco, mentre Olise riceve tra le linee e Mbappé attacca lo spazio creato. Se il Paraguay abbassa troppo i trequartisti, Sanabria rimane isolato; se li alza, concede campo alle transizioni francesi."],
        ["Il fattore caldo", "I 34°C previsti dopo picchi superiori ai 38°C rendono probabili pause, gestione conservativa e calo fisico. Questo può frenare il volume francese e sostenere l’Under 3,5, ma nel finale la maggiore profondità della panchina rende la Francia ancora più pericolosa."],
        ["Verdetto", "Risultato centrale 0-2, alternative 0-3 e 1-2. Francia qualificata e Francia vincente sono coerenti ma poco remunerative; la combinazione più sensata cerca una vittoria controllata, non una goleada automatica."]
      ],
      volume: ["Paraguay 5-8 tiri", "Francia 17-22 tiri", "Corner Francia 6-9", "Cartellini 4-7"],
      picks: ["Francia vincente", "Francia qualificata", "Over 1,5", "Under 3,5"]
    },
    "brasile-norvegia": {
      headline: "Il Brasile ha più controllo, la Norvegia l’attaccante che può cambiare la partita con una sola occasione.",
      deck: "È uno degli ottavi più pericolosi per una favorita. Il Brasile può produrre più volume e possesso, ma ogni palla persa apre il campo a Ødegaard, Nusa e Haaland.",
      score: "2-1 Brasile", probabilities: ["55%", "24%", "21%"], labels: ["Brasile", "Pareggio", "Norvegia"],
      result: {
        score: "Brasile 1-2 Norvegia",
        winner: "Norvegia qualificata",
        verdict: "Pronostico negativo",
        review: "La sorpresa indicata come medio-alta si concretizza, ma il risultato centrale 2-1 Brasile e il passaggio del turno verdeoro non entrano. Centrati Goal, Over 1,5, Over 2,5 e Under 3,5. Haaland segna due volte; Neymar accorcia su rigore nel recupero. Tutte e tre le MyCombo risultano perse perché contenevano Brasile qualificato o Brasile vincente."
      },
      sections: [
        ["La lettura della partita", "Il Brasile parte al 55% nei novanta minuti: favorito, ma lontano da una superiorità schiacciante. Martinelli tra le linee, Vinícius in isolamento e Bruno Guimarães nella prima costruzione danno alla Seleção più modi per attaccare. La Norvegia ha meno possesso, ma può creare occasioni di qualità superiore alla quantità."],
        ["La chiave tattica", "Marquinhos e Gabriel devono decidere quanto accorciare su Haaland senza liberare lo spazio per gli inserimenti di Ødegaard e Sørloth. Sul lato opposto, Ryerson avrà bisogno di aiuto costante contro Vinícius. Il 4-4-2 ufficiale del Brasile porta Martinelli vicino a Matheus Cunha e lascia a Rayan e Vinícius il compito di allargare il blocco norvegese. Se Berge e Berg vengono attratti troppo bassi, Bruno Guimarães può ricevere frontalmente."],
        ["Temporali e campo", "Il rischio di temporali nell’orario della partita può spezzare il ritmo e rendere il terreno più pesante. Le interruzioni riducono la continuità del palleggio brasiliano e aumentano il peso di piazzati e duelli: è un piccolo vantaggio relativo per la Norvegia."],
        ["Verdetto", "Scelgo 2-1 Brasile, con 1-1 come rischio principale. Goal e Over 1,5 sono più robusti del segno 1 secco. Haaland 3+ tiri in porta a quota alta è interessante, ma resta una selezione volatile e non entra nella base prudente."]
      ],
      volume: ["Brasile 15-20 tiri", "Norvegia 9-13 tiri", "Tiri in porta 6-9 / 3-5", "Corner totali 9-12"],
      picks: ["Over 1,5", "Goal", "Brasile qualificato", "Brasile vincente: rischio medio"]
    },
    "messico-inghilterra": {
      headline: "L’Inghilterra ha più talento, ma l’Azteca annulla una parte del divario e rende il Messico molto più vivo.",
      deck: "Altitudine, pubblico e temporali spostano la gara verso margini sottili. L’Inghilterra resta leggermente avanti per la qualificazione, non nei novanta minuti con la stessa nettezza suggerita dai nomi.",
      score: "1-1", probabilities: ["34%", "30%", "36%"], labels: ["Messico", "Pareggio", "Inghilterra"],
      result: {
        score: "Messico 2-3 Inghilterra",
        winner: "Inghilterra qualificata",
        verdict: "Pronostico misto",
        review: "Centrati Inghilterra qualificata, X2 e Goal. Non entrano il risultato centrale 1-1, il pareggio, Under 2,5 e Under 3,5. La lettura sul Messico competitivo e sul margine sottile era corretta: l’Inghilterra passa 3-2 dopo aver difeso in dieci dal 54’. Bellingham firma una doppietta e Kane segna su rigore."
      },
      sections: [
        ["La lettura della partita", "Nei novanta minuti la stima è quasi tripartita: 34% Messico, 30% pareggio e 36% Inghilterra. Il valore inglese è superiore, ma giocare a oltre 2.200 metri cambia recuperi, pressing e gestione delle accelerazioni. Il Messico conosce tempi e traiettorie dell’Azteca e può tenere la partita in equilibrio molto a lungo."],
        ["La chiave tattica", "Rice e Anderson devono proteggere le perdite di palla quando Saka e O’Reilly salgono insieme. Lira può spezzare il ritmo inglese, mentre Mora e Romo cercano subito Alvarado e Quiñones. Bellingham è l’uomo che può rompere il blocco messicano ricevendo alle spalle dei centrocampisti; Kane dovrà alternare area e raccordo senza svuotare la zona centrale. Quansah deve gestire ampiezza e transizioni sul lato di Alvarado."],
        ["Altitudine e temporali", "Il pallone viaggia più rapidamente, mentre gli sprint ripetuti costano di più. Il rischio di pioggia aumenta ulteriormente la difficoltà tecnica. Le sostituzioni e la gestione dei primi sessanta minuti avranno un peso anomalo: partire troppo forte può essere un errore."],
        ["Verdetto", "Il risultato centrale è 1-1. L’Inghilterra resta leggermente favorita per passare il turno grazie alla panchina, ma il segno 2 nei novanta minuti non è una scelta prudente. Under 3,5 è la linea più solida; Under 2,5 è coerente ma più esposto a supplementari esclusi e singoli episodi."]
      ],
      volume: ["Messico 9-13 tiri", "Inghilterra 11-15 tiri", "Corner totali 8-11", "Cartellini 5-7"],
      picks: ["Under 3,5", "Under 2,5", "Pareggio nei 90’: quota alta", "Inghilterra qualificata: fiducia contenuta"]
    },
    "portogallo-spagna": {
      headline: "La Spagna può comandare il pallone, il Portogallo ha abbastanza talento per punire ogni eccesso di controllo.",
      deck: "Una sfida di qualità, con il possesso spagnolo contro le ricezioni di Bruno Fernandes e le accelerazioni di Leão. La Spagna è favorita, ma il Goal è più stabile del segno 2.",
      score: "1-2 Spagna", probabilities: ["25%", "29%", "46%"], labels: ["Portogallo", "Pareggio", "Spagna"],
      sections: [
        ["La lettura della partita", "La Spagna sale al 46% nei novanta minuti grazie a un centrocampo più continuo e a una migliore capacità di recuperare il pallone dopo la perdita. Il Portogallo conserva il 25% di vittoria e soprattutto una minaccia concreta nelle transizioni. La stima non segue ciecamente il mercato: il margine spagnolo esiste, ma è più stretto di quanto suggerisca la quota."],
        ["La chiave tattica", "Rodri o Zubimendi devono controllare Bruno Fernandes senza lasciare Pedri e Fabián troppo lontani dall’area. Lamine Yamal può costringere Nuno Mendes a difendere basso, ma proprio quella corsia offre al Portogallo la migliore uscita in campo aperto. Ronaldo occupa i centrali e libera seconde ricezioni per Bernardo e Leão."],
        ["Ritmo controllato", "Con tetto chiuso e climatizzazione l’estremo caldo di Arlington dovrebbe restare fuori dalla partita. Questo favorisce intensità tecnica e pressing organizzato. I temporali inciderebbero soprattutto sulla logistica, non sul campo, salvo decisione di giocare con il tetto aperto."],
        ["Tre scenari", "Scenario prudente (35%): gara bloccata, 0-0 o 1-1, con Under 2,5. Scenario centrale (40%): entrambe segnano e la maggiore continuità spagnola produce 1-2. Scenario alternativo (25%): il Portogallo sfrutta transizioni e piazzati, vincendo 2-1. La sintesi mantiene la Spagna favorita senza trattarne la vittoria come automatica."],
        ["Verdetto", "Risultato centrale 1-1. Non considero scontata la qualificazione spagnola: il Portogallo ha abbastanza qualità ed esperienza per passare oltre i regolamentari. Goal e Over 1,5 sono più solidi del segno; l’Under 3,5 protegge uno scenario equilibrato."]
      ],
      volume: ["Portogallo 10-14 tiri", "Spagna 14-18 tiri", "Tiri in porta 4-6 / 5-7", "Corner totali 9-12"],
      picks: ["Over 1,5", "Goal", "Spagna qualificata", "Under 3,5"]
    },
    "stati-uniti-belgio": {
      headline: "Equilibrio quasi totale: intensità americana contro qualità belga negli ultimi trenta metri.",
      deck: "Seattle offre condizioni ideali per una partita veloce. La disponibilità di Balogun restituisce profondità e opzioni agli USA; il Belgio risponde con De Bruyne, Doku e più esperienza.",
      score: "2-1 Stati Uniti", probabilities: ["39%", "28%", "33%"], labels: ["USA", "Pareggio", "Belgio"],
      sections: [
        ["La lettura della partita", "Il modello non trova una vera favorita. La revoca dell’espulsione di Balogun migliora profondità, cambi e capacità degli Stati Uniti di attaccare lo spazio; insieme al fattore campo, sposta leggermente la qualificazione verso gli USA. Il Belgio conserva più esperienza e qualità tra le linee, quindi il margine resta minimo."],
        ["La chiave tattica", "Adams e Musah devono ridurre il tempo di ricezione di De Bruyne, ma non possono entrambi uscire dalla zona centrale: Doku attacca immediatamente lo spazio che si apre. Gli USA devono muovere il pallone rapidamente verso Pulisic e Weah, costringendo Castagne e De Cuyper a lunghe corse all’indietro. Il duello sulle seconde palle decide chi può mantenere il ritmo alto."],
        ["Condizioni ideali", "Ventuno gradi e cielo sereno permettono pressing e accelerazioni continue. Non esiste una giustificazione ambientale per una gara lenta: se le squadre restano prudenti sarà per il peso dell’eliminazione diretta, non per il clima."],
        ["Tre scenari", "Scenario USA (36%): pressione, ampiezza di Pulisic e profondità di Balogun portano al 2-1. Scenario equilibrato (31%): le squadre si neutralizzano per lunghi tratti e chiudono 1-1. Scenario Belgio (33%): De Bruyne trova Doku e Lukaku tra le linee per un 1-2. La media dei tre scenari suggerisce Goal e margini minimi, non un segno secco."],
        ["Verdetto", "Il risultato centrale aggiornato è 2-1 Stati Uniti, con 1-1 e 1-2 molto vicini. Goal e Over 1,5 sono le scelte principali; il passaggio turno resta troppo equilibrato per diventare una base prudente. Il ritorno di Balogun aumenta le alternative offensive e riduce il vantaggio precedentemente assegnato al Belgio."]
      ],
      volume: ["USA 11-15 tiri", "Belgio 12-16 tiri", "Tiri in porta 4-6 per parte", "Corner totali 9-12"],
      picks: ["Over 1,5", "Goal", "Under 3,5", "Nessun segno 1X2 come scelta principale"]
    },
    "argentina-egitto": {
      headline: "L’Argentina può controllare territorio e ritmo, ma Salah e Marmoush vietano qualsiasi gestione distratta.",
      deck: "La campione del mondo parte nettamente avanti. L’Egitto deve difendere basso, proteggere il centro e conservare energie per poche transizioni ad alta qualità.",
      score: "2-0 Argentina", probabilities: ["71%", "19%", "10%"], labels: ["Argentina", "Pareggio", "Egitto"],
      sections: [
        ["La lettura della partita", "L’Argentina ha il 71% di vittoria nei novanta minuti perché può dominare possesso, seconde palle e qualità delle occasioni. L’Egitto non è innocuo: Salah e Marmoush possono trasformare un recupero in una conclusione in pochi secondi. Per questo il vantaggio argentino va letto come controllo probabile, non come goleada obbligatoria."],
        ["La chiave tattica", "De Paul e Molina devono accompagnare Messi senza lasciare libero il corridoio di Salah. Enzo Fernández e Mac Allister possono muovere il blocco egiziano fino ad aprire lo spazio centrale per Lautaro o Julián Álvarez. Elneny e Hamdi Fathi hanno il compito più difficile: schermare Messi e contemporaneamente seguire gli inserimenti."],
        ["Caldo e irraggiamento", "A Kansas City si gioca all’aperto con 31-33°C e possibile forte irraggiamento. Il caldo può abbassare il pressing continuo, favorire pause e rendere più importante il primo gol; l’Argentina conserva un vantaggio tecnico netto, ma la gestione delle energie rafforza Under 3,5 rispetto a una goleada."],
        ["Tre scenari", "Scenario di controllo (50%): Argentina avanti presto e gestione fino al 2-0. Scenario resistente (27%): l’Egitto resta basso e perde 1-0. Scenario aperto (23%): Salah o Marmoush segnano in transizione e la gara arriva al 2-1 o 3-1. La media porta a 2-0, con Argentina qualificata e Under 3,5 come assi principali."],
        ["Verdetto", "Scelgo 2-0 Argentina, con 2-1 come rischio principale se Salah trova spazio. Argentina qualificata, Under 3,5 e Over 1,5 compongono lo scenario più coerente. No Goal è sensato ma meno sicuro del risultato centrale, proprio per la qualità delle transizioni egiziane."]
      ],
      volume: ["Argentina 16-21 tiri", "Egitto 6-9 tiri", "Corner Argentina 6-9", "Cartellini 3-5"],
      picks: ["Argentina qualificata", "Argentina vincente", "Under 3,5", "Over 1,5"]
    },
    "svizzera-colombia": {
      headline: "La Colombia ha più accelerazione offensiva, la Svizzera la struttura per portare tutto fino all’ultimo episodio.",
      deck: "È una partita da margini sottili. James e Luis Díaz possono creare la giocata decisiva, ma Xhaka e Akanji rendono la Svizzera difficile da spostare e ancora più difficile da eliminare.",
      score: "0-1 Colombia", probabilities: ["29%", "31%", "40%"], labels: ["Svizzera", "Pareggio", "Colombia"],
      sections: [
        ["La lettura della partita", "La Colombia parte al 40%, con pareggio al 31% e Svizzera al 29%. È il profilo classico di una favorita leggera: più talento offensivo e uno contro uno, ma nessun margine per controllare la gara in automatico. La Svizzera può abbassare il numero di possessi e rendere ogni duello decisivo."],
        ["La chiave tattica", "Widmer e Rodríguez devono contenere Luis Díaz e Arias senza schiacciare completamente Vargas e Shaqiri. Xhaka prova a orientare il possesso lontano dalla pressione di Lerma e Richard Ríos; James cerca invece la ricezione alle spalle di Freuler. Embolo può mettere in difficoltà i centrali colombiani attaccando direttamente la profondità."],
        ["Condizioni controllate", "Ad Atlanta il tetto retrattile e la climatizzazione mantengono circa 22-24°C all’interno nonostante i 33-35°C esterni. La componente fisica dipende quindi dalle scelte tattiche: la Svizzera vuole comprimere il ritmo, la Colombia aumentare gli uno contro uno."],
        ["Tre scenari", "Scenario bloccato (38%): 0-0 o 1-1 e qualificazione decisa oltre i novanta minuti. Scenario Colombia (40%): Luis Díaz e James producono il gol dello 0-1 o dell’1-2. Scenario Svizzera (22%): struttura, piazzati e seconde palle valgono l’1-0. La media conferma Colombia leggermente avanti e Under 3,5 come mercato più robusto."],
        ["Verdetto", "Scelgo 0-1 Colombia, con 1-1 come alternativa più forte. Under 3,5 e Under 2,5 sono le linee principali; Colombia qualificata è preferibile al segno 2. Una rete svizzera trasformerebbe la gara in uno scenario molto più incerto."]
      ],
      volume: ["Svizzera 9-12 tiri", "Colombia 11-15 tiri", "Tiri in porta 3-5 / 4-6", "Corner totali 8-11"],
      picks: ["Under 3,5", "Under 2,5", "Colombia qualificata", "Colombia vincente: rischio medio"]
    },
    "francia-marocco": {
      headline: "La Francia ha più profondità e soluzioni, ma il Marocco arriva al quarto con struttura, fiducia e qualità tra le linee.",
      deck: "Il mercato favorisce nettamente i francesi, senza cancellare il rischio di una gara bloccata. Il Marocco può comprimere gli spazi e colpire con Hakimi, Ounahi e Saibari; la Francia resta avanti per volume, panchina e capacità di decidere gli episodi.",
      score: "1-0 Francia", probabilities: ["58%", "25%", "17%"], labels: ["Francia", "Pareggio", "Marocco"],
      history: "I precedenti registrati sono sei, non dieci: quattro vittorie Francia, due pareggi e nessuna vittoria del Marocco, con 14-7 nel totale dei gol. La Francia ha sempre segnato almeno una rete; il riferimento competitivo più recente è il 2-0 nella semifinale mondiale del 2022. È un segnale favorevole alla Francia, ma riceve un peso limitato perché quattro gare sono amichevoli o tornei storici e le rose attuali sono diverse.",
      sections: [
        ["La lettura della partita", "La Francia parte al 58% nei novanta minuti: favorita chiara, non dominante. La quota del segno 1 riflette il vantaggio tecnico, la profondità offensiva e una difesa capace di proteggere Maignan. Il Marocco conserva però un 42% complessivo tra pareggio e vittoria: abbastanza per preferire mercati larghi e qualificazione al semplice 1 secco nelle combinazioni prudenti."],
        ["La chiave tattica", "Hakimi e Mazraoui devono scegliere con precisione quando accompagnare, perché Dembélé e Barcola possono attaccare lo spazio lasciato alle loro spalle. Bouaddi ed El Aynaoui cercano di togliere ricezioni a Olise e Mbappé; sul fronte opposto, Ounahi ed El Khannouss devono attirare fuori Koné e Rabiot per liberare Saibari. La Francia ha più cambi per aumentare ritmo nell’ultima mezz’ora."],
        ["Ritmo e contesto", "Il quarto può partire prudente: eliminazione diretta, due difese fisiche e grande valore del primo gol. Il caldo previsto a Foxborough può ridurre la continuità del pressing e rafforzare Under 3,5; eventuale umidità o temporali andranno rivalutati vicino alla partita."],
        ["Verdetto", "Scelgo 1-0 Francia, con 2-0 e 1-1 come alternative principali. Under 3,5 è la base più robusta; Francia qualificata ha un prezzo basso ma coerente. Over 1,5 è utilizzabile nelle MyCombo più ricche, mentre No Goal e Mbappé marcatore restano giocate secondarie per la loro maggiore varianza."]
      ],
      volume: ["Francia 14-18 tiri", "Marocco 8-12 tiri", "Tiri in porta 5-7 / 3-4", "Corner totali 8-11"],
      picks: ["Under 3,5", "Francia qualificata", "Francia 1X", "Francia vincente: rischio medio"]
    }
  };

  const calculatedDetails = {
    "canada-marocco": {
      motivation: [94, 95], surprise: "Medio", shots: [["Canada", "8-11", "3-4"], ["Marocco", "12-16", "4-6"]], corners: ["3-5", "5-7", "8-11"],
      cards: [["Saliba", "Alto", "Protezione centrale contro Ounahi e Brahim Díaz."], ["Laryea", "Medio-alto", "Duelli esterni con Hakimi."], ["Bouaddi", "Medio-alto", "Falli tattici sulle transizioni canadesi."], ["Cornelius", "Medio", "Coperture profonde su Saibari."], ["Hakimi", "Outsider", "Recuperi lunghi contro Millar."]],
      shotsPlayers: ["Jonathan David 3-5", "Oluwaseyi 2-3", "Brahim Díaz 2-4", "Saibari 2-4"]
    },
    "paraguay-francia": {
      motivation: [96, 94], surprise: "Basso", shots: [["Paraguay", "5-8", "2-3"], ["Francia", "17-22", "7-10"]], corners: ["2-4", "6-9", "8-12"],
      cards: [["Cubas", "Alto", "Schermo davanti alla difesa contro Olise e Mbappé."], ["Balbuena", "Alto", "Campo aperto e duelli con Mbappé."], ["Villasanti", "Medio-alto", "Pressione su Camavinga e Koné."], ["Espinoza", "Medio", "Uno contro uno con Dembélé."], ["Camavinga", "Outsider", "Possibile fallo tattico su Enciso."]],
      shotsPlayers: ["Mbappé 4-7", "Dembélé 3-5", "Olise 2-4", "Enciso 2-4"]
    },
    "brasile-norvegia": {
      motivation: [97, 96], surprise: "Medio-alto", shots: [["Brasile", "15-20", "6-9"], ["Norvegia", "9-13", "3-5"]], corners: ["6-8", "3-5", "9-12"],
      cards: [["Ryerson", "Alto", "Duello diretto con Vinícius e coperture sul lato debole."], ["Casemiro", "Alto", "Copertura preventiva su Ødegaard e seconde palle."], ["Ajer", "Medio-alto", "Profondità di Martinelli e Matheus Cunha."], ["Bruno Guimarães", "Medio", "Transizioni norvegesi da interrompere."], ["Berge", "Medio", "Pressione su Bruno Guimarães e inserimenti centrali."]],
      shotsPlayers: ["Vinícius 4-6 (2-3 in porta)", "Matheus Cunha 3-5 (1-2 in porta)", "Haaland 4-6 (2-3 in porta)", "Rayan 3-4 (1-2 in porta)", "Ødegaard 1-3 (0-1 in porta)", "Nusa 2-3 (0-1 in porta)"]
    },
    "messico-inghilterra": {
      motivation: [98, 96], surprise: "Alto", shots: [["Messico", "9-13", "3-5"], ["Inghilterra", "11-15", "4-6"]], corners: ["4-6", "4-6", "8-11"],
      cards: [["Lira", "Alto", "Protezione centrale contro Bellingham."], ["Montes", "Alto", "Duello fisico con Kane."], ["Gallardo", "Medio-alto", "Uno contro uno con Saka."], ["Rice", "Medio-alto", "Transizioni messicane e fattore altitudine."], ["Quansah", "Medio", "Duelli esterni e coperture su Alvarado."], ["O’Reilly", "Medio", "Transizioni di Quiñones sul lato inglese."]],
      shotsPlayers: ["Kane 3-5", "Saka 2-4", "Bellingham 2-3", "Jiménez 2-4"]
    },
    "portogallo-spagna": {
      motivation: [98, 97], surprise: "Medio-alto", shots: [["Portogallo", "10-14", "4-6"], ["Spagna", "14-18", "5-7"]], corners: ["4-6", "5-7", "9-12"],
      cards: [["João Neves", "Alto", "Schermo contro Pedri e Dani Olmo."], ["Nuno Mendes", "Alto", "Duello ripetuto con Lamine Yamal."], ["Cucurella", "Medio-alto", "Duelli in velocità con Pedro Neto."], ["João Cancelo", "Medio-alto", "Uno contro uno con Álex Baena."], ["Pau Cubarsí", "Medio", "Duello fisico con Ronaldo."], ["Rodri", "Medio", "Falli tattici sulle transizioni."]],
      shotsPlayers: ["Ronaldo 3-5", "Rafael Leão 2-4", "Lamine Yamal 3-5", "Oyarzabal 2-4"]
    },
    "stati-uniti-belgio": {
      motivation: [97, 94], surprise: "Alto", shots: [["Stati Uniti", "11-15", "4-6"], ["Belgio", "12-16", "4-6"]], corners: ["4-6", "5-7", "9-12"],
      cards: [["Adams", "Alto", "Pressione e coperture su De Bruyne."], ["Freeman", "Alto", "Duello esterno con Doku."], ["Raskin", "Medio-alto", "Interruzione delle transizioni americane."], ["Ream", "Medio-alto", "Gestione della profondità di Lukaku."], ["Theate", "Medio", "Coperture sul lato di Dest."]],
      shotsPlayers: ["Pulisic 3-5", "Balogun 2-4", "Doku 2-4", "Lukaku 3-5"]
    },
    "argentina-egitto": {
      motivation: [97, 99], surprise: "Basso", shots: [["Argentina", "16-21", "6-9"], ["Egitto", "6-9", "2-4"]], corners: ["6-9", "2-3", "8-11"],
      cards: [["Hamdy Fathy", "Alto", "Schermo centrale contro Messi."], ["Yasser Ibrahim", "Alto", "Duelli con Lautaro Martínez."], ["Marwan Attia", "Medio-alto", "Coperture sugli inserimenti argentini."], ["De Paul", "Medio", "Controllo delle transizioni di Marmoush."], ["Mohamed Hany", "Medio", "Uno contro uno con Almada."]],
      shotsPlayers: ["Messi 4-6", "Lautaro Martínez 3-5", "Salah 2-4", "Marmoush 2-3"]
    },
    "svizzera-colombia": {
      motivation: [95, 96], surprise: "Alto", shots: [["Svizzera", "9-12", "3-5"], ["Colombia", "11-15", "4-6"]], corners: ["4-5", "4-6", "8-11"],
      cards: [["Freuler", "Alto", "Coperture su James Rodríguez."], ["Widmer", "Alto", "Uno contro uno con Luis Díaz."], ["Lerma", "Medio-alto", "Duelli centrali con Xhaka."], ["Muñoz", "Medio", "Pressione alta e recuperi su Vargas."], ["Elvedi", "Medio", "Gestione della profondità colombiana."]],
      shotsPlayers: ["Embolo 2-4", "Vargas 2-3", "Luis Díaz 3-5", "James Rodríguez 2-4"]
    },
    "francia-marocco": {
      motivation: [97, 99], surprise: "Medio", shots: [["Francia", "14-18", "5-7"], ["Marocco", "8-12", "3-4"]], corners: ["5-7", "3-5", "8-11"],
      cards: [["Bouaddi", "Alto", "Coperture centrali su Olise e Mbappé."], ["Issa Diop", "Medio-alto", "Duelli in campo aperto con Mbappé."], ["Manu Koné", "Medio-alto", "Falli tattici sulle transizioni di Ounahi."], ["Mazraoui", "Medio", "Uno contro uno con Dembélé."], ["Rabiot", "Medio", "Pressione e seconde palle contro El Aynaoui."]],
      shotsPlayers: ["Mbappé 4-6", "Dembélé 2-4", "Saibari 2-4", "Ounahi 1-3"]
    }
  };

  const root = document.querySelector("[data-round-of-16-match]");
  const slug = root && root.dataset.roundOf16Match;
  const data = slug && matches[slug];
  const reading = slug && readings[slug];
  const detail = slug && calculatedDetails[slug];
  if (!data || !reading || !detail) return;
  const resultReview = reading.result
    ? `<section class="reading-result-review">
        <span>${reading.result.verdict}</span>
        <div><strong>Finale: ${reading.result.score}</strong><p>${reading.result.review}</p></div>
      </section>`
    : "";
  const formationCards = data.formations.map(([team, system, players, note = ""], index) => {
    const rows = players.replace(/\.$/, "").split(";").map(row => row.trim());
    const goalkeeper = rows.shift();
    return `<article class="match-formation-card">
      <header><img src="flags/${data.flags[index]}.svg" alt=""><div><strong>${team}</strong><span>Modulo ${system} · ${data.officialFormations ? "ufficiale" : "probabile"}</span></div></header>
      <div class="football-pitch" aria-label="Probabile formazione ${team}">
        ${rows.reverse().map(row => `<div class="pitch-row">${row.split(",").map(player => `<span>${player.trim()}</span>`).join("")}</div>`).join("")}
        <div class="pitch-row"><span>${goalkeeper}</span></div>
      </div>${note ? `<div class="formation-bench"><b>Nota</b><span>${note}</span></div>` : ""}
    </article>`;
  }).join("");
  const formations = data.formations.map(([team, system, players, note = ""]) =>
    `<div class="round16-formation"><h3>${team} <span>${system}</span></h3><p>${players}</p>${note ? `<small>${note}</small>` : ""}</div>`
  ).join("");
  const referee = data.referee
    ? `<p><strong>${data.referee}</strong>${data.var ? `<br>VAR: ${data.var}.` : ""}</p><p>${data.profile}</p><div class="round16-severity"><span>Indice severità</span><strong>${data.severity}/100</strong></div>`
    : `<span class="round16-badge is-pending">Da ufficializzare</span><p>L’arbitro non è ancora ufficiale nelle fonti consultate.</p>`;
  root.innerHTML = `
    <header class="reading-hero">
      <div class="reading-kicker">${data.roundLabel || "Ottavi di finale"} · ${reading.result ? "Partita conclusa" : "Scheda prepartita"}</div>
      <div class="reading-match">
        <div class="reading-team"><img src="flags/${data.flags[0]}.svg" alt=""><strong>${data.teams[0]}</strong></div>
        <div class="reading-versus"><b>${data.teams[0]} - ${data.teams[1]}</b><small>Mondiale 2026 · Eliminazione diretta</small></div>
        <div class="reading-team is-away"><img src="flags/${data.flags[1]}.svg" alt=""><strong>${data.teams[1]}</strong></div>
      </div>
      <h2>${reading.headline}</h2>
      <p class="reading-deck">${reading.deck}</p>
      <div class="reading-meta">
        <span>Arbitro: ${data.referee || "da ufficializzare"}</span>
        <span>${reading.result ? `Stato: finale · ${reading.result.winner}` : `Formazioni: ${data.officialFormations ? "ufficiali" : "probabili"}`}</span>
        <span>${reading.result ? `Risultato finale: ${reading.result.score}` : `Risultato centrale: ${reading.score}`}</span>
      </div>
    </header>
    ${resultReview}
    <section class="reading-summary">
      <div><span>Risultato centrale</span><strong>${reading.score}</strong><small>Stima indipendente dalle quote</small></div>
      <div><span>Scenario</span><strong>${reading.sections[0][1].split(".")[0]}</strong><small>La direzione principale della lettura</small></div>
      <div><span>Scelta base</span><strong>${reading.picks[0]}</strong><small>${reading.picks[1]}</small></div>
    </section>
    <div class="round16-info-grid">
      <section class="round16-info-box round16-formations"><span>1</span><h2>${data.officialFormations ? "Formazioni ufficiali" : "Probabili Formazioni"}</h2>${formations}</section>
      <section class="round16-info-box"><span>2</span><h2>Meteo</h2>${data.high ? `<div class="round16-badge is-high">Fattore ambientale alto</div>` : ""}<p>${data.weather}</p></section>
      <section class="round16-info-box"><span>3</span><h2>Stadio</h2><p>${data.stadium}</p></section>
      <section class="round16-info-box"><span>4</span><h2>Arbitraggio</h2>${referee}</section>
    </div>
    <div class="reading-layout">
      <div class="reading-copy">
        <section><p class="reading-lead">${reading.sections[0][1]}</p><p>Le probabilità stimate nei novanta minuti sono ${reading.probabilities[0]} ${reading.labels[0]}, ${reading.probabilities[1]} pareggio e ${reading.probabilities[2]} ${reading.labels[2]}. Le quote vengono confrontate con questa distribuzione soltanto dopo la costruzione dello scenario.</p></section>
        <section><h3>Forma e precedenti pesati</h3><p>${reading.history || "Non viene attribuito peso decisivo ai precedenti lontani nel tempo: rose, cicli tecnici e contesto mondiale rendono più affidabili forma recente, qualità degli undici e compatibilità tattica. La stima conserva margine per il pareggio proprio perché una gara secca riduce il vantaggio teorico della favorita."}</p></section>
        <section class="match-formations"><h3>${data.officialFormations ? "Formazioni ufficiali" : "Probabili formazioni"}</h3><div class="match-formation-grid">${formationCards}</div><p class="formation-disclaimer">${data.officialFormations ? "Undici ufficiali comunicati prima del calcio d’inizio." : "Formazioni da confermare nelle comunicazioni ufficiali."}</p></section>
        <section><h3>La partita di ${data.teams[0]}</h3><p>${reading.sections[1][1]}</p></section>
        <blockquote><strong>La chiave</strong>${reading.sections[2][1]}</blockquote>
        <section><h3>La partita di ${data.teams[1]}</h3><p>${reading.deck} La squadra senza palla deve proteggere il centro, scegliere con precisione quando alzare la pressione e non concedere transizioni dopo un possesso forzato.</p></section>
        <section><h3>Stato motivazionale playoff</h3><p><strong>${data.teams[0]} ${detail.motivation[0]}/100.</strong> Motivazione da eliminazione diretta, aumentata dal contesto e dalla possibilità di ${data.achievement || "entrare tra le migliori otto"}.</p><p><strong>${data.teams[1]} ${detail.motivation[1]}/100.</strong> Pressione competitiva molto alta e margine minimo per gli errori.</p><p>Rischio sorpresa: <strong>${detail.surprise}</strong>. La differenza motivazionale non sostituisce il divario tecnico, ma incide su intensità, duelli e gestione dei momenti decisivi.</p></section>
        <section><h3>Tiri e corner previsti</h3><p>${detail.shots[0][0]}: ${detail.shots[0][1]} tiri, ${detail.shots[0][2]} nello specchio. ${detail.shots[1][0]}: ${detail.shots[1][1]} tiri, ${detail.shots[1][2]} in porta.</p><p>Proiezioni individuali: ${detail.shotsPlayers.join("; ")}. Corner previsti: ${data.teams[0]} ${detail.corners[0]}, ${data.teams[1]} ${detail.corners[1]}, totale ${detail.corners[2]}.</p></section>
        <section><h3>Possibili ammoniti</h3><p>La gerarchia combina ruolo, zona di campo, avversario diretto e profilo arbitrale. ${detail.cards.slice(0, 3).map(item => `<strong>${item[0]}</strong>: ${item[2]}`).join(" ")} Le selezioni individuali restano più volatili dei mercati squadra.</p></section>
        <blockquote><strong>La scelta</strong>${reading.picks.slice(0, 3).join(" · ")}</blockquote>
        <section><h3>Verdetto preliminare</h3><p>${reading.sections[3][1]}</p></section>
      </div>
      <aside class="reading-sidebar">
        <section class="reading-data-panel"><span>Probabilità nei 90 minuti</span><div class="reading-probability">${reading.probabilities.map((p, i) => `<div><b>${p}</b><small>${reading.labels[i]}</small></div>`).join("")}</div></section>
        <section class="reading-data-panel"><span>Stato motivazionale</span><dl class="reading-stat-list"><div><dt>${data.teams[0]}</dt><dd>${detail.motivation[0]}/100</dd></div><div><dt>${data.teams[1]}</dt><dd>${detail.motivation[1]}/100</dd></div><div><dt>Rischio sorpresa</dt><dd>${detail.surprise}</dd></div></dl></section>
        <section class="reading-data-panel"><span>Volume previsto</span><dl class="reading-stat-list">${detail.shots.map(item => `<div><dt>${item[0]}, tiri</dt><dd>${item[1]}</dd></div><div><dt>In porta</dt><dd>${item[2]}</dd></div>`).join("")}</dl></section>
        <section class="reading-data-panel"><span>Gerarchia ammoniti</span><ol class="reading-card-ranking">${detail.cards.map(item => `<li><b>${item[0]}</b><strong>${item[1]}</strong><small>${item[2]}</small></li>`).join("")}</ol></section>
        <section class="reading-data-panel"><span>Gerarchia giocate</span><ol class="reading-card-ranking">${reading.picks.map((item, i) => `<li><b>${i + 1}. ${item}</b><small>${i === 0 ? "Scelta principale" : i === 1 ? "Seconda linea" : "Mercato complementare"}</small></li>`).join("")}</ol></section>
        <section class="reading-data-panel"><span>Metodo</span><p>Scenario e probabilità nascono dalla lettura di qualità, assetto tattico, assenze e ambiente. Le quote sono usate solo dopo, per valutare il prezzo.</p></section>
      </aside>
    </div>
    <footer class="reading-note"><strong>Nota</strong><p>Formazioni probabili e informazioni prepartita: titolarità, arbitro e gestione del tetto possono richiedere un aggiornamento vicino al calcio d’inizio.</p></footer>`;
  document.title = `Lettura - ${data.teams[0]} ${data.teams[1]} | Mondiale 2026`;
})();
