function getEnrolledCourses() {
  return JSON.parse(localStorage.getItem("enrolled")) || [];
}

function updateEnrollmentBadge() {
  const badge = document.getElementById("enrolledCount");
  if (badge) {
    badge.textContent = getEnrolledCourses().length;
  }
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
}

function setupThemeToggle() {
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const theme = document.body.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", theme);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  updateEnrollmentBadge();
  setupThemeToggle();
});

function setupNewsletter() {
  const btn = document.getElementById("subscribeBtn");
  const emailInput = document.getElementById("newsletterEmail");
  const msg = document.getElementById("subscribeMessage");

  if (btn && emailInput && msg) {
    btn.addEventListener("click", () => {
      if (emailInput.value.trim() === "") {
        msg.textContent = "Please enter a valid email.";
        msg.className = "text-danger mt-2";
      } else {
        msg.textContent = "Subscribed successfully!";
        msg.className = "text-success mt-2";
        emailInput.value = "";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  applySavedTheme();
  updateEnrollmentBadge();
  setupThemeToggle();
  setupNewsletter();
});