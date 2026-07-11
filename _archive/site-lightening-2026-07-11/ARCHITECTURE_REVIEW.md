# Football Prediction Platform — Architectural Review

**Architettura revisionata:** 1.0  
**Tipo di revisione:** strutturale  
**Ambito:** modularità, dipendenze, scalabilità, estendibilità, data model, performance, robustezza e testing  
**Esclusioni:** nuove funzionalità e riscrittura dell’architettura

## Sintesi esecutiva

L’architettura 1.0 parte da principi corretti: provider isolati, modello evento condiviso, separazione tra probabilità, Confidence, Stability e value, ownership dei campi e MyCombo Builder in sola lettura.

La direzione complessiva è solida, ma il documento contiene alcune ambiguità che, se lasciate aperte, produrranno refactoring costosi:

1. manca un’identità stabile e indipendente dal bookmaker per partita ed evento;
2. `breakdown` ha ownership e significato troppo ampi;
3. il confine tra Specialized Engines e Probability/Confidence/Stability Engine non è completamente definito;
4. la pipeline è descritta come lineare, mentre storico e apprendimento introducono fan-out e feedback;
5. il formato a file JSON completi per ogni stadio non scala a milioni di eventi;
6. mancano versionamento dello schema, provenienza dei dati e politiche formali per dati incompleti.

Questi problemi non invalidano l’architettura. Richiedono però decisioni contrattuali prima dello Sprint 1.

---

## ✅ Punti di forza

### 1. Separazione corretta dei concetti predittivi

La distinzione tra:

- `expectedProbability`;
- `confidence`;
- `stability`;
- `value`;

è uno dei punti migliori dell’architettura.

In particolare, il vincolo:

```text
expectedProbability != confidence / 100
```

evita un errore frequente nei sistemi predittivi. I quattro valori rappresentano dimensioni differenti:

- probabilità dell’esito;
- fiducia nella stima;
- robustezza rispetto agli imprevisti;
- vantaggio rispetto al mercato.

Questa separazione è adatta a modelli futuri più sofisticati senza richiedere una nuova struttura dati.

### 2. Data Provider Layer ben motivato

Il divieto per gli engine di leggere sorgenti grezze è corretto.

I provider:

- isolano cambi di formato;
- normalizzano i dati;
- permettono test indipendenti;
- riducono l’accoppiamento con bookmaker e pagine HTML;
- rendono sostituibili le sorgenti.

È una scelta adatta sia a un progetto personale evoluto sia a una piattaforma enterprise.

### 3. Responsabilità generalmente chiare

La maggior parte dei moduli possiede un risultato specifico:

| Modulo | Responsabilità principale |
|---|---|
| Quote Engine | Identità commerciale dell’evento e probabilità implicita |
| Match Intelligence | Contesto della partita |
| Feature Engineering | Trasformazione numerica |
| Probability Engine | Probabilità stimata |
| Confidence Engine | Affidabilità della stima |
| Stability Engine | Robustezza |
| Value Engine | Confronto con il bookmaker |
| Ranking Engine | Classificazione |
| Strategy Engine | Profilo strategico |
| MyCombo Builder | Composizione read-only |

Non emergono moduli che debbano essere uniti immediatamente.

In particolare, Strategy Engine e MyCombo Builder devono restare separati:

- Strategy decide quali eventi sono coerenti con un profilo;
- MyCombo Builder applica vincoli di composizione agli eventi già selezionati.

### 4. Modello canonico condiviso

L’uso di un unico record evento riduce:

- conversioni tra formati;
- perdita di campi;
- contratti impliciti;
- duplicazione della logica di validazione.

L’ownership dichiarata dei campi è un ottimo punto di partenza per test automatici di non-regressione.

### 5. Gestione prudente dei dati mancanti

La regola:

```text
dato mancante → null, {}, oppure []
```

è corretta.

Evita che l’assenza di una fonte venga trasformata in un valore neutro apparentemente reale. È essenziale per meteo, arbitri, assenze e statistiche incomplete.

