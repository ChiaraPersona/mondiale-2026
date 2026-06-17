const codexRoleOrder = ["Portieri", "Difensori", "Centrocampisti", "Attaccanti"];
const codexRoundOf32Seeds = [
  ["1E", "3 ABCDF"], ["1I", "3 CDFGH"], ["2A", "2B"], ["1F", "2C"],
  ["2K", "2L"], ["1H", "2J"], ["1D", "3 BEFIJ"], ["1G", "3 AEHIJ"],
  ["1C", "2F"], ["2E", "2I"], ["1A", "3 CEFHI"], ["1L", "3 EHIJK"],
  ["1J", "2H"], ["2D", "2G"], ["1B", "3 EFGIJ"], ["1K", "3 DEIJL"],
];

const codexBracketMatchNumbers = {
  r32: [74, 77, 73, 76, 83, 84, 81, 82, 75, 78, 79, 80, 86, 88, 85, 87],
  r16: [89, 90, 93, 94, 91, 92, 95, 96],
  qf: [97, 98, 99, 100],
  sf: [101, 102],
  bronze: [103],
  final: [104],
};

const codexDependencies = {
  89: [{ match: 74, result: "winner" }, { match: 77, result: "winner" }],
  90: [{ match: 73, result: "winner" }, { match: 75, result: "winner" }],
  91: [{ match: 76, result: "winner" }, { match: 78, result: "winner" }],
  92: [{ match: 79, result: "winner" }, { match: 80, result: "winner" }],
  93: [{ match: 83, result: "winner" }, { match: 84, result: "winner" }],
  94: [{ match: 81, result: "winner" }, { match: 82, result: "winner" }],
  95: [{ match: 86, result: "winner" }, { match: 88, result: "winner" }],
  96: [{ match: 85, result: "winner" }, { match: 87, result: "winner" }],
  97: [{ match: 89, result: "winner" }, { match: 90, result: "winner" }],
  98: [{ match: 93, result: "winner" }, { match: 94, result: "winner" }],
  99: [{ match: 91, result: "winner" }, { match: 92, result: "winner" }],
  100: [{ match: 95, result: "winner" }, { match: 96, result: "winner" }],
  101: [{ match: 97, result: "winner" }, { match: 98, result: "winner" }],
  102: [{ match: 99, result: "winner" }, { match: 100, result: "winner" }],
  103: [{ match: 101, result: "loser" }, { match: 102, result: "loser" }],
  104: [{ match: 101, result: "winner" }, { match: 102, result: "winner" }],
};

const codexTranslations = {
  "Mexico": "Messico",
  "South Africa": "Sudafrica",
  "South Korea": "Corea del Sud",
  "Czech Republic": "Repubblica Ceca",
  "Bosnia & Herzegovina": "Bosnia ed Erzegovina",
  "Switzerland": "Svizzera",
  "Brazil": "Brasile",
  "Morocco": "Marocco",
  "USA": "Stati Uniti",
  "Turkey": "Turchia",
  "Germany": "Germania",
  "Ivory Coast": "Costa d'Avorio",
  "Netherlands": "Olanda",
  "Sweden": "Svezia",
  "Spain": "Spagna",
  "Cape Verde": "Capo Verde",
  "Saudi Arabia": "Arabia Saudita",
  "Belgium": "Belgio",
  "Egypt": "Egitto",
  "New Zealand": "Nuova Zelanda",
  "France": "Francia",
  "Norway": "Norvegia",
  "Jordan": "Giordania",
  "Portugal": "Portogallo",
  "DR Congo": "RD Congo",
  "England": "Inghilterra",
  "Croatia": "Croazia",
  "Scotland": "Scozia",
  "Australia": "Australia",
  "Japan": "Giappone",
  "Tunisia": "Tunisia",
  "Uruguay": "Uruguay",
  "Iran": "Iran",
  "Senegal": "Senegal",
  "Argentina": "Argentina",
  "Algeria": "Algeria",
  "Austria": "Austria",
  "Ghana": "Ghana",
  "Panama": "Panama",
  "Qatar": "Qatar",
  "Haiti": "Haiti",
  "Paraguay": "Paraguay",
  "Ecuador": "Ecuador",
  "Canada": "Canada",
  "Curacao": "Curacao",
  "Iraq": "Iraq",
  "Uzbekistan": "Uzbekistan",
  "Colombia": "Colombia",
};

const codexNationalAliases = {
  "Algeria": ["algeria", "algerien"],
  "Arabia Saudita": ["arabia saudita", "saudi arabia", "saudi-arabien"],
  "Argentina": ["argentina", "argentinien"],
  "Australia": ["australia", "australien"],
  "Austria": ["austria", "osterreich", "österreich"],
  "Belgio": ["belgio", "belgium", "belgien"],
  "Bosnia ed Erzegovina": ["bosnia ed erzegovina", "bosnia & herzegovina", "bosnien und herzegowina"],
  "Brasile": ["brasile", "brazil", "brasilien"],
  "Canada": ["canada", "kanada"],
  "Capo Verde": ["capo verde", "cape verde", "kap verde"],
  "Colombia": ["colombia", "kolumbien"],
  "Corea del Sud": ["corea del sud", "south korea", "sudkorea", "südkorea"],
  "Costa d'Avorio": ["costa d avorio", "ivory coast", "elfenbeinkuste", "elfenbeinküste"],
  "Croazia": ["croazia", "croatia", "kroatien"],
  "Curacao": ["curacao", "curacao", "curaçao"],
  "Ecuador": ["ecuador"],
  "Egitto": ["egitto", "egypt", "agypten", "ägypten"],
  "Francia": ["francia", "france", "frankreich"],
  "Germania": ["germania", "germany", "deutschland"],
  "Ghana": ["ghana"],
  "Giappone": ["giappone", "japan"],
  "Giordania": ["giordania", "jordan", "jordanien"],
  "Haiti": ["haiti"],
  "Inghilterra": ["inghilterra", "england"],
  "Iran": ["iran"],
  "Iraq": ["iraq"],
  "Marocco": ["marocco", "morocco", "marokko"],
  "Messico": ["messico", "mexico", "mexiko"],
  "Norvegia": ["norvegia", "norway", "norwegen"],
  "Nuova Zelanda": ["nuova zelanda", "new zealand", "neuseeland"],
  "Olanda": ["olanda", "netherlands", "niederlande"],
  "Panama": ["panama"],
  "Paraguay": ["paraguay"],
  "Portogallo": ["portogallo", "portugal"],
  "Qatar": ["qatar", "katar"],
  "RD Congo": ["rd congo", "dr congo", "dr kongo", "democratic republic of congo"],
  "Repubblica Ceca": ["repubblica ceca", "czech republic", "tschechien"],
  "Scozia": ["scozia", "scotland", "schottland"],
  "Senegal": ["senegal"],
  "Spagna": ["spagna", "spain", "spanien"],
  "Stati Uniti": ["stati uniti", "usa", "united states", "vereinigte staaten"],
  "Sudafrica": ["sudafrica", "south africa", "sudafrika", "südafrika"],
  "Svezia": ["svezia", "sweden", "schweden"],
  "Svizzera": ["svizzera", "switzerland", "schweiz"],
  "Tunisia": ["tunisia", "tunesien"],
  "Turchia": ["turchia", "turkey", "turkei", "türkei"],
  "Uruguay": ["uruguay"],
  "Uzbekistan": ["uzbekistan", "usbekistan"],
};

const codexState = {
  strengths: {},
  groupTables: {},
  thirds: [],
  thirdAssignments: {},
  results: {},
};

const codexRegulationProfiles = {
  "Spagna": { press: 0.95, tempo: 0.8, dissent: 0.15, timeManagement: 0.05 },
  "Germania": { press: 0.8, tempo: 0.75, dissent: 0.2, timeManagement: 0.08 },
  "Francia": { press: 0.58, tempo: 0.82, dissent: 0.18, timeManagement: 0.12 },
  "Brasile": { press: 0.62, tempo: 0.78, dissent: 0.26, timeManagement: 0.12 },
  "Olanda": { press: 0.7, tempo: 0.68, dissent: 0.18, timeManagement: 0.08 },
  "Croazia": { press: 0.3, tempo: 0.22, dissent: 0.28, timeManagement: 0.76 },
  "Marocco": { press: 0.36, tempo: 0.24, dissent: 0.22, timeManagement: 0.7 },
  "Portogallo": { press: 0.44, tempo: 0.42, dissent: 0.24, timeManagement: 0.62 },
  "Argentina": { press: 0.54, tempo: 0.48, dissent: 0.62, timeManagement: 0.58 },
  "Uruguay": { press: 0.42, tempo: 0.38, dissent: 0.66, timeManagement: 0.6 },
};

const codexWinnerMarketOdds = {
  "Francia": 5.5,
  "Spagna": 7,
  "Portogallo": 8,
  "Inghilterra": 9,
  "Argentina": 10,
  "Brasile": 12,
  "Germania": 15,
  "Olanda": 18,
  "Stati Uniti": 40,
  "Marocco": 40,
  "Norvegia": 40,
  "Giappone": 50,
  "Colombia": 50,
  "Belgio": 50,
  "Messico": 75,
  "Svizzera": 100,
  "Uruguay": 100,
  "Croazia": 100,
  "Svezia": 150,
  "Senegal": 150,
  "Costa d'Avorio": 150,
  "Turchia": 200,
  "Corea del Sud": 200,
  "Austria": 200,
  "Ecuador": 200,
  "Australia": 250,
  "Scozia": 300,
  "Canada": 300,
  "Iran": 500,
  "Ghana": 500,
  "Paraguay": 500,
  "Bosnia ed Erzegovina": 500,
  "Egitto": 500,
  "Algeria": 500,
  "Repubblica Ceca": 750,
  "Tunisia": 1000,
  "Sudafrica": 1000,
  "Uzbekistan": 1000,
  "Iraq": 1000,
  "Haiti": 1000,
  "Giordania": 1000,
  "Qatar": 1000,
};

const codexGroupWinnerMarketOdds = {
  "A": { "Messico": 1.5, "Corea del Sud": 3, "Repubblica Ceca": 12, "Sudafrica": 125 },
  "B": { "Svizzera": 2, "Canada": 2.5, "Bosnia ed Erzegovina": 6, "Qatar": 33 },
  "C": { "Brasile": 1.6, "Marocco": 2.75, "Scozia": 10, "Haiti": 200 },
  "D": { "Stati Uniti": 1.4, "Australia": 4.5, "Turchia": 7.5, "Paraguay": 33 },
  "E": { "Germania": 1.3, "Costa d'Avorio": 4.5, "Ecuador": 9, "Curacao": 500 },
  "F": { "Olanda": 2.25, "Svezia": 3, "Giappone": 3.25, "Tunisia": 100 },
  "G": { "Belgio": 1.57, "Egitto": 3.75, "Iran": 7.5, "Nuova Zelanda": 16 },
  "H": { "Spagna": 1.25, "Uruguay": 4.5, "Capo Verde": 25, "Arabia Saudita": 33 },
  "I": { "Francia": 1.36, "Norvegia": 4, "Senegal": 8, "Iraq": 100 },
  "J": { "Argentina": 1.33, "Austria": 5, "Algeria": 9, "Giordania": 50 },
  "K": { "Portogallo": 1.45, "Colombia": 3, "RD Congo": 16, "Uzbekistan": 30 },
  "L": { "Inghilterra": 1.3, "Croazia": 4, "Ghana": 20, "Panama": 50 },
};

const codexTopScorerMarketOdds = [
  { team: "Francia", player: "Kylian Mbappe", odds: 6 },
  { team: "Inghilterra", player: "Harry Kane", odds: 7.5 },
  { team: "Norvegia", player: "Erling Haaland", odds: 10 },
  { team: "Argentina", player: "Lionel Messi", odds: 16 },
  { team: "Francia", player: "Michael Olise", odds: 20 },
  { team: "Argentina", player: "Julian Alvarez", odds: 20 },
  { team: "Brasile", player: "Vinicius Jr", odds: 20 },
  { team: "Portogallo", player: "Cristiano Ronaldo", odds: 20 },
  { team: "Spagna", player: "Mikel Oyarzabal", odds: 25 },
  { team: "Stati Uniti", player: "Folarin Balogun", odds: 25 },
  { team: "Spagna", player: "Lamine Yamal", odds: 33 },
  { team: "Francia", player: "Ousmane Dembele", odds: 40 },
  { team: "Brasile", player: "Raphinha", odds: 50 },
  { team: "Germania", player: "Jamal Musiala", odds: 50 },
  { team: "Argentina", player: "Lautaro Martinez", odds: 50 },
  { team: "Brasile", player: "Igor Thiago", odds: 66 },
  { team: "Olanda", player: "Donyell Malen", odds: 66 },
  { team: "Olanda", player: "Cody Gakpo", odds: 66 },
  { team: "Messico", player: "Raul Jimenez", odds: 66 },
  { team: "Germania", player: "Nick Woltemade", odds: 66 },
  { team: "Canada", player: "Jonathan David", odds: 75 },
  { team: "Colombia", player: "Luis Diaz", odds: 75 },
  { team: "Belgio", player: "Romelu Lukaku", odds: 75 },
  { team: "Spagna", player: "Ferran Torres", odds: 100 },
  { team: "Germania", player: "Florian Wirtz", odds: 100 },
  { team: "Inghilterra", player: "Bukayo Saka", odds: 100 },
  { team: "Corea del Sud", player: "Son Heung-Min", odds: 100 },
  { team: "Olanda", player: "Memphis Depay", odds: 100 },
  { team: "Portogallo", player: "Bruno Fernandes", odds: 100 },
  { team: "Colombia", player: "Luis Suarez", odds: 100 },
  { team: "Francia", player: "Jean-Philippe Mateta", odds: 150 },
  { team: "Uruguay", player: "Darwin Nunez", odds: 150 },
  { team: "Portogallo", player: "Goncalo Ramos", odds: 150 },
  { team: "Stati Uniti", player: "Christian Pulisic", odds: 150 },
  { team: "Marocco", player: "Brahim Diaz", odds: 150 },
  { team: "Spagna", player: "Nico Williams", odds: 200 },
  { team: "Turchia", player: "Kenan Yildiz", odds: 200 },
  { team: "Scozia", player: "Scott McTominay", odds: 200 },
  { team: "Spagna", player: "Dani Olmo", odds: 200 },
  { team: "Egitto", player: "Mohamed Salah", odds: 200 },
  { team: "Norvegia", player: "Alexander Sorloth", odds: 200 },
  { team: "Belgio", player: "Leandro Trossard", odds: 200 },
];

