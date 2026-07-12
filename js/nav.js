const readingPage = document.body.classList.contains("reading-page");
const storyReadingPage = Boolean(document.querySelector(".reading-story-article"));

if (!document.querySelector('link[rel="icon"]')) {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = "assets/favicon.png";
  document.head.appendChild(favicon);
}

function escapeNavText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function enhanceReadingArticleLinks() {
  const articleNav = document.querySelector(".reading-article-nav");
  if (!articleNav || articleNav.querySelector("[data-reading-crosslink]")) return;

  const teamNames = [...document.querySelectorAll(".reading-match .reading-team strong")]
    .map((node) => node.textContent.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (!teamNames.length) return;

  const links = teamNames.map((teamName) => `
    <a data-reading-crosslink href="statistiche-squadre.html?team=${encodeURIComponent(teamName)}">Statistiche ${escapeNavText(teamName)}</a>
  `);
  links.push('<a data-reading-crosslink href="arbitri.html">Arbitri</a>');
  articleNav.insertAdjacentHTML("beforeend", links.join(""));
}

if (readingPage && !storyReadingPage && !document.querySelector('script[data-mycombo-export]')) {
  const loadMyComboViewer = () => {
    if (document.querySelector('script[data-mycombo-export]')) return;
    const myComboScript = document.createElement("script");
    myComboScript.src = "js/mycombo-export.js?v=20260709-mycombo-visible-1";
    myComboScript.dataset.mycomboExport = "true";
    myComboScript.defer = true;
    document.head.appendChild(myComboScript);
  };
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadMyComboViewer, { timeout: 1500 });
  } else {
    window.addEventListener("load", loadMyComboViewer, { once: true });
  }
}

if (readingPage && !document.querySelector(".page-links")) {
  const header = document.querySelector("body > header");

  if (header) {
    header.insertAdjacentHTML("beforeend", `
      <nav class="page-links" aria-label="Sezioni">
        <a class="page-link" href="index.html">Home</a>
      <a class="page-link" href="statistiche-squadre.html">Statistiche squadre</a>
      <a class="page-link" href="arbitri.html">Arbitri</a>
        <a class="page-link active" href="lettura.html">Lettura</a>
        <a class="page-link" href="storia.html">Storia</a>
      <a class="page-link utility-link" href="metodo-fonti.html">Metodo e fonti</a>
      </nav>
    `);
  }
}

document.querySelectorAll(".page-links").forEach((nav, index) => {
  const button = document.createElement("button");
  const navId = nav.id || "site-nav-" + index;
  nav.id = navId;
  button.className = "mobile-nav-toggle";
  button.type = "button";
  button.setAttribute("aria-controls", navId);
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = '<span class="mobile-nav-icon" aria-hidden="true"><i></i><i></i><i></i></span><span>Menu</span>';
  nav.parentNode.insertBefore(button, nav);
  document.body.classList.add("has-mobile-nav");

  function setOpen(isOpen) {
    nav.classList.toggle("is-open", isOpen);
    button.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  }

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !button.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
});

if (readingPage && !storyReadingPage) {
  enhanceReadingArticleLinks();
}
