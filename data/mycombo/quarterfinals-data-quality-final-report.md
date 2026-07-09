# Quarterfinals data quality final report

Generato il 2026-07-09. Regola applicata: nessun dato reale inventato; i campi non reperibili restano null e sono segnalati.

## Stato per partita

| Partita | PlayerStats | TeamStats | RoleSlotModel | Reading | MyCombo |
|---|---|---|---|---|---|
| France-Morocco | complete | partial core complete | complete | partial_missing_context | 12/12 linked |
| Spain-Belgium | complete | partial core complete | complete | partial_missing_context | 12/12 linked |
| Norway-England | complete | partial core complete | complete | partial_missing_context | 12/12 linked |
| Argentina-Switzerland | complete | partial core complete | complete | partial_missing_context | 12/12 linked |

## Stato per squadra

| Squadra | Partite elaborate | Campi completi principali | Campi null principali | Qualita dati |
|---|---:|---|---|---|
| France | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |
| Morocco | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |
| Spain | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |
| Belgium | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |
| Norway | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |
| England | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |
| Argentina | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |
| Switzerland | 5 | goalsFor, goalsAgainst, shotsFor, shotsOnTargetFor, foulsCommitted, foulsDrawn, yellowCards, redCards | cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst | medium |

## Role slot migliori

Vedi `data/player-stats/quarterfinals-role-slot-model.md`. Il modello si applica solo ai mercati tiri/tiri in porta se il regolamento bookmaker include il sostituto.

## MyCombo

| Partita | Eventi con statEvidence | Eventi low confidence | Eventi rimossi | Eventi sostituiti |
|---|---:|---|---:|---:|
| France-Morocco | 12/12 | n/d | 0 | 0 |
| Spain-Belgium | 12/12 | n/d | 0 | 0 |
| Norway-England | 12/12 | n/d | 0 | 0 |
| Argentina-Switzerland | 12/12 | n/d | 0 | 0 |

## MissingContext rimasti

- France-Morocco: France: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst; Morocco: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst
- Spain-Belgium: Spain: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst; Belgium: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst; weather low confidence/da aggiornare
- Norway-England: Norway: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst; England: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst; referee not confirmed; weather low confidence/da aggiornare
- Argentina-Switzerland: Argentina: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst; Switzerland: cornersFor, cornersAgainst, possession, saves, firstHalfGoalsFor, firstHalfGoalsAgainst, secondHalfGoalsFor, secondHalfGoalsAgainst; referee not confirmed; weather low confidence/da aggiornare

## Anomalie non bloccanti

- Il builder esistente e stato eseguito fuori sandbox: funziona, ma usa ancora una configurazione interna che produce segnaposto MyCombo; i file finali sono stati ripristinati dagli eventi Sisal reali e arricchiti con statEvidence.
- Corner, possesso, parate e gol per tempo non sono disponibili in modo uniforme dai dataset locali: restano null nel team model.
- Alcuni mercati Sisal come pali/traverse e fuorigioco hanno evidenza indiretta, quindi restano a confidence bassa/media.

## Conferma finale

- Tutte le 4 partite sono analizzabili.
- Tutte le MyCombo sono collegate ai dati tramite statEvidence.
- Tutte le letture sono complete o partial_missing_context con spiegazione.