const externalPredictionModels = [
  {
    id: "klement",
    name: "Joachim Klement",
    weight: 0.07,
    description: "Modello economico-statistico noto per aver indicato correttamente Germania 2014, Francia 2018 e Argentina 2022.",
    badges: [
      { team: "Olanda", label: "Klement", icon: "&#127942;", score: 100, consensus: 3 },
      { team: "Portogallo", label: "Klement", icon: "&#129353;", score: 86, consensus: 2 },
      { team: "Spagna", label: "Klement", icon: "&#127941;", score: 72, consensus: 1 },
      { team: "Inghilterra", label: "Klement", icon: "&#127941;", score: 72, consensus: 1 },
      { team: "Giappone", label: "Klement", icon: "&#9733;", score: 58, consensus: 0 },
    ],
    summary: "Campione Olanda, finalista Portogallo, semifinaliste Spagna e Inghilterra.",
  },
  {
    id: "opta",
    name: "Opta Supercomputer",
    weight: 0.12,
    description: "25.000 simulazioni statistiche del torneo.",
    probabilities: {
      "Spagna": 16.1,
      "Francia": 13.0,
      "Inghilterra": 11.2,
      "Argentina": 10.4,
      "Portogallo": 7.0,
      "Brasile": 6.6,
      "Germania": 5.1,
      "Olanda": 3.8,
    },
    summary: "Spagna davanti a Francia, Inghilterra e Argentina nelle simulazioni.",
  },
  {
    id: "goldman",
    name: "Goldman Sachs",
    weight: 0.06,
    description: "Modello economico-finanziario applicato al torneo.",
    badges: [
      { team: "Spagna", label: "Goldman", icon: "&#127942;", score: 100, consensus: 2 },
    ],
    summary: "Campione Spagna con probabilita titolo 26%.",
  },
  {
    id: "ai",
    name: "Modelli IA",
    weight: 0.05,
    description: "Le IA utilizzano metodologie differenti e non rappresentano una previsione unificata.",
    badges: [
      { team: "Olanda", label: "Gemini", icon: "&#127942;", score: 100, consensus: 1 },
      { team: "Argentina", label: "ChatGPT", icon: "&#127942;", score: 100, consensus: 1 },
      { team: "Francia", label: "Claude", icon: "&#127942;", score: 100, consensus: 1 },
    ],
    summary: "Gemini indica Olanda, ChatGPT Argentina, Claude Francia.",
  },
];

const codexWorldTitles = {
  "Brasile": 5,
  "Germania": 4,
  "Italia": 4,
  "Argentina": 3,
  "Francia": 2,
  "Uruguay": 2,
  "Inghilterra": 1,
  "Spagna": 1,
};

const codexLegendMotivation = {
  "Portogallo": { score: 20, reason: "Probabile ultimo Mondiale di Cristiano Ronaldo." },
  "Argentina": { score: 18, reason: "Ultima grande finestra competitiva della generazione Messi." },
  "Croazia": { score: 18, reason: "Ultima corsa mondiale del gruppo Modric." },
  "Corea del Sud": { score: 16, reason: "Son e la generazione esperta hanno una motivazione personale molto alta." },
  "Egitto": { score: 15, reason: "Salah e il nucleo storico cercano il grande risultato mondiale." },
  "Belgio": { score: 13, reason: "Ultima finestra reale per alcuni leader della generazione d'oro." },
  "Olanda": { score: 9, reason: "Leader maturi e gruppo nel pieno della carriera internazionale." },
  "Uruguay": { score: 8, reason: "Generazione di transizione con riferimenti esperti ancora centrali." },
  "Colombia": { score: 7, reason: "Leader offensivi nel pieno della maturita." },
  "Marocco": { score: 7, reason: "Gruppo storico ancora spinto dal picco del 2022." },
  "Messico": { score: 7, reason: "Leader esperti e Mondiale casalingo aumentano la spinta emotiva." },
  "Stati Uniti": { score: 6, reason: "Nucleo maturo davanti al pubblico di casa." },
  "Inghilterra": { score: 6, reason: "Leader offensivi nel pieno, pressione nazionale alta." },
};

const codexGoldenGeneration = {
  "Spagna": 19,
  "Francia": 18,
  "Inghilterra": 19,
  "Portogallo": 18,
  "Argentina": 17,
  "Brasile": 17,
  "Olanda": 16,
  "Germania": 16,
  "Belgio": 15,
  "Marocco": 15,
  "Colombia": 14,
  "Uruguay": 14,
  "Stati Uniti": 14,
  "Canada": 13,
  "Giappone": 13,
  "Messico": 12,
  "Turchia": 12,
  "Croazia": 11,
  "Norvegia": 11,
  "Senegal": 11,
};

const codexHistoricalRevenge = {
  "Olanda": { score: 15, reason: "Tre finali mondiali perse: la rivincita storica e enorme." },
  "Inghilterra": { score: 14, reason: "Un solo titolo nel 1966 e pressione storica costante." },
  "Belgio": { score: 13, reason: "Generazione molto forte mai premiata con un titolo." },
  "Croazia": { score: 12, reason: "Finale 2018 persa e semifinale 2022: conto aperto con il torneo." },
  "Marocco": { score: 12, reason: "Prima africana in semifinale: spinta a completare l'impresa." },
  "Portogallo": { score: 11, reason: "Grande tradizione recente, ma nessun Mondiale vinto." },
  "Messico": { score: 10, reason: "Mondiale in casa e lunga attesa di un salto storico." },
  "Stati Uniti": { score: 9, reason: "Torneo casalingo e progetto costruito per alzare l'asticella." },
  "Colombia": { score: 8, reason: "Talento generazionale e desiderio di superare il miglior percorso storico." },
  "Brasile": { score: 8, reason: "Pressione enorme dopo le delusioni recenti da favorita." },
  "Argentina": { score: 7, reason: "Difesa del titolo e orgoglio del ciclo vincente." },
  "Spagna": { score: 7, reason: "Rosa giovane e forte dopo anni senza tornare in finale." },
  "Francia": { score: 7, reason: "Finale 2022 persa e gruppo ancora da titolo." },
  "Germania": { score: 7, reason: "Necessita una risposta storica dopo tornei sotto standard." },
};

const codexTechnicalContinuity = {
  "Argentina": 10,
  "Francia": 9,
  "Spagna": 9,
  "Portogallo": 8,
  "Olanda": 8,
  "Inghilterra": 8,
  "Brasile": 7,
  "Germania": 7,
  "Marocco": 8,
  "Croazia": 8,
  "Uruguay": 7,
  "Colombia": 7,
  "Giappone": 8,
  "Messico": 7,
  "Stati Uniti": 7,
  "Canada": 7,
  "Belgio": 6,
  "Senegal": 6,
};

const codexEnvironmentalProfiles = {
  "Messico": { altitude: 10, heat: 6, humidity: 5, home: 2.5 },
  "Stati Uniti": { altitude: 3, heat: 7, humidity: 7, home: 2.5 },
  "Canada": { altitude: 2, heat: 4, humidity: 4, home: 2.2 },
  "Ecuador": { altitude: 10, heat: 8, humidity: 6, home: 0 },
  "Colombia": { altitude: 8, heat: 8, humidity: 7, home: 0 },
  "Brasile": { altitude: 3, heat: 9, humidity: 9, home: 0 },
  "Paraguay": { altitude: 3, heat: 8, humidity: 7, home: 0 },
  "Sudafrica": { altitude: 8, heat: 5, humidity: 4, home: 0 },
  "Marocco": { altitude: 5, heat: 7, humidity: 4, home: 0 },
  "Uruguay": { altitude: 2, heat: 6, humidity: 6, home: 0 },
  "Argentina": { altitude: 3, heat: 6, humidity: 5, home: 0 },
  "Portogallo": { altitude: 2, heat: 6, humidity: 5, home: 0 },
  "Spagna": { altitude: 3, heat: 7, humidity: 4, home: 0 },
};

const STADIUM_INFO = {
  "BC Place": { city: "Vancouver", country: "Canada", altitude: 2 },
  "Lumen Field": { city: "Seattle", country: "USA", altitude: 6 },
  "Levi's Stadium": { city: "Santa Clara", country: "USA", altitude: 3 },
  "SoFi Stadium": { city: "Los Angeles", country: "USA", altitude: 38 },
  "Estadio Akron": { city: "Guadalajara", country: "Messico", altitude: 1566 },
  "Estadio Azteca": { city: "Città del Messico", country: "Messico", altitude: 2200 },
  "Estadio BBVA": { city: "Monterrey", country: "Messico", altitude: 540 },
  "NRG Stadium": { city: "Houston", country: "USA", altitude: 15 },
  "AT&T Stadium": { city: "Dallas / Arlington", country: "USA", altitude: 180 },
  "Arrowhead Stadium": { city: "Kansas City", country: "USA", altitude: 270 },
  "Mercedes-Benz Stadium": { city: "Atlanta", country: "USA", altitude: 320 },
  "Hard Rock Stadium": { city: "Miami", country: "USA", altitude: 2 },
  "BMO Field": { city: "Toronto", country: "Canada", altitude: 76 },
  "Gillette Stadium": { city: "Boston / Foxborough", country: "USA", altitude: 88 },
  "Lincoln Financial Field": { city: "Philadelphia", country: "USA", altitude: 10 },
  "MetLife Stadium": { city: "New York / New Jersey", country: "USA", altitude: 2 },
};

const CLIMATE_DATA = {
  "Vancouver": { tempMin: 18, tempMax: 23, humidity: "Moderata", rainRisk: "Basso", difficulty: 10 },
  "Seattle": { tempMin: 18, tempMax: 25, humidity: "Moderata", rainRisk: "Basso", difficulty: 15 },
  "Santa Clara": { tempMin: 17, tempMax: 23, humidity: "Moderata", rainRisk: "Molto basso", difficulty: 15 },
  "Los Angeles": { tempMin: 20, tempMax: 28, humidity: "Bassa", rainRisk: "Molto basso", difficulty: 25 },
  "Toronto": { tempMin: 22, tempMax: 29, humidity: "Media", rainRisk: "Medio", difficulty: 35 },
  "Boston": { tempMin: 22, tempMax: 30, humidity: "Media", rainRisk: "Medio", difficulty: 40 },
  "Guadalajara": { tempMin: 22, tempMax: 31, humidity: "Moderata", rainRisk: "Medio", difficulty: 45 },
  "Città del Messico": { tempMin: 18, tempMax: 27, humidity: "Moderata", rainRisk: "Medio", difficulty: 55 },
  "Philadelphia": { tempMin: 24, tempMax: 32, humidity: "Alta", rainRisk: "Medio", difficulty: 60 },
  "New York / New Jersey": { tempMin: 24, tempMax: 32, humidity: "Alta", rainRisk: "Medio", difficulty: 60 },
  "Kansas City": { tempMin: 26, tempMax: 35, humidity: "Medio-alta", rainRisk: "Medio", difficulty: 70 },
  "Atlanta": { tempMin: 27, tempMax: 35, humidity: "Alta", rainRisk: "Alto", difficulty: 80 },
  "Dallas / Arlington": { tempMin: 30, tempMax: 39, humidity: "Medio-alta", rainRisk: "Basso", difficulty: 90 },
  "Houston": { tempMin: 29, tempMax: 37, humidity: "Molto alta", rainRisk: "Alto", difficulty: 95 },
  "Monterrey": { tempMin: 30, tempMax: 40, humidity: "Medio-alta", rainRisk: "Basso", difficulty: 95 },
  "Miami": { tempMin: 29, tempMax: 35, humidity: "Estremamente alta", rainRisk: "Molto alto", difficulty: 100 },
};

const codexVenueStadiums = {
  "Vancouver, Canada": "BC Place",
  "Seattle, USA": "Lumen Field",
  "Santa Clara, USA": "Levi's Stadium",
  "Los Angeles, USA": "SoFi Stadium",
  "Zapopan, Mexico": "Estadio Akron",
  "Mexico City, Mexico": "Estadio Azteca",
  "Guadalupe, Mexico": "Estadio BBVA",
  "Houston, USA": "NRG Stadium",
  "Arlington, USA": "AT&T Stadium",
  "Kansas City, USA": "Arrowhead Stadium",
  "Atlanta, USA": "Mercedes-Benz Stadium",
  "Miami, USA": "Hard Rock Stadium",
  "Toronto, Canada": "BMO Field",
  "Foxborough, USA": "Gillette Stadium",
  "Philadelphia, USA": "Lincoln Financial Field",
  "New Jersey, USA": "MetLife Stadium",
};

function codexFold(value) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function codexCompact(value) {
  return codexFold(value).replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
}

function codexRankingKey(value) {
  const aliases = {
    "stati uniti": "usa",
    "united states": "usa",
    "usa": "usa",
    "repubblica ceca": "cechia",
    "czech republic": "cechia",
    "cechia": "cechia",
    "rd congo": "rd del congo",
    "dr congo": "rd del congo",
    "democratic republic of congo": "rd del congo",
    "bosnia herzegovina": "bosnia ed erzegovina",
    "bosnia erzegovina": "bosnia ed erzegovina",
    "bosnia and herzegovina": "bosnia ed erzegovina",
    "curaçao": "curacao",
    "curacao": "curacao",
    "olanda": "olanda",
    "netherlands": "olanda",
    "emirati arabi uniti": "emirati arabi uniti",
    "uae": "emirati arabi uniti",
    "comoros": "comore",
    "rwanda": "ruanda",
    "kenya": "kenia",
    "central african rep": "repubblica centrafricana",
    "faeroerne": "isole faroe",
    "south sudan": "sud sudan",
    "st lucia": "santa lucia",
  };
  const key = codexCompact(value);
  return aliases[key] || key;
}

function codexNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function codexAverage(items, key) {
  const values = items.map((item) => codexNumber(item[key])).filter((value) => value !== null);
  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function codexClamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function codexRegulationProfile(team) {
  return codexRegulationProfiles[team] || { press: 0.48, tempo: 0.48, dissent: 0.3, timeManagement: 0.32 };
}

function codexRegulationBoost(team) {
  const profile = codexRegulationProfile(team);
  return (profile.press * 1.15 + profile.tempo * 0.9) - (profile.timeManagement * 1.05 + profile.dissent * 0.38);
}

function codexWinnerMarketBoost(team) {
  const odds = codexWinnerMarketOdds[team];
  if (!odds) return 0;
  return codexClamp(Math.log(80 / odds) * 2.2, -5.2, 6.6);
}

function codexGroupOfTeam(team) {
  return Object.entries(groupTeams || {}).find(([, teams]) => teams.includes(team))?.[0] || "";
}

function codexGroupWinnerMarketBoost(team) {
  const group = codexGroupOfTeam(team);
  const odds = codexGroupWinnerMarketOdds[group]?.[team];
  if (!odds) return 0;
  return codexClamp(Math.log(7.5 / odds) * 1.35, -4.5, 3.2);
}

function codexScorerMarketEntry(row) {
  return codexTopScorerMarketOdds.find((entry) =>
    entry.team === row.team && codexStarterMatchesPlayer(entry.player, row.player)
  );
}

function codexScorerMarketOdds(row) {
  const item = codexScorerMarketEntry(row);
  return item?.odds || null;
}

function codexScorerDisplayName(row) {
  return codexScorerMarketEntry(row)?.player || row.player;
}

function codexExternalModelById(id) {
  return externalPredictionModels.find((model) => model.id === id) || {};
}

function codexExternalModelBadgeItems(team) {
  return externalPredictionModels.flatMap((model) => {
    if (model.id === "opta") {
      const probability = model.probabilities?.[team];
      return probability ? [{
        model: model.id,
        label: "Opta",
        icon: "",
        value: `${probability.toFixed(1)}%`,
        score: codexExternalModelScore(team, "opta"),
        consensus: codexOptaConsensusPoints(probability),
      }] : [];
    }
    return (model.badges || [])
      .filter((badge) => badge.team === team)
      .map((badge) => ({ model: model.id, ...badge }));
  });
}

function codexOptaConsensusPoints(probability) {
  if (probability >= 16) return 3;
  if (probability >= 10) return 2;
  if (probability >= 5) return 1;
  return 0;
}

function codexExternalModelScore(team, modelId) {
  const model = codexExternalModelById(modelId);
  if (modelId === "opta") {
    const probabilities = Object.values(model.probabilities || {});
    const maxProbability = Math.max(...probabilities, 1);
    return codexClamp(((model.probabilities?.[team] || 0) / maxProbability) * 100, 0, 100);
  }
  const matching = (model.badges || []).filter((badge) => badge.team === team);
  if (!matching.length) return 0;
  return Math.max(...matching.map((badge) => badge.score || 0));
}

function codexExternalConsensusDetail(team) {
  const optaProbability = codexExternalModelById("opta").probabilities?.[team] || 0;
  const klementPoints = (codexExternalModelById("klement").badges || [])
    .filter((badge) => badge.team === team)
    .reduce((total, badge) => total + (badge.consensus || 0), 0);
  const goldmanPoints = (codexExternalModelById("goldman").badges || [])
    .filter((badge) => badge.team === team)
    .reduce((total, badge) => total + (badge.consensus || 0), 0);
  const aiPoints = (codexExternalModelById("ai").badges || [])
    .filter((badge) => badge.team === team)
    .reduce((total, badge) => total + (badge.consensus || 0), 0);
  const optaPoints = codexOptaConsensusPoints(optaProbability);
  return {
    team,
    total: klementPoints + optaPoints + goldmanPoints + aiPoints,
    klementPoints,
    optaPoints,
    goldmanPoints,
    aiPoints,
    optaProbability,
  };
}

function codexExternalConsensusRanking() {
  return Object.values(groupTeams).flat()
    .map(codexExternalConsensusDetail)
    .filter((row) => row.total > 0)
    .sort((a, b) =>
      b.total - a.total ||
      (b.klementPoints >= 2 ? 1 : 0) - (a.klementPoints >= 2 ? 1 : 0) ||
      b.optaProbability - a.optaProbability ||
      b.klementPoints - a.klementPoints ||
      b.optaPoints - a.optaPoints ||
      b.goldmanPoints - a.goldmanPoints ||
      b.aiPoints - a.aiPoints ||
      a.team.localeCompare(b.team)
    );
}

function codexRoundOf32TeamSet() {
  if (!Object.keys(codexState.groupTables || {}).length) return new Set();
  return new Set(codexRoundOf32Seeds
    .flatMap((seeds, matchIndex) => seeds.map((seed, seedOffset) => codexTeamFromSeed(seed, matchIndex * 2 + seedOffset)))
    .filter(Boolean));
}

function codexIsRoundOf32Team(team) {
  return codexRoundOf32TeamSet().has(team);
}

function codexTitleHungerScore(team) {
  const titles = codexWorldTitles[team] || 0;
  if (titles === 0) return { score: 25, reason: "Non ha mai vinto il Mondiale." };
  if (titles === 1) return { score: 15, reason: "Ha un solo titolo mondiale e forte pressione per riaprire il ciclo." };
  return { score: 5, reason: "Ha gia una storia mondiale vincente, quindi la fame pesa meno." };
}

function codexTeamRouteEnvironments(team) {
  return Object.values(codexState.results || {})
    .filter((result) => result?.fixture && (result.teamA === team || result.teamB === team))
    .map((result) => enrichMatch(result.fixture))
    .filter((match) => match?.stadium);
}

function codexEnvironmentalMotivation(team) {
  const profile = codexEnvironmentalProfiles[team] || { altitude: 2, heat: 4, humidity: 4, home: 0 };
  const route = codexTeamRouteEnvironments(team);
  const avgAltitude = route.length
    ? route.reduce((total, match) => total + (match.altitude || 0), 0) / route.length
    : 250;
  const avgDifficulty = route.length
    ? route.reduce((total, match) => total + (match.climateDifficulty || 0), 0) / route.length
    : 45;
  const altitudeDemand = avgAltitude >= 1500 ? 1 : avgAltitude >= 500 ? 0.58 : 0.18;
  const climateDemand = codexClamp(avgDifficulty / 100, 0.1, 1);
  const score = codexClamp(
    profile.home + profile.altitude * altitudeDemand * 0.42 + profile.heat * climateDemand * 0.34 + profile.humidity * climateDemand * 0.18,
    0,
    10
  );
  const reasons = [];
  if (profile.home >= 2) reasons.push("Vantaggio ambientale da paese ospitante.");
  if (profile.altitude >= 8 && avgAltitude >= 500) reasons.push("Buona adattabilita ad altura e rarefazione dell'ossigeno.");
  if (profile.heat >= 7 && avgDifficulty >= 60) reasons.push("Abitudine a caldo, umidita e stress climatico.");
  if (!reasons.length && score >= 5.8) reasons.push("Condizioni del percorso abbastanza favorevoli.");
  return { score, reasons, avgAltitude, avgDifficulty };
}

function codexGoldenGenerationScore(team) {
  const manual = codexGoldenGeneration[team] ?? null;
  if (manual !== null) return manual;
  const strength = codexState.strengths[team]?.total || 50;
  const formationIndex = codexState.strengths[team]?.worldCupIndex || 50;
  return codexClamp(Math.round((strength - 42) * 0.32 + (formationIndex - 45) * 0.16 + 8), 0, 20);
}

function codexMotivationIndex(team) {
  if (!codexIsRoundOf32Team(team)) return null;
  const title = codexTitleHungerScore(team);
  const legend = codexLegendMotivation[team] || { score: 0, reason: "" };
  const generationScore = codexGoldenGenerationScore(team);
  const revenge = codexHistoricalRevenge[team] || { score: 0, reason: "" };
  const continuityScore = codexTechnicalContinuity[team] ?? codexClamp(Math.round(((codexState.strengths[team]?.form || 50) - 42) / 3), 0, 10);
  const environment = codexEnvironmentalMotivation(team);
  const total = codexClamp(Math.round(
    title.score +
    legend.score +
    generationScore +
    revenge.score +
    continuityScore +
    environment.score
  ), 0, 100);
  const reasons = [
    title.reason,
    legend.reason,
    generationScore >= 16 ? "Generazione forte e nel pieno della maturita." : generationScore >= 12 ? "Rosa competitiva con diversi profili di alto livello." : "",
    revenge.reason,
    continuityScore >= 8 ? "Progetto tecnico stabile e identita tattica chiara." : continuityScore >= 6 ? "Continuita tecnica discreta." : "",
    ...environment.reasons,
  ].filter(Boolean).slice(0, 5);
  return {
    team,
    total,
    titleScore: title.score,
    legendScore: legend.score,
    generationScore,
    revengeScore: revenge.score,
    continuityScore,
    environmentScore: Number(environment.score.toFixed(1)),
    reasons,
  };
}

function codexMotivationRanking() {
  return Array.from(codexRoundOf32TeamSet())
    .map(codexMotivationIndex)
    .filter(Boolean)
    .sort((a, b) =>
      b.total - a.total ||
      b.legendScore - a.legendScore ||
      b.generationScore - a.generationScore ||
      a.team.localeCompare(b.team)
    );
}

function codexPlusScore(team) {
  const codexScore = codexState.strengths[team]?.total || 0;
  const motivationScore = codexMotivationIndex(team)?.total ?? codexScore;
  const optaScore = codexExternalModelScore(team, "opta");
  const klementScore = codexExternalModelScore(team, "klement");
  const goldmanScore = codexExternalModelScore(team, "goldman");
  const aiScore = codexExternalModelScore(team, "ai");
  return codexScore * 0.60 +
    motivationScore * 0.10 +
    optaScore * 0.12 +
    klementScore * 0.07 +
    goldmanScore * 0.06 +
    aiScore * 0.05;
}

function codexExternalBadges(team, limit = 4) {
  const badges = codexExternalModelBadgeItems(team)
    .sort((a, b) => (b.consensus || 0) - (a.consensus || 0) || (b.score || 0) - (a.score || 0))
    .slice(0, limit);
  if (!badges.length) return "";
  return `<span class="codex-external-badges">${badges.map((badge) => `
    <span class="codex-external-badge is-${codexEscape(badge.model)}">
      ${badge.icon || ""}${codexEscape(badge.label)}${badge.value ? ` ${codexEscape(badge.value)}` : ""}
    </span>`).join("")}</span>`;
}

function codexScorerMarketMultiplier(row) {
  const odds = codexScorerMarketOdds(row);
  if (!odds) return 1;
  return codexClamp(1 + Math.log(120 / odds) * 0.13, 0.78, 1.48);
}

function codexRankingEntries() {
  if (typeof fifaRankingData === "undefined") return [];
  return fifaRankingData.rankings || [];
}

function codexRankingRecord(team) {
  const key = codexRankingKey(team);
  const found = codexRankingEntries().find(([name]) => codexRankingKey(name) === key);
  if (!found) return null;
  return { name: found[0], rank: found[1], points: codexNumber(found[2]) };
}

function codexRankingPoints(team) {
  const record = codexRankingRecord(team);
  if (!record) return null;
  if (record.points !== null) return record.points;
  return Math.max(720, 1465 - Math.max(0, record.rank - 50) * 4.5);
}

function codexFlag(team) {
  const src = teamFlags[team];
  return src ? `<img class="prediction-team-flag" src="${src}" alt="" loading="lazy">` : "";
}

function codexEscape(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char]));
}

function codexTeamFromFixtureName(name) {
  return codexTranslations[name] || name;
}

function codexFixtureTeams(match) {
  const parts = String(match || "").split(/\s+vs\s+/i);
  if (parts.length !== 2) return [];
  if (parts.some((part) => /Group|Match|winner|loser|runner|third/i.test(part))) return [];
  return parts.map((team) => codexTeamFromFixtureName(team.trim()));
}

function codexTeamMatches(team) {
  const record = (typeof teamStatsData !== "undefined" ? teamStatsData : []).find((item) => item.team === team);
  return record?.matches || [];
}

function codexRecentForm(matches) {
  if (!matches.length) return 0;
  const points = matches.reduce((total, match) => {
    const score = String(match.score || "").match(/(\d+)\s*-\s*(\d+)/);
    if (!score) return total;
    const own = Number(score[1]);
    const other = Number(score[2]);
    if (own > other) return total + 3;
    if (own === other) return total + 1;
    return total;
  }, 0);
  return points / (matches.length * 3);
}

function codexWeightedAverage(matches, getter) {
  let total = 0;
  let weightTotal = 0;
  matches.forEach((match, index) => {
    const value = getter(match);
    if (value === null || value === undefined || Number.isNaN(value)) return;
    const weight = Math.max(1, matches.length - index);
    total += value * weight;
    weightTotal += weight;
  });
  return weightTotal ? total / weightTotal : null;
}

function codexRecentTeamProfile(matches) {
  if (!matches.length) {
    return {
      form: 0,
      weightedForm: 0,
      goalsFor: 1.1,
      goalsAgainst: 1.1,
      goalDiff: 0,
      xgFor: 1.25,
      xgAgainst: 1.15,
      shotsFor: 10,
      shotsAgainst: 10,
      sotFor: 4,
      sotAgainst: 4,
      possession: 50,
    };
  }
  const pointsGetter = (match) => {
    const score = String(match.score || "").match(/(\d+)\s*-\s*(\d+)/);
    if (!score) return null;
    const own = Number(score[1]);
    const other = Number(score[2]);
    if (own > other) return 1;
    if (own === other) return 1 / 3;
    return 0;
  };
  const goalsFor = codexWeightedAverage(matches, (match) => {
    const score = String(match.score || "").match(/(\d+)\s*-\s*(\d+)/);
    return score ? Number(score[1]) : null;
  }) ?? 1.1;
  const goalsAgainst = codexWeightedAverage(matches, (match) => {
    const score = String(match.score || "").match(/(\d+)\s*-\s*(\d+)/);
    return score ? Number(score[2]) : null;
  }) ?? 1.1;
  const opponentRanking = codexWeightedAverage(matches, (match) => codexRankingPoints(match.opponent));
  return {
    form: codexRecentForm(matches),
    weightedForm: codexWeightedAverage(matches, pointsGetter) ?? codexRecentForm(matches),
    goalsFor,
    goalsAgainst,
    goalDiff: goalsFor - goalsAgainst,
    xgFor: codexWeightedAverage(matches, (match) => codexNumber(match.xgFor)) ?? codexAverage(matches, "xgFor") ?? 1.25,
    xgAgainst: codexWeightedAverage(matches, (match) => codexNumber(match.xgAgainst)) ?? codexAverage(matches, "xgAgainst") ?? 1.15,
    shotsFor: codexWeightedAverage(matches, (match) => codexNumber(match.shotsFor)) ?? codexAverage(matches, "shotsFor") ?? 10,
    shotsAgainst: codexWeightedAverage(matches, (match) => codexNumber(match.shotsAgainst)) ?? codexAverage(matches, "shotsAgainst") ?? 10,
    sotFor: codexWeightedAverage(matches, (match) => codexNumber(match.shotsOnTargetFor)) ?? codexAverage(matches, "shotsOnTargetFor") ?? 4,
    sotAgainst: codexWeightedAverage(matches, (match) => codexNumber(match.shotsOnTargetAgainst)) ?? codexAverage(matches, "shotsOnTargetAgainst") ?? 4,
    possession: codexWeightedAverage(matches, (match) => codexNumber(match.possession)) ?? codexAverage(matches, "possession") ?? 50,
    opponentRanking,
  };
}

function codexPlayerRecord(row) {
  const stats = typeof playerStats !== "undefined" ? playerStats : {};
  const base = codexFold(`${row.team}::${row.player}`);
  const roleKey = `${base}::${codexFold(row.role)}`;
  return stats[roleKey] || stats[base] || {};
}

function codexOutfieldRows(team) {
  return (typeof rows !== "undefined" ? rows : []).filter((row) => row.team === team && row.role !== "Portieri");
}

function codexSyntheticScorerRows(team) {
  const existingRows = codexOutfieldRows(team);
  const existing = (name) => existingRows.some((row) => codexStarterMatchesPlayer(name, row.player));
  const meta = codexFormationMeta(team);
  const candidates = [
    ...codexTopScorerMarketOdds.filter((entry) => entry.team === team).map((entry) => entry.player),
    meta.penaltyTaker,
    meta.mainStriker,
    meta.starPlayer,
  ].filter(Boolean);
  return [...new Set(candidates)]
    .filter((name) => !existing(name))
    .map((name) => ({
      group: codexGroupOfTeam(team),
      team,
      role: "Attaccanti",
      player: name,
      club: "",
      status: "Sintesi pronostico",
      source: "Quote capocannoniere / formazioni",
      flag: "",
    }));
}

function codexGoalkeeperRows(team) {
  return (typeof rows !== "undefined" ? rows : []).filter((row) => row.team === team && row.role === "Portieri");
}

function codexTeamInsight(team) {
  const formation = typeof probableFormations !== "undefined" ? probableFormations[team] || {} : {};
  const insight = typeof teamInsights !== "undefined" ? teamInsights[team] || {} : {};
  const formationMeta = typeof formationInsights !== "undefined" ? formationInsights[team] || {} : {};
  return {
    ...insight,
    ...formation,
    ...formationMeta,
    starters: (formation.starters || []).length ? formation.starters : (insight.starters || []),
  };
}

