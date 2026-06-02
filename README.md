# Aggiornamento statistiche gratis

Il sito ora legge le statistiche da `js/stats.js` e mantiene una copia pulita in `stats.json` e `data/stats.json`.

## Flusso consigliato

1. Compila un CSV gratuito con i dati trovati da Wikidata/Wikipedia/FBref/Kaggle.
2. Lancia:

```bash
node scripts/update-stats-from-csv.js data/stats.csv
```

3. Pubblica di nuovo il sito su GitHub Pages.

Nessuna API a pagamento e nessuna chiave esposta nel sito.
