const fs = require("fs");
const path = require("path");
const vm = require("vm");

const rootDirectory = path.resolve(__dirname, "..");
const renderer = fs.readFileSync(path.join(rootDirectory, "js", "round-of-16-readings.js"), "utf8");
const allSlugs = [
  "canada-marocco",
  "paraguay-francia",
  "brasile-norvegia",
  "messico-inghilterra",
  "portogallo-spagna",
  "stati-uniti-belgio",
  "argentina-egitto",
  "svizzera-colombia",
  "francia-marocco",
];
const requestedSlugs = process.argv.slice(2);
const slugs = requestedSlugs.length ? allSlugs.filter(slug => requestedSlugs.includes(slug)) : allSlugs;

function market(markets, info, selection) {
  return markets.find(item => item.info === info && item.esito === selection);
}

function quotePanels(slug) {
  const quote = JSON.parse(fs.readFileSync(path.join(rootDirectory, "data", "quote", `${slug}-quote.json`), "utf8"));
  const myCombo = JSON.parse(fs.readFileSync(path.join(rootDirectory, "data", "mycombo", `${slug}.json`), "utf8"));
  const requested = [
    ["1", "ESITO FINALE 1X2", "1"],
    ["X", "ESITO FINALE 1X2", "X"],
    ["2", "ESITO FINALE 1X2", "2"],
    ["Under 2,5", "U/O 2.5", "UNDER"],
    ["Over 2,5", "U/O 2.5", "OVER"],
    ["No Goal", "GOAL/NO GOAL", "NOGOAL"],
    ["Goal", "GOAL/NO GOAL", "GOAL"],
  ];
  const quoteRows = requested.map(([label, info, selection]) => {
    const found = market(quote.markets, info, selection);
    return found ? `<div><dt>${label}</dt><dd>${Number(found.quota).toFixed(2)}</dd></div>` : "";
  }).join("");
  const comboRows = myCombo.portfolios.map(portfolio => {
    const selections = portfolio.events.map(event => `${event.selection} ${event.market.split("—").pop().trim()}`).join(" · ");
    return `<div><b>${portfolio.name} <em>@ ${Number(portfolio.finalOdds).toFixed(2)}</em></b><small>${selections}</small></div>`;
  }).join("");
  const anomalies = myCombo.quoteErrorAnalysis?.events || [];
  const anomalyRows = anomalies.length
    ? anomalies.map(item => `<li><b>${item.label || `${item.event}: ${item.selection}`} @ ${Number(item.odds).toFixed(2)}</b><span>Stima Codex ${Number(item.estimatedProbability).toFixed(2)}% · probabilità implicita ${Number(item.impliedProbability).toFixed(2)}% · vantaggio +${Number(item.edge).toFixed(2)} punti</span><small>${item.reason}</small></li>`).join("")
    : "<li>Nessun possibile errore di quota rilevato.</li>";
  return `
    <section class="reading-data-panel"><span>Quote ricevute</span><dl class="reading-stat-list">${quoteRows}</dl></section>
    <section class="reading-data-panel"><span>MyCombo · quote aggiornate</span><div class="reading-mycombo">${comboRows}</div></section>
    <section class="reading-data-panel"><span>3 possibili errori di quota · tutti sopra 3,00</span><ul class="reading-picks">${anomalyRows}</ul></section>`;
}

for (const slug of slugs) {
  const article = {
    dataset: { roundOf16Match: slug },
    innerHTML: "",
  };
  const document = {
    querySelector(selector) {
      return selector === "[data-round-of-16-match]" ? article : null;
    },
    title: "",
  };
  vm.runInNewContext(renderer, { document });
  if (
    !article.innerHTML.includes("Verdetto") ||
    !(article.innerHTML.includes("Probabili Formazioni") || article.innerHTML.includes("Formazioni ufficiali"))
  ) {
    throw new Error(`${slug}: contenuto incompleto.`);
  }

  article.innerHTML = article.innerHTML.replace("</aside>", `${quotePanels(slug)}</aside>`);
  const pagePath = path.join(rootDirectory, "letture", `lettura-${slug}.html`);
  let page = fs.readFileSync(pagePath, "utf8");
  if (!page.includes('class="page-links"')) {
    const navigation = `<nav class="page-links" aria-label="Sezioni">
      <a class="page-link" href="index.html">Home</a>
      <a class="page-link" href="convocati.html">Convocati</a>
      <a class="page-link" href="player.html">Player</a>
      <a class="page-link" href="statistiche-squadre.html">Statistiche squadre</a>
      <a class="page-link" href="arbitri.html">Arbitri</a>
      <div class="nav-dropdown"><span class="page-link nav-dropdown-toggle active">Pronostico <span class="nav-caret">&#9662;</span></span><div class="nav-dropdown-menu"><a class="page-link" href="pronostico-codex.html">Pronostico Codex</a><a class="page-link active" href="lettura.html">Lettura</a></div></div>
      <a class="page-link" href="storia.html">Storia</a>
      <a class="page-link utility-link" href="metodo-fonti.html">Metodo e fonti</a>
    </nav>`;
    page = page.replace("</header><main", `${navigation}</header><main`);
  }
  page = page.replace(
    /<article class="reading-article" data-round-of-16-match="[^"]+">[\s\S]*<\/article><\/main>/,
    `<article class="reading-article" data-round-of-16-match="${slug}">${article.innerHTML}</article></main>`
  );
  page = page.replace(/<script src="js\/round-of-16-readings\.js[^"]*"><\/script>/, "");
  page = page.replace(/[ \t]+$/gm, "");
  fs.writeFileSync(pagePath, page, "utf8");
  console.log(`${slug}: lettura incorporata nell'HTML.`);
}
