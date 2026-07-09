# Match Environment - Quarti Mondiale 2026

Report generato per alimentare la pipeline MyCombo come input opzionale `matchEnvironment`.

## Dati Certi

- **Francia-Marocco**: stadio Boston Stadium / Gillette Stadium, Foxborough/Boston; open-air senza tetto; circa 90 metri; non climatizzato. Arbitro confermato: Facundo Tello con squadra argentina.
- **Spagna-Belgio**: stadio Los Angeles Stadium / SoFi Stadium, Inglewood/Los Angeles; canopy fisso con lati aperti; circa 30 metri; passive cooling, non aria condizionata. Arbitro confermato: Michael Oliver.
- **Norvegia-Inghilterra**: stadio Miami Stadium / Hard Rock Stadium; altitudine circa 2 metri; open-air con canopy parziale sugli spalti e campo esposto.
- **Argentina-Svizzera**: stadio Nashville Stadium / GEODIS Park; altitudine circa 180 metri; open-air, non climatizzato.

## Dati Da Verificare

- **Norvegia-Inghilterra**: arbitro ufficiale, assistenti, quarto uomo, VAR/AVAR, precedenti arbitro nel Mondiale 2026 e precedenti con Norvegia/Inghilterra.
- **Argentina-Svizzera**: arbitro ufficiale, assistenti, quarto uomo, VAR/AVAR, precedenti arbitro nel Mondiale 2026 e precedenti con Argentina/Svizzera.
- **Spagna-Belgio**: forecast locale aggiornato e VAR/AVAR se non ancora inseriti.
- **Tutti i match**: aggiornare il forecast vicino al calcio d'inizio, soprattutto temperatura percepita, temporali e condizioni umidita.

## Impatto Su Cartellini

- **Francia-Marocco**: Tello aumenta leggermente il rischio cartellini per profilo severo e contesto emotivo, ma il riferimento politico/psicologico non deve diventare automatismo predittivo.
- **Spagna-Belgio**: Oliver porta rischio medio-alto se la gara diventa intensa; utile per mercati cartellini squadra e punti cartellino.
- **Norvegia-Inghilterra**: nessun aumento arbitro finche la designazione non e confermata.
- **Argentina-Svizzera**: nessun aumento arbitro finche la designazione non e confermata; resta rilevante la tensione da eliminazione diretta.

## Impatto Su Falli

- **Francia-Marocco**: aumentare peso dei mercati falli/cartellini.
- **Spagna-Belgio**: buono per falli/cartellini se la partita resta fisica e intensa.
- **Norvegia-Inghilterra**: valutare soprattutto profilo squadre e intensita; arbitro da integrare.
- **Argentina-Svizzera**: valutare duelli e stato gara; arbitro da integrare.

## Impatto Su Tiri

- **Francia-Marocco**: attenzione agli over tiri troppo alti se il caldo abbassa il ritmo nella seconda parte.
- **Spagna-Belgio**: condizioni ambientali meno negative rispetto a Boston/Miami, ma non trattare SoFi come indoor climatizzato.
- **Norvegia-Inghilterra**: caldo/umidita possono penalizzare over tiri dipendenti da ritmo alto costante.
- **Argentina-Svizzera**: possibile lieve penalita agli over tiri in caso di calo ritmo.

## Impatto Su Ritmo Partita

- **Francia-Marocco**: possibile calo nella seconda parte, maggiore peso dei cambi e dei cooling break.
- **Spagna-Belgio**: ritmo meno penalizzato da esposizione diretta, ma comunque dipendente dal meteo esterno.
- **Norvegia-Inghilterra**: Miami caldo/umido, possibile gestione energie e cooling break.
- **Argentina-Svizzera**: Nashville caldo/umido, possibile calo ritmo e gestione fisica piu importante.

## Collegamento Pipeline

Il file `data/match-environment/quarterfinals-2026.json` puo essere letto dalla pipeline MyCombo come input opzionale. Se un `matchId` non e presente, la pipeline deve continuare senza modifiche.
