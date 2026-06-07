document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  const nav = dropdown.closest(".page-links");
  if (!toggle) return;

  toggle.setAttribute("tabindex", "0");
  toggle.setAttribute("role", "button");
  toggle.setAttribute("aria-expanded", "false");

  function setOpen(isOpen) {
    dropdown.classList.toggle("is-open", isOpen);
    if (nav) nav.classList.toggle("nav-menu-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen && window.matchMedia("(max-width: 720px)").matches) {
      const rect = toggle.getBoundingClientRect();
      document.documentElement.style.setProperty("--nav-menu-top", Math.round(rect.bottom + 8) + "px");
    }
  }

  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(!dropdown.classList.contains("is-open"));
  });

  toggle.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setOpen(!dropdown.classList.contains("is-open"));
  });

  dropdown.querySelectorAll(".nav-dropdown-menu a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation();
      setOpen(false);
    });
  });

  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
});