### 6. Explainability prevista fin dall’inizio

Prevedere:

- motivazioni;
- fattori;
- contributi;
- regole applicate;

prima dell’introduzione di modelli complessi riduce il rischio di produrre numeri non verificabili.

### 7. Storico centrato sugli eventi

La scelta di salvare soprattutto gli eventi, e non soltanto i risultati delle partite, è corretta.

La piattaforma dovrà misurare, per esempio:

- Over corner;
- tiri giocatore;
- cartellini;
- Goal/No Goal;
- qualificazione;

come unità predittive indipendenti.

### 8. Estensione per categoria

Gli Specialized Engines permettono di aggiungere logiche diverse per:

- corner;
- cartellini;
- gol;
- tiri;
- giocatori;
- mercati partita.

Questa separazione limita la crescita di un unico motore monolitico.

---

## ⚠ Criticità

## 1. Modularità

### 1.1 Ownership ambigua di `breakdown`

Il modello assegna `breakdown` a:

```text
Match Intelligence / Feature Engineering
```

Questo viola il principio di ownership singola.

Match Intelligence produce contesto semantico; Feature Engineering produce valori numerici. Se entrambi scrivono liberamente nello stesso oggetto:

- il significato del campo cambia tra stadi;
- un modulo può sovrascrivere il lavoro dell’altro;
- i test non possono stabilire facilmente chi ha alterato un dato;
- il formato interno rischia di diventare un contenitore generico.

Questa è una criticità strutturale, non soltanto terminologica.

### 1.2 Confine incompleto tra Specialized Engines e aggregatori

Il documento afferma che gli Specialized Engines producono contributi a:

- `expectedProbability`;
- `confidence`;
- `stability`.

Gli stessi campi appartengono però rispettivamente a:

- Probability Engine;
- Confidence Engine;
- Stability Engine.

Manca la distinzione tra:

- stima parziale;
- contributo;
- risultato finale aggregato.

Senza un contratto esplicito, uno Specialized Engine potrebbe modificare direttamente un campo di cui non è proprietario.

### 1.3 Scoring Engine non definito nell’architettura concettuale

La struttura delle directory e il codice corrente includono uno Scoring Engine, ma il flusso architetturale ufficiale usa Feature Engineering e Specialized Engines.

Occorre chiarire se Scoring Engine sia:

- un nome transitorio;
- un validatore;
- una parte di Feature Engineering;
- un orchestratore degli Specialized Engines.

Lasciarlo indefinito rischia di trasformarlo in un modulo generico con responsabilità crescenti.

### 1.4 Explainability troppo tardiva

Explainability Engine compare dopo Value Engine.

Un motore finale può assemblare spiegazioni, ma non può ricostruire con certezza decisioni precedenti se i moduli non conservano:

- input usati;
- regola applicata;
- contributo;
- versione della regola.

L’esplicabilità deve essere raccolta durante l’elaborazione, anche se presentata alla fine.

## 2. Dipendenze

### 2.1 La pipeline non è completamente lineare

Il percorso principale può essere lineare, ma il sistema completo non lo è.

Esistono almeno tre forme di diramazione:

1. più Specialized Engines lavorano in parallelo;
2. Historical Database deve ricevere eventi da più punti;
3. Learning Engine produce indicazioni che influenzeranno configurazioni e modelli futuri.

Il Learning Engine introduce un ciclo intenzionale:

```text
produzione → storico → apprendimento → nuova versione dei modelli
```

Non è una dipendenza circolare runtime, purché l’aggiornamento avvenga tramite versioni nuove e non modifichi una previsione già prodotta.

### 2.2 Historical Database collocato troppo in fondo

Nel diagramma, lo storico arriva dopo MyCombo Builder.

Questo può suggerire che vengano salvati soltanto eventi selezionati o combinati, in contrasto con il requisito di salvare ogni evento analizzato.

Lo storico è logicamente un sink laterale della pipeline, non soltanto l’ultimo passaggio sequenziale.

