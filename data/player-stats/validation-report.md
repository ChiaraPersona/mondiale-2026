# Player Stats Validation Report

Generato: 2026-07-15T17:44:12.671Z

## Riepilogo

- File controllati: 44
- Errori trovati: 4
- Warning trovati: 1

## File controllati

- argentina-algeria-2026-06-16.json: Argentina 3-0 Algeria (completion 36.4%)
- argentina-austria-2026-06-22.json: Argentina 2-0 Austria (completion 36.4%)
- argentina-cape-verde-2026-07-03.json: Argentina 3-2 Cape Verde (completion 36.5%)
- argentina-egypt-2026-07-07.json: Argentina 3-2 Egypt (completion 35.7%)
- argentina-switzerland-2026-07-11.json: Argentina 3-1 Switzerland (completion 36%)
- belgium-egypt-2026-06-15.json: Belgium 1-1 Egypt (completion 36.4%)
- belgium-iran-2026-06-21.json: Belgium 0-0 Iran (completion 36.6%)
- belgium-senegal-2026-07-01.json: Belgium 3-2 Senegal (completion 36.8%)
- brazil-morocco-2026-06-13.json: Brazil 1-1 Morocco (completion 36.6%)
- brazil-norway-2026-07-05.json: Brazil 1-2 Norway (completion 36.5%)
- canada-morocco-2026-07-04.json: Canada 0-3 Morocco (completion 36.5%)
- england-congo-dr-2026-07-01.json: England 2-1 Congo DR (completion 36.3%)
- england-croatia-2026-06-17.json: England 4-2 Croatia (completion 36.5%)
- england-ghana-2026-06-23.json: England 0-0 Ghana (completion 36.3%)
- france-iraq-2026-06-22.json: France 3-0 Iraq (completion 36.4%)
- france-morocco-2026-07-09.json: France 2-0 Morocco (completion 36.3%)
- france-senegal-2026-06-16.json: France 3-1 Senegal (completion 36.1%)
- france-spain-2026-07-14.json: France 0-2 Spain (completion 36.4%)
- france-sweden-2026-06-30.json: France 3-0 Sweden (completion 36.5%)
- iraq-norway-2026-06-16.json: Iraq 1-4 Norway (completion 36.4%)
- ivory-coast-norway-2026-06-30.json: Ivory Coast 1-2 Norway (completion 36.2%)
- jordan-argentina-2026-06-27.json: Jordan 1-3 Argentina (completion 36.4%)
- mexico-england-2026-07-05.json: Mexico 2-3 England (completion 36.3%)
- morocco-haiti-2026-06-24.json: Morocco 4-2 Haiti (completion 36.4%)
- netherlands-morocco-2026-06-29.json: Netherlands 1-1 Morocco (completion 36.5%)
- new-zealand-belgium-2026-06-26.json: New Zealand 1-5 Belgium (completion 36.6%)
- norway-england-2026-07-11.json: Norway 1-2 England (completion 36.7%)
- norway-france-2026-06-26.json: Norway 1-4 France (completion 36.4%)
- norway-senegal-2026-06-22.json: Norway 3-2 Senegal (completion 36.4%)
- panama-england-2026-06-27.json: Panama 0-2 England (completion 36.5%)
- paraguay-france-2026-07-04.json: Paraguay 0-1 France (completion 36%)
- portugal-spain-2026-07-06.json: Portugal 0-1 Spain (completion 36.3%)
- qatar-switzerland-2026-06-13.json: Qatar 1-1 Switzerland (completion 36.4%)
- scotland-morocco-2026-06-19.json: Scotland 0-1 Morocco (completion 36.3%)
- spain-austria-2026-07-02.json: Spain 3-0 Austria (completion 36.4%)
- spain-belgium-2026-07-10.json: Spain 2-1 Belgium (completion 36.5%)
- spain-cape-verde-2026.json: Spain 0-0 Cape Verde (completion 36.3%)
- spain-saudi-arabia-2026.json: Spain 4-0 Saudi Arabia (completion 36.4%)
- switzerland-algeria-2026-07-02.json: Switzerland 2-0 Algeria (completion 36.6%)
- switzerland-bosnia-herzegovina-2026-06-18.json: Switzerland 4-1 Bosnia-Herzegovina (completion 35.8%)
- switzerland-canada-2026-06-24.json: Switzerland 2-1 Canada (completion 36.6%)
- switzerland-colombia-2026-07-07.json: Switzerland 0-0 Colombia (completion 36.7%)
- united-states-belgium-2026-07-06.json: United States 1-4 Belgium (completion 36.5%)
- uruguay-spain-2026.json: Uruguay 0-1 Spain (completion 36.3%)

## Errori

- argentina-cape-verde-2026-07-03.json / argentina-cape-verde-2026-07-03: Somma gol squadra casa non coerente con il risultato. (team: Argentina; expected: 3; actual: 2; playerGoals: 2; ownGoalsFor: 0)
- belgium-egypt-2026-06-15.json / belgium-egypt-2026-06-15: Somma gol squadra casa non coerente con il risultato. (team: Belgium; expected: 1; actual: 0; playerGoals: 0; ownGoalsFor: 0)
- iraq-norway-2026-06-16.json / iraq-norway-2026-06-16: Somma gol squadra trasferta non coerente con il risultato. (team: Norway; expected: 4; actual: 3; playerGoals: 3; ownGoalsFor: 0)
- qatar-switzerland-2026-06-13.json / qatar-switzerland-2026-06-13: Somma gol squadra casa non coerente con il risultato. (team: Qatar; expected: 1; actual: 0; playerGoals: 0; ownGoalsFor: 0)


## Warning

- brazil-norway-2026-07-05.json / brazil-norway-2026-07-05: Non utilizzato con minuteIn valorizzato. (player: Brazil / Ederson; minutes: 0; minuteIn: 79)


## Giocatori sospetti

- Brazil / Ederson


## Campi da correggere manualmente

- minuteIn/minutes
