(function () {
  "use strict";

  const SOUTH_AFRICA_CANADA = {
    match: "Sudafrica - Canada",
    scenario: "Canada favorito, partita da eliminazione diretta, Sudafrica più difensivo, Canada più pericoloso in fase offensiva.",
    events: [
      { id: "canada_passa", label: "Canada passa il turno", search: ["PASSAGGIO TURNO", "2"], probability: 78, maxOdd: 1.8 },
      { id: "under_4_5", label: "Under 4.5 gol", search: ["U/O 4.5", "UNDER"], probability: 82, maxOdd: 1.45 },
      { id: "david_2_tiri_totali", label: "David almeno 2 tiri totali nella partita", search: ["DAVID J.", "ALMENO 2", "TIRI TOT"], probability: 68, maxOdd: 1.85 },
      { id: "buchanan_1_tiro", label: "Buchanan almeno 1 tiro", search: ["BUCHANAN T.", "ALMENO 1", "TIRI"], probability: 64, maxOdd: 2.1 },
      { id: "sudafrica_cartellini_over", label: "Sudafrica over punti cartellini", search: ["SQUADRA 1", "CARTELLINI", "OVER"], probability: 70, maxOdd: 1.8 },
      { id: "canada_corner", label: "Canada prima a 2 corner", search: ["PRIMA A 2 CALCI D'ANGOLO", "TEAM 2"], probability: 62, maxOdd: 1.5 },
    ],
  };

  const SOUTH_AFRICA_CANADA_META = [
    ["Passaggio turno", "Qualità, volume offensivo e profondità della rosa favoriscono il Canada nella gara a eliminazione diretta."],
    ["Gol", "Lo studio prevede una partita prudente e con margini stretti: quattro reti o meno coprono lo scenario centrale."],
    ["Tiri giocatore", "David è il principale terminale canadese e la proiezione dello studio è di 3-5 conclusioni."],
    ["Tiri giocatore", "Buchanan parte largo ma attacca l'uno contro uno e lo studio gli assegna 1-3 conclusioni."],
    ["Cartellini squadra", "Il centrocampo sudafricano è esposto ai falli tattici su David e alle accelerazioni del Canada."],
    ["Corner squadra", "Il Canada è proiettato a 5-7 corner grazie al vantaggio territoriale e al lavoro sulle fasce."],
  ];

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
    if (fold(match) === "sudafrica - canada") {
      return {
        ...SOUTH_AFRICA_CANADA,
        events: SOUTH_AFRICA_CANADA.events.map((item, index) => ({
          ...item,
          category: SOUTH_AFRICA_CANADA_META[index][0],
          reason: SOUTH_AFRICA_CANADA_META[index][1],
        })),
      };
    }
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

  function selectionCard(selection) {
    if (!selection || typeof selection !== "object") {
      return `<li class="mycombo-selection"><strong>${escapeHtml(selection || "Selezione non disponibile")}</strong></li>`;
    }
    const value = selectionValue(selection);
    const valueTone = Number.isFinite(value) ? value > 8 ? "is-positive" : value >= 0 ? "is-neutral" : "is-negative" : "is-unknown";
    const label = firstValue(selection, ["label", "name", "descrizione"]);
    const market = firstValue(selection, ["mercato", "market", "marketName"]);
    const info = firstValue(selection, ["info", "marketInfo", "detail"]);
    const outcome = firstValue(selection, ["esito", "outcome", "selection"]);
    const odd = firstValue(selection, ["quota", "odd", "price"]);
    const probability = firstValue(selection, ["probability", "probabilitaStimata", "estimatedProbability"]);
    const impliedProbability = firstValue(selection, ["impliedProbability", "probabilitaImplicita", "implicitProbability"]);
    const selectionId = firstValue(selection, ["selectionId", "id"]);
    return `
      <li class="mycombo-selection">
        <div class="mycombo-selection-title">
          <strong>${displayValue(label)}</strong>
          <span class="mycombo-value-badge ${valueTone}">Value ${Number.isFinite(value) ? escapeHtml(value) : "n.d."}</span>
        </div>
        <dl>
          <div><dt>Mercato</dt><dd>${displayValue(market)}</dd></div>
          <div><dt>Info</dt><dd>${displayValue(info)}</dd></div>
          <div><dt>Esito</dt><dd>${displayValue(outcome)}</dd></div>
          <div><dt>Quota</dt><dd>${displayValue(odd)}</dd></div>
          <div><dt>Probabilità stimata</dt><dd>${displayValue(probability, probability === undefined || probability === null || probability === "" || String(probability).includes("%") ? "" : "%")}</dd></div>
          <div><dt>Probabilità implicita</dt><dd>${displayValue(impliedProbability, impliedProbability === undefined || impliedProbability === null || impliedProbability === "" || String(impliedProbability).includes("%") ? "" : "%")}</dd></div>
          <div><dt>Value stimato</dt><dd>${Number.isFinite(value) ? escapeHtml(value) : "n.d."}</dd></div>
          <div><dt>Selection ID</dt><dd class="mycombo-selection-id">${displayValue(selectionId)}</dd></div>
        </dl>
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
    return `
      <article class="mycombo-final-card">
        <header>
          <div><span>Quota target ${target}</span><h4>${title}</h4></div>
          <strong><small>Quota trovata</small>${displayValue(found)}</strong>
        </header>
        ${missedTarget ? `<p class="mycombo-target-note">Quota target ${target}, quota trovata ${escapeHtml(found)}</p>` : ""}
        <ol class="mycombo-selections">${selections.map(selectionCard).join("") || '<li class="mycombo-combo-empty">Nessuna selezione presente.</li>'}</ol>
      </article>`;
  }

  function renderFinalCombos(container, payload) {
    const combos = payload?.combos;
    if (!combos || typeof combos !== "object") throw new Error("Formato final-mycombo.json non valido");
    container.innerHTML = [
      comboCard("MyCombo Prudente", 5, combos.quota5),
      comboCard("MyCombo Equilibrata", 10, combos.quota10),
      comboCard("MyCombo Aggressiva", 20, combos.quota20),
    ].join("");
  }

  async function loadFinalCombos(container) {
    try {
      const response = await fetch("final-mycombo.json", { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      renderFinalCombos(container, await response.json());
    } catch (error) {
      if (window.FINAL_MYCOMBO_DATA) {
        renderFinalCombos(container, window.FINAL_MYCOMBO_DATA);
        return;
      }
      container.innerHTML = `
        <div class="mycombo-node-message">
          <strong>Genera prima le MyCombo con Node:</strong>
          <code>node final-mycombo.js sudafrica-canada-quote.json events-target.json</code>
        </div>`;
    }
  }

  function render() {
    const article = document.querySelector(".reading-article");
    if (!article || document.querySelector(".mycombo-export")) return;
    const study = generateStudy();
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

    const generated = document.createElement("section");
    generated.className = "mycombo-generated";
    generated.innerHTML = `
      <header class="mycombo-generated-head">
        <div><span>Output final-mycombo.json</span><h3>MYCOMBO GENERATE</h3></div>
        <p>Le combinazioni sono lette dal motore Node, senza elaborazioni nel frontend.</p>
      </header>
      <div class="mycombo-final-grid"><p class="mycombo-loading">Caricamento MyCombo…</p></div>`;
    panel.insertAdjacentElement("afterend", generated);
    loadFinalCombos(generated.querySelector(".mycombo-final-grid"));
  }

  window.MyComboExport = { generateStudy, exportPayload, downloadStudy, render, renderFinalCombos };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", render);
  else render();
}());