### 2.3 Dipendenza ampia di Match Intelligence

Match Intelligence può dipendere da molti provider:

- Motivation;
- Form;
- Team;
- Player;
- Referee;
- Weather;
- Statistics;
- Tactics;
- Pressure;
- Absence;
- Risk.

Questo è accettabile per un aggregatore di contesto, ma richiede un contratto stabile. Senza di esso, ogni nuovo provider costringerà a modificare Match Intelligence.

## 3. Scalabilità

### 3.1 Materializzazione completa a ogni stadio

Il modello canonico completo viene copiato in:

- `events`;
- `intelligence`;
- `scoring`;
- `confidence`;
- `probability`;
- `value`;
- `ranking`.

Con milioni di eventi questo implica:

- forte duplicazione su disco;
- letture e scritture ripetute;
- serializzazione di grandi `breakdown`;
- tempi elevati anche quando cambia un solo campo;
- difficoltà negli aggiornamenti incrementali.

Il modello logico è corretto, ma il formato fisico basato esclusivamente su grandi array JSON non è una soluzione scalabile.

### 3.2 Assenza di partizionamento

Non è definito come partizionare eventi per:

- competizione;
- stagione;
- data;
- partita;
- bookmaker;
- categoria;
- versione del modello.

Senza partizionamento, scansioni, rigenerazioni e recupero storico diventeranno costosi.

### 3.3 Elaborazione non dichiarata come incrementale

La pipeline non specifica:

- come riconoscere dati invariati;
- quando ricalcolare una partita;
- come invalidare una cache;
- come elaborare soltanto nuovi eventi;
- come gestire aggiornamenti delle quote.

Rigenerare tutto a ogni variazione non è sostenibile su milioni di eventi.

### 3.4 JSON adatto al prototipo, non al volume finale

JSON rimane utile per:

- debugging;
- fixture di test;
- esportazioni;
- sviluppo iniziale.

Per milioni di eventi sarà necessario un livello di persistenza interrogabile o un formato analitico partizionato. Questa decisione non deve essere implementata ora, ma l’architettura non deve assumere che i file JSON siano il database definitivo.

## 4. Estendibilità

### 4.1 Aggiungere una sorgente non richiede sempre “solo un Provider”

Per una sorgente equivalente, come un secondo provider di statistiche già previste, può bastare:

1. aggiungere il provider;
2. mappare i dati nel contratto standard esistente.

Per una sorgente che introduce nuovi concetti, invece, possono cambiare:

- schema normalizzato del provider;
- Match Intelligence;
- Feature Engineering;
- Specialized Engines;
- test e policy di qualità.

Pertanto:

| Estensione | Modifiche realistiche |
|---|---|
| Understat con metriche già supportate | Nuovo Provider e mapping |
| FBref con statistiche equivalenti | Nuovo Provider e mapping |
| StatsBomb con eventi granulari nuovi | Provider, feature e motori interessati |
| Nuovo bookmaker | Provider quote e mapping degli identificativi |
| Nuovo mercato noto | Tassonomia e Specialized Engine relativo |
| Nuovo mercato concettualmente diverso | Tassonomia, feature, engine e test |
| Nuovo campionato di calcio | Principalmente configurazione e provider |
| Altro sport | Nuovo dominio, tassonomia, feature ed engine |

L’aggiunta di altri sport non può realisticamente richiedere soltanto nuovi provider. Il modello attuale è esplicitamente calcistico.

### 4.2 Tassonomia dei mercati non formalizzata

Le categorie sono stringhe libere.

Non è definito un vocabolario versionato per:

- categorie;
- periodi di gioco;
- soglie;
- squadra casa/ospite;
- giocatore;
- tipo di selezione;
- mercato semplice o combinato.

Nuovi bookmaker possono descrivere lo stesso mercato con nomi differenti. Senza una tassonomia comune, gli Specialized Engines dipenderanno da stringhe specifiche del provider.

## 5. Separazione delle responsabilità

### Valutazione per livello

