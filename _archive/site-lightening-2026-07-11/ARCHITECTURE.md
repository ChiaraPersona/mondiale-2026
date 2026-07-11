# Football Prediction Platform — Architettura ufficiale

**Versione:** 1.0  
**Stato:** congelata  
**Progetto:** Mondiale 2026

## 1. Scopo del documento

Questo documento definisce l’architettura ufficiale della Football Prediction Platform del progetto Mondiale 2026.

È il riferimento vincolante per:

- nuovi moduli;
- refactoring;
- contratti dati;
- dipendenze tra componenti;
- responsabilità degli engine;
- persistenza dei risultati;
- verifiche architetturali.

Una modifica che contraddice questo documento richiede prima una nuova versione esplicita dell’architettura. Le implementazioni non devono introdurre eccezioni implicite.

## 2. Visione del progetto

Il progetto non ha come obiettivo principale la generazione di MyCombo e non si limita alla previsione del risultato finale di una partita.

L’obiettivo è costruire una piattaforma capace di:

1. acquisire dati calcistici eterogenei;
2. trasformarli in informazioni standardizzate;
3. analizzare migliaia di eventi appartenenti a mercati differenti;
4. stimare la probabilità reale di ciascun evento;
5. misurare l’affidabilità e la stabilità della stima;
6. confrontare la probabilità stimata con quella implicita del bookmaker;
7. ordinare gli eventi secondo criteri trasparenti;
8. costruire strategie di gioco differenti;
9. verificare nel tempo accuratezza, calibrazione e rendimento teorico.

Le MyCombo sono uno dei possibili output finali della piattaforma, non il centro dell’architettura.

## 3. Principi di progettazione

### 3.1 Responsabilità singola

Ogni modulo deve svolgere un solo compito chiaramente identificabile.

Un provider pulisce dati. Un engine stima una proprietà. Un builder compone risultati già selezionati. Nessun modulo deve assumere responsabilità appartenenti a un altro livello.

### 3.2 Contratti espliciti

Ogni modulo deve dichiarare:

- input;
- output;
- campi che può modificare;
- campi che deve preservare;
- condizioni di errore;
- operazioni vietate.

### 3.3 Separazione tra dati e decisioni

I provider espongono fatti e dati normalizzati. Non calcolano probabilità, value, ranking o strategie.

Le decisioni appartengono esclusivamente agli engine dedicati.

### 3.4 Indipendenza dalle sorgenti

Gli engine non devono leggere direttamente:

- HTML;
- pagine web;
- file grezzi dei bookmaker;
- CSV sorgente;
- API esterne;
- file applicativi del sito.

Quando esiste un provider, ogni accesso alla relativa sorgente deve passare attraverso quel provider.

### 3.5 Determinismo ed esplicabilità

Ogni valore deve essere riproducibile a parità di input.

Sono vietati:

- valori casuali;
- numeri privi di una regola documentata;
- trasformazioni non tracciabili;
- equivalenze concettualmente errate, come `confidence = probability`.

### 3.6 Estendibilità

L’aggiunta di una sorgente o di un engine specializzato non deve richiedere la riscrittura dell’intera pipeline.

### 3.7 Conservazione dei dati

Ogni stadio deve preservare tutti i campi che non sono di propria competenza. La perdita silenziosa di dati è un errore.

## 4. Modello dati canonico dell’evento

Tutti i moduli che elaborano eventi devono leggere e scrivere lo stesso modello canonico:

```json
{
  "match": "",
  "category": "",
  "market": "",
  "selection": "",
  "odds": 1.0,
  "selectionId": "",
  "marketId": "",
  "expectedProbability": null,
  "probabilityBreakdown": {},
  "bookmakerProbability": null,
  "confidence": null,
  "stability": null,
  "value": null,
  "status": "pending",
  "needs": {},
  "breakdown": {},
  "reasons": [],
  "history": {}
}
```

Il contratto è centralizzato in:

```text
scripts/lib/event-model.js
```

### 4.1 Significato dei campi

