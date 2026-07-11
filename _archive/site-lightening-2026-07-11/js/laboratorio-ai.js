(() => {
  const DATA_ROOT = "data/quote/";
  const categories = [
    ["esito", "Esito"],
    ["goal", "Goal / Under-Over"],
    ["corner", "Corner"],
    ["cartellini", "Cartellini"],
    ["tiri", "Tiri"],
    ["giocatori", "Giocatori"],
    ["combo", "Combo"],
  ];

  const list = document.querySelector("#lab-match-list");
  const count = document.querySelector("#lab-file-count");
  const errorBox = document.querySelector("#lab-error");
  const analysis = document.querySelector("#lab-analysis");
  const analysisMatch = document.querySelector("#lab-analysis-match");
  const analysisMeta = document.querySelector("#lab-analysis-meta");
  const tabs = document.querySelector("#lab-category-tabs");
  const tableBody = document.querySelector("#lab-table-body");
  const empty = document.querySelector("#lab-empty-category");
  const closeButton = document.querySelector("#lab-close-analysis");
  const datasets = new Map();
  let activeDataset = null;

  function text(value) {
    return value === undefined || value === null || value === "" ? "—" : String(value);
  }

  function escapeHtml(value) {
    return text(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function clearError() {
    errorBox.hidden = true;
    errorBox.textContent = "";
  }

  function validateDataset(data, filename) {
    if (!data || typeof data !== "object" || !Array.isArray(data.markets)) {
      throw new Error(`${filename}: struttura JSON non valida o proprietà "markets" mancante.`);
    }
    if (!data.match || !data.date || !Number.isFinite(Number(data.totalMarkets))) {
      throw new Error(`${filename}: match, date o totalMarkets mancanti/non validi.`);
    }
    return data;
  }

  function categoryFor(market) {
    const value = `${text(market.mercato)} ${text(market.info)}`.toUpperCase();
    if (value.includes("COMBO")) return "combo";
    if (value.includes("CORNER") || value.includes("ANGOLO")) return "corner";
    if (value.includes("CARTELL") || value.includes("AMMON")) return "cartellini";
    if (value.includes("TIR")) return "tiri";
    if (
      value.includes("MARCATORE") || value.includes("ASSIST") ||
      value.includes("GIOCATORE") || value.includes("FALLI COMMESSI") ||
      value.includes("FUORIGIOCO GIOCATORE")
    ) return "giocatori";
    if (
      value.includes("GOAL") || value.includes("NOGOAL") ||
      value.includes("NO GOAL") || value.includes("UNDER/OVER") ||
      value.includes("U/O ") || value.includes("MULTIGOL")
    ) return "goal";
    return "esito";
  }

  function groupedMarkets(data) {
    const grouped = Object.fromEntries(categories.map(([id]) => [id, []]));
    data.markets.forEach(market => grouped[categoryFor(market)].push(market));
    return grouped;
  }

  function renderTable(category) {
    const markets = activeDataset?._grouped?.[category] || [];
    tableBody.innerHTML = markets.map(market => `
      <tr>
        <td>${escapeHtml(market.mercato)}</td>
        <td>${escapeHtml(market.info)}</td>
        <td>${escapeHtml(market.esito)}</td>
        <td class="lab-odd">${escapeHtml(market.quota)}</td>
        <td class="lab-id">${escapeHtml(market.selectionId)}</td>
      </tr>
    `).join("");
    empty.hidden = markets.length > 0;
    tabs.querySelectorAll("button").forEach(button => {
      const selected = button.dataset.category === category;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-selected", String(selected));
    });
  }

  async function loadDataset(filename) {
    if (datasets.has(filename)) return datasets.get(filename);
    const response = await fetch(`${DATA_ROOT}${filename}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`File non trovato (${response.status}): ${DATA_ROOT}${filename}`);
    const data = validateDataset(await response.json(), filename);
    data._grouped = groupedMarkets(data);
    datasets.set(filename, data);
    return data;
  }

  async function analyze(filename) {
    clearError();
    analysisMatch.textContent = "Caricamento…";
    analysisMeta.textContent = "Il file quote viene letto solo su richiesta.";
    analysis.hidden = false;
    let data;
    try {
      data = await loadDataset(filename);
    } catch (error) {
      showError(error.message);
      analysis.hidden = true;
      return;
    }
    activeDataset = data;
    analysisMatch.textContent = data.match;
    analysisMeta.textContent = `${data.date} · ${Number(data.totalMarkets).toLocaleString("it-IT")} quote dichiarate · ${data.markets.length.toLocaleString("it-IT")} record letti`;
    tabs.innerHTML = categories.map(([id, label], index) => `
      <button type="button" role="tab" data-category="${id}" aria-selected="${index === 0}">
        ${escapeHtml(label)} <strong>${data._grouped[id].length.toLocaleString("it-IT")}</strong>
      </button>
    `).join("");
    tabs.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => renderTable(button.dataset.category));
    });
    analysis.hidden = false;
    renderTable("esito");
    analysis.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function renderMatches(files) {
    count.textContent = `${files.length} ${files.length === 1 ? "partita" : "partite"}`;
    list.innerHTML = files.map(filename => `
        <article class="lab-match-card">
          <span>Dataset disponibile</span>
          <h3>${escapeHtml(filename.replace(/-quote\.json$/i, "").replaceAll("-", " "))}</h3>
          <p>Il JSON completo non viene scaricato finché non premi Analizza.</p>
          <button type="button" data-file="${escapeHtml(filename)}">Analizza</button>
        </article>`).join("");
    list.querySelectorAll("button").forEach(button => {
      button.addEventListener("click", () => analyze(button.dataset.file));
    });
  }

  async function init() {
    try {
      clearError();
      const indexResponse = await fetch(`${DATA_ROOT}index.json`, { cache: "no-store" });
      if (!indexResponse.ok) throw new Error(`Indice file non trovato (${indexResponse.status}): ${DATA_ROOT}index.json`);
      const index = await indexResponse.json();
      if (!Array.isArray(index.files)) throw new Error(`Indice non valido: ${DATA_ROOT}index.json`);

      renderMatches(index.files);
    } catch (error) {
      count.textContent = "Errore";
      showError(error.message);
    }
  }

  closeButton.addEventListener("click", () => {
    analysis.hidden = true;
    activeDataset = null;
  });

  init();
})();
