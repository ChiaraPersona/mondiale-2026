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

  const root = document.querySelector("[data-round-of-16-match]");
  const data = root && matches[root.dataset.roundOf16Match];
  if (!data) return;
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
      <h2>${data.teams[0]} - ${data.teams[1]}: formazioni, meteo, stadio e arbitraggio.</h2>
      <p class="reading-deck">Le informazioni operative da tenere sotto controllo prima del calcio d’inizio.</p>
      ${data.high ? `<span class="round16-badge is-high">Fattore ambientale alto</span>` : ""}
    </header>
    <div class="round16-info-grid">
      <section class="round16-info-box round16-formations"><span>1</span><h2>Probabili Formazioni</h2>${formations}</section>
      <section class="round16-info-box"><span>2</span><h2>Meteo</h2>${data.high ? `<div class="round16-badge is-high">Fattore ambientale alto</div>` : ""}<p>${data.weather}</p></section>
      <section class="round16-info-box"><span>3</span><h2>Stadio</h2><p>${data.stadium}</p></section>
      <section class="round16-info-box"><span>4</span><h2>Arbitraggio</h2>${referee}</section>
    </div>`;
  document.title = `Lettura - ${data.teams[0]} ${data.teams[1]} | Mondiale 2026`;
})();
