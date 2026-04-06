async function loadSharedComponent(containerId, filePath) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch(filePath);
    const html = await response.text();
    container.innerHTML = html;
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  await loadSharedComponent('navbar-container', 'navbar.html');
  await loadSharedComponent('footer-container', 'footer.html');

  applySavedTheme();
  updateEnrollmentBadge();
  bindThemeToggle();
});