| Livello | Indipendenza | Osservazione |
|---|---:|---|
| Data Acquisition | Buona | Deve restare privo di logiche decisionali |
| Providers | Buona | Necessario un contratto standard per provider equivalenti |
| Match Intelligence | Media | Rischio di dipendenza eccessiva dai provider |
| Feature Engineering | Media | Ownership di `breakdown` non chiara |
| Specialized Engines | Media | Contratto dei contributi non definito |
| Probability | Buona | Corretta esclusione delle quote |
| Confidence | Buona | Ben separata dalla probabilità |
| Stability | Buona | Responsabilità chiara, ancora da formalizzare nei fattori |
| Value | Buona | Formula e divieti chiari |
| Explainability | Media | Deve ricevere tracce già prodotte dagli engine |
| Ranking | Buona | Non deve ricalcolare valori |
| Strategy | Buona | Separata dalla composizione tecnica |
| MyCombo | Buona | Read-only |
| Historical Database | Media | Deve essere un sink di tutti gli eventi |
| Learning | Media | Feedback e versionamento non definiti |

## 6. Data Model

### 6.1 Separazione dei valori principali

La separazione tra `expectedProbability`, `confidence`, `stability` e `value` è sufficiente e corretta.

Non devono essere aggiunti duplicati semantici.

### 6.2 Manca un identificatore canonico dell’evento

`selectionId` e `marketId` appartengono al bookmaker. Non identificano stabilmente lo stesso evento tra:

- bookmaker diversi;
- aggiornamenti del feed;
- snapshot temporali;
- stagioni;
- mercati equivalenti con naming diverso.

Serve una strategia di identità canonica per:

- partita;
- evento;
- sorgente;
- snapshot della quota.

Senza questa identità, deduplicazione, join e storico saranno fragili.

### 6.3 Mancano metadati minimi di contesto

Il record non espone direttamente:

- competizione;
- stagione;
- data e ora della partita;
- bookmaker;
- timestamp della quota;
- versione dello schema;
- versione dei modelli;
- provenienza dei dati.

Non tutti devono necessariamente stare nel record principale, ma devono essere disponibili tramite un envelope o metadati associati. Senza di essi non è possibile riprodurre una previsione storica.

### 6.4 Mercato non sufficientemente strutturato

`market` e `selection` sono stringhe leggibili, ma non bastano per distinguere in modo affidabile:

- Over 5,5 da Over 7,5;
- primo tempo da partita intera;
- squadra da giocatore;
- tiri totali da tiri in porta;
- inclusione o esclusione dei supplementari;
- mercati combinati.

La soglia e il contesto non devono essere ricostruiti ogni volta analizzando stringhe libere.

### 6.5 Provenienza e qualità dei dati

Manca un modo standard per sapere:

- quale provider ha prodotto un dato;
- quando è stato acquisito;
- se è completo;
- quanto è fresco;
- se è stato derivato o osservato;
- quali provider erano indisponibili.

`null` descrive l’assenza del valore, ma non la causa.

### 6.6 `history` troppo generico

Un oggetto libero può diventare rapidamente inconsistente.

Lo storico richiede almeno una distinzione concettuale tra:

- previsione originaria;
- snapshot della quota;
- risultato osservato;
- valutazione della previsione;
- versioni dei motori.

### 6.7 `status` sovraccaricabile

Un solo campo può finire per rappresentare contemporaneamente:

- stato di elaborazione;
- stato del ranking;
- selezione strategica;
- esito reale;
- errore.

Il documento assegna `status` al Ranking Engine, quindi non deve essere riutilizzato per lifecycle tecnico o risultato reale.

## 7. Performance

### 7.1 Moduli parallelizzabili

Possono essere eseguiti in parallelo:

- provider indipendenti della stessa partita;
- partite differenti;
- bookmaker differenti;
- Specialized Engines differenti;
- categorie di eventi differenti;
- valutazione storica per partizione.

### 7.2 Moduli sequenziali

Richiedono risultati precedenti:

- Probability dopo feature e Specialized Engines;
- Confidence dopo la produzione della stima e dei relativi segnali di qualità;
- Stability dopo l’analisi dei fattori di fragilità;
- Value dopo Probability e Quote Engine;
- Ranking dopo i valori richiesti dalla policy;
- Strategy dopo Ranking;
- MyCombo dopo Strategy.

### 7.3 Componenti memorizzabili in cache

Buoni candidati:

- dati provider con timestamp e versione;
- Match Intelligence per partita;
- feature indipendenti dalle quote;
- dati di squadre, giocatori e arbitri;
- output degli Specialized Engines se gli input non cambiano.

### 7.4 Componenti da eseguire una volta o raramente

- normalizzazione di dati storici immutabili;
- anagrafiche squadre e competizioni;
- risultati definitivi;
- feature statiche relative a eventi conclusi.

### 7.5 Componenti sensibili agli aggiornamenti

- quote;
- formazioni;
- assenze;
- meteo;
- stato giocatori;
- probabilità, Confidence e Stability dipendenti da tali dati.

La cache deve essere invalidata per dipendenza, non globalmente.

### 7.6 Collo di bottiglia principale

Il collo di bottiglia previsto è la riscrittura completa di grandi array a ogni stadio. Il secondo è la duplicazione del `breakdown` di partita su migliaia di eventi.

## 8. Robustezza

### 8.1 Meteo mancante

Comportamento corretto:

- WeatherProvider restituisce `null`;
- Match Intelligence registra il dato come non disponibile;
- gli engine che non richiedono meteo continuano;
- gli engine che lo richiedono riducono Confidence o lasciano la stima non disponibile secondo una policy esplicita.

L’architettura supporta il `null`, ma non definisce ancora la policy di degradazione.

### 8.2 Arbitro mancante

Gli eventi non dipendenti dall’arbitro devono continuare.

Gli engine cartellini devono:

- distinguere “dato assente” da “arbitro medio”;
- non sostituire il dato con zero;
- dichiarare la riduzione di copertura.

### 8.3 Statistiche parziali

L’architettura degrada bene soltanto se ogni engine dichiara:

- dati obbligatori;
- dati opzionali;
- soglia minima di copertura;
- comportamento in caso di assenza.

Questa matrice non è ancora definita.

### 8.4 Cambio formato Sisal

Il Provider Layer limita correttamente il danno al QuoteProvider.

Servono comunque:

- validazione dello schema in ingresso;
- test con fixture reali;
- rilevamento di campi mancanti;
- quarantena del feed non valido;
- nessuna emissione di eventi parziali come se fossero completi.

### 8.5 Errori parziali

Non è definito se una partita debba:

- fallire interamente;
- produrre soltanto categorie valide;
- essere marcata come incompleta;
- essere ritentata.

È necessaria una policy minima e uniforme, senza costruire ora un sistema distribuito complesso.

### 8.6 Idempotenza

Ogni modulo dovrebbe produrre lo stesso output a parità di input e poter essere rieseguito senza duplicare record o alterare lo storico.

Il principio è implicito nel determinismo, ma non è dichiarato formalmente.

## 9. Testing

### Matrice minima consigliata

