const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const dialog = document.querySelector(".service-preview-dialog");
const previewForm = document.querySelector("#service-preview-form");
const dialogTitle = document.querySelector("#service-dialog-title");
const dialogDescription = document.querySelector(".service-dialog-description");
const previewNotice = document.querySelector(".service-preview-notice");
const recipientLabel = document.querySelector("#recipient-label");
const recipientInput = previewForm.elements.recipient;
const amountInput = previewForm.elements.amount;
const toast = document.querySelector("#services-toast");
const services = {
  "airtime-cash": {
    title: "Airtime to Cash",
    description: "Preview a sample airtime conversion request. Any conversion rate or payout depends on a real provider and is not available in this demo.",
    recipientLabel: "Phone number",
    recipientPlaceholder: "Enter the number with airtime",
    optionField: "#network-option-field",
    optionLabel: "#airtime-amount-field",
  },
  "gift-card": {
    title: "Gift Cards",
    description: "Preview sample gift card brands and denominations. This form will never ask for a gift card code or PIN.",
    recipientLabel: "Recipient email or phone",
    recipientPlaceholder: "Enter recipient contact",
    optionField: "#brand-option-field",
    optionLabel: "#product-option-field",
    productLabel: "Gift card denomination",
    products: [
      ["Amazon · $10", "Amazon · $10"],
      ["Apple · $10", "Apple · $10"],
      ["Google Play · $10", "Google Play · $10"],
      ["Steam · $10", "Steam · $10"],
    ],
  },
  internet: {
    title: "Internet Services",
    description: "Browse sample broadband bundle options. Provider availability and package details are not connected in this demo.",
    recipientLabel: "Internet account or phone number",
    recipientPlaceholder: "Enter account or phone number",
    optionField: "#provider-option-field",
    optionLabel: "#product-option-field",
    productLabel: "Internet plan",
    products: [
      ["Home 10 GB · 30 days", "Home 10 GB · 30 days"],
      ["Home 25 GB · 30 days", "Home 25 GB · 30 days"],
      ["Home 50 GB · 30 days", "Home 50 GB · 30 days"],
    ],
  },
};
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 4000);
}

function openServicePreview(serviceKey) {
  const service = services[serviceKey];
  previewForm.reset();
  previewNotice.textContent = "";
  dialogTitle.textContent = service.title;
  dialogDescription.textContent = service.description;
  recipientLabel.textContent = service.recipientLabel;
  recipientInput.placeholder = service.recipientPlaceholder;

  document.querySelectorAll(".preview-field[id]").forEach((field) => {
    field.hidden = true;
  });
  document.querySelectorAll(".preview-field select").forEach((select) => {
    select.required = false;
  });
  amountInput.required = false;

  [service.optionField, service.optionLabel].forEach((selector) => {
    document.querySelector(selector).hidden = false;
  });

  if (service.products) {
    const productSelect = previewForm.elements.product;
    const label = document.querySelector("#product-option-label");
    label.textContent = service.productLabel;
    productSelect.replaceChildren(new Option("Choose an option", "", true, true));
    service.products.forEach(([labelText, value]) => {
      productSelect.add(new Option(labelText, value));
    });
    productSelect.required = true;
  }
  if (serviceKey === "airtime-cash") {
    amountInput.required = true;
  }
  dialog.dataset.service = serviceKey;
  dialog.showModal();
}

menuButton.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuButton.innerHTML = `<i class="bi bi-${isOpen ? "x-lg" : "list"}"></i>`;
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.innerHTML = '<i class="bi bi-list"></i>';
  }
});

document.querySelectorAll("[data-service]").forEach((button) => {
  button.addEventListener("click", () => openServicePreview(button.dataset.service));
});

previewForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!previewForm.reportValidity()) {
    return;
  }

  const service = services[dialog.dataset.service];
  previewNotice.textContent = `${service.title} options reviewed. This service is a demo only; no payment or service request was submitted.`;
  showToast("Demo only — nothing was purchased or processed.");
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});
