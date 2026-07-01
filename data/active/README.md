# Dataset attivi — Mondiale 2026

Questa cartella contiene bundle derivati, limitati alle squadre ancora in gioco.
Il frontend deve leggere questi file e non i dataset completi presenti in `js/`.

Rigenerazione offline:

```powershell
node scripts/archive-eliminated-world-cup-data.js
```

Lo script non elimina né modifica i dataset sorgente. Copia i dati delle eliminate
in `data/archive/world-cup-2026/` e ricrea qui i bundle attivi.
