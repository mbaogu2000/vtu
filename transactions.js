const sidebar = document.querySelector("#dashboard-sidebar");
const menuToggle = document.querySelector(".dashboard-menu-toggle");
const sidebarScrim = document.querySelector(".sidebar-scrim");
const siteMenuButton = document.querySelector(".site-header .menu-toggle");
const siteNavigation = document.querySelector(".site-header .main-nav");
const searchInput = document.querySelector("#transaction-search");
const statusFilter = document.querySelector("#status-filter");
const filterButtons = document.querySelectorAll(".transaction-filter");
const rows = Array.from(document.querySelectorAll(".history-row"));
const emptyState = document.querySelector("#empty-transactions");
const countLabel = document.querySelector("#transaction-count");
const toast = document.querySelector(".transaction-toast");
let activeType = "all";
let toastTimeout;

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle("open", isOpen);
  sidebarScrim.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close dashboard menu" : "Open dashboard menu");
  menuToggle.innerHTML = `<i class="bi bi-${isOpen ? "x-lg" : "list"}"></i>`;
}

function updateTransactions() {
  const query = searchInput.value.trim().toLowerCase();
  const status = statusFilter.value;
  let visibleCount = 0;

  rows.forEach((row) => {
    const matchesType = activeType === "all" || row.dataset.type === activeType;
    const matchesStatus = status === "all" || row.dataset.status === status;
    const matchesQuery = !query || row.dataset.search.includes(query);
    const visible = matchesType && matchesStatus && matchesQuery;
    row.hidden = !visible;
    visibleCount += Number(visible);
  });

  emptyState.hidden = visibleCount > 0;
  countLabel.textContent = String(visibleCount);
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

document.querySelector(".notification-button").addEventListener("click", () => {
  showToast("You're all caught up on notifications.");
});

searchInput.addEventListener("input", updateTransactions);
statusFilter.addEventListener("change", updateTransactions);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeType = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    updateTransactions();
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && sidebar.classList.contains("open")) {
    setSidebarOpen(false);
  }
});
