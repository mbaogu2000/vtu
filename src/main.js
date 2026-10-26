const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const toast = document.querySelector("#toast");
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
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

document.querySelector("#quick-buy").addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const service = form.get("service");
  if (service === "Airtime") {
    const phone = form.get("phone");
    window.location.href = `./buy-airtime.html?phone=${encodeURIComponent(phone)}`;
    return;
  }
  if (service === "Data") {
    const phone = form.get("phone");
    window.location.href = `./buy-data.html?phone=${encodeURIComponent(phone)}`;
    return;
  }
  if (service === "TV Subscription" || service === "Electricity Bills") {
    const type = service === "TV Subscription" ? "tv" : "electricity";
    const phone = form.get("phone");
    const query = new URLSearchParams({ type, account: String(phone) });
    window.location.href = `./pay-bills.html?${query}`;
    return;
  }
  if (service === "Exam Pins") {
    const phone = form.get("phone");
    window.location.href = `./exam-pins.html?phone=${encodeURIComponent(phone)}`;
    return;
  }
  if (service === "More Services") {
    window.location.href = "./more-services.html";
    return;
  }
  showToast(`You're ready to buy ${service}. Sign in or create an account to continue.`);
});

document.querySelector("#newsletter-form").addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Thanks for subscribing to VTU9JA updates!");
  event.currentTarget.reset();
});
