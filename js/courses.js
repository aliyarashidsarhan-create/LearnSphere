let allCourses = [];
let selectedCategory = 'All';
// load the course data from data.json
async function loadCourses() {
  try {
    const response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error('Failed to load data.json');
    }

    const data = await response.json();
    allCourses = data.courses;

    renderCategoryButtons(data.categories);
    renderCourses(allCourses);
    bindFilters();
  } catch (error) {
    console.error('Error loading courses:', error);

    const container = document.getElementById('courses-container');
    if (container) {
      container.innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            Failed to load courses data.
          </div>
        </div>
      `;
    }
  }
}
// category filter buttons
function renderCategoryButtons(categories) {
  const container = document.getElementById('category-buttons');
  if (!container) return;

  const buttons = ['All', ...categories.map(cat => cat.name)];

  container.innerHTML = buttons.map(category => `
    <button class="btn btn-outline-primary filter-btn ${category === 'All' ? 'active' : ''}" data-category="${category}">
      ${category}
    </button>
  `).join('');

  container.addEventListener('click', (e) => {
    if (e.target.matches('[data-category]')) {
      selectedCategory = e.target.dataset.category;
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
      applyFilters();
    }
  });
}

function renderCourses(courses) {
  let container = document.getElementById('courses-container');
  if (!container) return;

  let enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];

  if (courses.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <h4 class="mb-2">No courses found</h4>
          <p class="mb-0">Try changing the filters or search text.</p>
        </div>
      </div>
    `;
    return;
  }

  container.innerHTML = courses.map(course => {
    const isEnrolled = enrolled.some(item => item.id === course.id);

    const fullStars = '★'.repeat(Math.floor(course.rating));
    const emptyStars = '☆'.repeat(5 - Math.floor(course.rating));
    const ratingStars = fullStars + emptyStars;
  //  card color 
    const colorMap = {
      'Web Development': '#6f42c1',
      'Design': '#e83e8c',
      'Data Science': '#198754',
      'Cybersecurity': '#dc3545',
      'Mobile Dev': '#fd7e14',
      'DevOps': '#0d6efd'
    };

    let buttonText = 'Enroll';
    if (!course.available) {
      buttonText = 'Coming Soon';
    } else if (isEnrolled) {
      buttonText = 'Enrolled ✓';
    }
    // cource card content
    return `
      <div class="col-lg-4 col-md-6">
        <div class="card course-card h-100 position-relative">
          ${!course.available ? '<span class="coming-soon-badge">Coming Soon</span>' : ''}
          <div class="course-placeholder" style="background:${colorMap[course.category] || '#6c757d'}">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <div class="card-body">
            <h5 class="card-title">${course.title}</h5>
            <p class="mb-2"><i class="fa-solid fa-user me-2"></i>${course.instructor}</p>

            <div class="d-flex flex-wrap gap-2 mb-2">
              <span class="badge bg-warning text-dark">${course.category}</span>
              <span class="badge bg-primary">${course.level}</span>
            </div>

            <p class="rating-stars mb-2">${ratingStars}</p>
            <p class="mb-1"><i class="fa-regular fa-clock me-2"></i>${course.duration}</p>
            <p class="mb-1"><i class="fa-solid fa-users me-2"></i>${course.studentsCount} students</p>
            <p class="fw-bold text-primary mb-3">$${course.price}</p>

            <div class="d-flex gap-2">
              <a href="course-details.html?id=${course.id}" class="btn btn-outline-secondary btn-sm flex-grow-1">Details</a>
              <button
                class="btn ${isEnrolled ? 'btn-success' : 'btn-warning'} btn-sm flex-grow-1 enroll-btn"
                data-id="${course.id}"
                ${isEnrolled || !course.available ? 'disabled' : ''}
              >
                ${buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  bindEnrollButtons();
}
// ربط أزرار Enroll
function bindEnrollButtons() {
  document.querySelectorAll('.enroll-btn').forEach(button => {
    button.addEventListener('click', () => {
      let courseId = Number(button.dataset.id);
      let selectedCourse = allCourses.find(course => course.id === courseId);

      let enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];
      let exists = enrolled.some(course => course.id === courseId);

      if (!exists && selectedCourse) {
        enrolled.push(selectedCourse);
        localStorage.setItem('enrolled', JSON.stringify(enrolled));

        button.textContent = 'Enrolled ✓';
        button.disabled = true;
        button.classList.remove('btn-warning');
        button.classList.add('btn-success');

        updateEnrollmentBadge();
      }
    });
  });
}

function bindFilters() {
  document.getElementById('search-input')?.addEventListener('keyup', applyFilters);
  document.getElementById('level-filter')?.addEventListener('change', applyFilters);
  document.getElementById('sort-filter')?.addEventListener('change', applyFilters);
}

function applyFilters() {
  const searchValue = document.getElementById('search-input').value.toLowerCase().trim();
  const levelValue = document.getElementById('level-filter').value;
  const sortValue = document.getElementById('sort-filter').value;

  let filtered = [...allCourses];

  if (selectedCategory !== 'All') {
    filtered = filtered.filter(course => course.category === selectedCategory);
  }

  if (levelValue !== 'All') {
    filtered = filtered.filter(course => course.level === levelValue);
  }

  if (searchValue) {
    filtered = filtered.filter(course =>
      course.title.toLowerCase().includes(searchValue) ||
      course.instructor.toLowerCase().includes(searchValue)
    );
  }

  if (sortValue === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortValue === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'duration') {
    filtered.sort((a, b) => convertDurationToMinutes(a.duration) - convertDurationToMinutes(b.duration));
  }

  renderCourses(filtered);
}
// number houer
function convertDurationToMinutes(duration) {
  let parts = duration.match(/(\d+)h\s*(\d+)m/i);
  if (!parts) return 0;
  return Number(parts[1]) * 60 + Number(parts[2]);
}

document.addEventListener('DOMContentLoaded', loadCourses);