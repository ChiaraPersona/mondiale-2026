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
