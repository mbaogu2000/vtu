const form = document.querySelector("#bills-form");
const providerSelect = document.querySelector("#bill-provider");
const accountInput = document.querySelector("#bill-account");
const amountInput = document.querySelector("#bill-amount");
const packageSelect = document.querySelector("#tv-package");
const notice = document.querySelector("#bills-notice");
const toast = document.querySelector("#bills-toast");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const electricityProviders = ["Ikeja Electric", "Eko Electric", "Abuja Electric", "Kano Electric", "Ibadan Electric", "Enugu Electric", "Port Harcourt Electric", "Jos Electric", "Kaduna Electric", "Benin Electric"];
const tvProviders = ["DStv", "GOtv", "StarTimes"];
let toastTimeout;

function updatePackageOptions(provider) {
  Array.from(packageSelect.options).forEach((option) => {
    option.hidden = Boolean(option.dataset.provider && option.dataset.provider !== provider);
  });
  packageSelect.value = "";
}

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function selectedType() {
  return form.querySelector('input[name="billType"]:checked')?.value || "";
}

function selectedPackage() {
  return packageSelect.selectedOptions[0];
}

function updateSummary() {
  const type = selectedType();
  const provider = providerSelect.value;
  const packageOption = selectedPackage();
  const isTv = type === "tv";
  document.querySelector("#summary-type").textContent = isTv ? "TV subscription" : type === "electricity" ? "Electricity" : "Choose a bill type";
  document.querySelector("#summary-provider").textContent = provider || "—";
  document.querySelector("#summary-account").textContent = accountInput.value.trim() || "Not entered";
  document.querySelector("#summary-package-row").hidden = !isTv || !packageSelect.value;
  document.querySelector("#summary-package").textContent = packageSelect.value || "—";
  document.querySelector("#summary-customer-row").hidden = type !== "electricity";
  document.querySelector("#summary-customer").textContent = form.querySelector('input[name="customerType"]:checked')?.value || "Prepaid";
  document.querySelector("#summary-total").textContent = formatNaira(isTv ? packageOption?.dataset.price : amountInput.value);
}

function updateBillType(type) {
  const isElectricity = type === "electricity";
  const isTv = type === "tv";
  providerSelect.disabled = false;
  providerSelect.replaceChildren(new Option("Select a provider", "", true, true));
  (isElectricity ? electricityProviders : tvProviders).forEach((provider) => {
    providerSelect.add(new Option(provider, provider));
  });
  document.querySelector("#customer-type-field").hidden = !isElectricity;
  document.querySelector("#electricity-amount-field").hidden = !isElectricity;
  document.querySelector("#tv-package-field").hidden = !isTv;
  amountInput.required = isElectricity;
  packageSelect.required = isTv;
  accountInput.maxLength = isElectricity ? 20 : 15;
  accountInput.minLength = isElectricity ? 6 : 10;
  accountInput.placeholder = isElectricity ? "Enter your meter number" : "Enter your smartcard number";
  document.querySelector("#bill-account-label").textContent = isElectricity ? "Meter number" : "Smartcard / IUC number";
  document.querySelector("#bill-account-help").textContent = isElectricity
    ? "Use the meter number registered with your electricity provider."
    : "Enter the smartcard number linked to your TV account.";
  document.querySelector(".bills-summary-icon i").className = `bi bi-${isElectricity ? "lightning-charge-fill" : "tv-fill"}`;
  providerSelect.value = "";
  updatePackageOptions("");
  packageSelect.value = "";
  amountInput.value = "";
  notice.textContent = "";
  updateSummary();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 4000);
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

form.addEventListener("change", (event) => {
  if (event.target.name === "billType") {
    updateBillType(event.target.value);
    return;
  }
  if (event.target === providerSelect && selectedType() === "tv") {
    updatePackageOptions(providerSelect.value);
    updateSummary();
    return;
  }
  updateSummary();
});
form.addEventListener("input", updateSummary);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    return;
  }

  const type = selectedType();
  const provider = providerSelect.value;
  const account = accountInput.value.trim();
  if (type === "tv") {
    const plan = selectedPackage();
    notice.textContent = `Review: ${plan.value} on ${provider} for account ${account} — ${formatNaira(plan.dataset.price)}.`;
  } else {
    const customerType = form.querySelector('input[name="customerType"]:checked').value.toLowerCase();
    notice.textContent = `Review: ${formatNaira(amountInput.value)} ${customerType} electricity payment to ${provider} for meter ${account}.`;
  }
  showToast("Demo only — no payment was taken and no bill was paid.");
});

const typeFromQuery = new URLSearchParams(window.location.search).get("type");
if (typeFromQuery === "electricity" || typeFromQuery === "tv") {
  const radio = form.querySelector(`input[name="billType"][value="${typeFromQuery}"]`);
  radio.checked = true;
  updateBillType(typeFromQuery);
  const activeNavigationLink = document.querySelector(`.bill-nav-${typeFromQuery}`);
  activeNavigationLink.classList.add("active");
  activeNavigationLink.setAttribute("aria-current", "page");
}

const accountFromQuery = new URLSearchParams(window.location.search).get("account");
if (accountFromQuery) {
  accountInput.value = accountFromQuery;
  updateSummary();
}
