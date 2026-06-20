const readingPage = document.body.classList.contains("reading-page");

if (readingPage && !document.querySelector(".page-links")) {
  const header = document.querySelector("body > header");

  if (header) {
    header.insertAdjacentHTML("beforeend", `
      <nav class="page-links" aria-label="Sezioni">
        <a class="page-link" href="index.html">Home</a>
        <a class="page-link" href="convocati.html">Convocati</a>
        <a class="page-link" href="probabili-formazioni.html">Probabili formazioni</a>
        <a class="page-link" href="player.html">Player</a>
        <a class="page-link" href="statistiche-squadre.html">Statistiche squadre</a>
        <a class="page-link" href="arbitri.html">Arbitri</a>
        <div class="nav-dropdown">
          <span class="page-link nav-dropdown-toggle active">Pronostico <span class="nav-caret">&#9662;</span></span>
          <div class="nav-dropdown-menu">
            <a class="page-link" href="pronostico-codex.html">Pronostico Codex</a>
            <a class="page-link" href="schedina.html">Schedina</a>
            <a class="page-link" href="tipster.html">Tipster</a>
            <a class="page-link active" href="lettura.html">Lettura</a>
          </div>
        </div>
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