| Modulo | Input minimo | Output atteso | Test automatici |
|---|---|---|---|
| Data Acquisition | Una risposta valida della sorgente | Raw Data integro | checksum, encoding, errore rete, risposta vuota |
| QuoteProvider | Un mercato valido | Mercato normalizzato | mapping campi, ID, quota nulla, formato cambiato |
| MotivationProvider | Testo con livello esplicito | Valore normalizzato | livelli noti, testo ambiguo, dato assente |
| FormProvider | Statistiche minime | Classe di forma | soglie, dati parziali, regressione sul parser |
| PlayerProvider | Lista giocatori | Giocatori normalizzati | duplicati, alias, giocatore assente |
| RefereeProvider | Dati arbitro | Profilo normalizzato | media valida, arbitro ignoto, unità errata |
| WeatherProvider | Osservazione meteo | Valori normalizzati | unità, dato mancante, timestamp scaduto |
| Quote Engine | Output QuoteProvider | Evento canonico | schema completo, probabilità implicita, ID preservati |
| Match Intelligence | Evento + provider minimi | `needs` e `breakdown` | nessun accesso raw, null propagation, ownership |
| Feature Engineering | Breakdown noto | Feature numeriche | formule, range, determinismo, dati mancanti |
| Specialized Engine | Feature della categoria | Contributi dichiarati | ignora altre categorie, range, fixture note |
| Probability Engine | Contributi sufficienti | Probabilità 0–1 | non usa quote, breakdown coerente, input insufficiente |
| Confidence Engine | Stima + qualità input | Confidence 0–100 | non modifica probabilità, copertura parziale |
| Stability Engine | Fattori di fragilità | Stability 0–100 | turnover, dipendenza giocatore, dati assenti |
| Value Engine | Probabilità e quota | `value` corretto | formula, probability null, quota non valida |
| Explainability Engine | Tracce degli engine | Reasons verificabili | nessun numero nuovo, riferimenti ai fattori |
| Ranking Engine | Eventi valutati | Ordine e status | tie-break, null, stabilità dell’ordinamento |
| Strategy Engine | Eventi ranked | Insiemi strategici | filtri Safe/Balanced/Value/Aggressive |
| MyCombo Builder | Eventi strategici compatibili | Combinazioni | read-only, incompatibilità, nessun evento escluso |
| Historical Database | Evento e risultato | Record storico immutabile | idempotenza, versioni, risultato tardivo |
| Learning Engine | Storico sufficiente | Metriche e proposta | split temporale, leakage, calibrazione, riproducibilità |

### Test trasversali indispensabili

1. **Schema contract test:** ogni stadio conserva tutti i campi canonici.
2. **Ownership test:** ogni modulo modifica soltanto i campi assegnati.
3. **Determinism test:** stesso input, stesso output.
4. **No-raw-access test:** gli engine non importano né leggono sorgenti.
5. **Null propagation test:** dato assente non diventa zero.
6. **Golden fixture test:** una partita nota attraversa tutta la pipeline.
7. **Version reproducibility test:** una previsione è ricostruibile con le versioni originali.
8. **Scale test:** elaborazione di un volume sintetico elevato senza cambiare logica.

---

## 🔧 Miglioramenti consigliati

I miglioramenti sono ordinati per priorità e mantengono l’architettura semplice.

### Priorità 1 — Chiarire i contratti

#### A. Definire l’identità canonica

Stabilire come identificare in modo stabile:

- partita;
- evento;
- bookmaker;
- snapshot della quota.

Non è necessario introdurre subito un database. È necessario definire la regola.

#### B. Assegnare un solo proprietario a `breakdown`

Occorre decidere se:

- `breakdown` contiene contesto semantico;
- oppure contiene feature numeriche;
- oppure è strutturato in namespace non sovrascrivibili.

Il significato non deve cambiare silenziosamente tra stadi.

#### C. Definire il contratto degli Specialized Engines

Gli Specialized Engines devono produrre contributi intermedi chiaramente nominati. I campi finali restano proprietà degli engine aggregatori.

#### D. Formalizzare dati obbligatori e opzionali

Per ogni categoria definire una matrice minima:

| Categoria | Dati obbligatori | Dati opzionali | Comportamento se mancanti |
|---|---|---|---|
| Corner | Da definire | Da definire | `null` o Confidence ridotta |
| Cartellini | Da definire | Da definire | `null` o Confidence ridotta |
| Tiri | Da definire | Da definire | `null` o Confidence ridotta |
| Gol | Da definire | Da definire | `null` o Confidence ridotta |
| Esito | Da definire | Da definire | `null` o Confidence ridotta |

### Priorità 2 — Rendere il sistema riproducibile

#### E. Versionare schema e modelli

Ogni previsione deve essere riconducibile a:

