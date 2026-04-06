async function loadSharedComponent(containerId, filePath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(filePath);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(`Failed to load ${filePath}`, error);
  }
}

function getEnrolledCourses() {
  return JSON.parse(localStorage.getItem('enrolled')) || [];
}

function updateEnrollmentBadge() {
  const badge = document.getElementById('enrolled-count');
  if (badge) {
    badge.textContent = getEnrolledCourses().length;
  }
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

function bindThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', function () {
    document.body.classList.toggle('dark');
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });
}

function bindNewsletter() {
  const subscribeBtn = document.getElementById('subscribe-btn');
  const emailInput = document.getElementById('newsletter-email');
  const message = document.getElementById('subscribe-message');

  if (!subscribeBtn || !emailInput || !message) return;

  subscribeBtn.addEventListener('click', function () {
    if (emailInput.value.trim() === '') {
      message.textContent = 'Please enter your email.';
      message.className = 'text-danger mt-2 d-block';
      return;
    }

    message.textContent = 'Subscribed successfully!';
    message.className = 'text-success mt-2 d-block';
    emailInput.value = '';
  });
}

document.addEventListener('DOMContentLoaded', async function () {
  await loadSharedComponent('navbar-container', 'navbar.html');
  await loadSharedComponent('footer-container', 'footer.html');

  applySavedTheme();
  updateEnrollmentBadge();
  bindThemeToggle();
  bindNewsletter();
});