function codexFormationMeta(team) {
  return typeof formationInsights !== "undefined" ? formationInsights[team] || {} : {};
}

function codexCleanNameTokens(value) {
  return codexFold(value).replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
}

function codexStarterMatchesPlayer(starter, player) {
  const starterName = codexCompact(starter);
  const playerName = codexCompact(player);
  const trimFinalE = (value) => value.endsWith("e") ? value.slice(0, -1) : value;
  if (!starterName || !playerName) return false;
  if (starterName.length > 2 && (playerName.includes(starterName) || starterName.includes(playerName))) return true;
  const starterTokens = codexCleanNameTokens(starter).filter((token) => token.length > 1);
  const playerTokens = codexCleanNameTokens(player).filter((token) => token.length > 1);
  if (!starterTokens.length || !playerTokens.length) return false;
  if (starterTokens.length === 1) {
    return playerTokens.includes(starterTokens[0]) ||
      (starterTokens[0].length >= 5 && playerTokens.some((playerToken) => trimFinalE(starterTokens[0]) === trimFinalE(playerToken)));
  }
  if (starterTokens.every((token) => playerTokens.includes(token))) return true;
  if (starterTokens.every((token) => playerTokens.some((playerToken) =>
    token.length >= 5 && trimFinalE(token) === trimFinalE(playerToken)
  ))) return true;
  const starterLoose = starterName.replace(/[^a-z0-9]/g, "");
  const playerLoose = playerName.replace(/[^a-z0-9]/g, "");
  const shortLoose = trimFinalE(starterLoose.length <= playerLoose.length ? starterLoose : playerLoose);
  const longLoose = trimFinalE(starterLoose.length > playerLoose.length ? starterLoose : playerLoose);
  return shortLoose.length >= 5 && longLoose.includes(shortLoose);
}

function codexIsProbableStarter(row) {
  const starters = codexTeamInsight(row.team).starters || [];
  return starters.some((starter) => codexStarterMatchesPlayer(starter, row.player));
}

function codexExpectedMinutesShare(row) {
  const starter = codexIsProbableStarter(row);
  if (starter && row.role === "Attaccanti") return 0.82;
  if (starter && row.role === "Centrocampisti") return 0.86;
  if (starter) return 0.9;
  if (row.role === "Attaccanti") return 0.32;
  if (row.role === "Centrocampisti") return 0.26;
  return 0.18;
}

function codexIsFormationStar(row) {
  const starPlayer = codexFormationMeta(row.team).starPlayer;
  return starPlayer ? codexStarterMatchesPlayer(starPlayer, row.player) : false;
}

function codexIsMainStriker(row) {
  const mainStriker = codexFormationMeta(row.team).mainStriker;
  return mainStriker ? codexStarterMatchesPlayer(mainStriker, row.player) : false;
}

function codexPenaltyRank(row) {
  const takers = typeof penaltyTakers !== "undefined" ? penaltyTakers[row.team] || [] : [];
  const index = takers.findIndex((taker) => codexStarterMatchesPlayer(taker, row.player));
  return index === -1 ? 0 : index + 1;
}

function codexHasTournamentPedigree(row) {
  return ["Kylian Mbappe", "Harry Kane", "Lionel Messi", "Cristiano Ronaldo"]
    .some((name) => codexStarterMatchesPlayer(name, row.player));
}

function codexIsScorerEligible(row) {
  return (codexIsProbableStarter(row) && row.role !== "Difensori") || codexPenaltyRank(row) > 0;
}

function codexFormationRoleWeight(row) {
  const insight = codexTeamInsight(row.team);
  const starters = insight.starters || [];
  const index = starters.findIndex((starter) => codexStarterMatchesPlayer(starter, row.player));
  if (index === -1) return row.role === "Attaccanti" ? 0.86 : row.role === "Centrocampisti" ? 0.68 : 0.28;
  const moduleParts = String(insight.module || "").split("-").map((part) => Number(part)).filter(Number.isFinite);
  if (!moduleParts.length) return 1.05;
  let lineStart = 1;
  for (let lineIndex = 0; lineIndex < moduleParts.length; lineIndex += 1) {
    const count = moduleParts[lineIndex];
    const lineEnd = lineStart + count;
    if (index >= lineStart && index < lineEnd) {
      const isLastLine = lineIndex === moduleParts.length - 1;
      const isPenultimateLine = lineIndex === moduleParts.length - 2;
      const positionInLine = index - lineStart;
      const centralDistance = Math.abs(positionInLine - (count - 1) / 2);
      const centralBoost = count <= 1 ? 1.2 : Math.max(0, 0.22 - centralDistance * 0.08);
      if (isLastLine) return 1.48 + centralBoost;
      if (isPenultimateLine) return lineIndex >= 2 ? 1.08 + centralBoost * 0.6 : 0.92;
      return 0.72;
    }
    lineStart = lineEnd;
  }
  return 0.74;
}

function codexIsNationalMatch(match) {
  const competition = codexCompact(match.competition || match.competitionName || "");
  return [
    "freundschaft", "international", "welt", "world", "qualification", "qualific", "qualifier",
    "nations league", "euro", "africa cup", "asian cup", "concacaf", "copa america"
  ].some((token) => competition.includes(token));
}

function codexTeamSideInMatch(team, match) {
  const aliases = (codexNationalAliases[team] || [team]).map(codexCompact);
  const home = codexCompact(match.homeTeam || match.home || "");
  const away = codexCompact(match.awayTeam || match.away || "");
  if (aliases.some((alias) => alias && (home.includes(alias) || alias.includes(home)))) return "home";
  if (aliases.some((alias) => alias && (away.includes(alias) || alias.includes(away)))) return "away";
  return "";
}

function codexGoalsConcededInMatch(team, match) {
  const homeScore = codexNumber(match.homeScore);
  const awayScore = codexNumber(match.awayScore);
  if (homeScore === null || awayScore === null) return null;
  const side = codexTeamSideInMatch(team, match);
  if (side === "home") return awayScore;
  if (side === "away") return homeScore;
  return null;
}

function codexNationalGoalkeeperSample(team, recent) {
  if (recent.nationalGoalkeeper?.matches?.length) {
    return recent.nationalGoalkeeper.matches
      .map((match) => ({
        conceded: codexNumber(match.conceded),
        rating: codexNumber(match.rating),
      }))
      .filter((item) => item.conceded !== null);
  }
  if (recent.nationalGoalkeeper?.sample?.length) {
    return recent.nationalGoalkeeper.sample
      .map((match) => ({
        conceded: codexNumber(match.goalsConceded) ?? codexGoalsConcededInMatch(team, match),
        rating: codexNumber(match.rating),
      }))
      .filter((item) => item.conceded !== null);
  }
  return (recent.sample || [])
    .filter(codexIsNationalMatch)
    .map((match) => ({
      conceded: codexGoalsConcededInMatch(team, match),
      rating: codexNumber(match.rating),
    }))
    .filter((item) => item.conceded !== null);
}

function codexPlayerScore(team) {
  const players = codexOutfieldRows(team);
  if (!players.length) return 50;
  const scored = players.map((row) => {
    const recent = codexPlayerRecord(row).recent15 || {};
    const rating = codexNumber(recent.averageRating) || 6.2;
    const apps = codexNumber(recent.appearances) || 0;
    const goals = codexNumber(recent.goals) || 0;
    const assists = codexNumber(recent.assists) || 0;
    const availability = codexClamp(apps / 15, 0, 1);
    return (rating - 6) * 18 + goals * 1.8 + assists * 1.2 + availability * 4;
  }).sort((a, b) => b - a);
  const best = scored.slice(0, 14);
  return 45 + best.reduce((total, value) => total + value, 0) / Math.max(best.length, 1);
}

function codexGoalkeeperScore(team) {
  const keepers = codexGoalkeeperRows(team);
  if (!keepers.length) return 50;
  const scored = keepers.map((row) => {
    const recent = codexPlayerRecord(row).recent15 || {};
    const rating = codexNumber(recent.averageRating) || 6.2;
    const nationalSample = codexNationalGoalkeeperSample(team, recent);
    const nationalConceded = nationalSample.length
      ? nationalSample.reduce((total, item) => total + item.conceded, 0) / nationalSample.length
      : null;
    const nationalRatingValues = nationalSample.map((item) => item.rating).filter((value) => value !== null);
    const nationalRating = nationalRatingValues.length
      ? nationalRatingValues.reduce((total, value) => total + value, 0) / nationalRatingValues.length
      : null;
    const generalConceded = codexNumber(recent.goalsConcededPerGame);
    const nationalWeight = nationalSample.length >= 8 ? 0.75 : nationalSample.length >= 3 ? 0.6 : nationalSample.length > 0 ? 0.25 : 0;
    const conceded = nationalConceded === null
      ? generalConceded
      : generalConceded === null
        ? nationalConceded
        : nationalConceded * nationalWeight + generalConceded * (1 - nationalWeight);
    const blendedRating = nationalRating === null ? rating : nationalRating * nationalWeight + rating * (1 - nationalWeight);
    const apps = codexNumber(recent.appearances) || 0;
    const availability = codexClamp(apps / 15, 0, 1);
    const concededScore = conceded === null ? 0 : codexClamp(1.55 - conceded, -1.2, 1.2) * 12;
    return 50 + (blendedRating - 6.2) * 12 + concededScore + availability * 5;
  }).sort((a, b) => b - a);
  return scored[0] || 50;
}

function codexTeamStrength(team) {
  const matches = codexTeamMatches(team);
  const recent = codexRecentTeamProfile(matches);
  const formationMeta = codexFormationMeta(team);
  const xgFor = recent.xgFor;
  const xgAgainst = recent.xgAgainst;
  const shotsFor = recent.shotsFor;
  const shotsAgainst = recent.shotsAgainst;
  const sotFor = recent.sotFor;
  const sotAgainst = recent.sotAgainst;
  const possession = recent.possession;
  const form = recent.weightedForm;
  const players = codexPlayerScore(team);
  const goalkeepers = codexGoalkeeperScore(team);
  const rankingPoints = codexRankingPoints(team);
  const rankingBoost = rankingPoints === null ? 0 : codexClamp((rankingPoints - 1450) / 18, -18, 24);
  const scheduleBoost = recent.opponentRanking === null ? 0 : codexClamp((recent.opponentRanking - 1450) / 28, -14, 16);
  const regulationBoost = codexRegulationBoost(team);
  const indexBoost = formationMeta.worldCupIndex ? codexClamp((formationMeta.worldCupIndex - 78) / 1.6, -12, 14) : 0;
  const tierBoosts = { favorite: 5.5, contender: 2.5, dark_horse: 0.6, mid_tier: -1.8, outsider: -4.2 };
  const tierBoost = tierBoosts[formationMeta.tier] || 0;
  const marketBoost = codexWinnerMarketBoost(team);
  const recentAttack = recent.goalsFor * 4.8 + Math.max(0, recent.goalDiff) * 2.2;
  const recentDefence = -recent.goalsAgainst * 4.8 + Math.max(0, -recent.goalDiff) * -2.1;
  const attack = 50 + xgFor * 10.5 + sotFor * 2.55 + shotsFor * 0.5 + recentAttack + (players - 50) * 0.48 + rankingBoost * 0.18 + scheduleBoost * 0.18 + regulationBoost * 1.2 + indexBoost * 0.48 + tierBoost * 0.72 + marketBoost * 0.34;
  const control = possession * 0.32 + form * 26 + recent.goalDiff * 2.4 + rankingBoost * 0.28 + scheduleBoost * 0.44 + regulationBoost * 1.65 + indexBoost * 0.36 + tierBoost * 0.42 + marketBoost * 0.58;
  const resistance = 54 - xgAgainst * 12.5 - sotAgainst * 3 - shotsAgainst * 0.72 + recentDefence + (goalkeepers - 50) * 0.5 + rankingBoost * 0.24 + scheduleBoost * 0.16 + regulationBoost * 0.45 + indexBoost * 0.28 + tierBoost * 0.34 + marketBoost * 0.28;
  const total = attack * 0.42 + control * 0.24 + resistance * 0.34;
  return {
    team,
    total,
    attack,
    control,
    resistance,
    playerScore: players,
    goalkeeperScore: goalkeepers,
    form,
    recentGoalDiff: recent.goalDiff,
    recentGoalsFor: recent.goalsFor,
    recentGoalsAgainst: recent.goalsAgainst,
    rankingPoints,
    opponentRanking: recent.opponentRanking,
    scheduleBoost,
    xgFor,
    xgAgainst,
    regulationBoost,
    marketBoost,
    winnerOdds: codexWinnerMarketOdds[team] || null,
    worldCupIndex: formationMeta.worldCupIndex,
    formationTier: formationMeta.tier,
  };
}

function codexBuildStrengths() {
  codexState.strengths = Object.fromEntries(Object.values(groupTeams).flat().map((team) => [team, codexTeamStrength(team)]));
}

function codexExpectedGoals(team, opponent, knockout = false) {
  const own = codexState.strengths[team];
  const other = codexState.strengths[opponent];
  if (!own || !other) return 1;
  const strengthEdge = (own.total - other.total) / 34;
  const rankingEdge = ((own.rankingPoints || 1450) - (other.rankingPoints || 1450)) / 360;
  const attackPressure = (own.attack - 62) / 80;
  const defensivePressure = (50 - other.resistance) / 90;
  const recentEdge = ((own.form - other.form) * 0.22) + ((own.recentGoalDiff - other.recentGoalDiff) * 0.035);
  const raw = (knockout ? 0.72 : 0.9) + strengthEdge + rankingEdge + attackPressure + defensivePressure + recentEdge - (knockout ? 0.24 : 0);
  return codexClamp(raw, 0.03, 3.05);
}

function codexVenueCountry(fixture) {
  const venue = fixture?.[4] || "";
  if (/,\s*USA$/i.test(venue)) return "USA";
  if (/,\s*Mexico$/i.test(venue)) return "Mexico";
  if (/,\s*Canada$/i.test(venue)) return "Canada";
  return "";
}

function codexVenueCity(fixture) {
  return String(fixture?.[4] || "").split(",")[0].trim();
}

function getAltitudeClass(altitude) {
  if (altitude >= 1500) return "altitude-high";
  if (altitude >= 500) return "altitude-medium";
  return "altitude-low";
}

function getClimateClass(difficulty) {
  if (difficulty >= 80) return "climate-extreme";
  if (difficulty >= 60) return "climate-hard";
  if (difficulty >= 30) return "climate-medium";
  return "climate-easy";
}

function codexClimateCityKey(city) {
  if (city === "Boston / Foxborough") return "Boston";
  return city;
}

function enrichClimate(match) {
  const city = match?.city || codexVenueCity(match);
  const climate = CLIMATE_DATA[codexClimateCityKey(city)] || null;
  if (!climate) {
    return {
      ...match,
      tempMin: null,
      tempMax: null,
      humidity: "",
      rainRisk: "",
      climateDifficulty: null,
      climateClass: "",
    };
  }
  return {
    ...match,
    tempMin: climate.tempMin,
    tempMax: climate.tempMax,
    humidity: climate.humidity,
    rainRisk: climate.rainRisk,
    climateDifficulty: climate.difficulty,
    climateClass: getClimateClass(climate.difficulty),
  };
}