- versione dello schema;
- versione dei provider;
- versione delle feature;
- versione degli engine;
- momento di acquisizione.

#### F. Definire provenienza e freschezza

Ogni dato importante deve poter indicare:

- provider;
- timestamp;
- stato di completezza;
- eventuale errore o indisponibilità.

#### G. Separare lo storico dal percorso di selezione

Lo storico deve ricevere tutti gli eventi analizzati, inclusi quelli:

- non selezionati;
- con value negativo;
- con dati incompleti;
- esclusi dalle strategie.

### Priorità 3 — Preparare la crescita

#### H. Definire partizionamento e incrementalità

Prima di aumentare il volume, stabilire:

- chiave di partizione;
- unità di ricalcolo;
- invalidazione della cache;
- comportamento sugli aggiornamenti delle quote.

#### I. Non considerare JSON come storage definitivo

Conservare JSON per sviluppo e test, ma mantenere il contratto di storage astratto rispetto al formato fisico futuro.

#### J. Formalizzare la tassonomia dei mercati

Definire almeno:

- categoria;
- periodo;
- soglia;
- soggetto;
- metrica;
- tipo di selezione.

Questo riduce la dipendenza dai nomi del bookmaker.

---

## 🚨 Problemi da risolvere prima dello Sprint 1

Questi punti devono essere decisi prima di costruire ulteriori engine. Non richiedono necessariamente molto codice, ma richiedono contratti non ambigui.

### 1. Identità stabile di match ed evento

**Motivo:** senza identità canonica non sono affidabili join, deduplicazione, storico e confronto tra bookmaker.

**Decisione richiesta:** regola ufficiale per `matchId`, `eventId`, sorgente e snapshot.

### 2. Ownership e struttura di `breakdown`

**Motivo:** Match Intelligence e Feature Engineering non possono possedere liberamente lo stesso campo.

**Decisione richiesta:** significato stabile o namespace separati.

### 3. Contratto Specialized Engines → Engine aggregatori

**Motivo:** oggi esiste una sovrapposizione sui contributi a Probability, Confidence e Stability.

**Decisione richiesta:** formato dei contributi intermedi e divieto di modificare direttamente i valori finali.

### 4. Schema version e model version

**Motivo:** senza versioni non sarà possibile riprodurre una previsione né interpretare correttamente lo storico.

**Decisione richiesta:** metadati minimi di versione.

### 5. Policy per dati mancanti

**Motivo:** `null` è corretto, ma non specifica quando un engine debba fermarsi, degradare o produrre una stima con copertura ridotta.

**Decisione richiesta:** dati obbligatori, opzionali e soglia minima per categoria.

### 6. Collocazione logica dello storico

**Motivo:** lo storico non deve ricevere soltanto eventi arrivati a Strategy o MyCombo.

**Decisione richiesta:** Historical Database come sink di tutti gli eventi analizzati.

### 7. Ruolo dello Scoring Engine

**Motivo:** è presente nella pipeline implementata ma non ha una responsabilità ufficiale distinta da Feature Engineering o Specialized Engines.

**Decisione richiesta:** assegnargli una responsabilità precisa oppure considerarlo un nome transitorio.

---

## Rischi futuri

Scala utilizzata:

- **Gravità:** danno architetturale se il rischio si verifica;
- **Probabilità:** possibilità che si presenti nei prossimi mesi;
- **Impatto:** area principalmente coinvolta.

