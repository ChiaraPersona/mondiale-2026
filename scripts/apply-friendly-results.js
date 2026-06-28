const fs = require("fs");

const path = "js/team-stats-data.js";
let text = fs.readFileSync(path, "utf8");

const note = "Risultato verificato su Soccerbase; statistiche complete Diretta da integrare";
const results = [
  ["Arabia Saudita", "06/06/2026", "Puerto Rico", "3-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Canada", "06/06/2026", "Irlanda", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Haiti", "06/06/2026", "Peru", "1-2", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Belgio", "06/06/2026", "Tunisia", "5-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Tunisia", "06/06/2026", "Belgio", "0-5", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Portogallo", "06/06/2026", "Cile", "2-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Stati Uniti", "06/06/2026", "Germania", "1-2", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Germania", "06/06/2026", "Stati Uniti", "2-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Panama", "06/06/2026", "Bosnia ed Erzegovina", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Bosnia ed Erzegovina", "06/06/2026", "Panama", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Svizzera", "06/06/2026", "Australia", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Australia", "06/06/2026", "Svizzera", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Qatar", "06/06/2026", "El Salvador", "0-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Capo Verde", "06/06/2026", "Bermuda", "3-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Inghilterra", "06/06/2026", "Nuova Zelanda", "1-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Nuova Zelanda", "06/06/2026", "Inghilterra", "0-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Sudafrica", "06/06/2026", "Giamaica", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Brasile", "06/06/2026", "Egitto", "2-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Egitto", "06/06/2026", "Brasile", "1-2", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Turchia", "06/06/2026", "Venezuela", "2-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-06"],
  ["Curacao", "07/06/2026", "Aruba", "4-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-07"],
  ["Argentina", "07/06/2026", "Honduras", "2-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-07"],
  ["Croazia", "07/06/2026", "Slovenia", "2-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-07"],
  ["Marocco", "07/06/2026", "Norvegia", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-07"],
  ["Norvegia", "07/06/2026", "Marocco", "1-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-07"],
  ["Ecuador", "07/06/2026", "Guatemala", "3-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-07"],
  ["Colombia", "08/06/2026", "Giordania", "2-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-08"],
  ["Giordania", "08/06/2026", "Colombia", "0-2", "https://www.soccerbase.com/matches/results.sd?date=2026-06-08"],
  ["Olanda", "08/06/2026", "Uzbekistan", "2-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-08"],
  ["Uzbekistan", "08/06/2026", "Olanda", "1-2", "https://www.soccerbase.com/matches/results.sd?date=2026-06-08"],
  ["Francia", "08/06/2026", "Irlanda del Nord", "3-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-08"],
  ["Spagna", "09/06/2026", "Peru", "3-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-09"],
  ["RD Congo", "09/06/2026", "Cile", "1-2", "https://www.soccerbase.com/matches/results.sd?date=2026-06-09"],
  ["Arabia Saudita", "10/06/2026", "Senegal", "0-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-10"],
  ["Senegal", "10/06/2026", "Arabia Saudita", "0-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-10"],
  ["Iraq", "10/06/2026", "Venezuela", "0-2", "https://www.soccerbase.com/matches/results.sd?date=2026-06-10"],
  ["Argentina", "10/06/2026", "Islanda", "3-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-10"],
  ["Portogallo", "10/06/2026", "Nigeria", "2-1", "https://www.soccerbase.com/matches/results.sd?date=2026-06-10"],
  ["Inghilterra", "10/06/2026", "Costa Rica", "3-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-10"],
  ["Algeria", "11/06/2026", "Bolivia", "4-0", "https://www.soccerbase.com/matches/results.sd?date=2026-06-11"],
];

for (const [team, date, opponent, score, source] of results) {
  const teamPos = text.indexOf(`"team": "${team}"`);
  if (teamPos === -1) throw new Error(`Team not found: ${team}`);
  const nextTeam = text.indexOf("\n  {", teamPos + 1);
  const blockEnd = nextTeam === -1 ? text.length : nextTeam;
  const block = text.slice(teamPos, blockEnd);
  if (block.includes(`"date": "${date}"`) && block.includes(`"opponent": "${opponent}"`)) continue;
  const matchesPos = text.indexOf('"matches": [', teamPos);
  if (matchesPos === -1 || matchesPos > blockEnd) throw new Error(`Matches not found: ${team}`);
  const insertPos = text.indexOf("[", matchesPos) + 1;
  const item = `\n      {\n        "date": "${date}",\n        "opponent": "${opponent}",\n        "score": "${score}",\n        "source": "${source}",\n        "note": "${note}"\n      },`;
  text = text.slice(0, insertPos) + item + text.slice(insertPos);
}

fs.writeFileSync(path, text);
console.log(`Inserted/checked ${results.length} friendly result rows.`);
