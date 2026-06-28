# Aggiornamento statistiche gratis

Il sito legge le statistiche da `js/stats.js`, in versione alleggerita: conserva medie, totali e riepiloghi utili, evitando lo storico completo delle singole partite quando non serve alla UI.

## Flusso consigliato

1. Compila un CSV gratuito con i dati trovati dalle fonti che stai usando per il sito.
2. Lancia:

```bash
node scripts/update-stats-from-csv.js data/stats.csv
```

3. Pubblica di nuovo il sito su GitHub Pages.

Nessuna API a pagamento e nessuna chiave esposta nel sito.