| # | Rischio | Gravità | Probabilità | Impatto |
|---:|---|---|---|---|
| 1 | Eventi non deduplicabili tra bookmaker e snapshot | Critica | Alta | Storico, value, ranking |
| 2 | `breakdown` trasformato in contenitore generico | Alta | Alta | Tutti gli engine |
| 3 | Probabilità non calibrate ma trattate come reali | Critica | Medio-alta | Value, strategie, ROI |
| 4 | Data leakage nel Learning Engine | Critica | Media | Validità dei modelli |
| 5 | Riscrittura completa di milioni di eventi | Alta | Alta | Performance e costi |
| 6 | Mancanza di versioni rende lo storico non riproducibile | Alta | Alta | Audit e apprendimento |
| 7 | Specialized Engines che modificano campi finali | Alta | Medio-alta | Ownership e debugging |
| 8 | Tassonomia dipendente dalle stringhe Sisal | Alta | Alta | Nuovi bookmaker |
| 9 | Dati mancanti interpretati come valori neutri | Alta | Media | Confidence e probabilità |
| 10 | Storico limitato agli eventi selezionati | Alta | Media | Bias del Learning Engine |
| 11 | Provider con semantiche incompatibili | Media-alta | Alta | Match Intelligence |
| 12 | Quote senza timestamp o snapshot | Alta | Medio-alta | Value e ROI storico |
| 13 | Learning Engine che aggiorna pesi senza versionamento | Alta | Media | Riproducibilità |
| 14 | Explainability ricostruita a posteriori | Media-alta | Medio-alta | Audit |
| 15 | Scoring Engine trasformato in modulo monolitico | Media-alta | Media | Manutenibilità |
| 16 | Altro sport forzato nel modello calcistico | Media | Media | Estendibilità |
| 17 | Assenza di policy per errori parziali | Media | Alta | Robustezza operativa |
| 18 | Cache non invalidata dopo formazioni o assenze | Alta | Media | Accuratezza |
| 19 | Ranking di eventi con dati incompleti | Media-alta | Media | Strategie |
| 20 | Crescita incontrollata dei campi nel modello canonico | Media | Medio-alta | Compatibilità |

---

## 📈 Valutazione finale

### Voto complessivo: **76/100**

### Motivazione del punteggio

| Area | Punteggio | Valutazione |
|---|---:|---|
| Visione e principi | 9/10 | Obiettivo chiaro e corretta centralità degli eventi |
| Modularità | 8/10 | Buona separazione, con ambiguità su breakdown e scoring |
| Dipendenze | 7/10 | Flusso principale chiaro, fan-out e feedback non formalizzati |
| Data model | 7/10 | Buona separazione predittiva, identità e metadati insufficienti |
| Scalabilità | 6/10 | Struttura logica valida, persistenza JSON non adatta al volume finale |
| Estendibilità | 7/10 | Buona per nuove sorgenti equivalenti, meno per nuovi concetti e sport |
| Robustezza | 7/10 | Null corretti, policy di degradazione ancora assente |
| Explainability | 8/10 | Prevista correttamente, ma deve essere raccolta durante il calcolo |
| Testing e riproducibilità | 7/10 | Principi buoni, versioni e contratti di test da formalizzare |
| Semplicità | 10/10 | L’architettura evita infrastruttura prematura e mantiene confini leggibili |

### Perché non è più basso

L’architettura evita già gli errori più costosi:

- engine accoppiati alle sorgenti;
- Confidence usata come probabilità;
- Value che modifica la stima;
- MyCombo che ricalcola punteggi;
- storico centrato soltanto sulle partite;
- assenza totale di explainability.

La visione è coerente e i moduli principali sono separati in modo sensato.

### Perché non è più alto

Il punteggio è limitato da problemi che diventerebbero costosi dopo l’avvio dello sviluppo:

- identità degli eventi non definita;
- ownership ambigua del breakdown;
- contratto incompleto degli Specialized Engines;
- assenza di versionamento e provenienza;
- pipeline descritta come più lineare di quanto sia realmente;
- storage fisico non scalabile;
- policy per dati incompleti non formalizzata.

### Giudizio conclusivo

L’architettura è abbastanza solida per diventare il riferimento ufficiale del progetto, ma non è ancora pronta per l’implementazione estesa degli engine.

Prima dello Sprint 1 devono essere risolti i sette punti indicati nella sezione dedicata. Si tratta soprattutto di decisioni di contratto e ownership, non di nuova infrastruttura.

Una volta chiariti quei confini, il rischio di un refactoring architetturale profondo nei prossimi mesi diminuirà in modo significativo.