function enrichMatch(match) {
  const venue = Array.isArray(match) ? match[4] : match?.venue || "";
  const stadium = codexVenueStadiums[venue] || "";
  const stadiumInfo = STADIUM_INFO[stadium] || null;
  const [rawCity = "", rawCountry = ""] = String(venue).split(",").map((part) => part.trim());
  const enriched = {
    fixture: match,
    venue,
    stadium,
    city: stadiumInfo?.city || rawCity,
    country: stadiumInfo?.country || rawCountry,
    altitude: stadiumInfo?.altitude ?? null,
    altitudeClass: stadiumInfo ? getAltitudeClass(stadiumInfo.altitude) : "",
  };
  return enrichClimate(enriched);
}

function codexAltitudeBadge(match) {
  if (match.altitudeClass === "altitude-high") return { className: "altitude-high", label: "🔴 Alta quota" };
  if (match.altitudeClass === "altitude-medium") return { className: "altitude-medium", label: "🟠 Media quota" };
  return { className: "altitude-low", label: "🟢 Bassa quota" };
}

function codexClimateBadge(match) {
  if (match.climateClass === "climate-extreme") return { className: "climate-extreme", label: "🔴 Condizioni estreme" };
  if (match.climateClass === "climate-hard") return { className: "climate-hard", label: "🟠 Condizioni impegnative" };
  if (match.climateClass === "climate-medium") return { className: "climate-medium", label: "🟡 Condizioni buone" };
  return { className: "climate-easy", label: "🟢 Condizioni ideali" };
}

function codexSpecialVenueBadges(match) {
  const badges = [];
  if (match.stadium === "Estadio Azteca") badges.push({ className: "is-altitude-factor", label: "FATTORE ALTITUDINE" });
  if (match.stadium === "Estadio Akron") badges.push({ className: "is-high-altitude", label: "ALTA QUOTA" });
  if (match.stadium === "Estadio BBVA") badges.push({ className: "is-mid-altitude", label: "QUOTA INTERMEDIA" });
  if (["Miami", "Houston", "Monterrey", "Dallas / Arlington"].includes(match.city) && match.climateDifficulty >= 90) {
    badges.push({ className: "is-extreme-heat", label: "🔥 CALDO ESTREMO" });
  } else if (["Atlanta", "Dallas / Arlington", "Houston", "Monterrey", "Miami"].includes(match.city) && match.climateDifficulty >= 80) {
    badges.push({ className: "is-heat-stress", label: "☀️ STRESS TERMICO ELEVATO" });
  }
  return badges;
}

function codexBadgeMarkup(badge, extraClass = "") {
  return `<span class="codex-env-badge ${extraClass} ${badge.className}">${codexEscape(badge.label)}</span>`;
}

function codexClimateTooltip() {
  return "Valore basato sulle medie climatiche storiche di giugno-luglio della città ospitante. Non rappresenta una previsione meteo reale.";
}

function codexRenderEnvironmentPanel(match, compact = false) {
  if (!match?.stadium) return "";
  const altitudeBadge = codexAltitudeBadge(match);
  const climateBadge = codexClimateBadge(match);
  const specialBadges = codexSpecialVenueBadges(match);
  const difficulty = codexClamp(match.climateDifficulty ?? 0, 0, 100);
  if (compact) {
    return `
      <div class="codex-world-env" title="${codexEscape(codexClimateTooltip())}">
        <span>🏟️ ${codexEscape(match.stadium)}</span>
        <span>📍 ${codexEscape(match.city)}</span>
        <span>⛰️ ${codexEscape(match.altitude)} m</span>
        <span>🌡️ ${codexEscape(match.tempMin)}°-${codexEscape(match.tempMax)}°C</span>
        ${codexBadgeMarkup(altitudeBadge)}
        ${codexBadgeMarkup(climateBadge)}
      </div>`;
  }
  return `
    <div class="codex-env-panel" title="${codexEscape(codexClimateTooltip())}">
      <div class="codex-env-lines">
        <span>🏟️ ${codexEscape(match.stadium)}</span>
        <span>📍 ${codexEscape(match.city)}, ${codexEscape(match.country)}</span>
        <span>⛰️ ${codexEscape(match.altitude)} m</span>
      </div>
      <div class="codex-env-badges">
        ${codexBadgeMarkup(altitudeBadge)}
        ${codexBadgeMarkup(climateBadge)}
        ${specialBadges.map((badge) => codexBadgeMarkup(badge, "is-special")).join("")}
      </div>
      <div class="codex-climate-grid">
        <span><b>🌡️</b>${codexEscape(match.tempMin)}° - ${codexEscape(match.tempMax)}°C</span>
        <span><b>💧 Umidità:</b>${codexEscape(match.humidity)}</span>
        <span><b>🌧️ Pioggia:</b>${codexEscape(match.rainRisk)}</span>
        <span><b>⚠️ Difficoltà climatica:</b>${difficulty}/100</span>
      </div>
      <div class="codex-climate-bar" aria-label="Difficoltà climatica ${difficulty} su 100">
        <span style="width: ${difficulty}%"></span>
      </div>
    </div>`;
}

function codexHostAdvantage(team, fixture) {
  const country = codexVenueCountry(fixture);
  const directHosts = {
    "Stati Uniti": "USA",
    "Messico": "Mexico",
    "Canada": "Canada",
  };
  if (directHosts[team] === country) return 0.24;
  if (team === "Messico" && country === "USA") return 0.14;
  if (team === "Stati Uniti" && country === "Mexico") return 0.08;
  if (team === "Canada" && country === "USA") return 0.07;
  if (team === "Stati Uniti" && country === "Canada") return 0.06;
  if (team === "Canada" && country === "Mexico") return 0.04;
  return 0;
}

const codexAltitudeAdaptedTeams = {
  "Messico": 0.18,
  "Ecuador": 0.16,
  "Colombia": 0.11,
  "Sudafrica": 0.08,
};

const codexHeatAdaptedTeams = {
  "Brasile": 0.11,
  "Colombia": 0.1,
  "Panama": 0.1,
  "Paraguay": 0.09,
  "Ecuador": 0.08,
  "Messico": 0.06,
  "Costa d'Avorio": 0.05,
  "Arabia Saudita": 0.05,
};

const codexHeatSensitiveTeams = {
  "Norvegia": -0.07,
  "Svezia": -0.06,
  "Inghilterra": -0.04,
  "Olanda": -0.04,
  "Germania": -0.035,
  "Svizzera": -0.035,
};

function codexEnvironmentalAdvantage(team, fixture) {
  const city = codexVenueCity(fixture);
  const country = codexVenueCountry(fixture);
  let boost = 0;
  if (/Mexico City|Guadalupe|Zapopan/i.test(city)) {
    boost += codexAltitudeAdaptedTeams[team] || 0;
    if (country === "Mexico" && team === "Messico") boost += 0.08;
  }
  if (/Miami|Houston|Arlington|Dallas|Kansas City|Atlanta|Philadelphia/i.test(city)) {
    boost += codexHeatAdaptedTeams[team] || 0;
    boost += codexHeatSensitiveTeams[team] || 0;
  }
  return codexClamp(boost, -0.08, 0.24);
}

function codexGoalsFromExpected(expected) {
  if (expected < 0.55) return 0;
  if (expected < 1.72) return 1;
  if (expected < 2.62) return 2;
  if (expected < 3.3) return 3;
  return 4;
}

function codexHashNumber(value) {
  return String(value || "").split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function codexScoreMatch(teamA, teamB, knockout = false, fixture = null) {
  const matchupHash = Math.abs(codexHashNumber(`${teamA}-${teamB}-${knockout ? "ko" : "group"}`));
  const tempo = ((matchupHash % 9) - 4) * 0.045 - (knockout ? 0.04 : 0);
  const tilt = (((Math.floor(matchupHash / 9) % 7) - 3) * 0.035);
  const rankGap = (codexRankingPoints(teamA) || 1450) - (codexRankingPoints(teamB) || 1450);
  const mismatch = Math.abs(rankGap);
  const favoriteIsAByRanking = rankGap >= 0;
  const upsetHash = Math.floor(matchupHash / 63) % 17;
  const exceptionChance = knockout ? 1 : 2;
  const allowUnderdogException = upsetHash < exceptionChance;
  const venueA = codexHostAdvantage(teamA, fixture) + codexEnvironmentalAdvantage(teamA, fixture);
  const venueB = codexHostAdvantage(teamB, fixture) + codexEnvironmentalAdvantage(teamB, fixture);
  const groupMarketA = knockout ? 0 : codexGroupWinnerMarketBoost(teamA);
  const groupMarketB = knockout ? 0 : codexGroupWinnerMarketBoost(teamB);
  let expectedA = codexClamp(codexExpectedGoals(teamA, teamB, knockout) + tempo + tilt + venueA + groupMarketA * 0.06, 0.03, 3.3);
  let expectedB = codexClamp(codexExpectedGoals(teamB, teamA, knockout) + tempo - tilt + venueB + groupMarketB * 0.06, 0.03, 3.3);
  const codexPlusA = knockout ? codexPlusScore(teamA) : 0;
  const codexPlusB = knockout ? codexPlusScore(teamB) : 0;
  const codexPlusEdge = knockout ? codexClamp((codexPlusA - codexPlusB) / 70, -0.42, 0.42) : 0;
  if (knockout) {
    expectedA = codexClamp(expectedA + codexPlusEdge, 0.03, 3.3);
    expectedB = codexClamp(expectedB - codexPlusEdge, 0.03, 3.3);
  }
  if (mismatch > 300) {
    const favoriteBoost = codexClamp((mismatch - 300) / 260, 0.12, 0.72);
    const underdogPenalty = codexClamp((mismatch - 260) / 300, 0.16, 0.86);
    if (favoriteIsAByRanking) {
      expectedA += favoriteBoost;
      expectedB = Math.max(0.03, expectedB - underdogPenalty);
    } else {
      expectedB += favoriteBoost;
      expectedA = Math.max(0.03, expectedA - underdogPenalty);
    }
  }
  let goalsA = codexGoalsFromExpected(expectedA);
  let goalsB = codexGoalsFromExpected(expectedB);
  if (Math.abs(expectedA - expectedB) > 0.45 && goalsA === goalsB) {
    if (expectedA > expectedB) goalsA += 1;
    else goalsB += 1;
  }
  const strengthGap = (codexState.strengths[teamA]?.total || 50) - (codexState.strengths[teamB]?.total || 50);
  const expectedGap = expectedA - expectedB;
  if ((Math.abs(strengthGap) > 24 || mismatch > 320) && Math.abs(expectedGap) > 1.05) {
    const favoriteIsA = Math.abs(rankGap) > 180 ? favoriteIsAByRanking : strengthGap > 0;
    const favoriteExpected = favoriteIsA ? expectedA : expectedB;
    const underdogExpected = favoriteIsA ? expectedB : expectedA;
    const blowoutTier = Math.max(Math.abs(strengthGap), mismatch / 9.5);
    const minimumFavoriteGoals = blowoutTier > 54 && favoriteExpected > 2.85 ? 5 : blowoutTier > 42 && favoriteExpected > 2.35 ? 4 : 3;
    const maximumUnderdogGoals = !allowUnderdogException && (mismatch > 360 || underdogExpected < 0.62)
      ? 0
      : underdogExpected < 0.58
        ? 0
        : underdogExpected < 1.05
          ? 1
          : 2;
    if (favoriteIsA) {
      goalsA = Math.max(goalsA, minimumFavoriteGoals);
      goalsB = Math.min(goalsB, maximumUnderdogGoals);
    } else {
      goalsB = Math.max(goalsB, minimumFavoriteGoals);
      goalsA = Math.min(goalsA, maximumUnderdogGoals);
    }
  }
  goalsA = codexClamp(goalsA, 0, 5);
  goalsB = codexClamp(goalsB, 0, 5);
  let winner = "";
  let note = "";
  if (goalsA > goalsB) winner = teamA;
  if (goalsB > goalsA) winner = teamB;
  if (knockout && goalsA === goalsB) {
    const tiebreakA = expectedA * 2.2 +
      (codexState.strengths[teamA].total || 50) * 0.018 +
      (codexRankingPoints(teamA) || 1450) / 1000 +
      codexWinnerMarketBoost(teamA) * 0.12 +
      codexPlusA * 0.018;
    const tiebreakB = expectedB * 2.2 +
      (codexState.strengths[teamB].total || 50) * 0.018 +
      (codexRankingPoints(teamB) || 1450) / 1000 +
      codexWinnerMarketBoost(teamB) * 0.12 +
      codexPlusB * 0.018;
    winner = tiebreakA >= tiebreakB ? teamA : teamB;
    note = `${winner} vince dopo extra time`;
  }
  if (knockout) {
    const oddsA = codexWinnerMarketOdds[teamA] || null;
    const oddsB = codexWinnerMarketOdds[teamB] || null;
    const marketFavorite = oddsA && oddsB && Math.min(oddsA, oddsB) / Math.max(oddsA, oddsB) <= 0.88
      ? oddsA < oddsB ? teamA : teamB
      : "";
    const favoriteGap = marketFavorite === teamA ? goalsB - goalsA : marketFavorite === teamB ? goalsA - goalsB : 0;
    const expectedGap = Math.abs(expectedA - expectedB);
    if (marketFavorite && winner !== marketFavorite && favoriteGap >= 0 && favoriteGap <= 1 && expectedGap < 0.9) {
      if (favoriteGap === 1) {
        if (marketFavorite === teamA) goalsA += 1;
        else goalsB += 1;
      }
      winner = marketFavorite;
      note = `${winner} vince dopo extra time`;
    }
  }
  return { teamA, teamB, goalsA, goalsB, winner, note, expectedA, expectedB, venueA, venueB, groupMarketA, groupMarketB, codexPlusA, codexPlusB };
}

function codexBlankRows(group) {
  return (groupTeams[group] || []).map((team, order) => ({
    team,
    order,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    gf: 0,
    ga: 0,
    points: 0,
  }));
}

function codexApplyGroupResult(table, result) {
  const home = table[result.teamA];
  const away = table[result.teamB];
  if (!home || !away) return;
  home.played += 1;
  away.played += 1;
  home.gf += result.goalsA;
  home.ga += result.goalsB;
  away.gf += result.goalsB;
  away.ga += result.goalsA;
  if (result.goalsA > result.goalsB) {
    home.wins += 1;
    home.points += 3;
    away.losses += 1;
  } else if (result.goalsB > result.goalsA) {
    away.wins += 1;
    away.points += 3;
    home.losses += 1;
  } else {
    home.draws += 1;
    away.draws += 1;
    home.points += 1;
    away.points += 1;
  }
}

function codexRealResult(matchNumber, fixture) {
  const real = typeof worldCupResultFor === "function" ? worldCupResultFor(matchNumber) : null;
  if (!real) return null;
  const teams = codexFixtureTeams(fixture?.[2]);
  if (teams.length !== 2) return null;
  const goalsA = codexNumber(real.home);
  const goalsB = codexNumber(real.away);
  if (goalsA === null || goalsB === null) return null;
  const [teamA, teamB] = teams;
  return {
    teamA,
    teamB,
    goalsA,
    goalsB,
    expectedA: goalsA,
    expectedB: goalsB,
    winner: goalsA > goalsB ? teamA : goalsB > goalsA ? teamB : "",
    note: real.status || "Risultato reale",
    fixture,
    isReal: true,
    real,
  };
}

function codexSortTable(rows) {
  return rows.sort((a, b) =>
    b.points - a.points ||
    (b.gf - b.ga) - (a.gf - a.ga) ||
    b.gf - a.gf ||
    codexGroupWinnerMarketBoost(b.team) - codexGroupWinnerMarketBoost(a.team) ||
    codexState.strengths[b.team].total - codexState.strengths[a.team].total ||
    a.order - b.order
  );
}

function codexSimulateGroups() {
  const tables = Object.fromEntries(Object.keys(groupTeams).map((group) => [
    group,
    Object.fromEntries(codexBlankRows(group).map((row) => [row.team, row])),
  ]));
  const fixtures = (typeof worldCupFixtures !== "undefined" ? worldCupFixtures : []).slice(0, 72);
  fixtures.forEach((fixture, index) => {
    const teams = codexFixtureTeams(fixture[2]);
    if (teams.length !== 2) return;
    const forecast = codexScoreMatch(teams[0], teams[1], false, fixture);
    const realResult = codexRealResult(index + 1, fixture);
    const result = realResult ? { ...realResult, forecast } : forecast;
    codexState.results[index + 1] = { ...result, fixture };
    const group = fixture[1].replace("Group ", "");
    codexApplyGroupResult(tables[group], result);
  });
  codexState.groupTables = Object.fromEntries(Object.entries(tables).map(([group, table]) => [
    group,
    codexSortTable(Object.values(table)),
  ]));
  codexState.thirds = codexSortTable(Object.entries(codexState.groupTables).map(([group, table]) => ({
    ...table[2],
    group,
  })));
  codexState.thirdAssignments = codexBuildThirdAssignments();
}

function codexSeedGroups(seed) {
  return seed.match(/[A-L]/g) || [];
}

function codexBuildThirdAssignments() {
  const assignments = {};
  const usedGroups = new Set();
  codexRoundOf32Seeds.flat().forEach((seed, index) => {
    if (seed.trim()[0] !== "3") return;
    const allowed = new Set(codexSeedGroups(seed));
    const third = codexState.thirds.find((row) => allowed.has(row.group) && !usedGroups.has(row.group));
    if (!third) return;
    assignments[`${index}:${seed}`] = third.team;
    usedGroups.add(third.group);
  });
  return assignments;
}

function codexTeamFromSeed(seed, seedIndex = -1) {
  const place = seed.trim()[0];
  const groups = codexSeedGroups(seed);
  if (place === "1") return codexState.groupTables[groups[0]]?.[0]?.team || "";
  if (place === "2") return codexState.groupTables[groups[0]]?.[1]?.team || "";
  if (place === "3") {
    return codexState.thirdAssignments?.[`${seedIndex}:${seed}`] || "";
  }
  return "";
}

function codexRoundForMatch(matchNumber) {
  for (const [round, numbers] of Object.entries(codexBracketMatchNumbers)) {
    const index = numbers.indexOf(matchNumber);
    if (index !== -1) return { round, index };
  }
  return null;
}

function codexParticipants(matchNumber) {
  const fixture = worldCupFixtures[matchNumber - 1];
  const directTeams = codexFixtureTeams(fixture?.[2]);
  if (directTeams.length === 2) return directTeams;
  if (matchNumber >= 73 && matchNumber <= 88) {
    const location = codexRoundForMatch(matchNumber);
    return codexRoundOf32Seeds[location.index].map((seed, seedOffset) => (
      codexTeamFromSeed(seed, location.index * 2 + seedOffset)
    ));
  }
  return (codexDependencies[matchNumber] || []).map((dependency) => {
    const previous = codexState.results[dependency.match];
    if (!previous) return "";
    if (dependency.result === "winner") return previous.winner;
    return previous.teamA === previous.winner ? previous.teamB : previous.teamA;
  });
}

function codexSimulateKnockout() {
  [73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104]
    .forEach((matchNumber) => {
      const [teamA, teamB] = codexParticipants(matchNumber);
      if (!teamA || !teamB) return;
      const result = codexScoreMatch(teamA, teamB, true, worldCupFixtures[matchNumber - 1]);
      codexState.results[matchNumber] = { ...result, fixture: worldCupFixtures[matchNumber - 1] };
    });
}

function codexScorerWeight(row) {
  if (!codexIsScorerEligible(row)) return 0;
  const recent = codexPlayerRecord(row).recent15 || {};
  const apps = codexNumber(recent.appearances) || 0;
  const goals = codexNumber(recent.goals) || 0;
  const assists = codexNumber(recent.assists) || 0;
  const rating = codexNumber(recent.averageRating) || 6.25;
  const roleBase = row.role === "Attaccanti" ? 1.35 : row.role === "Centrocampisti" ? 0.72 : 0.22;
  const starterBonus = codexIsProbableStarter(row) ? 1.16 : 0.86;
  const formationWeight = codexFormationRoleWeight(row);
  const minutesShare = codexExpectedMinutesShare(row);
  const penaltyRank = codexPenaltyRank(row);
  const penaltyBonus = penaltyRank === 1 ? 1.16 : penaltyRank === 2 ? 1.08 : penaltyRank === 3 ? 1.04 : 1;
  const focalBonus = penaltyRank === 1 && row.role === "Attaccanti" ? 1.18 : 1;
  const formationFocalBonus = codexIsMainStriker(row) ? 1.2 : codexIsFormationStar(row) ? 1.12 : 1;
  const pedigreeBonus = codexHasTournamentPedigree(row) ? 1.1 : 1;
  const marketMultiplier = codexScorerMarketMultiplier(row);
  const goalRate = goals / Math.max(apps, 5);
  const assistSupport = assists / Math.max(apps, 6);
  const ratingLift = codexClamp((rating - 6.15) / 1.25, 0, 1.25);
  const availability = codexClamp(apps / 15, 0.35, 1);
  return Math.max(0.05, roleBase * starterBonus * formationWeight * penaltyBonus * focalBonus * formationFocalBonus * pedigreeBonus * marketMultiplier * minutesShare * availability * (0.82 + goalRate * 4.8 + assistSupport * 1.1 + ratingLift * 0.45));
}

function codexScorerPool(team) {
  return [...codexOutfieldRows(team), ...codexSyntheticScorerRows(team)]
    .filter(codexIsScorerEligible)
    .map((row) => ({ row, weight: codexScorerWeight(row) }))
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.row.player.localeCompare(b.row.player))
    .slice(0, 12);
}

