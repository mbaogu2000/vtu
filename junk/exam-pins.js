const form = document.querySelector("#exam-form");
const phoneInput = document.querySelector("#exam-phone");
const quantitySelect = document.querySelector("#exam-quantity");
const notice = document.querySelector("#exam-notice");
const toast = document.querySelector("#exam-toast");
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

function selectedExam() {
  return form.querySelector('input[name="exam"]:checked');
}

function updateSummary() {
  const exam = selectedExam();
  const quantity = Number(quantitySelect.value) || 1;
  const unitPrice = Number(exam?.dataset.price) || 0;
  document.querySelector("#summary-exam").textContent = exam ? exam.value : "Choose an exam pin";
  document.querySelector("#summary-phone").textContent = phoneInput.value.trim() || "Not entered";
  document.querySelector("#summary-quantity").textContent = `${quantity} ${quantity === 1 ? "pin" : "pins"}`;
  document.querySelector("#summary-unit-price").textContent = formatNaira(unitPrice);
  document.querySelector("#summary-total").textContent = formatNaira(unitPrice * quantity);
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

  const exam = selectedExam();
  const quantity = Number(quantitySelect.value);
  const total = Number(exam.dataset.price) * quantity;
  notice.textContent = `Review: ${quantity} ${quantity === 1 ? "pin" : "pins"} for ${exam.value}, for ${phoneInput.value.trim()} — ${formatNaira(total)}.`;
  showToast("Demo only — no payment was taken and no exam pin was issued.");
});

const phoneFromQuery = new URLSearchParams(window.location.search).get("phone");
if (phoneFromQuery) {
  phoneInput.value = phoneFromQuery;
  updateSummary();
}
