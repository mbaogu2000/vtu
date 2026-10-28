const sidebar = document.querySelector("#dashboard-sidebar");
const menuToggle = document.querySelector(".dashboard-menu-toggle");
const sidebarScrim = document.querySelector(".sidebar-scrim");
const dialog = document.querySelector(".action-dialog");
const dialogTitle = document.querySelector("#action-dialog-title");
const dialogKicker = document.querySelector("#dialog-kicker");
const dialogDescription = document.querySelector(".dialog-description");
const actionForm = document.querySelector(".dialog-action-form");
const dialogNotice = document.querySelector(".dialog-notice");
const recipientField = document.querySelector("#phone-field");
const toast = document.querySelector(".dashboard-toast");
const siteMenuButton = document.querySelector(".site-header .menu-toggle");
const siteNavigation = document.querySelector(".site-header .main-nav");
const newsletterForm = document.querySelector("#newsletter-form");
let toastTimeout;
let selectedAction = "";

function setSidebarOpen(isOpen) {
  sidebar.classList.toggle("open", isOpen);
  sidebarScrim.hidden = !isOpen;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close dashboard menu" : "Open dashboard menu");
  menuToggle.innerHTML = `<i class="bi bi-${isOpen ? "x-lg" : "list"}"></i>`;
}

function openActionDialog(action, isWalletFunding = false) {
  selectedAction = action;
  dialogTitle.textContent = isWalletFunding ? "Fund your wallet" : `Buy ${action}`;
  dialogKicker.textContent = isWalletFunding ? "DEMO WALLET FUNDING" : "DEMO SERVICE";
  dialogDescription.textContent = isWalletFunding
    ? "This is a demo dashboard. No payment will be taken or wallet balance changed."
    : `Enter the details for this ${action} demo. No payment or service transaction will be processed.`;
  recipientField.hidden = isWalletFunding;
  const recipientInput = recipientField.querySelector("input");
  recipientInput.required = !isWalletFunding;
  dialogNotice.textContent = "";
  actionForm.reset();
  dialog.showModal();
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

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Thanks for subscribing to VTU9JA updates!");
  newsletterForm.reset();
});

menuToggle.addEventListener("click", () => {
  setSidebarOpen(!sidebar.classList.contains("open"));
});

sidebarScrim.addEventListener("click", () => setSidebarOpen(false));

sidebar.addEventListener("click", (event) => {
  const link = event.target.closest("a[href^='#']");
  if (link) {
    sidebar.querySelectorAll(".dashboard-nav-link.active").forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
    setSidebarOpen(false);
  }

});

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => {
    if (sidebar.contains(button)) {
      setSidebarOpen(false);
    }
    openActionDialog(button.dataset.service);
  });
});

document.querySelectorAll("[data-open-wallet]").forEach((button) => {
  button.addEventListener("click", () => openActionDialog("Wallet funding", true));
});

document.querySelector(".balance-toggle").addEventListener("click", (event) => {
  const toggle = event.currentTarget;
  const amount = document.querySelector(".wallet-amount");
  const hidden = toggle.getAttribute("aria-pressed") !== "true";
  amount.textContent = hidden ? "••••••••" : amount.dataset.balance;
  toggle.setAttribute("aria-pressed", String(hidden));
  toggle.setAttribute("aria-label", hidden ? "Show wallet balance" : "Hide wallet balance");
  toggle.innerHTML = `<i class="bi bi-eye${hidden ? "-slash" : ""}"></i>`;
});

document.querySelector(".notification-button").addEventListener("click", () => {
  showToast("You're all caught up on notifications.");
});

document.querySelectorAll(".transaction-filter").forEach((filterButton) => {
  filterButton.addEventListener("click", () => {
    const filter = filterButton.dataset.filter;
    let visibleRows = 0;

    document.querySelectorAll(".transaction-row").forEach((row) => {
      const visible = filter === "all" || row.dataset.type === filter;
      row.hidden = !visible;
      visibleRows += Number(visible);
    });

    document.querySelectorAll(".transaction-filter").forEach((button) => {
      const isActive = button === filterButton;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelector(".empty-transactions").hidden = visibleRows > 0;
  });
});

actionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  dialogNotice.textContent = `${selectedAction} is a demo only. Connect an account and payment service to complete transactions.`;
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && sidebar.classList.contains("open")) {
    setSidebarOpen(false);
  }
});
