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
  "Germania|Francia": { home: 1, away: 2, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  "Canada|Olanda": { home: 0, away: 2, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  "Brasile|Norvegia": { home: 2, away: 1, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  "Messico|Inghilterra": { home: 0, away: 1, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  "Portogallo|Spagna": { home: 1, away: 2, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  "Stati Uniti|Belgio": { home: 2, away: 1, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  "Argentina|Egitto": { home: 2, away: 0, stage: "Ottavi", basis: "Letture dei sedicesimi" },
  "Svizzera|Colombia": { home: 1, away: 1, winner: "Colombia", stage: "Ottavi", basis: "Letture dei sedicesimi" },
};
