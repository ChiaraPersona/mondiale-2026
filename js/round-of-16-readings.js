(() => {
  const matches = {
    "canada-marocco": {
      teams: ["Canada", "Marocco"], flags: ["canada", "marocco"], high: true,
      formations: [
        ["Canada", "4-4-2", "Crépeau; Johnston, Bombito, Cornelius, Laryea; Buchanan, Saliba, Eustáquio, Millar; Jonathan David, Oluwaseyi.", "In dubbio: Alphonso Davies, possibile utilizzo da subentrante."],
        ["Marocco", "4-3-3", "Bounou; Hakimi, Issa Diop, Chadi Riad, Mazraoui; El Aynaoui, Bouaddi, Ounahi; Brahim Díaz, Saibari, El Khannouss."]
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
      teams: ["Brasile", "Norvegia"], flags: ["brasile", "norvegia"], high: true,
      formations: [
        ["Brasile", "4-2-3-1", "Alisson; Vanderson, Marquinhos, Gabriel Magalhães, Guilherme Arana; Casemiro, Bruno Guimarães; Raphinha/Rayan, Neymar, Vinícius Júnior; Endrick."],
        ["Norvegia", "4-3-3", "Nyland; Ryerson, Ajer, Østigård, Meling; Berge, Aursnes, Ødegaard; Bobb, Haaland, Nusa."]
      ],
      weather: "Circa 26°C alle 16:00 locali, cielo nuvoloso con temporali indicati proprio nell’orario della partita. Allerta caldo nell’area. Impatto medio-alto, soprattutto per il rischio di interruzioni e un campo più pesante.",
      stadium: "MetLife Stadium, East Rutherford / New York-New Jersey Stadium. Stadio aperto, grande capienza, erba naturale temporanea per il Mondiale. Non climatizzato.",
      referee: "Ismail Elfath (USA)", profile: "Arbitro esperto, dalla gestione abbastanza fluida, ma discusso in alcune gare fisiche.", severity: 63
    },
    "messico-inghilterra": {
      teams: ["Messico", "Inghilterra"], flags: ["messico", "inghilterra"], high: true,
      formations: [
        ["Messico", "4-3-3", "Malagón; Sánchez, Montes, Vásquez, Gallardo; Álvarez, Chávez, Romo; Antuna, Giménez, Lozano."],
        ["Inghilterra", "4-2-3-1", "Pickford; Konsa, Stones, Guéhi, Shaw; Rice, Anderson/Mainoo; Saka, Bellingham, Gordon/Rashford; Kane.", "Dubbi: Reece James e Quansah."]
      ],
      weather: "Circa 17°C alle 18:00 locali, cielo nuvoloso, con temporali previsti tra pomeriggio e sera. Impatto alto per altitudine e possibile pioggia: pallone più veloce, recuperi più difficili e vantaggio ambientale per il Messico.",
      stadium: "Estadio Azteca, Città del Messico. Capienza circa 87.500, erba ibrida e altitudine di circa 2.200–2.240 metri. Non climatizzato: il fattore altitudine è molto importante.",
      referee: "Alireza Faghani (Australia/Iran)", profile: "Arbitro molto esperto, severo nella gestione disciplinare e molto presente nei momenti caldi.", severity: 75
    },
    "portogallo-spagna": {
      teams: ["Portogallo", "Spagna"], flags: ["portogallo", "spagna"], high: true,
      formations: [
        ["Portogallo", "4-2-3-1", "Diogo Costa; Dalot, Rúben Dias, António Silva, Nuno Mendes; João Palhinha, Vitinha; Bernardo Silva, Bruno Fernandes, Rafael Leão; Cristiano Ronaldo."],
        ["Spagna", "4-3-3", "Unai Simón; Carvajal/Porro, Le Normand, Laporte, Cucurella; Rodri/Zubimendi, Pedri, Fabián Ruiz; Lamine Yamal, Morata, Nico Williams."]
      ],
      weather: "Circa 35°C alle 14:00 locali, parzialmente soleggiato, con temporali possibili nel pomeriggio. Impatto basso se tetto chiuso e climatizzazione attiva; alto solo all’esterno.",
      stadium: "AT&T Stadium / Dallas Stadium, Arlington. Tetto retrattile, aria condizionata ed erba naturale temporanea. Condizioni probabilmente controllate.",
      referee: null
    },
    "stati-uniti-belgio": {
      teams: ["Stati Uniti", "Belgio"], flags: ["stati-uniti", "belgio"],
      formations: [
        ["USA", "4-2-3-1", "Turner; Scally, Richards, Ream, Jedi Robinson; Adams, Musah; Weah, Reyna, Pulisic; Pepi.", "Assente: Balogun squalificato."],
        ["Belgio", "4-3-3", "Casteels; Castagne, Faes, Theate, De Cuyper; Onana, Tielemans, De Bruyne; Doku, Lukaku/Openda, Trossard."]
      ],
      weather: "Circa 21°C alle 17:00 locali, soleggiato/sereno. Impatto basso: condizioni ideali per intensità e pressing.",
      stadium: "Lumen Field, Seattle. Campo aperto e copertura parziale sugli spalti, erba naturale temporanea per il Mondiale. Non climatizzato, ma con clima favorevole.",
      referee: null
    },
    "argentina-egitto": {
      teams: ["Argentina", "Egitto"], flags: ["argentina", "egitto"], high: true,
      formations: [
        ["Argentina", "4-3-3", "Emiliano Martínez; Molina, Romero, Otamendi/Lisandro Martínez, Tagliafico; De Paul, Enzo Fernández, Mac Allister; Messi, Lautaro Martínez/Julián Álvarez, Nico González."],
        ["Egitto", "4-2-3-1", "El Shenawy; Mohamed Hany, Hegazy, Abdelmonem, Hamdy; Elneny, Hamdi Fathi; Trezeguet, Emam Ashour, Marmoush; Salah."]
      ],
      weather: "Circa 30°C alle 12:00 locali, nuvole intermittenti, con temporali più probabili in serata. Impatto basso se lo stadio è chiuso e climatizzato.",
      stadium: "Mercedes-Benz Stadium / Atlanta Stadium. Tetto retrattile, aria condizionata ed erba naturale installata per il Mondiale. Ambiente controllato.",
      referee: null
    },
    "svizzera-colombia": {
      teams: ["Svizzera", "Colombia"], flags: ["svizzera", "colombia"],
      formations: [
        ["Svizzera", "3-4-2-1", "Sommer/Kobel; Akanji, Schär, Elvedi; Widmer, Xhaka, Freuler, Rodríguez; Vargas, Shaqiri/Okafor; Embolo."],
        ["Colombia", "4-2-3-1", "Vargas; Muñoz, Lucumí, Davinson Sánchez, Mojica; Lerma, Richard Ríos; Arias, James Rodríguez, Luis Díaz; Jhon Córdoba/Durán."]
      ],
      weather: "Circa 23°C alle 13:00 locali, prevalentemente soleggiato. Impatto basso: condizioni molto buone.",
      stadium: "BC Place, Vancouver. Tetto retrattile, capienza circa 54.500 e superficie convertita per il Mondiale con erba naturale/ibrida. Clima mite.",
      referee: null
    }
  };

  const readings = {
    "canada-marocco": {
      headline: "Il Marocco ha più qualità tra le linee, ma il Canada può trascinarlo in una partita fisica e molto stretta.",
      deck: "Il divario tecnico favorisce i nordafricani senza trasformare l’ottavo in una formalità. Il Canada ha corsa, profondità e un Jonathan David capace di punire ogni uscita sbagliata.",
      score: "0-1 Marocco", probabilities: ["18%", "29%", "53%"], labels: ["Canada", "Pareggio", "Marocco"],
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
      sections: [
        ["La lettura della partita", "Il Brasile parte al 55% nei novanta minuti: favorito, ma lontano da una superiorità schiacciante. Neymar tra le linee, Vinícius in isolamento e Bruno Guimarães nella prima costruzione danno alla Seleção più modi per attaccare. La Norvegia ha meno possesso, ma può creare occasioni di qualità superiore alla quantità."],
        ["La chiave tattica", "Marquinhos e Gabriel devono decidere quanto accorciare su Haaland senza liberare lo spazio per gli inserimenti di Ødegaard e Bobb. Sul lato opposto, Ryerson avrà bisogno di aiuto costante contro Vinícius. Se Berge e Aursnes vengono attratti troppo bassi, Neymar può ricevere frontalmente; se salgono, il Brasile trova corridoi diretti verso Endrick."],
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
      sections: [
        ["La lettura della partita", "Nei novanta minuti la stima è quasi tripartita: 34% Messico, 30% pareggio e 36% Inghilterra. Il valore inglese è superiore, ma giocare a oltre 2.200 metri cambia recuperi, pressing e gestione delle accelerazioni. Il Messico conosce tempi e traiettorie dell’Azteca e può tenere la partita in equilibrio molto a lungo."],
        ["La chiave tattica", "Rice e il secondo mediano devono proteggere le perdite di palla quando Saka e il laterale destro salgono insieme. Álvarez può spezzare il ritmo inglese, mentre Chávez e Romo cercano subito Lozano e Antuna. Bellingham è l’uomo che può rompere il blocco messicano ricevendo alle spalle dei centrocampisti; Kane dovrà alternare area e raccordo senza svuotare la zona centrale."],
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
        ["Verdetto", "Risultato centrale 1-2, con 1-1 molto vicino. Goal e Over 1,5 sono le basi; Spagna qualificata è preferibile al segno 2. L’Under 3,5 protegge lo scenario tecnico più probabile senza chiedere una partita completamente chiusa."]
      ],
      volume: ["Portogallo 10-14 tiri", "Spagna 14-18 tiri", "Tiri in porta 4-6 / 5-7", "Corner totali 9-12"],
      picks: ["Over 1,5", "Goal", "Spagna qualificata", "Under 3,5"]
    },
    "stati-uniti-belgio": {
      headline: "Equilibrio quasi totale: intensità americana contro qualità belga negli ultimi trenta metri.",
      deck: "Seattle offre condizioni ideali per una partita veloce. Gli USA possono alzare il pressing, ma senza Balogun perdono una parte della profondità; il Belgio risponde con De Bruyne, Doku e più esperienza.",
      score: "1-1", probabilities: ["35%", "29%", "36%"], labels: ["USA", "Pareggio", "Belgio"],
      sections: [
        ["La lettura della partita", "Il modello non trova una vera favorita: 35% Stati Uniti, 29% pareggio e 36% Belgio. Il fattore campo equilibra il maggiore talento belga. L’assenza di Balogun sposta però più responsabilità su Pulisic, Reyna e Pepi, mentre il Belgio può cambiare centravanti senza perdere completamente struttura."],
        ["La chiave tattica", "Adams e Musah devono ridurre il tempo di ricezione di De Bruyne, ma non possono entrambi uscire dalla zona centrale: Doku attacca immediatamente lo spazio che si apre. Gli USA devono muovere il pallone rapidamente verso Pulisic e Weah, costringendo Castagne e De Cuyper a lunghe corse all’indietro. Il duello sulle seconde palle decide chi può mantenere il ritmo alto."],
        ["Condizioni ideali", "Ventuno gradi e cielo sereno permettono pressing e accelerazioni continue. Non esiste una giustificazione ambientale per una gara lenta: se le squadre restano prudenti sarà per il peso dell’eliminazione diretta, non per il clima."],
        ["Verdetto", "Il risultato centrale è 1-1, con 2-1 e 1-2 quasi simmetrici. Goal e Over 1,5 sono le scelte principali; il passaggio turno è troppo equilibrato per diventare una base prudente. Pulisic 2+ tiri in porta offre value moderato, ma dipende dallo sviluppo e dal suo ruolo effettivo."]
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
        ["Gestione dello stadio", "Con tetto chiuso e climatizzazione, caldo e umidità di Atlanta incidono poco. L’ambiente controllato aiuta la squadra che vuole tenere il pallone e riduce la possibilità che la gara venga decisa dalla fatica."],
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
        ["Condizioni favorevoli", "Il clima mite di Vancouver e il possibile tetto chiuso eliminano quasi tutte le variabili esterne. Il ritmo dipenderà dalle scelte tattiche: la Svizzera ha interesse a comprimerlo, la Colombia ad aumentare il numero di uno contro uno."],
        ["Verdetto", "Scelgo 0-1 Colombia, con 1-1 come alternativa più forte. Under 3,5 e Under 2,5 sono le linee principali; Colombia qualificata è preferibile al segno 2. Una rete svizzera trasformerebbe la gara in uno scenario molto più incerto."]
      ],
      volume: ["Svizzera 9-12 tiri", "Colombia 11-15 tiri", "Tiri in porta 3-5 / 4-6", "Corner totali 8-11"],
      picks: ["Under 3,5", "Under 2,5", "Colombia qualificata", "Colombia vincente: rischio medio"]
    }
  };

  const root = document.querySelector("[data-round-of-16-match]");
  const slug = root && root.dataset.roundOf16Match;
  const data = slug && matches[slug];
  const reading = slug && readings[slug];
  if (!data || !reading) return;
  const formations = data.formations.map(([team, system, players, note = ""]) =>
    `<div class="round16-formation"><h3>${team} <span>${system}</span></h3><p>${players}</p>${note ? `<small>${note}</small>` : ""}</div>`
  ).join("");
  const referee = data.referee
    ? `<p><strong>${data.referee}</strong>${data.var ? `<br>VAR: ${data.var}.` : ""}</p><p>${data.profile}</p><div class="round16-severity"><span>Indice severità</span><strong>${data.severity}/100</strong></div>`
    : `<span class="round16-badge is-pending">Da ufficializzare</span><p>L’arbitro non è ancora ufficiale nelle fonti consultate.</p>`;
  root.innerHTML = `
    <header class="reading-hero">
      <div class="reading-kicker">Ottavi di finale · Scheda prepartita</div>
      <div class="reading-match">
        <div class="reading-team"><img src="flags/${data.flags[0]}.svg" alt=""><strong>${data.teams[0]}</strong></div>
        <div class="reading-versus"><b>${data.teams[0]} - ${data.teams[1]}</b><small>Mondiale 2026 · Eliminazione diretta</small></div>
        <div class="reading-team is-away"><img src="flags/${data.flags[1]}.svg" alt=""><strong>${data.teams[1]}</strong></div>
      </div>
      <h2>${reading.headline}</h2>
      <p class="reading-deck">${reading.deck}</p>
      ${data.high ? `<span class="round16-badge is-high">Fattore ambientale alto</span>` : ""}
    </header>
    <section class="reading-summary">
      <div><span>Risultato centrale</span><strong>${reading.score}</strong><small>Stima indipendente dalle quote</small></div>
      <div><span>Scenario</span><strong>${reading.sections[0][1].split(".")[0]}</strong><small>La direzione principale della lettura</small></div>
      <div><span>Scelta base</span><strong>${reading.picks[0]}</strong><small>${reading.picks[1]}</small></div>
    </section>
    <div class="round16-info-grid">
      <section class="round16-info-box round16-formations"><span>1</span><h2>Probabili Formazioni</h2>${formations}</section>
      <section class="round16-info-box"><span>2</span><h2>Meteo</h2>${data.high ? `<div class="round16-badge is-high">Fattore ambientale alto</div>` : ""}<p>${data.weather}</p></section>
      <section class="round16-info-box"><span>3</span><h2>Stadio</h2><p>${data.stadium}</p></section>
      <section class="round16-info-box"><span>4</span><h2>Arbitraggio</h2>${referee}</section>
    </div>
    <div class="reading-layout">
      <div class="reading-copy">
        ${reading.sections.map(([title, copy], index) => `${index === 3 ? `<blockquote><strong>La scelta</strong>${reading.picks.slice(0, 3).join(" · ")}</blockquote>` : ""}<section><h3>${title}</h3><p class="${index === 0 ? "reading-lead" : ""}">${copy}</p></section>`).join("")}
      </div>
      <aside class="reading-sidebar">
        <section class="reading-data-panel"><span>Probabilità nei 90 minuti</span><div class="reading-probability">${reading.probabilities.map((p, i) => `<div><b>${p}</b><small>${reading.labels[i]}</small></div>`).join("")}</div></section>
        <section class="reading-data-panel"><span>Volume previsto</span><ul class="reading-picks">${reading.volume.map(item => `<li>${item}</li>`).join("")}</ul></section>
        <section class="reading-data-panel"><span>Gerarchia giocate</span><ol class="reading-card-ranking">${reading.picks.map((item, i) => `<li><b>${i + 1}. ${item}</b><small>${i === 0 ? "Scelta principale" : i === 1 ? "Seconda linea" : "Mercato complementare"}</small></li>`).join("")}</ol></section>
        <section class="reading-data-panel"><span>Metodo</span><p>Scenario e probabilità nascono dalla lettura di qualità, assetto tattico, assenze e ambiente. Le quote sono usate solo dopo, per valutare il prezzo.</p></section>
      </aside>
    </div>
    <footer class="reading-note"><strong>Nota</strong><p>Formazioni probabili e informazioni prepartita: titolarità, arbitro e gestione del tetto possono richiedere un aggiornamento vicino al calcio d’inizio.</p></footer>`;
  document.title = `Lettura - ${data.teams[0]} ${data.teams[1]} | Mondiale 2026`;
})();
