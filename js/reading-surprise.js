const readingSurpriseMatches = {
  "lettura-sudafrica-canada.html": {
    underdog: "Sudafrica",
    factors: { equilibrium: 63, form: 42, motivation: 48, absences: 15, turnover: 15, style: 58, pressure: 72, referee: 46 },
    bonuses: [{ value: 2, reason: "partita a eliminazione diretta" }],
  },
  "lettura-brasile-giappone.html": {
    underdog: "Giappone",
    factors: { equilibrium: 64, form: 62, motivation: 32, absences: 15, turnover: 20, style: 68, pressure: 92, referee: 48 },
    bonuses: [{ value: 2, reason: "partita a eliminazione diretta" }],
  },
  "lettura-germania-paraguay.html": {
    underdog: "Paraguay",
    factors: { equilibrium: 39, form: 30, motivation: 34, absences: 15, turnover: 15, style: 42, pressure: 88, referee: 44 },
    bonuses: [{ value: 2, reason: "partita a eliminazione diretta" }],
  },
  "lettura-olanda-marocco.html": {
    underdog: "Marocco",
    factors: { equilibrium: 83, form: 68, motivation: 50, absences: 32, turnover: 20, style: 72, pressure: 76, referee: 82 },
    bonuses: [
      { value: 2, reason: "partita a eliminazione diretta" },
      { value: 2, reason: "alta probabilità di equilibrio fino ai rigori" },
    ],
  },
  "lettura-costa-avorio-norvegia.html": {
    underdog: "Costa d'Avorio",
    factors: { equilibrium: 84, form: 72, motivation: 50, absences: 15, turnover: 20, style: 69, pressure: 62, referee: 25 },
    bonuses: [
      { value: 2, reason: "partita a eliminazione diretta" },
      { value: 2, reason: "alta probabilità di equilibrio fino ai rigori" },
    ],
  },
  "lettura-francia-svezia.html": {
    underdog: "Svezia",
    factors: { equilibrium: 36, form: 22, motivation: 18, absences: 15, turnover: 22, style: 34, pressure: 86, referee: 25 },
    bonuses: [{ value: 2, reason: "partita a eliminazione diretta" }],
  },
  "lettura-messico-ecuador.html": {
    underdog: "Ecuador",
    factors: { equilibrium: 79, form: 58, motivation: 24, absences: 15, turnover: 18, style: 67, pressure: 96, referee: 25 },
    bonuses: [
      { value: 5, reason: "altitudine elevata di Città del Messico" },
      { value: 2, reason: "partita a eliminazione diretta" },
    ],
  },
  "lettura-inghilterra-rd-congo.html": {
    underdog: "RD Congo",
    factors: { equilibrium: 34, form: 31, motivation: 26, absences: 15, turnover: 16, style: 45, pressure: 98, referee: 25 },
    bonuses: [{ value: 2, reason: "partita a eliminazione diretta" }],
  },
  "lettura-belgio-senegal.html": {
    underdog: "Senegal",
    factors: { equilibrium: 83, form: 36, motivation: 36, absences: 15, turnover: 20, style: 66, pressure: 84, referee: 25 },
    bonuses: [
      { value: 2, reason: "partita a eliminazione diretta" },
      { value: 2, reason: "alta probabilità di equilibrio fino ai rigori" },
    ],
  },
  "lettura-stati-uniti-bosnia-erzegovina.html": {
    underdog: "Bosnia-Erzegovina",
    factors: { equilibrium: 43, form: 32, motivation: 26, absences: 52, turnover: 22, style: 47, pressure: 94, referee: 25 },
    bonuses: [{ value: 2, reason: "partita a eliminazione diretta" }],
  },
  "lettura-spagna-austria.html": {
    underdog: "Austria",
    factors: { equilibrium: 31, form: 34, motivation: 24, absences: 15, turnover: 18, style: 40, pressure: 82, referee: 25 },
    bonuses: [{ value: 2, reason: "partita a eliminazione diretta" }],
  },
  "lettura-portogallo-croazia.html": {
    underdog: "Croazia",
    factors: { equilibrium: 70, form: 45, motivation: 40, absences: 15, turnover: 20, style: 72, pressure: 92, referee: 25 },
    bonuses: [
      { value: 2, reason: "partita a eliminazione diretta" },
      { value: 2, reason: "alta probabilità di equilibrio fino ai rigori" },
    ],
  },
};

