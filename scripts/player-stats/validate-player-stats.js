#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { readJson, resolveRepo, writeJson, writeText } = require("./lib/common");

const mergedDir = resolveRepo("data", "player-stats", "merged");
const jsonReportPath = resolveRepo("data", "player-stats", "validation-report.json");
const markdownReportPath = resolveRepo("data", "player-stats", "validation-report.md");

function numberOrNull(value) {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function parseScore(score) {
  const match = String(score || "").match(/^\s*(\d+)\s*-\s*(\d+)\s*$/);
  if (!match) return null;
  return { home: Number(match[1]), away: Number(match[2]) };
}

function issue(type, file, matchId, message, details = {}) {
  return {
    type,
    file,
    matchId,
    message,
    ...details
  };
}

function playerLabel(teamName, player) {
  return `${teamName} / ${player.name || "Giocatore senza nome"}`;
}

function checkTeamGoals({ data, file, score, errors }) {
  const homePlayers = data.teams?.[data.homeTeam]?.players || [];
  const awayPlayers = data.teams?.[data.awayTeam]?.players || [];
  const homeGoals = homePlayers.reduce((total, player) => total + (numberOrNull(player.goals) || 0), 0);
  const awayGoals = awayPlayers.reduce((total, player) => total + (numberOrNull(player.goals) || 0), 0);

  if (homeGoals !== score.home) {
    errors.push(issue("error", file, data.matchId, "Somma gol squadra casa non coerente con il risultato.", {
      team: data.homeTeam,
      expected: score.home,
      actual: homeGoals
    }));
  }

  if (awayGoals !== score.away) {
    errors.push(issue("error", file, data.matchId, "Somma gol squadra trasferta non coerente con il risultato.", {
      team: data.awayTeam,
      expected: score.away,
      actual: awayGoals
    }));
  }
}

function checkTeamAssists({ data, file, score, warnings }) {
  const sides = [
    { teamName: data.homeTeam, goals: score.home },
    { teamName: data.awayTeam, goals: score.away }
  ];

  for (const side of sides) {
    const players = data.teams?.[side.teamName]?.players || [];
    const assists = players.reduce((total, player) => total + (numberOrNull(player.assists) || 0), 0);
    if (assists > side.goals) {
      warnings.push(issue("warning", file, data.matchId, "Assist squadra superiori ai gol segnati.", {
        team: side.teamName,
        goals: side.goals,
        assists
      }));
    }
  }
}

function checkPlayer({ data, file, teamName, player, errors, warnings, suspiciousPlayers, fieldsToReview }) {
  const label = playerLabel(teamName, player);
  const minutes = numberOrNull(player.minutes);
  const minuteIn = numberOrNull(player.minuteIn);
  const shots = numberOrNull(player.shots);
  const shotsOnTarget = numberOrNull(player.shotsOnTarget);
  const goals = numberOrNull(player.goals);
  const yellowCards = numberOrNull(player.yellowCards);
  const redCards = numberOrNull(player.redCards);
  const hasProviderCandidates = Array.isArray(player.providerCandidates) && player.providerCandidates.length > 0;

  if (minutes === null) {
    warnings.push(issue("warning", file, data.matchId, "Minuti null.", { player: label, field: "minutes" }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("minutes");
  }

  if (player.starter === true && minutes !== null && minutes <= 0) {
    errors.push(issue("error", file, data.matchId, "Titolare con minutes <= 0.", { player: label, minutes }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("starter/minutes");
  }

  if (player.starter === false && minutes !== null && minutes > 0 && minuteIn === null) {
    warnings.push(issue("warning", file, data.matchId, "Subentrato con minuti > 0 ma minuteIn non valorizzato.", {
      player: label,
      minutes,
      minuteIn
    }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("minuteIn");
  }

  if (player.starter === false && minutes === 0 && minuteIn !== null) {
    warnings.push(issue("warning", file, data.matchId, "Non utilizzato con minuteIn valorizzato.", {
      player: label,
      minutes,
      minuteIn
    }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("minuteIn/minutes");
  }

  if (player.starter === null && hasProviderCandidates) {
    warnings.push(issue("warning", file, data.matchId, "Starter null per giocatore presente nel merged.", {
      player: label,
      field: "starter"
    }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("starter");
  }

  if (shots !== null && shotsOnTarget !== null && shotsOnTarget > shots) {
    errors.push(issue("error", file, data.matchId, "Tiri in porta maggiori dei tiri totali.", {
      player: label,
      shots,
      shotsOnTarget
    }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("shots/shotsOnTarget");
  }

  if (goals !== null && shotsOnTarget !== null && goals > shotsOnTarget) {
    errors.push(issue("error", file, data.matchId, "Gol maggiori dei tiri in porta.", {
      player: label,
      goals,
      shotsOnTarget,
      note: "Possibile autogol o dato da verificare manualmente."
    }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("goals/shotsOnTarget");
  }

  if (yellowCards === null) {
    warnings.push(issue("warning", file, data.matchId, "Cartellini gialli null.", { player: label, field: "yellowCards" }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("yellowCards");
  }

  if (redCards === null) {
    warnings.push(issue("warning", file, data.matchId, "Cartellini rossi null.", { player: label, field: "redCards" }));
    suspiciousPlayers.add(label);
    fieldsToReview.add("redCards");
  }
}

function validateFile(file) {
  const filePath = path.join(mergedDir, file);
  const data = readJson(filePath);
  const errors = [];
  const warnings = [];
  const suspiciousPlayers = new Set();
  const fieldsToReview = new Set();
  const score = parseScore(data.score);

  if (!score) {
    errors.push(issue("error", file, data.matchId, "Risultato non parsabile.", { score: data.score }));
    fieldsToReview.add("score");
  } else {
    checkTeamGoals({ data, file, score, errors });
    checkTeamAssists({ data, file, score, warnings });
  }

  for (const [teamName, team] of Object.entries(data.teams || {})) {
    for (const player of team.players || []) {
      checkPlayer({ data, file, teamName, player, errors, warnings, suspiciousPlayers, fieldsToReview });
    }
  }

  return {
    file,
    matchId: data.matchId || null,
    match: `${data.homeTeam || "n/d"} ${data.score || "n/d"} ${data.awayTeam || "n/d"}`,
    provider: data.provider || null,
    completion: data.completion ?? null,
    errors,
    warnings,
    suspiciousPlayers: [...suspiciousPlayers].sort((a, b) => a.localeCompare(b, "it")),
    fieldsToReview: [...fieldsToReview].sort((a, b) => a.localeCompare(b, "it"))
  };
}

function markdownList(items, emptyText) {
  if (!items.length) return `- ${emptyText}\n`;
  return items.map((item) => {
    const details = Object.entries(item)
      .filter(([key]) => !["type", "file", "matchId", "message"].includes(key))
      .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
      .join("; ");
    return `- ${item.file} / ${item.matchId}: ${item.message}${details ? ` (${details})` : ""}`;
  }).join("\n") + "\n";
}

function renderMarkdown(report) {
  const lines = [
    "# Player Stats Validation Report",
    "",
    `Generato: ${report.generatedAt}`,
    "",
    "## Riepilogo",
    "",
    `- File controllati: ${report.summary.filesChecked}`,
    `- Errori trovati: ${report.summary.errors}`,
    `- Warning trovati: ${report.summary.warnings}`,
    "",
    "## File controllati",
    "",
    ...report.files.map((file) => `- ${file.file}: ${file.match} (completion ${file.completion}%)`),
    "",
    "## Errori",
    "",
    markdownList(report.errors, "Nessun errore trovato.").trimEnd(),
    "",
    "",
    "## Warning",
    "",
    markdownList(report.warnings, "Nessun warning trovato.").trimEnd(),
    "",
    "",
    "## Giocatori sospetti",
    "",
    report.suspiciousPlayers.length
      ? report.suspiciousPlayers.map((player) => `- ${player}`).join("\n")
      : "- Nessun giocatore sospetto.",
    "",
    "",
    "## Campi da correggere manualmente",
    "",
    report.fieldsToReview.length
      ? report.fieldsToReview.map((field) => `- ${field}`).join("\n")
      : "- Nessun campo da correggere manualmente.",
    ""
  ];
  return lines.join("\n");
}

function main() {
  if (!fs.existsSync(mergedDir)) throw new Error(`Cartella merged non trovata: ${mergedDir}`);
  const files = fs.readdirSync(mergedDir)
    .filter((file) => file.toLowerCase().endsWith(".json"))
    .sort((a, b) => a.localeCompare(b, "it"));

  const fileReports = files.map(validateFile);
  const errors = fileReports.flatMap((file) => file.errors);
  const warnings = fileReports.flatMap((file) => file.warnings);
  const suspiciousPlayers = [...new Set(fileReports.flatMap((file) => file.suspiciousPlayers))].sort((a, b) => a.localeCompare(b, "it"));
  const fieldsToReview = [...new Set(fileReports.flatMap((file) => file.fieldsToReview))].sort((a, b) => a.localeCompare(b, "it"));

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      filesChecked: files.length,
      errors: errors.length,
      warnings: warnings.length,
      suspiciousPlayers: suspiciousPlayers.length,
      fieldsToReview: fieldsToReview.length
    },
    files: fileReports,
    errors,
    warnings,
    suspiciousPlayers,
    fieldsToReview
  };

  writeJson(jsonReportPath, report);
  writeText(markdownReportPath, renderMarkdown(report));

  console.log(`Validation report JSON: ${jsonReportPath}`);
  console.log(`Validation report MD: ${markdownReportPath}`);
  console.log(`files=${report.summary.filesChecked} errors=${report.summary.errors} warnings=${report.summary.warnings}`);
}

if (require.main === module) main();
