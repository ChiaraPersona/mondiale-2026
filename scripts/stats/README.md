# Player Stats Pipeline

Pipeline da terminale per estrarre statistiche player-by-player da provider partita.

## Scrape raw

```bash
node scripts/stats/scrape-player-stats.js --provider espn --url "https://www.espn.com/soccer/player-stats/_/gameId/760506" --match portugal-spain-2026-07-06
```

Provider supportati:

- `espn`
- `fotmob`
- `whoscored`
- `sofascore`

Lo scraper salva:

- `data/player-stats/raw/MATCH.json`: envelope raw con provider, URL, artifact salvati, errori, primo estratto quando disponibile.
- `data/player-stats/debug/MATCH/*`: HTML/JSON completi scaricati dal provider per debug.

Per pagine che richiedono JavaScript:

```bash
node scripts/stats/scrape-player-stats.js --provider whoscored --url "URL_PARTITA" --match MATCH_ID --playwright
```

Playwright e' opzionale: se non e' installato, la pipeline lo segnala senza inventare dati.

## Normalize

```bash
node scripts/stats/normalize-player-stats.js --input data/player-stats/raw/portugal-spain-2026-07-06.json --output data/player-stats/normalized/portugal-spain-2026-07-06.json
```

Regole:

- Nessun valore viene stimato.
- I campi assenti restano `null`.
- La console stampa, per ogni calciatore, campi trovati e campi mancanti.
- Ogni giocatore mantiene il campo `source` con il provider usato.

## Estensione provider

Per aggiungere un provider:

1. Crea `scripts/stats/providers/nuovo-provider.js`.
2. Esporta `{ PROVIDER, scrape }`.
3. Registra il provider in `scripts/stats/providers/index.js`.
4. Se il raw non produce gia' `extracted`, aggiungi una normalizzazione dedicata in `normalize-player-stats.js`.