| Campo | Significato | Proprietario |
|---|---|---|
| `match` | Identità leggibile della partita | Quote Engine |
| `category` | Categoria normalizzata dell’evento | Quote Engine |
| `market` | Mercato del bookmaker | Quote Engine |
| `selection` | Selezione specifica | Quote Engine |
| `odds` | Quota decimale | Quote Engine |
| `selectionId` | Identificativo della selezione | Quote Engine |
| `marketId` | Identificativo del mercato | Quote Engine |
| `expectedProbability` | Probabilità stimata dell’evento, tra 0 e 1 | Probability Engine |
| `probabilityBreakdown` | Contributi alla probabilità stimata | Probability Engine |
| `bookmakerProbability` | Probabilità implicita della quota | Quote Engine |
| `confidence` | Affidabilità della stima, tra 0 e 100 | Confidence Engine |
| `stability` | Robustezza della previsione, tra 0 e 100 | Stability Engine |
| `value` | Differenza tra probabilità stimata e implicita | Value Engine |
| `status` | Stato assegnato nel processo di selezione | Ranking Engine |
| `needs` | Dati necessari per analizzare l’evento | Match Intelligence |
| `breakdown` | Contesto e fattori strutturati disponibili | Match Intelligence / Feature Engineering |
| `reasons` | Spiegazioni leggibili delle decisioni | Explainability Engine |
| `history` | Risultati e verifiche storiche dell’evento | Historical Database |

### 4.2 Distinzioni obbligatorie

I seguenti concetti non sono intercambiabili:

- `expectedProbability`: probabilità che l’evento accada;
- `confidence`: sicurezza del sistema sulla qualità della stima;
- `stability`: resistenza della previsione agli imprevisti;
- `value`: vantaggio stimato rispetto al bookmaker.

In particolare:

```text
expectedProbability != confidence / 100
```

## 5. Flusso completo dei dati

```text
Data Acquisition
        ↓
Data Providers
        ↓
Quote Engine
        ↓
Match Intelligence
        ↓
Feature Engineering
        ↓
Specialized Engines
        ↓
Probability Engine
        ↓
Confidence Engine
        ↓
Stability Engine
        ↓
Value Engine
        ↓
Explainability Engine
        ↓
Ranking Engine
        ↓
Strategy Engine
        ↓
MyCombo Builder
        ↓
Historical Database
        ↓
Learning Engine
```

Gli stadi futuri possono inizialmente essere assenti o neutrali, ma non devono essere simulati con dati inventati.

## 6. Data Acquisition

### Scopo

Acquisire e conservare i dati grezzi provenienti dalle sorgenti.

### Sorgenti previste

- bookmaker, inclusa Sisal;
- pagine interne del sito;
- statistiche di squadre e giocatori;
- arbitri;
- meteo;
- formazioni;
- risultati reali;
- future API o dataset autorizzati.

### Output

Raw Data, non ancora interpretato.

### Non deve

- calcolare probabilità;
- classificare il valore di una quota;
- creare strategie;
- alterare il significato dei dati ricevuti;
- sostituire dati mancanti con valori simulati.

## 7. Data Providers

### Scopo

Isolare le sorgenti e trasformare dati grezzi in strutture pulite e standardizzate.

### Provider previsti

- `QuoteProvider`;
- `MotivationProvider`;
- `FormProvider`;
- `TeamProvider`;
- `TacticsProvider`;
- `PressureProvider`;
- `AbsenceProvider`;
- `RiskProvider`;
- `PlayerProvider`;
- `RefereeProvider`;
- `WeatherProvider`;
- `StatisticsProvider`.

### Input

Esclusivamente le sorgenti grezze di competenza del singolo provider.

### Output

Dati normalizzati in:

```text
data/providers/<provider>/<partita>.json
```

### Responsabilità

- leggere una sola famiglia di sorgenti;
- validare il formato;
- normalizzare nomi e valori;
- usare `null` quando il dato non è disponibile;
- segnalare errori di sorgente in modo esplicito.

### Non deve

- calcolare probabilità;
- assegnare Confidence o Stability;
- calcolare value;
- ordinare eventi;
- scegliere giocate;
- creare MyCombo;
- applicare logiche decisionali.

## 8. Quote Engine

### Scopo

Creare gli eventi canonici partendo esclusivamente dal `QuoteProvider`.

### Input

```text
data/providers/quote/*.json
```

### Output

```text
data/events/*-events.json
```

### Campi di competenza

- `match`;
- `category`;
- `market`;
- `selection`;
- `odds`;
- `selectionId`;
- `marketId`;
- `bookmakerProbability`.

La probabilità implicita è:

```text
bookmakerProbability = 1 / odds
```

### Non deve

- leggere direttamente file bookmaker grezzi;
- calcolare `expectedProbability`;
- modificare Confidence o Stability;
- valutare il value;
- scartare eventi sulla base della quota.

## 9. Match Intelligence

### Scopo

Costruire una rappresentazione coerente del contesto della partita usando esclusivamente i provider.

### Informazioni gestite

- motivazione;
- forma;
- pressione;
- tattica;
- qualità offensiva e difensiva;
- giocatori chiave;
- assenze;
- turnover;
- rischi;
- intensità prevista;
- condizioni arbitrali e ambientali quando disponibili.

### Input

- eventi canonici del Quote Engine;
- output dei Data Provider.

### Output

Eventi canonici arricchiti in:

```text
data/intelligence/*-events.json
```

### Campi di competenza

- `needs`;
- `breakdown`.

### Non deve

- leggere direttamente HTML o raw data;
- usare quote per valutare il contesto;
- calcolare probabilità;
- calcolare Confidence, Stability o value;
- scegliere eventi.

## 10. Feature Engineering

### Scopo

Trasformare il contesto qualitativo in feature numeriche standardizzate.

### Esempi

- `attack_strength`;
- `defensive_strength`;
- `corner_pressure`;
- `card_risk`;
- `goal_expectancy`;
- `shot_volume`;
- `turnover_risk`.

### Input

Il `breakdown` prodotto da Match Intelligence.

### Output

Feature numeriche documentate, associate all’evento o alla partita.

### Non deve

- accedere alle sorgenti originali;
- usare quote bookmaker;
- produrre una decisione finale;
- modificare dati non di propria competenza.

## 11. Specialized Engines

### Scopo

Analizzare in modo indipendente categorie differenti.

### Motori previsti

- Corner Engine;
- Cards Engine;
- Goals Engine;
- Shots Engine;
- Player Engine;
- Match Engine.

### Responsabilità

Ogni engine:

- elabora esclusivamente eventi della propria categoria;
- usa feature e provider pertinenti;
- espone contributi tracciabili;
- non influenza direttamente categorie diverse.

### Output previsti

- contributi a `expectedProbability`;
- contributi a `confidence`;
- contributi a `stability`;
- fattori esplicativi.

### Non deve

- leggere raw data;
- usare quote per stimare la probabilità reale;
- creare ranking o strategie;
- combinare eventi.

## 12. Probability Engine

### Scopo

Determinare `expectedProbability` usando informazioni calcistiche e contributi degli Specialized Engines.

### Input

- eventi canonici;
- feature numeriche;
- output degli Specialized Engines;
- `breakdown` disponibile.

### Campi di competenza

- `expectedProbability`;
- `probabilityBreakdown`.

### Vincoli

```text
0 <= expectedProbability <= 1
```

### Non deve

- utilizzare `odds` o `bookmakerProbability`;
- derivare la probabilità da Confidence;
- modificare Confidence;
- calcolare value;
- ordinare eventi.

Se i dati necessari non sono sufficienti, deve lasciare:

```json
{
  "expectedProbability": null,
  "probabilityBreakdown": {}
}
```

## 13. Confidence Engine

### Scopo

Misurare quanto il sistema è sicuro della qualità della propria stima.

### Campo di competenza

- `confidence`.

### Vincoli

```text
0 <= confidence <= 100
```

### Non deve

- rappresentare la probabilità dell’evento;
- modificare `expectedProbability`;
- usare Confidence come sostituto di dati mancanti;
- calcolare value o ranking.

## 14. Stability Engine

### Scopo

Valutare la robustezza della previsione rispetto agli imprevisti.

### Fattori

- turnover;
- espulsioni;
- dipendenza da singoli giocatori;
- varianza del tipo di mercato;
- eventi casuali;
- sensibilità tattica.

### Campo di competenza

- `stability`.

### Vincoli

```text
0 <= stability <= 100
```

### Non deve

- modificare probabilità o Confidence;
- usare quote;
- selezionare strategie.

## 15. Value Engine

### Scopo

Confrontare la probabilità stimata con quella implicita del bookmaker.

### Formula

```text
value = expectedProbability - bookmakerProbability
```

### Campo di competenza

- `value`.

Eventuali classi come `valueIndex` devono essere definite da un contratto versionato prima dell’introduzione nel modello canonico.

### Non deve

- modificare `expectedProbability`;
- modificare `bookmakerProbability`;
- usare Confidence come probabilità;
- inventare value quando `expectedProbability` è `null`;
- ordinare o selezionare eventi.

## 16. Explainability Engine

### Scopo

Rendere ogni decisione verificabile.

### Campi di competenza

- `reasons`;
- eventuali dettagli esplicativi versionati.

### Output

Per ogni evento:

- fattori utilizzati;
- contributo di ciascun fattore;
- regola applicata;
- dati mancanti rilevanti.

### Non deve

- introdurre nuovi punteggi;
- correggere silenziosamente altri engine;
- sostituire una motivazione testuale a un calcolo reale.

## 17. Ranking Engine

### Scopo

Ordinare e classificare gli eventi già valutati.

### Input

Eventi completi provenienti dagli engine precedenti.

### Campo di competenza

- `status`.

### Output

- eventi ordinati;
- Top Eventi;
- stato di selezione.

### Non deve

- ricalcolare probabilità, Confidence, Stability o value;
- leggere dati grezzi;
- costruire MyCombo;
- promuovere eventi privi dei dati minimi richiesti.

