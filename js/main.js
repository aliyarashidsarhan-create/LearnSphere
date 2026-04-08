const navbarHTML = `
<nav class="navbar navbar-expand-lg navbar-light shadow-sm sticky-top custom-navbar">
  <div class="container">
    <a class="navbar-brand fw-bold" href="index.html">
      <i class="fa-solid fa-graduation-cap me-2 text-warning"></i>LearnSphere
    </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">
        <li class="nav-item">
          <a class="nav-link" href="index.html">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="courses.html">Courses</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="course-details.html">Instructors</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="index.html#contact">Contact</a>
        </li>

        <li class="nav-item">
          <a class="nav-link position-relative" href="dashboard.html">
            Enrolled
            <span id="enrolled-count" class="badge rounded-pill bg-warning text-dark ms-1">0</span>
          </a>
        </li>

        <li class="nav-item">
          <button id="theme-toggle" class="btn btn-outline-dark btn-sm ms-lg-2" type="button">
            <i class="fa-solid fa-moon"></i>
          </button>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;

const footerHTML = `
<footer class="site-footer py-5 mt-5" id="contact">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <h5 class="fw-bold mb-3">
          <i class="fa-solid fa-graduation-cap me-2 text-warning"></i>LearnSphere
        </h5>
        <p>Learn without limits with practical online courses in development, design, data, and security.</p>
      </div>

      <div class="col-md-4">
        <h6 class="fw-bold mb-3">Quick Links</h6>
        <ul class="list-unstyled">
          <li><a href="index.html">Home</a></li>
          <li><a href="courses.html">Courses</a></li>
          <li><a href="dashboard.html">Dashboard</a></li>
        </ul>
      </div>

      <div class="col-md-4">
        <h6 class="fw-bold mb-3">Newsletter</h6>
        <label for="newsletter-email" class="form-label visually-hidden">Email</label>
        <input type="email" id="newsletter-email" class="form-control mb-2" placeholder="Enter your email">
        <button id="subscribe-btn" class="btn btn-warning w-100">Subscribe</button>
        <small id="subscribe-message" class="d-block mt-2"></small>

        <div class="social-icons mt-3">
          <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#"><i class="fa-brands fa-instagram"></i></a>
          <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="#"><i class="fa-brands fa-x-twitter"></i></a>
        </div>
      </div>
    </div>

    <hr class="my-4">
    <p class="text-center mb-0">&copy; 2026 LearnSphere. All rights reserved.</p>
  </div>
</footer>
`;

function loadSharedComponents() {
  const navbarContainer = document.getElementById('navbar-container');
  const footerContainer = document.getElementById('footer-container');

  if (navbarContainer) navbarContainer.innerHTML = navbarHTML;
  if (footerContainer) footerContainer.innerHTML = footerHTML;
}

function getEnrolledCourses() {
  return JSON.parse(localStorage.getItem('enrolled')) || [];
}

function updateEnrollmentBadge() {
  const badge = document.getElementById('enrolled-count');
  if (badge) badge.textContent = getEnrolledCourses().length;
}

function applySavedTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.toggle('dark', savedTheme === 'dark');
  updateThemeIcon();
}

function updateThemeIcon() {
  const icon = document.querySelector('#theme-toggle i');
  if (!icon) return;

  if (document.body.classList.contains('dark')) {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

function bindThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const theme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    updateThemeIcon();
  });
}

function bindNewsletter() {
  const subscribeBtn = document.getElementById('subscribe-btn');
  const emailInput = document.getElementById('newsletter-email');
  const message = document.getElementById('subscribe-message');

  if (!subscribeBtn || !emailInput || !message) return;

  subscribeBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();

    if (email === '') {
      message.textContent = 'Please enter your email.';
      message.className = 'text-danger mt-2 d-block';
      return;
    }

    message.textContent = 'Subscribed successfully!';
    message.className = 'text-success mt-2 d-block';
    emailInput.value = '';
  });
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSharedComponents();
  applySavedTheme();
  updateEnrollmentBadge();
  bindThemeToggle();
  bindNewsletter();
  setActiveNavLink();
});