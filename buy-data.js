const form = document.querySelector("#data-form");
const phoneInput = document.querySelector("#data-phone");
const notice = document.querySelector("#data-notice");
const toast = document.querySelector("#data-toast");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
let toastTimeout;

function formatNaira(amount) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
}

function updateSummary() {
  const network = form.querySelector('input[name="network"]:checked');
  const plan = form.querySelector('input[name="plan"]:checked');
  document.querySelector("#summary-network").textContent = network ? network.value : "Choose a network";
  document.querySelector("#summary-phone").textContent = phoneInput.value.trim() || "Not entered";
  document.querySelector("#summary-plan").textContent = plan ? plan.value : "Choose a plan";
  document.querySelector("#summary-validity").textContent = plan ? plan.dataset.validity : "—";
  document.querySelector("#summary-total").textContent = formatNaira(plan?.dataset.price);
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

form.addEventListener("input", updateSummary);
form.addEventListener("change", updateSummary);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!form.reportValidity()) {
    return;
  }

  const network = form.querySelector('input[name="network"]:checked').value;
  const plan = form.querySelector('input[name="plan"]:checked');
  notice.textContent = `Review: ${plan.value} for ${phoneInput.value.trim()} on ${network} — ${formatNaira(plan.dataset.price)}, valid for ${plan.dataset.validity}.`;
  showToast("Demo only — no payment was taken and no data was sent.");
});

const phoneFromQuery = new URLSearchParams(window.location.search).get("phone");
if (phoneFromQuery) {
  phoneInput.value = phoneFromQuery;
  updateSummary();
}
