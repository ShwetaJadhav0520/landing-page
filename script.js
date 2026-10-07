// =========================================================
// STEP 1: Select the HTML elements we need
// =========================================================
const menuToggle = document.getElementById("menuToggle");
const mainNav    = document.getElementById("mainNav");
const header     = document.querySelector(".site-header");
const navLinks   = document.querySelectorAll(".nav-link");

// =========================================================
// STEP 2: Open / close the mobile menu
// =========================================================
function setMenu(isOpen) {
  mainNav.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = !mainNav.classList.contains("open");
  setMenu(isOpen);
});

// =========================================================
// STEP 3: When a nav link is clicked
//         - close the mobile menu
//         - mark that link as "active"
// =========================================================
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.forEach((l) => l.classList.remove("active"));
    link.classList.add("active");
    setMenu(false);
  });
});

// Close the menu with the Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

// =========================================================
// STEP 4: Add a shadow to the header when the page scrolls
// =========================================================
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

// =========================================================
// STEP 5: Quote popup (modal)
// "Get a Free Quote" and "Book Installation Today" open it
// =========================================================
const modal     = document.getElementById("quoteModal");
const quoteForm = document.getElementById("quoteForm");
const qError    = document.getElementById("qError");
const qSuccess  = document.getElementById("qSuccess");

function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  setMenu(false);
  document.getElementById("qName").focus();
}
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

document.querySelectorAll("[data-open-quote]").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault();   // stop the page from jumping
    openModal();
  });
});

document.getElementById("quoteClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); }); // click outside
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// Form check (validation)
quoteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name  = document.getElementById("qName").value.trim();
  const phone = document.getElementById("qPhone").value.trim();

  if (name.length < 2) { qError.textContent = "Please enter your name."; return; }
  if (!/^[0-9]{10}$/.test(phone)) { qError.textContent = "Please enter a valid 10-digit phone number."; return; }

  qError.textContent = "";
  quoteForm.hidden = true;
  qSuccess.hidden = false;       // show thank-you message
  // Note: no backend yet. Later, send this data with fetch() to a server.

  setTimeout(() => {             // reset after 2.5 seconds
    closeModal();
    quoteForm.reset();
    quoteForm.hidden = false;
    qSuccess.hidden = true;
  }, 2500);
});

// =========================================================
// STEP 6: Fade-in sections when scrolling
// =========================================================
const revealItems = document.querySelectorAll(".section .section-title, .card, .narrow p, .narrow .btn");
revealItems.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach((el) => observer.observe(el));

// =========================================================
// STEP 7: Highlight the nav link of the section on screen
// =========================================================
const sections = document.querySelectorAll("main section[id]");
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });

sections.forEach((s) => sectionObserver.observe(s));
