const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const contactForm = document.querySelector("#contact-form");
const contactNotice = document.querySelector("#contact-notice");
const newsletterForm = document.querySelector("#newsletter-form");
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

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  contactNotice.textContent = "Your message form is ready, but messages cannot be sent until support is connected.";
});

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  showToast("Thanks for subscribing to VTU9JA updates!");
  newsletterForm.reset();
});
