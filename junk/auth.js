document.querySelectorAll(".password-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const input = document.getElementById(toggle.getAttribute("aria-controls"));
    const showingPassword = input.type === "password";
    input.type = showingPassword ? "text" : "password";
    toggle.setAttribute("aria-label", showingPassword ? "Hide password" : "Show password");
    toggle.querySelector("i").className = `bi bi-eye${showingPassword ? "-slash" : ""}`;
  });
});

const form = document.querySelector(".auth-form");
const notice = document.querySelector(".auth-notice");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

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

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const password = form.querySelector('[name="password"]');
  const confirmPassword = form.querySelector('[name="confirm-password"]');
  if (confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords do not match.");
    confirmPassword.reportValidity();
    return;
  }

  if (confirmPassword) {
    confirmPassword.setCustomValidity("");
  }
  notice.textContent = "This page is ready to connect to an authentication service.";
});

const newsletterForm = document.querySelector("#newsletter-form");
const toast = document.querySelector("#toast");
let toastTimeout;

newsletterForm.addEventListener("submit", (event) => {
  event.preventDefault();
  toast.textContent = "Thanks for subscribing to VTU9JA updates!";
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 3200);
  newsletterForm.reset();
});

form.querySelectorAll('[name="password"], [name="confirm-password"]').forEach((input) => {
  input.addEventListener("input", () => {
    const confirmPassword = form.querySelector('[name="confirm-password"]');
    if (confirmPassword) {
      confirmPassword.setCustomValidity("");
    }
  });
});