function codexTournamentGoalPressure(row, totals) {
  const key = `${row.team}::${row.player}`;
  const currentGoals = totals[key]?.goals || 0;
  if (!currentGoals) return 1;
  const isFocalForward = (codexPenaltyRank(row) === 1 && row.role === "Attaccanti") || codexIsMainStriker(row);
  const marketOdds = codexScorerMarketOdds(row);
  const isEliteMarket = marketOdds && marketOdds <= 25;
  const softCap = isEliteMarket ? 7 : isFocalForward ? 6 : codexPenaltyRank(row) ? 5 : codexIsProbableStarter(row) && row.role === "Attaccanti" ? 4 : 3;
  const pressureRate = isEliteMarket ? 0.5 : isFocalForward ? 0.64 : 0.88;
  const pressure = 1 / (1 + currentGoals * pressureRate);
  if (currentGoals < softCap) return pressure;
  return pressure * Math.max(0.08, 1 - (currentGoals - softCap + 1) * 0.28);
}

function codexMatchGoalPressure(row, matchScorers = []) {
  const currentGoals = matchScorers.filter((player) => player === row.player).length;
  if (!currentGoals) return 1;
  if (row.role === "Attaccanti" && codexPenaltyRank(row) === 1 && currentGoals < 2) return 0.42;
  if (row.role === "Attaccanti" && currentGoals < 2) return 0.24;
  if (row.role === "Centrocampisti" && currentGoals < 1) return 0.18;
  return 0;
}

function codexPickScorer(team, goalIndex, matchNumber, totals = {}, matchScorers = []) {
  const pool = codexScorerPool(team)
    .map((item) => ({
      ...item,
      weight: Math.pow(item.weight * codexTournamentGoalPressure(item.row, totals) * codexMatchGoalPressure(item.row, matchScorers), 1.18),
    }))
    .filter((item) => item.weight > 0.01);
  if (!pool.length) return null;
  const primaryPool = goalIndex < 2
    ? pool.filter((item) => item.row.role === "Attaccanti" || codexPenaltyRank(item.row) === 1 || codexIsMainStriker(item.row))
    : pool;
  const activePool = primaryPool.length ? primaryPool : pool;
  const totalWeight = activePool.reduce((total, item) => total + item.weight, 0);
  const hash = Math.abs(codexHashNumber(`${team}-${matchNumber}-${goalIndex}`));
  let cursor = (hash % 10000) / 10000 * totalWeight;
  for (const item of activePool) {
    cursor -= item.weight;
    if (cursor <= 0) return item.row;
  }
  return activePool[0].row;
}

function codexAddScorer(totals, team, matchNumber, goalIndex, matchScorers = []) {
  const row = codexPickScorer(team, goalIndex, matchNumber, totals, matchScorers);
  if (!row) return null;
  const total = codexEnsureScorerTotal(totals, row);
  total.goals += 1;
  return total;
}

function codexEnsureScorerTotal(totals, row) {
  const key = `${row.team}::${row.player}`;
  if (!totals[key]) {
    const recent = codexPlayerRecord(row).recent15 || {};
    totals[key] = {
      player: codexScorerDisplayName(row),
      team: row.team,
      role: row.role,
      goals: 0,
      matches: 0,
      recentGoals: codexNumber(recent.goals) || 0,
      recentApps: codexNumber(recent.appearances) || 0,
      rating: codexNumber(recent.averageRating),
      starter: codexIsProbableStarter(row),
      expectedMinutes: Math.round(codexExpectedMinutesShare(row) * 90),
      penaltyRank: codexPenaltyRank(row),
      scorerOdds: codexScorerMarketOdds(row),
    };
  }
  return totals[key];
}

function codexApplyFocalScorerFloor(totals, teamMatches) {
  Object.entries(teamMatches).forEach(([team, matches]) => {
    if (matches < 5) return;
    const focal = codexScorerPool(team)
      .map((item) => item.row)
      .find((row) => row.role === "Attaccanti" && codexIsProbableStarter(row) && (codexPenaltyRank(row) === 1 || codexIsMainStriker(row)));
    if (!focal) return;
    const recent = codexPlayerRecord(focal).recent15 || {};
    const goals = codexNumber(recent.goals) || 0;
    const apps = codexNumber(recent.appearances) || 0;
    const rating = codexNumber(recent.averageRating) || 6.2;
    const goalRate = goals / Math.max(apps, 5);
    if (goalRate < 0.28 && rating < 7) return;
    const floor = Math.min(8, Math.round(matches * 0.82 + (rating >= 7.15 ? 0.45 : 0) + (codexHasTournamentPedigree(focal) ? 1.2 : 0)));
    const total = codexEnsureScorerTotal(totals, focal);
    total.goals = Math.max(total.goals, floor);
  });
}

function codexApplyMarketScorerBalance(totals, teamMatches) {
  codexTopScorerMarketOdds.forEach((entry) => {
    const poolItem = codexScorerPool(entry.team).find((item) => codexStarterMatchesPlayer(entry.player, item.row.player));
    if (!poolItem) return;
    const matches = teamMatches[entry.team] || 0;
    if (matches < 3) return;
    const total = codexEnsureScorerTotal(totals, poolItem.row);
    const floor = entry.odds <= 10
      ? Math.min(8, Math.max(5, Math.round(matches * 0.9)))
      : entry.odds <= 20
        ? Math.min(6, Math.max(3, Math.round(matches * 0.55)))
        : entry.odds <= 50
          ? Math.min(5, Math.max(2, Math.round(matches * 0.38)))
          : 0;
    if (floor) total.goals = Math.max(total.goals, floor);
  });

  Object.values(totals).forEach((row) => {
    const matches = teamMatches[row.team] || row.matches || 1;
    const marketOdds = row.scorerOdds;
    const absoluteCap = marketOdds && marketOdds <= 10
      ? 8
      : marketOdds && marketOdds <= 20
        ? 7
        : marketOdds && marketOdds <= 50
          ? 6
          : marketOdds && marketOdds <= 100
            ? 5
          : row.penaltyRank === 1
            ? 5
            : row.role === "Attaccanti"
              ? 4
              : 4;
    const matchCap = Math.max(2, Math.ceil(matches * 0.9));
    row.goals = Math.min(row.goals, Math.min(absoluteCap, matchCap));
  });
}

function codexProjectedScorers() {
  const totals = {};
  const teamMatches = {};
  Object.entries(codexState.results).forEach(([number, result]) => {
    const matchNumber = Number(number);
    if (!result?.teamA || !result?.teamB) return;
    result.scorers = {
      [result.teamA]: [],
      [result.teamB]: [],
    };
    teamMatches[result.teamA] = (teamMatches[result.teamA] || 0) + 1;
    teamMatches[result.teamB] = (teamMatches[result.teamB] || 0) + 1;
    if (result.isReal && result.real?.scorers) {
      [result.teamA, result.teamB].forEach((team) => {
        (result.real.scorers[team] || []).forEach((name) => {
          const player = codexScorerPool(team).find((item) => codexCompact(item.row.player) === codexCompact(name))?.row || {
            player: name,
            team,
            role: "Dato reale",
          };
          const total = codexEnsureScorerTotal(totals, player);
          total.goals += 1;
          result.scorers[team].push(total.player);
        });
      });
      return;
    }
    for (let goal = 0; goal < result.goalsA; goal += 1) {
      const scorer = codexAddScorer(totals, result.teamA, matchNumber, goal, result.scorers[result.teamA]);
      if (scorer) result.scorers[result.teamA].push(scorer.player);
    }
    for (let goal = 0; goal < result.goalsB; goal += 1) {
      const scorer = codexAddScorer(totals, result.teamB, matchNumber, goal, result.scorers[result.teamB]);
      if (scorer) result.scorers[result.teamB].push(scorer.player);
    }
  });
  codexApplyMarketScorerBalance(totals, teamMatches);
  return Object.values(totals)
    .map((row) => ({ ...row, matches: teamMatches[row.team] || 0 }))
    .sort((a, b) =>
      b.goals - a.goals ||
      (b.penaltyRank === 1 ? 1 : 0) - (a.penaltyRank === 1 ? 1 : 0) ||
      (b.role === "Attaccanti" ? 1 : 0) - (a.role === "Attaccanti" ? 1 : 0) ||
      ((b.scorerOdds ? 1 / b.scorerOdds : 0) - (a.scorerOdds ? 1 / a.scorerOdds : 0)) ||
      (b.rating || 0) - (a.rating || 0) ||
      b.matches - a.matches ||
      a.player.localeCompare(b.player)
    )
    .slice(0, 10);
}