In assenza di regole definite, lo stato deve restare:

```json
"status": "pending"
```

## 18. Strategy Engine

### Scopo

Costruire insiemi di eventi coerenti con profili strategici.

### Strategie previste

- Safe;
- Balanced;
- Value;
- Aggressive.

### Input

Esclusivamente eventi valutati e selezionati dal Ranking Engine.

### Non deve

- modificare i punteggi degli eventi;
- stimare probabilità;
- leggere quote grezze;
- ignorare vincoli di compatibilità.

## 19. MyCombo Builder

### Scopo

Comporre MyCombo a partire dalle strategie e dagli eventi selezionati.

### Output previsti

- Quota 5;
- Quota 10;
- Quota 20.

### Vincoli

Il builder è un consumatore in sola lettura degli eventi.

### Non deve

- modificare il modello canonico;
- ricalcolare punteggi;
- cambiare probabilità, Confidence, Stability o value;
- usare eventi esclusi dal Ranking Engine;
- accedere alle sorgenti originali.

## 20. Historical Database

### Scopo

Conservare lo storico di ogni evento analizzato.

### Dati minimi

- previsione;
- probabilità stimata;
- Confidence;
- Stability;
- quota disponibile;
- value;
- risultato reale;
- esito della previsione;
- timestamp e versione dei motori.

### Unità principale

L’unità storica è l’evento, non soltanto la partita.

### Campo di competenza

- `history`.

### Non deve

- alterare retroattivamente le previsioni;
- sovrascrivere la versione originaria senza tracciamento;
- conservare soltanto il risultato finale della partita.

## 21. Learning Engine

### Scopo

Analizzare lo storico e proporre miglioramenti verificabili.

### Metriche

- accuratezza;
- calibrazione delle probabilità;
- calibrazione di Confidence;
- ROI teorico;
- rendimento per categoria;
- rendimento per engine;
- stabilità nel tempo;
- errori sistematici.

### Non deve

- applicare automaticamente nuovi pesi senza versionamento;
- modificare dati storici;
- confondere correlazione con causalità;
- introdurre modelli non spiegabili senza una decisione architetturale esplicita.

## 22. Directory e artefatti

```text
data/
├── quote/                 # raw data bookmaker
├── providers/             # output puliti dei provider
├── events/                # eventi canonici del Quote Engine
├── intelligence/          # eventi arricchiti dal Match Intelligence
├── scoring/               # eventi validati/preparati
├── confidence/            # eventi con Confidence
├── probability/           # eventi con expectedProbability
├── value/                 # eventi con value
└── ranking/               # eventi classificati

scripts/
├── providers/             # implementazioni dei singoli provider
├── lib/event-model.js     # contratto canonico
├── data-provider-layer.js
├── quote-engine.js
├── football-intelligence-engine.js
├── event-scoring-engine.js
├── confidence-engine.js
├── probability-engine.js
├── value-engine.js
├── ranking-engine.js
└── mycombo-builder.js
```

## 23. Regole per l’evoluzione

Prima di aggiungere un campo al modello canonico occorre:

1. definirne il significato;
2. assegnarne la proprietà a un solo modulo;
3. stabilire tipo, valore iniziale e intervallo valido;
4. documentare input e formula;
5. aggiornare la versione dell’architettura;
6. aggiungere verifiche di compatibilità.

Prima di introdurre un nuovo engine occorre:

1. dimostrare che la responsabilità non appartiene a un modulo esistente;
2. definire categorie gestite;
3. dichiarare dati obbligatori;
4. indicare i campi modificabili;
5. stabilire il comportamento in caso di dati mancanti;
6. garantire l’assenza di accessi diretti alle sorgenti.

## 24. Invarianti architetturali

Le seguenti regole non possono essere violate:

1. gli engine non leggono sorgenti grezze;
2. i provider non prendono decisioni;
3. Probability non usa quote;
4. Confidence non è una probabilità;
5. Value non modifica probabilità;
6. Ranking non modifica punteggi;
7. MyCombo Builder è read-only;
8. i dati mancanti restano `null`, `{}` o `[]`;
9. ogni numero deriva da una regola documentata;
10. ogni evento mantiene il modello canonico completo;
11. ogni stadio preserva i campi altrui;
12. lo storico conserva gli eventi, non soltanto le partite.

## 25. Obiettivo finale

Il sistema deve stimare correttamente la probabilità dei singoli eventi calcistici, misurare quanto tali stime siano affidabili e robuste, confrontarle con il mercato e costruire strategie trasparenti basate sugli eventi migliori.

Questa architettura versione 1.0 costituisce il riferimento ufficiale per tutto lo sviluppo futuro del progetto.
