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
    const filename = decodeURIComponent(location.pathname.split("/").pop() || "");
    return filename.match(/^lettura-(.+)\.html$/i)?.[1]?.toLowerCase() || "";
  }

  function probabilityLabel(odds) {
    const numeric = Number(odds);
    return Number.isFinite(numeric) && numeric > 1 ? `${(100 / numeric).toFixed(1)}%` : "n.d.";
  }

  function readableMarket(value) {
    return clean(value).split(/\s+—\s+/).filter(Boolean).join(" · ") || "Mercato non disponibile";
  }

  function selectionCard(event, settlement) {
    const result = settlement?.[event.id] || {};
    const outcome = fold(result.status);
    const resultLabel = outcome === "won" ? "Vinta" : outcome === "lost" ? "Persa" : "";
    const resultClass = resultLabel ? ` is-${outcome}` : "";
    const riskScore = Number(event.riskScore);
    return `
      <li class="mycombo-selection${resultClass}">
        <div class="mycombo-selection-title">
          <div>
            <span class="mycombo-market-label">Mercato</span>
            <strong>${escapeHtml(readableMarket(firstValue(event, ["market", "mercato"])))}</strong>
          </div>
          <div class="mycombo-selection-badges">
            ${event.category ? `<span class="mycombo-category-badge">${escapeHtml(event.category)}</span>` : ""}
            ${event.class ? `<span class="mycombo-class-badge is-${escapeHtml(fold(event.class))}">${escapeHtml(event.class)}</span>` : ""}
            ${Number.isFinite(riskScore) ? `<span class="mycombo-risk-badge is-${escapeHtml(event.riskLevel || "medium")}">Rischio ${riskScore}/100</span>` : ""}
            ${resultLabel ? `<span class="mycombo-result-badge${resultClass}">${resultLabel}</span>` : ""}
          </div>
        </div>
        <div class="mycombo-pick-line">
          <strong>${escapeHtml(firstValue(event, ["selection", "selezione"]) || "n.d.")}</strong>
          <span>Quota ${escapeHtml(event.odds ?? event.quota ?? "n.d.")}</span>
        </div>
        ${result.evidence ? `<p class="mycombo-settlement-note">${escapeHtml(result.evidence)}</p>` : ""}
      </li>`;
  }

  function portfolioCard(portfolio, index, settlement) {
    const events = Array.isArray(portfolio.events) ? portfolio.events : [];
    const risk = portfolio.riskProfile || {};
    const verdict = fold(portfolio.riskVerdict || "high");
    const scenario = typeof portfolio.scenario === "object" ? portfolio.scenario?.name : portfolio.scenario;
    if (!events.length || !Number.isFinite(Number(portfolio.finalOdds))) {
      return `
        <article class="mycombo-final-card mycombo-portfolio-panel" data-portfolio-panel="${index}" ${index ? "hidden" : ""}>
          <h4>${escapeHtml(portfolio.name || "Portfolio")}</h4>
          <p class="mycombo-combo-empty">${escapeHtml(portfolio.reason || "Nessuna combinazione compatibile disponibile.")}</p>
        </article>`;
    }
    return `
      <article class="mycombo-final-card mycombo-portfolio-panel" data-portfolio-panel="${index}" ${index ? "hidden" : ""}>
        <header>
          <div><span>Portfolio</span><h4>${escapeHtml(portfolio.name)}</h4></div>
          <div class="mycombo-portfolio-metrics">
            <strong><small>Quota finale</small>${escapeHtml(portfolio.finalOdds)}</strong>
            <strong class="mycombo-success-probability"><small>Probabilità implicita</small>${probabilityLabel(portfolio.finalOdds)}</strong>
          </div>
        </header>
        ${portfolio.reason ? `<p class="mycombo-portfolio-reason">${escapeHtml(portfolio.reason)}</p>` : ""}
        <section class="mycombo-risk-profile is-${escapeHtml(verdict)}">
          <header><strong>Profilo rischio</strong><span>${escapeHtml(portfolio.riskVerdict || "n.d.")}</span></header>
          <dl>
            <div><dt>Rischio medio</dt><dd>${escapeHtml(risk.averageRisk ?? "n.d.")}${risk.averageRisk != null ? "/100" : ""}</dd></div>
            <div><dt>Rischio massimo</dt><dd>${escapeHtml(risk.maxEventRisk ?? "n.d.")}${risk.maxEventRisk != null ? "/100" : ""}</dd></div>
            <div><dt>Eventi</dt><dd>${escapeHtml(risk.numberOfEvents ?? events.length)}</dd></div>
          </dl>
        </section>
        ${scenario ? `<p class="mycombo-scenario"><strong>Scenario:</strong> ${escapeHtml(scenario)}</p>` : ""}
        <ol class="mycombo-selections">${events.map((event) => selectionCard(event, settlement)).join("")}</ol>
      </article>`;
  }

  function renderFinalCombos(container, payload) {
    if (!Array.isArray(payload?.portfolios) || !payload.portfolios.length) {
      throw new Error("Formato MyCombo non valido");
    }
    const settlement = payload?.settlement?.events || {};
    container.innerHTML = `
      <div class="mycombo-tabs" role="tablist" aria-label="Scegli portfolio">
        ${payload.portfolios.map((portfolio, index) => `
          <button type="button" role="tab" aria-selected="${index === 0}" class="${index === 0 ? "active" : ""}" data-portfolio-tab="${index}">
            <span>${escapeHtml(portfolio.name)}</span>
            <span class="mycombo-tab-values"><strong>${escapeHtml(portfolio.finalOdds ?? "—")}</strong><small>${probabilityLabel(portfolio.finalOdds)} successo</small></span>
          </button>`).join("")}
      </div>
      <div class="mycombo-portfolio-content">
        ${payload.portfolios.map((portfolio, index) => portfolioCard(portfolio, index, settlement)).join("")}
      </div>`;

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
        <div><span>Portfolio precalcolati</span><h3>MYCOMBO DEFINITIVE</h3></div>
        <p>Safe, Balanced e Aggressive della partita.</p>
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