function codexTeamStatAverage(team, key) {
  const matches = codexTeamMatches(team);
  const values = matches
    .map((match) => codexNumber(match[key]))
    .filter((value) => value !== null);
  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

function codexTeamCardsAverage(team) {
  const yellow = codexTeamStatAverage(team, "yellowCards") ?? 1.8;
  const red = codexTeamStatAverage(team, "redCards") ?? 0.05;
  return yellow + red * 2.4;
}

function codexTeamFoulsAverage(team) {
  return codexTeamStatAverage(team, "foulsFor") ?? 12;
}

function codexTeamCornerAverage(team) {
  const own = codexTeamStatAverage(team, "cornersFor");
  const conceded = codexTeamStatAverage(team, "cornersAgainst");
  if (own === null && conceded === null) return 4.6;
  return (own ?? 4.6) * 0.62 + (conceded ?? 4.6) * 0.38;
}

function codexBestScorerName(team) {
  const scorer = codexScorerPool(team)[0]?.row;
  return scorer ? scorer.player : "";
}

function codexBettingConfidence(result) {
  const strengthGap = Math.abs((codexState.strengths[result.teamA]?.total || 50) - (codexState.strengths[result.teamB]?.total || 50));
  const expectedGap = Math.abs((result.expectedA || 1) - (result.expectedB || 1));
  if (strengthGap > 24 || expectedGap > 1.05) return "Alta";
  if (strengthGap > 12 || expectedGap > 0.55) return "Media";
  return "Bassa";
}

function codexBettingRead(result) {
  const totalGoals = result.goalsA + result.goalsB;
  const expectedTotal = (result.expectedA || 1) + (result.expectedB || 1);
  const winner = result.winner;
  const loser = winner === result.teamA ? result.teamB : result.teamA;
  const strengthGap = Math.abs((codexState.strengths[result.teamA]?.total || 50) - (codexState.strengths[result.teamB]?.total || 50));
  const rankGap = Math.abs((codexRankingPoints(result.teamA) || 1450) - (codexRankingPoints(result.teamB) || 1450));
  const drawish = !winner || Math.abs((result.expectedA || 1) - (result.expectedB || 1)) < 0.32;
  const safe = drawish
    ? "Under 3.5"
    : `${winner} o pareggio`;
  const balanced = drawish
    ? "Pareggio/Under 3.5"
    : `${winner} vincente`;
  const risky = drawish
    ? `Risultato esatto ${result.goalsA}-${result.goalsB}`
    : strengthGap > 24 || rankGap > 300
      ? `${winner} handicap -1`
      : `Risultato esatto ${result.goalsA}-${result.goalsB}`;
  const goalMarket = expectedTotal >= 2.8 || totalGoals >= 3
    ? "Over 2.5"
    : expectedTotal <= 1.85 || totalGoals <= 1
      ? "Under 2.5"
      : "Over 1.5";
  const btts = result.goalsA > 0 && result.goalsB > 0 && Math.min(result.expectedA || 0, result.expectedB || 0) > 0.72
    ? "Goal"
    : "No Goal";
  const scorerTeam = winner || (result.expectedA >= result.expectedB ? result.teamA : result.teamB);
  const scorer = codexBestScorerName(scorerTeam);
  const cardLine = codexBettingCardLine(result);
  const cornerLine = codexBettingCornerLine(result);
  return {
    safe,
    balanced,
    risky,
    goalMarket,
    btts,
    scorer: scorer ? `${scorer} marcatore` : "",
    cardLine,
    cornerLine,
    confidence: codexBettingConfidence(result),
    loser,
  };
}

function codexBettingCardLine(result) {
  const teamCards = codexTeamCardsAverage(result.teamA) + codexTeamCardsAverage(result.teamB);
  const teamFouls = codexTeamFoulsAverage(result.teamA) + codexTeamFoulsAverage(result.teamB);
  const tension = Math.abs((result.expectedA || 1) - (result.expectedB || 1)) < 0.45 ? 0.55 : 0;
  const comebackPressure = Math.abs(result.goalsA - result.goalsB) <= 1 ? 0.28 : 0;
  const profileA = codexRegulationProfile(result.teamA);
  const profileB = codexRegulationProfile(result.teamB);
  const dissentPressure = (profileA.dissent + profileB.dissent) * 0.72;
  const timeManagementPressure = (profileA.timeManagement + profileB.timeManagement) * 0.42;
  const captainOnlyPressure = teamFouls > 26 || tension || dissentPressure > 0.55 ? 0.35 : -0.18;
  const refereePanelAverage = 4.05;
  const scoreGapRelief = Math.abs(result.goalsA - result.goalsB) >= 3 ? -0.42 : 0;
  const cardIndex = teamCards * 0.46 + (teamFouls / 8.4) + refereePanelAverage * 0.2 + tension + comebackPressure + captainOnlyPressure + dissentPressure + timeManagementPressure + scoreGapRelief;
  const market = cardIndex >= 6.25
    ? "Over 5.5 cartellini"
    : cardIndex >= 5.25
      ? "Over 4.5 cartellini"
      : cardIndex >= 4.35
        ? "Over 3.5 cartellini"
        : cardIndex <= 3.35
          ? "Under 3.5 cartellini"
          : "Under 4.5 cartellini";
  const note = captainOnlyPressure > 0
    ? "solo capitano: proteste, accerchiamenti e gestione emotiva aumentano il rischio"
    : "solo capitano: profilo disciplinare piu gestibile";
  return { market, index: cardIndex, note };
}

function codexBettingCornerLine(result) {
  const cornerA = codexTeamCornerAverage(result.teamA);
  const cornerB = codexTeamCornerAverage(result.teamB);
  const corners = cornerA + cornerB;
  const mismatch = Math.abs((codexRankingPoints(result.teamA) || 1450) - (codexRankingPoints(result.teamB) || 1450));
  const underdogTeam = (codexRankingPoints(result.teamA) || 1450) < (codexRankingPoints(result.teamB) || 1450) ? result.teamA : result.teamB;
  const underdogExpected = underdogTeam === result.teamA ? result.expectedA : result.expectedB;
  const profileA = codexRegulationProfile(result.teamA);
  const profileB = codexRegulationProfile(result.teamB);
  const pressPressure = (profileA.press + profileB.press) * 0.72;
  const tempoPressure = (profileA.tempo + profileB.tempo) * 0.38;
  const timeManagementRisk = (profileA.timeManagement + profileB.timeManagement) * 0.46;
  const keeperEightSecondRisk = mismatch > 240 && underdogExpected < 0.88;
  const favoriteCornerBoost = mismatch > 260 ? 0.42 : 0;
  const lowTempoRelief = (profileA.tempo + profileB.tempo) < 0.75 ? -0.48 : 0;
  const projectedCornerSide = cornerA + (codexState.strengths[result.teamA]?.attack || 50) / 95 >= cornerB + (codexState.strengths[result.teamB]?.attack || 50) / 95
    ? result.teamA
    : result.teamB;
  const cornerIndex = corners * 0.82 + pressPressure + tempoPressure + timeManagementRisk + favoriteCornerBoost + (keeperEightSecondRisk ? 0.85 : 0) + (((result.expectedA || 1) + (result.expectedB || 1)) > 2.7 ? 0.28 : 0) + lowTempoRelief;
  const market = cornerIndex >= 11.2
    ? "Over 10.5 corner"
    : cornerIndex >= 10
      ? "Over 9.5 corner"
      : cornerIndex >= 8.75
        ? "Over 8.5 corner"
        : cornerIndex <= 6.8
          ? "Under 8.5 corner"
          : cornerIndex <= 7.75
            ? "Under 9.5 corner"
            : "Corner live";
  const note = keeperEightSecondRisk
    ? `regola 8 secondi: possibile corner extra contro ${underdogTeam}`
    : pressPressure > 0.8
      ? "pressione alta: la nuova gestione anti-perdite di tempo puo alzare i corner"
      : "regola 8 secondi da monitorare live";
  return { market, index: cornerIndex, note, side: projectedCornerSide };
}

function codexRealScorerNames(result) {
  if (!result?.real?.scorers) return [];
  return Object.values(result.real.scorers).flat().filter(Boolean);
}

function codexBettingPickHit(value, realResult) {
  if (!realResult?.isReal || !value) return null;
  const totalGoals = realResult.goalsA + realResult.goalsB;
  const realWinner = realResult.winner;
  if (/^Over 2\.5$/i.test(value)) return totalGoals >= 3;
  if (/^Under 2\.5$/i.test(value)) return totalGoals <= 2;
  if (/^Over 1\.5$/i.test(value)) return totalGoals >= 2;
  if (/^Under 3\.5$/i.test(value)) return totalGoals <= 3;
  if (/^Goal$/i.test(value)) return realResult.goalsA > 0 && realResult.goalsB > 0;
  if (/^No Goal$/i.test(value)) return realResult.goalsA === 0 || realResult.goalsB === 0;
  const exact = value.match(/^Risultato esatto\s+(\d+)-(\d+)$/i);
  if (exact) return realResult.goalsA === Number(exact[1]) && realResult.goalsB === Number(exact[2]);
  const handicap = value.match(/^(.+)\s+handicap\s+-1$/i);
  if (handicap) {
    const team = handicap[1].trim();
    const gap = team === realResult.teamA ? realResult.goalsA - realResult.goalsB : team === realResult.teamB ? realResult.goalsB - realResult.goalsA : 0;
    return gap >= 2;
  }
  const winner = value.match(/^(.+)\s+vincente$/i);
  if (winner) return realWinner === winner[1].trim();
  const doubleChance = value.match(/^(.+)\s+o pareggio$/i);
  if (doubleChance) return !realWinner || realWinner === doubleChance[1].trim();
  if (/^Pareggio\/Under 3\.5$/i.test(value)) return !realWinner && totalGoals <= 3;
  const scorer = value.match(/^(.+)\s+marcatore$/i);
  if (scorer) {
    const target = codexCompact(scorer[1]);
    return codexRealScorerNames(realResult).some((name) => codexCompact(name) === target);
  }
  return null;
}

function codexBettingTag(label, value, tone = "", hit = null) {
  const hitClass = hit === true ? "is-hit" : "";
  return `<span class="codex-bet-tag ${tone} ${hitClass}"><b>${codexEscape(label)}</b>${codexEscape(value)}${hit === true ? "<i>PRESO</i>" : ""}</span>`;
}

function codexBettingCard(matchNumber, compact = false) {
  const result = codexState.results[matchNumber];
  if (!result) return "";
  const bettingResult = result.isReal && result.forecast ? result.forecast : result;
  const read = codexBettingRead(bettingResult);
  const confidenceTone = read.confidence === "Alta" ? "is-high" : read.confidence === "Media" ? "is-medium" : "is-low";
  const goalHit = codexBettingPickHit(read.goalMarket, result);
  const bttsHit = codexBettingPickHit(read.btts, result);
  return `
    <article class="codex-bet-card ${compact ? "is-compact" : ""} ${result.isReal ? "is-real-result" : ""}">
      <div class="codex-bet-head">
        <span class="codex-bet-match">#${matchNumber}</span>
        <strong>${codexFlag(result.teamA)}${codexEscape(result.teamA)} <span>${result.goalsA}-${result.goalsB}</span> ${codexFlag(result.teamB)}${codexEscape(result.teamB)}</strong>
        <em class="${confidenceTone}">${read.confidence}</em>
      </div>
      ${result.isReal && result.forecast ? `<div class="codex-bet-forecast">Pronostico Codex: ${codexEscape(String(result.forecast.goalsA))}-${codexEscape(String(result.forecast.goalsB))}</div>` : ""}
      <div class="codex-bet-tags">
        ${codexBettingTag("Prudente", read.safe, "is-safe", codexBettingPickHit(read.safe, result))}
        ${codexBettingTag("Equilibrata", read.balanced, "is-balanced", codexBettingPickHit(read.balanced, result))}
        ${codexBettingTag("Rischiosa", read.risky, "is-risky", codexBettingPickHit(read.risky, result))}
        ${codexBettingTag("Gol", `${read.goalMarket} / ${read.btts}`, "", goalHit === true || bttsHit === true)}
        ${read.scorer ? codexBettingTag("Marcatore", read.scorer, "", codexBettingPickHit(read.scorer, result)) : ""}
        ${codexBettingTag("Cartellini", `${read.cardLine.market} · indice ${read.cardLine.index.toFixed(1)}`)}
        ${codexBettingTag("Corner", `${read.cornerLine.market} · indice ${read.cornerLine.index.toFixed(1)}`)}
        ${codexBettingTag("Più corner", read.cornerLine.side)}
      </div>
      <small>${codexEscape(read.cardLine.note)} &middot; ${codexEscape(read.cornerLine.note)}</small>
    </article>`;
}

function codexRenderBettingDraft() {
  const picksRoot = document.getElementById("codex-betting-picks");
  const fixturesRoot = document.getElementById("codex-betting-fixtures");
  if (!picksRoot || !fixturesRoot) return;
  const groupMatchNumbers = Object.keys(codexState.results)
    .map(Number)
    .filter((number) => number <= 72)
    .sort((a, b) => a - b);
  const ranked = groupMatchNumbers
    .map((number) => ({ number, result: codexState.results[number], read: codexBettingRead(codexState.results[number]) }))
    .sort((a, b) => {
      const confidenceScore = { Alta: 3, Media: 2, Bassa: 1 };
      const goalGapA = Math.abs(a.result.goalsA - a.result.goalsB);
      const goalGapB = Math.abs(b.result.goalsA - b.result.goalsB);
      return confidenceScore[b.read.confidence] - confidenceScore[a.read.confidence] || goalGapB - goalGapA || a.number - b.number;
    });
  const top = ranked.slice(0, 12).map((item) => codexBettingCard(item.number, true)).join("");
  const byDate = groupMatchNumbers.reduce((days, number) => {
    const date = codexState.results[number]?.fixture?.[0] || "";
    days[date] = days[date] || [];
    days[date].push(number);
    return days;
  }, {});
  const all = Object.entries(byDate).map(([date, numbers]) => {
    const cards = groupMatchNumbers
      .filter((number) => numbers.includes(number))
      .map((number) => codexBettingCard(number))
      .join("");
    const label = new Date(`${date}T12:00:00`).toLocaleDateString("it-IT", {
      weekday: "long",
      day: "2-digit",
      month: "long",
    });
    return `<section class="codex-bet-group"><h3>${codexEscape(label)}</h3>${cards}</section>`;
  }).join("");
  picksRoot.innerHTML = top;
  fixturesRoot.innerHTML = all;
}

function codexScorerSummary(players) {
  const counts = {};
  (players || []).forEach((player) => {
    counts[player] = (counts[player] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([player, goals]) => `${codexEscape(player)}${goals > 1 ? ` x${goals}` : ""}`)
    .join(", ");
}

function codexPhaseLabel(phase) {
  return String(phase || "")
    .replace(/^Group ([A-L])$/, "Girone $1")
    .replace(/^Round of 32 - Match (\d+)$/, "Sedicesimi - Partita $1")
    .replace(/^Round of 16 - Match (\d+)$/, "Ottavi - Partita $1")
    .replace(/^Quarter-final - Match (\d+)$/, "Quarti - Partita $1")
    .replace(/^Semi-final - Match (\d+)$/, "Semifinale - Partita $1")
    .replace(/^Third Place Playoff - Match (\d+)$/, "Finale 3&deg; posto - Partita $1")
    .replace(/^Final - Match (\d+)$/, "Finale - Partita $1");
}

function codexRenderResultCard(matchNumber) {
  const result = codexState.results[matchNumber];
  if (!result) return "";
  if (!result.scorers) codexProjectedScorers();
  const phase = codexPhaseLabel(result.fixture?.[1]);
  const matchEnvironment = enrichMatch(result.fixture);
  const scorersA = codexScorerSummary(result.scorers?.[result.teamA]);
  const scorersB = codexScorerSummary(result.scorers?.[result.teamB]);
  const scorerBlock = (scorersA || scorersB) ? `
        <div class="codex-match-scorers">
          ${scorersA ? `<span>${codexFlag(result.teamA)}${scorersA}</span>` : ""}
          ${scorersB ? `<span>${codexFlag(result.teamB)}${scorersB}</span>` : ""}
        </div>` : "";
  return `
    <article class="codex-match-card ${matchNumber > 72 ? "is-knockout" : ""} ${result.isReal ? "is-real-result" : ""}">
      <span class="fixture-number">${matchNumber}</span>
      <div>
        <b>${phase}</b>
        <strong class="codex-match-scoreline">
          <span class="codex-match-team">${codexFlag(result.teamA)}${codexEscape(result.teamA)}${codexExternalBadges(result.teamA, 3)}</span>
          <span class="codex-match-score">${result.goalsA}-${result.goalsB}</span>
          <span class="codex-match-team">${codexFlag(result.teamB)}${codexEscape(result.teamB)}${codexExternalBadges(result.teamB, 3)}</span>
        </strong>
        ${scorerBlock}
        ${result.isReal ? '<em class="codex-real-result-badge">Risultato reale</em>' : ""}
        ${codexRenderEnvironmentPanel(matchEnvironment)}
        ${result.note ? `<small>${codexEscape(result.note)}</small>` : ""}
      </div>
    </article>`;
}

function codexRenderMethod() {
  const root = document.getElementById("codex-method");
  if (!root) return;
  const goalkeeperCount = (typeof rows !== "undefined" ? rows : [])
    .filter((row) => row.role === "Portieri" && codexPlayerRecord(row).recent15?.goalsConcededPerGame !== undefined)
    .length;
  const recentResultUpdates = (typeof teamStatsData !== "undefined" ? teamStatsData : [])
    .reduce((total, team) => total + (team.matches || []).filter((match) => /03\/06\/2026|04\/06\/2026|05\/06\/2026/.test(match.date || "")).length, 0);
  const realResultCount = Object.keys(typeof worldCupResults !== "undefined" ? worldCupResults : {}).length;
  root.innerHTML = `
    <div><strong>48</strong><span>Nazionali</span></div>
    <div><strong>104</strong><span>Partite simulate</span></div>
    <div><strong>${goalkeeperCount}</strong><span>Portieri con media GS</span></div>
    <div><strong>${realResultCount || recentResultUpdates}</strong><span>${realResultCount ? "Risultati reali" : "Amichevoli 3-5 giugno"}</span></div>`;
}

function codexRenderExternalModels() {
  const root = document.getElementById("codex-external-models");
  if (!root) return;
  const consensus = codexExternalConsensusRanking().slice(0, 6);
  const modelCards = externalPredictionModels.map((model) => `
    <article class="codex-external-model-card is-${codexEscape(model.id)}">
      <strong>${codexEscape(model.name)}</strong>
      <span>${codexEscape(model.description)}</span>
      <small>${codexEscape(model.summary)}</small>
    </article>`).join("");
  const consensusRows = consensus.map((row, index) => `
    <li>
      <span>${index + 1}</span>
      <strong>${codexFlag(row.team)}${codexEscape(row.team)}${codexExternalBadges(row.team, 3)}</strong>
      <em>${row.total} pt</em>
    </li>`).join("");
  root.innerHTML = `
    <div class="codex-plus-note">
      <strong>Codex+</strong>
      <span>scoreFinale = Codex 60% + Motivation Index 10% + Opta 12% + Klement 7% + Goldman 6% + IA 5%</span>
      <small>Il pronostico principale resta Codex. Il Motivation Index entra solo sulle squadre arrivate ai sedicesimi e corregge la fase a eliminazione diretta.</small>
    </div>
    <div class="codex-external-grid">${modelCards}</div>
    <div class="codex-external-consensus">
      <strong>Consenso Esterno</strong>
      <ol>${consensusRows}</ol>
    </div>`;
}

function codexMotivationBadge(team) {
  const motivation = codexMotivationIndex(team);
  if (!motivation) return "";
  return `<span class="codex-motivation-mini">&#128293; ${motivation.total}/100</span>`;
}

function codexRenderMotivationRanking() {
  const root = document.getElementById("codex-motivation-ranking");
  if (!root) return;
  const rows = codexMotivationRanking().slice(0, 10);
  root.innerHTML = rows.map((row, index) => `
    <article class="codex-motivation-row">
      <div class="codex-motivation-head">
        <span>${index + 1}</span>
        <strong>${codexFlag(row.team)}${codexEscape(row.team)}</strong>
        <b>&#128293; ${row.total}/100</b>
      </div>
      <div class="codex-motivation-factors">
        <span>Titolo ${row.titleScore}</span>
        <span>Leggenda ${row.legendScore}</span>
        <span>Generazione ${row.generationScore}</span>
        <span>Rivincita ${row.revengeScore}</span>
        <span>Progetto ${row.continuityScore}</span>
        <span>Ambiente ${row.environmentScore}</span>
      </div>
      <ul>${row.reasons.map((reason) => `<li>${codexEscape(reason)}</li>`).join("")}</ul>
    </article>`).join("");
}

function codexRenderRanking() {
  const root = document.getElementById("codex-team-ranking");
  if (!root) return;
  const rows = Object.values(codexState.strengths)
    .sort((a, b) => b.total - a.total)
    .slice(0, 16);
  root.innerHTML = rows.map((row, index) => `
    <article class="codex-ranking-row">
      <span>${index + 1}</span>
      <strong>${codexFlag(row.team)}${codexEscape(row.team)}${codexExternalBadges(row.team, 3)}${codexMotivationBadge(row.team)}</strong>
      <small><b>Codex+ ${codexPlusScore(row.team).toFixed(1)}</b><em>Codex ${row.total.toFixed(1)}</em></small>
    </article>`).join("");
}

function codexRenderTopScorers() {
  const root = document.getElementById("codex-top-scorers");
  if (!root) return;
  const scorers = codexProjectedScorers();
  root.innerHTML = scorers.map((row, index) => {
    const rate = row.recentApps ? (row.recentGoals / row.recentApps).toFixed(2) : "n.d.";
    return `
      <article class="codex-scorer-row">
        <span>${index + 1}</span>
        <div>
          <strong>${codexEscape(row.player)} ${row.starter ? '<em>Probabile titolare</em>' : ""}</strong>
          <small>${codexFlag(row.team)}${codexEscape(row.team)}${codexExternalBadges(row.team, 2)} &middot; ${codexEscape(row.role)} &middot; ${row.matches} partite previste &middot; ${row.expectedMinutes || 25}' stimati${row.penaltyRank ? ` &middot; rigorista #${row.penaltyRank}` : ""}</small>
        </div>
        <div class="codex-scorer-goals">
          <strong>${row.goals}</strong>
          <small>gol previsti</small>
          <small>media recente ${rate}</small>
        </div>
      </article>`;
  }).join("");
}

function codexRenderGroupFixtures() {
  const root = document.getElementById("codex-group-fixtures");
  if (!root) return;
  const byGroup = Object.keys(groupTeams).map((group) => {
    const cards = Object.entries(codexState.results)
      .filter(([number, result]) => Number(number) <= 72 && result.fixture?.[1] === `Group ${group}`)
      .map(([number]) => codexRenderResultCard(Number(number)))
      .join("");
    return `<section class="codex-group-results"><h3>Girone ${group}</h3><div>${cards}</div></section>`;
  }).join("");
  root.innerHTML = byGroup;
}

function codexStandingTable(group, table) {
  return `
    <article class="prediction-group-card" style="--group-color:${groupColors[group] || "#00d084"}">
      <div class="prediction-group-head"><span>Girone ${group}</span><small>Codex</small></div>
      <table class="prediction-group-table">
        <thead><tr><th>Pos</th><th>Squadra</th><th>PG</th><th>V</th><th>N</th><th>P</th><th>GF</th><th>GS</th><th>DR</th><th>Pt</th></tr></thead>
        <tbody>${table.map((row, index) => {
          const diff = row.gf - row.ga;
          return `<tr><td>${index + 1}</td><td><span class="prediction-team-name">${codexFlag(row.team)}${codexEscape(row.team)}${codexExternalBadges(row.team, 2)}</span></td><td>${row.played}</td><td>${row.wins}</td><td>${row.draws}</td><td>${row.losses}</td><td>${row.gf}</td><td>${row.ga}</td><td>${diff > 0 ? "+" : ""}${diff}</td><td><strong>${row.points}</strong></td></tr>`;
        }).join("")}</tbody>
      </table>
    </article>`;
}

function codexRenderStandings() {
  const root = document.getElementById("codex-standings");
  if (!root) return;
  root.innerHTML = Object.entries(codexState.groupTables)
    .map(([group, table]) => codexStandingTable(group, table))
    .join("");
}

function codexRenderThirds() {
  const root = document.getElementById("codex-thirds");
  if (!root) return;
  root.innerHTML = `
    <table class="prediction-group-table prediction-thirds-ranking">
      <thead><tr><th>Pos</th><th>Squadra</th><th>Gir</th><th>PG</th><th>DR</th><th>Pt</th></tr></thead>
      <tbody>${codexState.thirds.map((row, index) => {
        const diff = row.gf - row.ga;
        return `<tr class="${index < 8 ? "is-qualified-third" : "is-excluded-third"}"><td>${index + 1}</td><td><span class="prediction-team-name">${codexFlag(row.team)}${codexEscape(row.team)}${codexExternalBadges(row.team, 2)}</span></td><td>${row.group}</td><td>${row.played}</td><td>${diff > 0 ? "+" : ""}${diff}</td><td><strong>${row.points}</strong></td></tr>`;
      }).join("")}</tbody>
    </table>`;
}

function codexRenderKnockout() {
  const root = document.getElementById("codex-knockout");
  if (!root) return;
  const rounds = [
    ["Sedicesimi", codexBracketMatchNumbers.r32],
    ["Ottavi", codexBracketMatchNumbers.r16],
    ["Quarti", codexBracketMatchNumbers.qf],
    ["Semifinali", codexBracketMatchNumbers.sf],
    ["Finali", [...codexBracketMatchNumbers.bronze, ...codexBracketMatchNumbers.final]],
  ];
  root.innerHTML = rounds.map(([title, matches]) => `
    <section class="codex-knockout-round">
      <h3>${title}</h3>
      <div>${matches.map((matchNumber) => codexRenderResultCard(matchNumber)).join("")}</div>
    </section>`).join("");
}

function codexWorldMatchCard(matchNumber, compact = false) {
  const result = codexState.results[matchNumber];
  if (!result) return `<article class="codex-world-match is-empty"><span>Da definire</span></article>`;
  if (!result.scorers) codexProjectedScorers();
  const matchEnvironment = enrichMatch(result.fixture);
  const scorersA = codexScorerSummary(result.scorers?.[result.teamA]);
  const scorersB = codexScorerSummary(result.scorers?.[result.teamB]);
  return `
    <article class="codex-world-match ${compact ? "is-compact" : ""} ${result.isReal ? "is-real-result" : ""}">
      <div class="codex-world-scoreline">
        <span class="codex-world-team ${result.winner === result.teamA ? "is-winner" : ""}" title="${codexEscape(result.teamA)}">${codexFlag(result.teamA)}</span>
        <strong>${result.goalsA}-${result.goalsB}</strong>
        <span class="codex-world-team ${result.winner === result.teamB ? "is-winner" : ""}" title="${codexEscape(result.teamB)}">${codexFlag(result.teamB)}</span>
      </div>
      ${(scorersA || scorersB) ? `
        <div class="codex-world-scorers">
          ${scorersA ? `<span title="${codexEscape(result.teamA)}">${codexFlag(result.teamA)}${scorersA}</span>` : ""}
          ${scorersB ? `<span title="${codexEscape(result.teamB)}">${codexFlag(result.teamB)}${scorersB}</span>` : ""}
        </div>` : ""}
      ${codexRenderEnvironmentPanel(matchEnvironment, true)}
    </article>`;
}

function codexWorldRound(round, indexes) {
  return indexes.map((index) => codexWorldMatchCard(codexBracketMatchNumbers[round][index], round === "r32")).join("");
}

function codexWorldMatches(matchNumbers, compact = false) {
  return matchNumbers.map((matchNumber) => codexWorldMatchCard(matchNumber, compact)).join("");
}

function codexChampionTeam() {
  return codexState.results[104]?.winner || "";
}

function codexRenderWorldBracket() {
  const champion = codexChampionTeam();
  const bronze = codexState.results[103]?.winner || "";
  const root = document.getElementById("codex-world-bracket");
  if (!root) return;
  root.innerHTML = `
    <div class="codex-world-scroll">
      <div class="codex-world-board">
        <div class="codex-world-title">
          <strong>WORLD CHAMPIONS</strong>
          <span>Pronostico Codex+ 2026 · Codex 60% · Motivation Index 10% · Opta 12% · Klement 7% · Goldman 6% · IA 5%</span>
        </div>
        <div class="codex-world-layout">
          <div class="codex-world-side">
            <div class="codex-world-round codex-world-r32">${codexWorldMatches([74,77,73,75,83,84,81,82], true)}</div>
            <div class="codex-world-round codex-world-r16">${codexWorldRound("r16", [0,1,2,3])}</div>
            <div class="codex-world-round codex-world-qf">${codexWorldRound("qf", [0,1])}</div>
            <div class="codex-world-round codex-world-sf">${codexWorldRound("sf", [0])}</div>
          </div>
          <div class="codex-world-center">
            <div class="codex-world-champion">
              <span>Campione</span>
              <strong title="${codexEscape(champion)}">${champion ? codexFlag(champion) : "Da definire"}</strong>
            </div>
            <div class="codex-world-trophy">26</div>
            <div class="codex-world-final">
              <span>Finale</span>
              ${codexWorldMatchCard(104)}
            </div>
            <div class="codex-world-final is-bronze">
              <span>Bronzo</span>
              <strong title="${codexEscape(bronze)}">${bronze ? codexFlag(bronze) : "Da definire"}</strong>
              ${codexWorldMatchCard(103, true)}
            </div>
          </div>
          <div class="codex-world-side codex-world-side-right">
            <div class="codex-world-round codex-world-sf">${codexWorldRound("sf", [1])}</div>
            <div class="codex-world-round codex-world-qf">${codexWorldRound("qf", [2,3])}</div>
            <div class="codex-world-round codex-world-r16">${codexWorldRound("r16", [4,5,6,7])}</div>
            <div class="codex-world-round codex-world-r32">${codexWorldMatches([76,78,79,80,86,88,85,87], true)}</div>
          </div>
        </div>
      </div>
    </div>`;
}

function codexBoot() {
  codexBuildStrengths();
  codexSimulateGroups();
  codexSimulateKnockout();
  codexRenderMethod();
  codexRenderExternalModels();
  codexRenderMotivationRanking();
  codexRenderRanking();
  codexRenderTopScorers();
  codexRenderBettingDraft();
  codexRenderGroupFixtures();
  codexRenderStandings();
  codexRenderThirds();
  codexRenderWorldBracket();
}

codexBoot();
