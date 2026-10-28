const sidebar = document.querySelector("#dashboard-sidebar");
const menuToggle = document.querySelector(".dashboard-menu-toggle");
const sidebarScrim = document.querySelector(".sidebar-scrim");
const siteMenuButton = document.querySelector(".site-header .menu-toggle");
const siteNavigation = document.querySelector(".site-header .main-nav");
const newsletterForm = document.querySelector("#newsletter-form");
const toast = document.querySelector(".profile-toast");
let toastTimeout;

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle("open", isOpen);
  sidebarScrim.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close dashboard menu" : "Open dashboard menu");
  menuToggle.innerHTML = `<i class="bi bi-${isOpen ? "x-lg" : "list"}"></i>`;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
}

siteMenuButton.addEventListener("click", () => {
  const isOpen = siteNavigation.classList.toggle("open");
  siteMenuButton.setAttribute("aria-expanded", String(isOpen));
  siteMenuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  siteMenuButton.innerHTML = `<i class="bi bi-${isOpen ? "x-lg" : "list"}"></i>`;
});

siteNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    siteNavigation.classList.remove("open");
    siteMenuButton.setAttribute("aria-expanded", "false");
    siteMenuButton.setAttribute("aria-label", "Open navigation");
    siteMenuButton.innerHTML = '<i class="bi bi-list"></i>';
  }
});

menuToggle.addEventListener("click", () => {
  setSidebarOpen(!sidebar.classList.contains("open"));
});

sidebarScrim.addEventListener("click", () => setSidebarOpen(false));

sidebar.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setSidebarOpen(false);
  }
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Thanks for subscribing to VTU9JA updates!");
  newsletterForm.reset();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && sidebar.classList.contains("open")) {
    setSidebarOpen(false);
  }
});
