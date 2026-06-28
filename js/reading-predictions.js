/*
 * Pronostici editoriali pubblicati nelle pagine "Lettura".
 * Quando una Lettura viene aggiornata, aggiornare qui il risultato centrale:
 * Pronostico Codex lo userà al posto della simulazione automatica.
 */
const readingPredictions = {
  "Sudafrica|Canada": { home: 0, away: 1, source: "lettura-sudafrica-canada.html" },
  "Brasile|Giappone": { home: 2, away: 1, source: "lettura-brasile-giappone.html" },
  "Germania|Paraguay": { home: 3, away: 0, source: "lettura-germania-paraguay.html" },
  "Olanda|Marocco": { home: 1, away: 1, winner: "Olanda", source: "lettura-olanda-marocco.html" },
  "Costa d'Avorio|Norvegia": { home: 1, away: 2, source: "lettura-costa-avorio-norvegia.html" },
  "Francia|Svezia": { home: 3, away: 0, source: "lettura-francia-svezia.html" },
  "Messico|Ecuador": { home: 1, away: 0, source: "lettura-messico-ecuador.html" },
  "Inghilterra|RD Congo": { home: 3, away: 0, source: "lettura-inghilterra-rd-congo.html" },
  "Belgio|Senegal": { home: 1, away: 0, source: "lettura-belgio-senegal.html" },
  "Stati Uniti|Bosnia ed Erzegovina": { home: 2, away: 0, source: "lettura-stati-uniti-bosnia-erzegovina.html" },
  "Spagna|Austria": { home: 2, away: 0, source: "lettura-spagna-austria.html" },
  "Portogallo|Croazia": { home: 1, away: 0, source: "lettura-portogallo-croazia.html" },
  "Svizzera|Algeria": { home: 2, away: 1, source: "lettura-svizzera-algeria.html" },
  "Australia|Egitto": { home: 0, away: 1, source: "lettura-australia-egitto.html" },
  "Argentina|Capo Verde": { home: 3, away: 0, source: "lettura-argentina-capo-verde.html" },
  "Colombia|Ghana": { home: 2, away: 0, source: "lettura-colombia-ghana.html" },

  /*
   * Possibili ottavi costruiti esclusivamente dalle qualificate previste
   * nelle Letture dei sedicesimi. Sono proiezioni editoriali preliminari.
   */
  /*
   * Francia avanti in cinque degli ultimi otto confronti, compresi
   * il 2-0 del giugno 2025 e le sfide ufficiali del 2021 e 2016.
   */
  "Germania|Francia": { home: 1, away: 2, stage: "Ottavi", basis: "Letture dei sedicesimi + precedenti diretti" },
  /*
   * Due precedenti e due vittorie olandesi: 4-0 nel 2024 e 3-0 nel 1994.
   * Il dato recente sostiene il divario tecnico e lo scenario No Goal.
   */
  "Canada|Olanda": { home: 0, away: 2, stage: "Ottavi", basis: "Letture dei sedicesimi + precedenti diretti" },
  /*
   * Norvegia imbattuta nei quattro precedenti: due vittorie e due pareggi.
   * La serie è datata (ultimo confronto nel 2006), quindi aumenta il rischio
   * sorpresa senza superare forma e qualità attuali del Brasile.
   */
  "Brasile|Norvegia": { home: 2, away: 1, stage: "Ottavi", basis: "Letture dei sedicesimi + precedenti diretti (rischio sorpresa medio-alto)" },
  /*
   * Inghilterra vincente negli ultimi quattro confronti disponibili,
   * con 12 gol segnati e uno subito. Precedenti datati ma coerenti
   * con la maggiore solidità prevista della squadra inglese.
   */
  "Messico|Inghilterra": { home: 0, away: 1, stage: "Ottavi", basis: "Letture dei sedicesimi + precedenti diretti" },
  /*
   * Cinque degli ultimi sei precedenti sono finiti in parità nei 90 minuti.
   * Le finali 2025 e 2012 sono arrivate ai rigori: Spagna avanti soltanto
   * come qualificata prevista, non come vincente nei tempi regolamentari.
   */
  "Portogallo|Spagna": { home: 1, away: 1, winner: "Spagna", stage: "Ottavi", basis: "Letture dei sedicesimi + precedenti diretti" },
  /*
   * Belgio vincente in tutti i cinque precedenti mostrati. Il 5-2
   * del marzo 2026 rende la serie direttamente rilevante per forma,
   * rose attuali e compatibilità tattica, superando il fattore campo USA.
   */
  "Stati Uniti|Belgio": { home: 1, away: 2, stage: "Ottavi", basis: "Letture dei sedicesimi + precedenti diretti (5-2 Belgio nel 2026)" },
  "Argentina|Egitto": { home: 2, away: 0, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  /*
   * Colombia avanti 2-1 nelle vittorie, con un pareggio. Il 2-0
   * colombiano ai Mondiali 1994 sostiene la qualificazione prevista,
   * ma la distanza temporale non giustifica un vantaggio netto nei 90 minuti.
   */
  "Svizzera|Colombia": { home: 1, away: 1, winner: "Colombia", stage: "Ottavi", basis: "Letture dei sedicesimi + precedenti diretti" },
};