function readingClamp(value, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function readingSurpriseLabel(value) {
  if (value <= 20) return "Partita molto prevedibile";
  if (value <= 40) return "Sorpresa possibile ma poco probabile";
  if (value <= 60) return "Gara aperta";
  if (value <= 80) return "Alto rischio sorpresa";
  return "Partita caotica e imprevedibile";
}

function calculateSurpriseFactor(match) {
  const factor = match.factors;
  const base = factor.equilibrium * 0.25 +
    factor.form * 0.20 +
    factor.motivation * 0.15 +
    factor.absences * 0.10 +
    factor.turnover * 0.10 +
    factor.style * 0.10 +
    factor.pressure * 0.05 +
    factor.referee * 0.05;
  const bonusTotal = (match.bonuses || []).reduce((sum, bonus) => sum + bonus.value, 0);
  const malusTotal = (match.maluses || []).reduce((sum, malus) => sum - Math.abs(malus.value), 0);
  const value = Math.round(readingClamp(base + bonusTotal + malusTotal));
  const upset = Math.round(readingClamp(
    factor.equilibrium * 0.35 + factor.form * 0.30 + factor.motivation * 0.20 + factor.style * 0.15
  ));
  const chaos = Math.round(readingClamp(
    factor.referee * 0.30 + factor.pressure * 0.25 + factor.absences * 0.15 +
      factor.turnover * 0.15 + factor.style * 0.15 + bonusTotal
  ));
  return { ...match, value, base: Math.round(base), bonusTotal, malusTotal, upset, chaos, label: readingSurpriseLabel(value) };
}

function readingSurpriseExplanation(result) {
  const descriptions = {
    equilibrium: "la gara è equilibrata",
    form: "la sfavorita presenta una forma competitiva",
    motivation: "le motivazioni riducono il divario",
    absences: "le assenze aumentano l'incertezza",
    turnover: "il turnover rende meno stabili le gerarchie",
    style: "l'incrocio tattico può ostacolare la favorita",
    pressure: "la pressione sulla favorita può pesare",
    referee: "arbitro ed episodi possono incidere",
  };
  const strongest = Object.entries(result.factors)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => descriptions[key]);
  return `Il rischio sorpresa è ${result.value >= 61 ? "alto" : result.value >= 41 ? "concreto" : "contenuto"} perché ${strongest.join(", ")}.`;
}

function readingSurpriseMetric(label, value, detail) {
  return `
    <div class="reading-surprise-metric">
      <span>${label}</span><b>${value}/100</b>
      <div><i style="width:${value}%"></i></div>
      <small>${detail}</small>
    </div>`;
}

function renderReadingSurprise() {
  const filename = location.pathname.split("/").pop() || "";
  const config = readingSurpriseMatches[filename];
  const summary = document.querySelector(".reading-summary");
  if (!config || !summary) return;
  const result = calculateSurpriseFactor(config);
  const panel = document.createElement("section");
  panel.className = "reading-surprise-panel";
  panel.innerHTML = `
    <div class="reading-surprise-head">
      <div><span>Indicatore dinamico</span><strong>Fattore Sorpresa</strong><small>${result.label}</small></div>
      <b>${result.value}<small>/100</small></b>
    </div>
    <div class="reading-surprise-progress" role="progressbar" aria-label="Fattore Sorpresa" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${result.value}">
      <i style="width:${result.value}%"></i>
    </div>
    <div class="reading-surprise-metrics">
      ${readingSurpriseMetric("Potenziale Upset", result.upset, `Possibile vittoria di ${result.underdog}`)}
      ${readingSurpriseMetric("Indice Caos", result.chaos, "Episodi, pressione e variabili")}
    </div>
    <p>${readingSurpriseExplanation(result)}</p>
    ${result.bonusTotal ? `<p class="reading-surprise-adjustment">Il Fattore Sorpresa aumenta per ${(result.bonuses || []).map((bonus) => bonus.reason).join(", ")}. <b>+${result.bonusTotal}</b></p>` : ""}
    <div class="reading-surprise-factors">
      ${Object.entries(result.factors).map(([key, value]) => `<span>${key} <b>${value}</b></span>`).join("")}
    </div>`;
  summary.insertAdjacentElement("afterend", panel);
}

renderReadingSurprise();

if (!document.querySelector('script[data-mycombo-export]')) {
  const myComboScript = document.createElement("script");
  myComboScript.src = "js/mycombo-export.js?v=20260629-4";
  myComboScript.dataset.mycomboExport = "true";
  document.head.appendChild(myComboScript);
}
