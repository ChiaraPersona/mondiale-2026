(function () {
  "use strict";

  const fold = (value) => String(value || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const slug = (value) => fold(value).replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
  const clean = (value) => String(value || "").replace(/\s+/g, " ").trim();
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const firstValue = (source, keys) => keys.map((key) => source?.[key]).find((value) => value !== undefined && value !== null && value !== "");
  const displayValue = (value, suffix = "") => value === undefined || value === null || value === "" ? "n.d." : `${escapeHtml(value)}${suffix}`;

  function matchName() {
    return clean(document.querySelector(".reading-versus b")?.textContent || document.title.replace(/^Lettura\s*-\s*/i, ""));
  }

  function pageSlug() {
    const fileName = decodeURIComponent(window.location.pathname.split("/").pop() || "");
    const match = fileName.match(/^lettura-(.+)\.html$/i);
    return match ? match[1].toLowerCase() : "";
  }

  function scenarioText() {
    const headline = clean(document.querySelector(".reading-hero h2")?.textContent);
    const deck = clean(document.querySelector(".reading-deck")?.textContent);
    const text = [headline, deck].filter(Boolean).join(" ");
    return text.length > 260 ? `${text.slice(0, 257).replace(/\s+\S*$/, "")}...` : text;
  }

  function teamContext(match) {
    const teams = match.split(/\s+-\s+/).map(clean);
    return { home: teams[0] || "Squadra 1", away: teams[1] || "Squadra 2" };
  }

  function sourcePicks() {
    return [...document.querySelectorAll(".reading-picks li")].map((item) => {
      const key = clean(item.querySelector("b")?.textContent);
      const clone = item.cloneNode(true);
      clone.querySelector("b")?.remove();
      return { key, value: clean(clone.textContent), source: clean(item.textContent) };
    });
  }

  function confidence(key, category) {
    const base = /principale/i.test(key) ? 76 : /prudente/i.test(key) ? 73 : /alternativa/i.test(key) ? 62 : 68;
    const adjustment = category === "Gol" ? 2 : category.includes("Tiri") ? -3 : category.includes("Cartellini") ? -4 : 0;
    return Math.max(0, Math.min(100, base + adjustment));
  }

  function sideToken(label, teams, prefix) {
    const normalized = fold(label);
    if (normalized.includes(fold(teams.home))) return `${prefix} 1`;
    if (normalized.includes(fold(teams.away))) return `${prefix} 2`;
    return "";
  }

  function parsePick(pick, teams) {
    const text = clean(pick.value);
    const normalized = fold(text);
    if (!text || /risultato|marcatore|minuto|primo tempo/i.test(normalized)) return null;

    let match;
    if ((match = text.match(/\b(under|over)\s*(\d+(?:[.,]\d+)?)\b/i))) {
      const direction = match[1].toUpperCase();
      const line = match[2].replace(",", ".");
      return event(`${direction} ${line} gol`, [`U/O ${line}`, direction], "Gol", `La soglia è indicata esplicitamente tra le giocate dello studio (${pick.source}).`, pick);
    }
    if (/\bno\s*goal\b/i.test(text)) {
      return event("No Goal", ["GOAL/NO GOAL", "NO GOAL"], "Goal/No Goal", `Lo studio indica No Goal tra le giocate (${pick.source}).`, pick);
    }
    if (/^goal$/i.test(text)) {
      return event("Goal", ["GOAL/NO GOAL", "GOAL"], "Goal/No Goal", `Lo studio indica Goal tra le giocate (${pick.source}).`, pick);
    }
    if ((match = text.match(/\b(1X|X2|12)\b/i)) || /doppia chance/i.test(text)) {
      const outcome = match ? match[1].toUpperCase() : text.replace(/.*doppia chance\s*/i, "").trim().toUpperCase();
      if (!/^(1X|X2|12)$/.test(outcome)) return null;
      return event(`Doppia chance ${outcome}`, ["DOPPIA CHANCE", outcome], "Doppia chance", `La copertura è consigliata esplicitamente nello studio (${pick.source}).`, pick);
    }
    if (/passa il turno|qualificat/i.test(text)) {
      const team = normalized.includes(fold(teams.away)) ? teams.away : teams.home;
      const outcome = team === teams.away ? "2" : "1";
      return event(`${team} passa il turno`, ["PASSAGGIO TURNO", outcome], "Passaggio turno", `La qualificazione è una giocata esplicita dello studio (${pick.source}).`, pick);
    }
    if ((match = text.match(/^(.+?)\s+(\d+)\+?\s+tiri(?:\s+in porta)?/i))) {
      const player = clean(match[1]);
      const amount = match[2];
      const onTarget = /in porta/i.test(text);
      return event(`${player} almeno ${amount} ${onTarget ? "tiri in porta" : "tiri totali"}`, [player.toUpperCase(), `ALMENO ${amount}`, onTarget ? "TIRI IN PORTA" : "TIRI TOT"], onTarget ? "Tiri in porta giocatore" : "Tiri giocatore", `Volume indicato esplicitamente nella sezione tiri/giocate (${pick.source}).`, pick);
    }
    if (/corner|calci d.angolo/i.test(text)) {
      const side = sideToken(text, teams, "TEAM");
      if (!side) return null;
      const team = side.endsWith("1") ? teams.home : teams.away;
      return event(`${team} prima a 2 corner`, ["PRIMA A 2 CALCI D'ANGOLO", side], "Corner squadra", `Il vantaggio sui corner è indicato tra le giocate dello studio (${pick.source}).`, pick);
    }
    if (/cartellin|ammonit/i.test(text)) {
      const side = sideToken(text, teams, "SQUADRA");
      if (!side) return null;
      const team = side.endsWith("1") ? teams.home : teams.away;
      return event(`${team} over punti cartellini`, [side, "CARTELLINI", "OVER"], "Cartellini squadra", `La pressione disciplinare della squadra emerge dallo studio (${pick.source}).`, pick);
    }
    return null;
  }

  function event(label, search, category, reason, pick) {
    const probability = confidence(pick.key, category);
    const maxOdd = category === "Gol" ? 1.8 : category.includes("Tiri") ? 2 : category.includes("Cartellini") ? 1.9 : 1.85;
    return { id: slug(label), label, search, probability, maxOdd, category, reason };
  }

  function generateStudy() {
    const match = matchName();
    const teams = teamContext(match);
    const seen = new Set();
    const events = sourcePicks().map((pick) => parsePick(pick, teams)).filter((item) => {
      if (!item || seen.has(item.id)) return false;
      seen.add(item.id);
      return true;
    });
    return { match, scenario: scenarioText(), events };
  }

  function exportPayload(study) {
    return {
      match: study.match,
      scenario: study.scenario,
      events: study.events.map(({ id, label, search, probability, maxOdd }) => ({ id, label, search, probability, maxOdd })),
    };
  }

  function downloadStudy(study) {
    const blob = new Blob([`${JSON.stringify(exportPayload(study), null, 2)}\n`], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "events-target.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function selectionValue(selection) {
    return Number(firstValue(selection, ["value", "valueStimato", "estimatedValue"]));
  }

  let activeSettlement = {};
  const viewerDebug = {
    slug: null,
    url: null,
    requested: false,
    status: null,
    parsed: false,
    rendered: false,
    error: null,
  };

  function updateDebug(values) {
    Object.assign(viewerDebug, values);
    window.MyComboViewerDebug = { ...viewerDebug };
    document.documentElement.dataset.mycomboDebug = JSON.stringify(viewerDebug);
    if (new URLSearchParams(window.location.search).has("debugMyCombo")) {
      console.info("[MyCombo Viewer]", window.MyComboViewerDebug);
    }
  }

  function readableMarket(value) {
    const parts = clean(value).split(/\s+—\s+/).filter(Boolean);
    if (parts.length === 2 && fold(parts[0]) === fold(parts[1])) return parts[0];
    return parts.join(" · ") || clean(value);
  }

  function selectionCard(selection, reason = "") {
    if (!selection || typeof selection !== "object") {
      return `<li class="mycombo-selection"><strong>${escapeHtml(selection || "Selezione non disponibile")}</strong></li>`;
    }
    const market = firstValue(selection, ["mercato", "market", "marketName"]);
    const outcome = firstValue(selection, ["esito", "outcome", "selection"]);
    const odd = firstValue(selection, ["odds", "quota", "odd", "price"]);
    const category = firstValue(selection, ["category", "categoria"]);
    const eventClass = firstValue(selection, ["class", "classe"]);
    const riskScore = Number(firstValue(selection, ["riskScore"]));
    const riskLevel = firstValue(selection, ["riskLevel"]);
    const eventId = firstValue(selection, ["eventId", "id"]);
    const settled = activeSettlement[eventId] || {};
    const settledLabel = settled.status === "won" ? "PRESA" : settled.status === "lost" ? "ERRATA" : "DA VERIFICARE";
    const settledTone = settled.status === "won" ? "is-won" : settled.status === "lost" ? "is-lost" : "is-pending";
    return `
      <li class="mycombo-selection ${settledTone}">
        <div class="mycombo-selection-title">
          <div>
            <span class="mycombo-market-label">Mercato</span>
            <strong>${escapeHtml(readableMarket(market))}</strong>
          </div>
          <div class="mycombo-selection-badges">
            ${category ? `<span class="mycombo-category-badge">${escapeHtml(category)}</span>` : ""}
            ${eventClass ? `<span class="mycombo-class-badge is-${escapeHtml(fold(eventClass))}">${escapeHtml(eventClass)}</span>` : ""}
            ${Number.isFinite(riskScore) ? `<span class="mycombo-risk-badge is-${escapeHtml(riskLevel || "medium")}">Rischio ${escapeHtml(riskScore)}/100</span>` : ""}
            ${settled.status === "won" || settled.status === "lost" ? `<span class="mycombo-result-badge ${settledTone}">${settledLabel}</span>` : ""}
          </div>
        </div>
        <div class="mycombo-pick-line">
          <div><span>Esito</span><strong>${escapeHtml(outcome)}</strong></div>
          <div><span>Quota</span><strong>${escapeHtml(odd)}</strong></div>
        </div>
        ${reason ? `<p class="mycombo-pick-reason"><span>Perché è stata scelta</span>${escapeHtml(reason)}</p>` : ""}
        ${riskLevel === "high" ? '<p class="mycombo-risk-warning">⚠ Evento ad alto rischio</p>' : ""}
        ${settled.evidence ? `<p class="mycombo-settlement-note">${escapeHtml(settled.evidence)}</p>` : ""}
      </li>`;
  }

  function comboCard(title, target, combo) {
    if (!combo || typeof combo !== "object") {
      return `
        <article class="mycombo-final-card">
          <header><div><span>Quota target ${target}</span><h4>${title}</h4></div><strong>n.d.</strong></header>
          <p class="mycombo-combo-empty">Combinazione non presente nel file.</p>
        </article>`;
    }
    if (!Array.isArray(combo.selections) || !combo.selections.length) {
      return `
        <article class="mycombo-final-card">
          <header><div><span>Quota target ${target}</span><h4>${title}</h4></div><strong><small>Quota trovata</small>non disponibile</strong></header>
          <p class="mycombo-target-note">${escapeHtml(combo.reason || "Nessuna combinazione compatibile disponibile.")}</p>
        </article>`;
    }
    const found = firstValue(combo, ["quotaTotale", "totalOdd", "quota"]);
    const foundNumber = Number(found);
    const missedTarget = Number.isFinite(foundNumber) && Math.abs(foundNumber - target) > 0.01;
    const selections = Array.isArray(combo.selections) ? combo.selections : [];
    const settledSelections = selections.map(selection => activeSettlement[selection?.eventId]).filter(Boolean);
    const comboLost = settledSelections.some(result => result.status === "lost");
    const comboWon = settledSelections.length === selections.length && settledSelections.every(result => result.status === "won");
    const comboResult = comboLost ? "PERSA" : comboWon ? "VINTA" : "DA VERIFICARE";
    const comboTone = comboLost ? "is-lost" : comboWon ? "is-won" : "is-pending";
    return `
      <article class="mycombo-final-card ${comboTone}">
        <header>
          <div><span>Quota target ${target}</span><h4>${title}</h4></div>
          <strong><small>${comboResult} · Quota trovata</small>${displayValue(found)}</strong>
        </header>
        ${missedTarget ? `<p class="mycombo-target-note">Quota target ${target}, quota trovata ${escapeHtml(found)}</p>` : ""}
        <ol class="mycombo-selections">${selections.map(selectionCard).join("") || '<li class="mycombo-combo-empty">Nessuna selezione presente.</li>'}</ol>
      </article>`;
  }

  function portfolioCard(portfolio, index) {
    const scenario = typeof portfolio.scenario === "object" ? portfolio.scenario?.name : portfolio.scenario;
    const reasonByEvent = new Map(
      (portfolio.optimization?.addedEvents || [])
        .filter(event => event?.id && event?.reason)
        .map(event => [event.id, event.reason])
    );
    const eligibleEvents = (portfolio.events || []).filter(event => {
      const market = fold(event?.market || event?.mercato);
      return !market.includes("prima a x corner") && !market.includes("prima a 2 calci d'angolo");
    });
    const strengths = Array.isArray(portfolio.strengths) ? portfolio.strengths.filter(Boolean) : [];
    const weaknesses = Array.isArray(portfolio.weaknesses) ? portfolio.weaknesses.filter(Boolean) : [];
    const risk = portfolio.riskProfile || {};
    const riskNotes = Array.isArray(portfolio.riskNotes) ? portfolio.riskNotes.filter(Boolean) : [];
    const riskVerdict = fold(portfolio.riskVerdict || "high");
    return `
      <article class="mycombo-final-card mycombo-portfolio-panel" data-portfolio-panel="${index}" ${index ? "hidden" : ""}>
        <header>
          <div>
            <span>Scenario · ${escapeHtml(scenario || "Non specificato")}</span>
            <h4>${escapeHtml(portfolio.name)}</h4>
          </div>
          <strong><small>Quota finale</small>${escapeHtml(portfolio.finalOdds)}</strong>
        </header>
        ${portfolio.reason ? `<p class="mycombo-portfolio-reason">${escapeHtml(portfolio.reason)}</p>` : ""}
        <section class="mycombo-risk-profile is-${escapeHtml(riskVerdict)}">
          <header><strong>Profilo rischio</strong><span>${escapeHtml(portfolio.riskVerdict || "high")}</span></header>
          <dl>
            <div><dt>Rischio medio</dt><dd>${escapeHtml(risk.averageRisk ?? "n.d.")}${risk.averageRisk != null ? "/100" : ""}</dd></div>
            <div><dt>Rischio massimo</dt><dd>${escapeHtml(risk.maxEventRisk ?? "n.d.")}${risk.maxEventRisk != null ? "/100" : ""}</dd></div>
            <div><dt>Numero eventi</dt><dd>${escapeHtml(risk.numberOfEvents ?? eligibleEvents.length)}</dd></div>
            <div><dt>Quota singola max</dt><dd>${escapeHtml(risk.maxSingleOdds ?? "n.d.")}</dd></div>
            <div><dt>Concentrazione</dt><dd>${escapeHtml(risk.riskConcentration || "n.d.")}</dd></div>
            <div><dt>Eventi alto rischio</dt><dd>${escapeHtml(risk.highRiskEvents ?? 0)}</dd></div>
          </dl>
          ${riskNotes.length ? `<ul>${riskNotes.map(note => `<li>${escapeHtml(note)}</li>`).join("")}</ul>` : ""}
        </section>
        <ol class="mycombo-selections">${eligibleEvents.map(event => selectionCard(event, event.reason || reasonByEvent.get(event.id) || "")).join("") || '<li class="mycombo-combo-empty">Nessuna selezione combinabile presente.</li>'}</ol>
        ${(strengths.length || weaknesses.length) ? `
          <div class="mycombo-assessment">
            <section class="is-strength">
              <h5>Punti di forza</h5>
              <ul>${strengths.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </section>
            <section class="is-weakness">
              <h5>Criticità</h5>
              <ul>${weaknesses.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
            </section>
          </div>` : ""}
      </article>`;
  }

  function renderFinalCombos(container, payload) {
    if (!Array.isArray(payload?.portfolios) || !payload.portfolios.length) {
      throw new Error("Formato MyCombo non valido");
    }
    activeSettlement = payload?.settlement?.events || {};
    container.innerHTML = `
      <div class="mycombo-tabs" role="tablist" aria-label="Scegli portfolio">
        ${payload.portfolios.map((portfolio, index) => `
          <button type="button" role="tab" aria-selected="${index === 0}" class="${index === 0 ? "active" : ""}" data-portfolio-tab="${index}">
            <span>${escapeHtml(portfolio.name)}</span>
            <strong>${escapeHtml(portfolio.finalOdds)}</strong>
          </button>`).join("")}
      </div>
      <div class="mycombo-portfolio-content">
        ${payload.portfolios.map(portfolioCard).join("")}
      </div>`;
    container.querySelectorAll("[data-portfolio-tab]").forEach(button => {
      button.addEventListener("click", () => {
        const selected = button.dataset.portfolioTab;
        container.querySelectorAll("[data-portfolio-tab]").forEach(tab => {
          const active = tab.dataset.portfolioTab === selected;
          tab.classList.toggle("active", active);
          tab.setAttribute("aria-selected", String(active));
        });
        container.querySelectorAll("[data-portfolio-panel]").forEach(panel => {
          panel.hidden = panel.dataset.portfolioPanel !== selected;
        });
      });
    });
    updateDebug({ rendered: true });
  }

  async function loadFinalCombos(container) {
    const currentSlug = pageSlug();
    const dataUrl = currentSlug
      ? new URL(`data/mycombo/${encodeURIComponent(currentSlug)}.json`, document.baseURI).href
      : null;
    updateDebug({
      slug: currentSlug || null,
      url: dataUrl,
      requested: false,
      status: null,
      parsed: false,
      rendered: false,
      error: null,
    });
    if (!currentSlug) {
      container.innerHTML = '<div class="mycombo-node-message"><strong>Dati MyCombo non ancora disponibili.</strong></div>';
      updateDebug({ error: "Slug della partita non ricavabile dal nome della pagina." });
      return;
    }
    try {
      updateDebug({ requested: true });
      const response = await fetch(dataUrl, { cache: "no-store" });
      updateDebug({ status: response.status });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      updateDebug({ parsed: true });
      renderFinalCombos(container, payload);
    } catch (error) {
      container.innerHTML = '<div class="mycombo-node-message"><strong>Dati MyCombo non ancora disponibili.</strong></div>';
      updateDebug({ error: error instanceof Error ? error.message : String(error) });
      console.error(`[MyCombo Viewer] Impossibile caricare ${dataUrl}:`, error);
    }
  }

  function createViewer(article) {
    const existing = document.querySelector("#mycombo-viewer");
    if (existing) return existing;
    const viewer = document.createElement("section");
    viewer.id = "mycombo-viewer";
    viewer.className = "mycombo-generated";
    viewer.innerHTML = `
      <header class="mycombo-generated-head">
        <div><span>Portfolio ottimizzati</span><h3>MYCOMBO DEFINITIVE</h3></div>
        <p>Safe, Balanced e Aggressive della partita.</p>
      </header>
      <div class="mycombo-final-grid"><p class="mycombo-loading">Caricamento MyCombo...</p></div>`;
    article.querySelector(".reading-note")?.insertAdjacentElement("beforebegin", viewer) || article.appendChild(viewer);
    return viewer;
  }

  function render() {
    const article = document.querySelector(".reading-article");
    if (!article) {
      updateDebug({ error: "Contenitore .reading-article non trovato." });
      console.error("[MyCombo Viewer] Contenitore .reading-article non trovato.");
      return;
    }

    const viewer = createViewer(article);
    loadFinalCombos(viewer.querySelector(".mycombo-final-grid"));

    if (document.querySelector(".mycombo-export")) return;
    let study;
    try {
      study = generateStudy();
    } catch (error) {
      console.error("[MyCombo Viewer] Errore nella sezione Studio MyCombo:", error);
      return;
    }
    const panel = document.createElement("section");
    panel.className = "mycombo-export";
    panel.innerHTML = `
      <div class="mycombo-export-head">
        <div><span>Integrazione Sisal</span><h3>Studio MyCombo</h3><p>${study.events.length ? `${study.events.length} eventi selezionati dallo studio della partita.` : "Nessun mercato semplice sufficientemente supportato dallo studio."}</p></div>
        <button class="mycombo-export-button" type="button" ${study.events.length ? "" : "disabled"}>Esporta studio MyCombo</button>
      </div>
      <div class="mycombo-preview" aria-label="Preview eventi MyCombo">
        ${study.events.map((item) => `
          <article class="mycombo-event">
            <div><span>${item.category}</span><strong>${item.label}</strong></div>
            <dl><div><dt>Probabilità</dt><dd>${item.probability}%</dd></div><div><dt>Quota massima</dt><dd>${item.maxOdd}</dd></div></dl>
            <p>${item.reason}</p>
          </article>`).join("")}
      </div>`;
    article.querySelector(".reading-note")?.insertAdjacentElement("beforebegin", panel) || article.appendChild(panel);
    panel.querySelector("button")?.addEventListener("click", () => downloadStudy(study));
  }

  window.MyComboExport = {
    generateStudy,
    exportPayload,
    downloadStudy,
    render,
    renderFinalCombos,
    loadFinalCombos,
    pageSlug,
    viewerDebug,
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
}());
