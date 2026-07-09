(function () {
  "use strict";

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character]);
  const clean = (value) => String(value ?? "").replace(/\s+/g, " ").trim();
  const fold = (value) => clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const firstValue = (source, keys) => keys.map((key) => source?.[key])
    .find((value) => value !== undefined && value !== null && value !== "");

  function pageSlug() {
    const override = document.querySelector(".reading-article")?.dataset?.mycomboSlug;
    if (override) return override;
    const filename = decodeURIComponent(location.pathname.split("/").pop() || "");
    const slug = filename.match(/^lettura-(.+)\.html$/i)?.[1]?.toLowerCase() || "";
    const currentQuarterfinals = {
      "francia-marocco": "france-morocco-2026-07-09",
      "spagna-belgio": "spain-belgium-2026-07-10",
      "norvegia-inghilterra": "norway-england-2026-07-11",
      "argentina-svizzera": "argentina-switzerland-2026-07-11",
    };
    return currentQuarterfinals[slug] || slug;
  }

  function readableMarket(value) {
    return clean(value).split(/\s+(?:—|â€”)\s+/).filter(Boolean).join(" · ");
  }

  function riskLabel(value) {
    const normalized = fold(value);
    if (normalized === "low" || normalized === "basso") return "Basso";
    if (normalized === "medium" || normalized === "medio") return "Medio";
    if (normalized === "high" || normalized === "alto") return "Alto";
    return clean(value);
  }

  function cleanList(values) {
    return (Array.isArray(values) ? values : [])
      .map(clean)
      .filter((value) => value && fold(value) !== "n.d.");
  }

  function assessmentList(title, className, values) {
    const items = cleanList(values);
    if (!items.length) return "";
    return `
      <section class="${className}">
        <h5>${escapeHtml(title)}</h5>
        <ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>`;
  }

  function selectionCard(event, settlement) {
    const result = settlement?.[event.id] || {};
    const outcome = fold(result.status);
    const resultLabel = outcome === "won" ? "Vinta" : outcome === "lost" ? "Persa" : "";
    const resultClass = resultLabel ? ` is-${outcome}` : "";
    const market = readableMarket(firstValue(event, ["market", "mercato"]));
    const selection = clean(firstValue(event, ["selection", "selezione"]));
    const odds = firstValue(event, ["odds", "quota"]);
    const reasons = cleanList([
      firstValue(event, ["reason", "motivo", "why"]),
      ...(Array.isArray(event.riskReasons) ? event.riskReasons : []),
    ]);

    return `
      <li class="mycombo-selection${resultClass}">
        <div class="mycombo-selection-title">
          <div>
            <span class="mycombo-market-label">Mercato</span>
            <strong>${escapeHtml(market)}</strong>
          </div>
          <div class="mycombo-selection-badges">
            ${event.category ? `<span class="mycombo-category-badge">${escapeHtml(event.category)}</span>` : ""}
            ${event.class ? `<span class="mycombo-class-badge is-${escapeHtml(fold(event.class))}">${escapeHtml(event.class)}</span>` : ""}
            ${resultLabel ? `<span class="mycombo-result-badge${resultClass}">${resultLabel}</span>` : ""}
          </div>
        </div>
        <div class="mycombo-pick-line">
          <div><span>Selezione</span><strong>${escapeHtml(selection)}</strong></div>
          ${odds !== undefined && odds !== null && odds !== "" ? `<div><span>Quota</span><strong>${escapeHtml(odds)}</strong></div>` : ""}
        </div>
        ${reasons.length ? `<p class="mycombo-pick-reason"><span>Motivo</span>${escapeHtml(reasons.join(" "))}</p>` : ""}
        ${result.evidence ? `<p class="mycombo-settlement-note"><strong>Esito:</strong> ${escapeHtml(result.evidence)}</p>` : ""}
      </li>`;
  }

  function oddsProduct(events) {
    if (!events.length || events.some(event => !Number.isFinite(Number(event.odds)))) return null;
    return Math.round(
      (events.reduce((total, event) => total * Number(event.odds), 1) + Number.EPSILON) * 100
    ) / 100;
  }

  function oddsExpression(events) {
    return events.map(event => Number(event.odds).toFixed(2)).join(" × ");
  }

  function portfolioCard(portfolio, index, settlement) {
    const events = Array.isArray(portfolio.events) ? portfolio.events : [];
    const calculatedOdds = oddsProduct(events);
    const risk = portfolio.riskProfile || {};
    const verdict = fold(portfolio.riskVerdict);
    const scenario = typeof portfolio.scenario === "object" ? portfolio.scenario?.name : portfolio.scenario;
    const riskNotes = cleanList(portfolio.riskNotes);
    const strengths = assessmentList("Punti di forza", "is-strength", portfolio.strengths);
    const weaknesses = assessmentList("Criticità", "is-weakness", portfolio.weaknesses);
    const hasRiskData = Boolean(portfolio.riskVerdict || Object.keys(risk).length || riskNotes.length);

    if (!events.length || calculatedOdds == null) {
      return `
        <article class="mycombo-final-card mycombo-portfolio-panel" data-portfolio-panel="${index}" ${index ? "hidden" : ""}>
          <h4>${escapeHtml(portfolio.name || "Portfolio")}</h4>
          <p class="mycombo-combo-empty">${escapeHtml(portfolio.reason || "Nessuna combinazione compatibile disponibile.")}</p>
        </article>`;
    }

    return `
      <article class="mycombo-final-card mycombo-portfolio-panel" data-portfolio-panel="${index}" ${index ? "hidden" : ""}>
        <header>
          <div><span>Schedina</span><h4>${escapeHtml(portfolio.name)}</h4></div>
          <div class="mycombo-portfolio-metrics">
            <strong><small>Prodotto quote</small>${escapeHtml(calculatedOdds)}</strong>
            <strong class="mycombo-event-count"><small>Eventi</small>${escapeHtml(events.length)}</strong>
          </div>
        </header>
        <p class="mycombo-settlement-note"><strong>Calcolo:</strong> ${escapeHtml(oddsExpression(events))} = ${escapeHtml(calculatedOdds)}. Prodotto matematico teorico: Sisal può rifiutare o riquotare eventi correlati della stessa partita.</p>
        ${portfolio.reason ? `<p class="mycombo-portfolio-reason">${escapeHtml(portfolio.reason)}</p>` : ""}
        <div class="mycombo-ticket-summary">
          ${scenario ? `<div><small>Scenario</small><strong>${escapeHtml(scenario)}</strong></div>` : ""}
          ${portfolio.riskVerdict ? `<div><small>Profilo rischio</small><strong class="is-risk-${escapeHtml(verdict)}">${escapeHtml(riskLabel(portfolio.riskVerdict))}</strong></div>` : ""}
          ${portfolio.confidence != null ? `<div><small>Confidence</small><strong>${escapeHtml(portfolio.confidence)}/100</strong></div>` : ""}
          ${portfolio.stability != null ? `<div><small>Stability</small><strong>${escapeHtml(portfolio.stability)}/100</strong></div>` : ""}
          ${portfolio.value != null ? `<div><small>Value</small><strong>${escapeHtml(portfolio.value)}/100</strong></div>` : ""}
        </div>
        ${hasRiskData ? `
          <section class="mycombo-risk-profile is-${escapeHtml(verdict)}">
            <header><strong>Risk Engine</strong>${portfolio.riskVerdict ? `<span>Rischio ${escapeHtml(riskLabel(portfolio.riskVerdict))}</span>` : ""}</header>
            <dl>
              ${risk.maxSingleOdds != null ? `<div><dt>Quota massima singola</dt><dd>${escapeHtml(risk.maxSingleOdds)}</dd></div>` : ""}
              ${risk.averageRisk != null ? `<div><dt>Rischio medio</dt><dd>${escapeHtml(risk.averageRisk)}/100</dd></div>` : ""}
              ${risk.maxEventRisk != null ? `<div><dt>Picco di rischio</dt><dd>${escapeHtml(risk.maxEventRisk)}/100</dd></div>` : ""}
            </dl>
            ${riskNotes.length ? `<ul class="mycombo-risk-notes">${riskNotes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>` : ""}
          </section>` : ""}
        ${strengths || weaknesses ? `<div class="mycombo-assessment">${strengths}${weaknesses}</div>` : ""}
        <ol class="mycombo-selections">${events.map((event) => selectionCard(event, settlement)).join("")}</ol>
      </article>`;
  }

  function bookingsTrioCard(trio, settlement) {
    if (!trio) return "";
    const events = Array.isArray(trio.events) ? trio.events : [];
    const risks = cleanList(trio.risks);
    const mode = trio.mode === "tris_ammoniti_con_errore"
      ? "Sisal · con errore"
      : "Tris manuale";

    return `
      <section class="mycombo-bookings-section" aria-labelledby="mycombo-bookings-title">
        <article class="mycombo-final-card mycombo-bookings-card">
          <header>
            <div><span>Sezione separata</span><h4 id="mycombo-bookings-title">Tris ammoniti</h4></div>
            ${trio.available ? `
              <div class="mycombo-portfolio-metrics">
                <strong><small>Quota totale</small>${escapeHtml(trio.totalOdds)}</strong>
                <strong class="mycombo-event-count"><small>Modalità</small>${escapeHtml(mode)}</strong>
              </div>` : ""}
          </header>
          <p class="mycombo-portfolio-reason">${escapeHtml(trio.reason || "Dati insufficienti per proporre il tris.")}</p>
          ${trio.available && events.length === 3
            ? `<ol class="mycombo-selections">${events.map((event) => selectionCard(event, settlement)).join("")}</ol>`
            : `<p class="mycombo-combo-empty">Combinazione non forzata.</p>`}
          ${risks.length ? `
            <section class="mycombo-risk-profile is-high">
              <header><strong>Rischi specifici</strong><span>Alta varianza</span></header>
              <ul class="mycombo-risk-notes">${risks.map((risk) => `<li>${escapeHtml(risk)}</li>`).join("")}</ul>
            </section>` : ""}
        </article>
      </section>`;
  }

  function quoteErrorCard(event) {
    const level = ["value", "suspicious", "error"].includes(event.level) ? event.level : "value";
    const risk = fold(event.risk);
    const confirmations = cleanList(event.confirmations);
    const concreteSelection = clean(firstValue(event, ["label", "selectionLabel", "displayName"]))
      || [clean(event.event), clean(event.selection)].filter(Boolean).join(" · ");
    const technicalMarket = clean(event.market);
    const anomalyIndex = Number.isFinite(Number(event.anomalyIndex)) ? `${Number(event.anomalyIndex)}/100` : "Non calcolato";
    const compatibility = typeof event.myComboCompatible === "boolean"
      ? (event.myComboCompatible ? "Sì" : "No")
      : "Non valutata";
    return `
      <article class="quote-error-card is-${escapeHtml(level)}">
        <header>
          <div>
            ${clean(event.badge) ? `<span class="quote-error-badge is-${escapeHtml(level)}">${escapeHtml(event.badge)}</span>` : ""}
            <h5>${escapeHtml(concreteSelection)}</h5>
            ${technicalMarket ? `<small class="quote-error-market-type">Tipologia: ${escapeHtml(technicalMarket)}</small>` : ""}
          </div>
          <div class="quote-error-odds"><small>Quota</small><strong>${escapeHtml(event.odds)}</strong></div>
        </header>
        <div class="quote-error-metrics">
          <div><small>Probabilità implicita</small><strong>${escapeHtml(event.impliedProbability)}%</strong></div>
          <div><small>Probabilità stimata</small><strong>${escapeHtml(event.estimatedProbability)}%</strong></div>
          <div><small>Edge</small><strong class="is-edge">+${escapeHtml(event.edge)}%</strong></div>
          <div><small>Indice di Anomalia</small><strong>${escapeHtml(anomalyIndex)}</strong></div>
          <div><small>Rischio</small><strong class="is-risk-${escapeHtml(risk)}">${escapeHtml(riskLabel(event.risk))}</strong></div>
          <div><small>Compatibilità MyCombo</small><strong>${compatibility}</strong></div>
          <div><small>Fiducia modello</small><strong>${escapeHtml(event.modelConfidence)}/100</strong></div>
          <div><small>Classificazione</small><strong>${escapeHtml(event.classification)}</strong></div>
        </div>
        <p class="quote-error-reason"><span>Motivo del possibile errore</span>${escapeHtml(event.reason)}</p>
        ${confirmations.length ? `
          <div class="quote-error-confirmations">
            <span>Conferme motori</span>
            <div>${confirmations.map((engine) => `<em>${escapeHtml(engine)}</em>`).join("")}</div>
          </div>` : ""}
      </article>`;
  }

  function quoteErrorSection(analysis) {
    if (!analysis) return "";
    const events = Array.isArray(analysis.events) ? analysis.events : [];
    const stats = analysis.analysis || {};
    return `
      <section class="quote-error-section" aria-labelledby="quote-error-title">
        <header class="quote-error-head">
          <div>
            <span>Market Intelligence</span>
            <h4 id="quote-error-title">Errore di Quota</h4>
          </div>
          <p>Solo eventi con quota superiore a 3.00, edge positivo e conferme sufficienti dai motori.</p>
        </header>
        <div class="quote-error-audit">
          <span><strong>${escapeHtml(stats.totalMarkets ?? 0)}</strong> quote analizzate</span>
          <span><strong>${escapeHtml(stats.marketsAboveOddsThreshold ?? 0)}</strong> sopra 3.00</span>
          <span><strong>${escapeHtml(events.length)}</strong> segnalazioni</span>
        </div>
        ${events.length
          ? `<div class="quote-error-grid">${events.map(quoteErrorCard).join("")}</div>`
          : `<p class="mycombo-combo-empty">Nessun possibile disallineamento supera tutti i filtri del modello.</p>`}
        <p class="quote-error-disclaimer">${escapeHtml(analysis.disclaimer)}</p>
      </section>`;
  }

  function normalizePortfolio(payload, key, fallbackName) {
    const portfolio = payload?.[key];
    if (!portfolio || typeof portfolio !== "object") return null;
    return {
      ...portfolio,
      name: portfolio.name || fallbackName,
      reason: portfolio.reason || portfolio.motivation || portfolio.whyIncluded || "",
      riskProfile: {
        ...(portfolio.riskProfile || {}),
        ...(portfolio.averageRisk != null ? { averageRisk: portfolio.averageRisk } : {}),
      },
      riskVerdict: portfolio.riskVerdict || (
        Number(portfolio.averageRisk) >= 65 ? "Alto" :
        Number(portfolio.averageRisk) >= 40 ? "Medio" :
        Number.isFinite(Number(portfolio.averageRisk)) ? "Basso" : ""
      ),
    };
  }

  function normalizePayload(payload) {
    if (Array.isArray(payload?.portfolios) && payload.portfolios.length) return payload;
    const portfolios = [
      normalizePortfolio(payload, "safe", "Safe"),
      normalizePortfolio(payload, "balanced", "Balanced"),
      normalizePortfolio(payload, "aggressive", "Aggressive"),
    ].filter(Boolean);
    return { ...payload, portfolios };
  }

  function renderFinalCombos(container, payload) {
    payload = normalizePayload(payload);
    if (!Array.isArray(payload?.portfolios) || !payload.portfolios.length) {
      throw new Error("Formato MyCombo non valido");
    }
    const settlement = payload?.settlement?.events || {};
    container.innerHTML = `
      <div class="mycombo-tabs" role="tablist" aria-label="Scegli portfolio">
        ${payload.portfolios.map((portfolio, index) => `
          <button type="button" role="tab" aria-selected="${index === 0}" class="${index === 0 ? "active" : ""}" data-portfolio-tab="${index}">
            <span>${escapeHtml(portfolio.name)}</span>
            ${oddsProduct(Array.isArray(portfolio.events) ? portfolio.events : []) != null ? `<span class="mycombo-tab-values"><small>Prodotto</small><strong>${escapeHtml(oddsProduct(portfolio.events))}</strong></span>` : ""}
          </button>`).join("")}
      </div>
      <div class="mycombo-portfolio-content">
        ${payload.portfolios.map((portfolio, index) => portfolioCard(portfolio, index, settlement)).join("")}
      </div>
      ${bookingsTrioCard(payload.bookingsTrio, settlement)}
      ${quoteErrorSection(payload.quoteErrorAnalysis)}`;

    container.addEventListener("click", (event) => {
      const button = event.target.closest("[data-portfolio-tab]");
      if (!button) return;
      const selected = button.dataset.portfolioTab;
      container.querySelectorAll("[data-portfolio-tab]").forEach((tab) => {
        const active = tab.dataset.portfolioTab === selected;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-selected", String(active));
      });
      container.querySelectorAll("[data-portfolio-panel]").forEach((panel) => {
        panel.hidden = panel.dataset.portfolioPanel !== selected;
      });
    });
  }

  async function loadViewer(viewer) {
    if (viewer.dataset.loaded === "true") return;
    viewer.dataset.loaded = "true";
    const slug = pageSlug();
    const container = viewer.querySelector(".mycombo-final-grid");
    if (!slug) {
      container.innerHTML = "<p>Dati MyCombo non disponibili.</p>";
      return;
    }
    try {
      const response = await fetch(`data/mycombo/${encodeURIComponent(slug)}.json`, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      renderFinalCombos(container, await response.json());
    } catch (error) {
      container.innerHTML = "<p>Dati MyCombo non ancora disponibili.</p>";
      console.warn(`[MyCombo Viewer] ${error.message}`);
    }
  }

  function createViewer() {
    const article = document.querySelector(".reading-article");
    if (!article) return null;
    const existing = document.querySelector("#mycombo-viewer");
    if (existing) return existing;
    const viewer = document.createElement("section");
    viewer.id = "mycombo-viewer";
    viewer.className = "mycombo-generated";
    viewer.innerHTML = `
      <header class="mycombo-generated-head">
        <div><span>Schedine ragionate</span><h3>MYCOMBO DEFINITIVE</h3></div>
        <p>Scegli il profilo Safe, Balanced o Aggressive.</p>
      </header>
      <div class="mycombo-final-grid"><p class="mycombo-loading">La MyCombo verrà caricata quando raggiungi questa sezione.</p></div>`;
    article.querySelector(".reading-note")?.insertAdjacentElement("beforebegin", viewer) || article.appendChild(viewer);
    return viewer;
  }

  function init() {
    const viewer = createViewer();
    if (!viewer) return;
    if (!("IntersectionObserver" in window)) {
      requestAnimationFrame(() => loadViewer(viewer));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      loadViewer(viewer);
    }, { rootMargin: "600px 0px" });
    observer.observe(viewer);
  }

  window.MyComboViewer = { init, loadViewer, renderFinalCombos, pageSlug };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
}());
