document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch('./assets/data.json');
    const data = await response.json();

    renderStats(data.stats);
    renderFeaturedCourses(data.courses.slice(0, 3));
    renderCategories(data.categories);
  } catch (error) {
    console.error('Error loading home data:', error);
  }
});

function renderStats(stats) {
  const statsRow = document.getElementById('stats-row');
  if (!statsRow) return;

  statsRow.innerHTML = `
    <div class="col-md-4">
      <div class="card stat-card shadow-sm p-4 text-center">
        <i class="fa-solid fa-book fa-2x text-warning mb-3"></i>
        <h3>${stats.totalCourses}</h3>
        <p>Total Courses</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card stat-card shadow-sm p-4 text-center">
        <i class="fa-solid fa-users fa-2x text-warning mb-3"></i>
        <h3>${stats.studentsEnrolled}</h3>
        <p>Students Enrolled</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="card stat-card shadow-sm p-4 text-center">
        <i class="fa-solid fa-chalkboard-user fa-2x text-warning mb-3"></i>
        <h3>${stats.instructors}</h3>
        <p>Instructors</p>
      </div>
    </div>
  `;
}

function renderFeaturedCourses(courses) {
  const container = document.getElementById('featured-courses');
  if (!container) return;

  container.innerHTML = courses.map(course => `
    <div class="col-lg-4 col-md-6">
      <div class="card course-card h-100 shadow-sm">
        <div class="card-body">
          <span class="badge bg-warning text-dark mb-2">${course.category}</span>
          <h5>${course.title}</h5>
          <p class="text-muted mb-1">Instructor: ${course.instructor}</p>
          <p>${'★'.repeat(Math.floor(course.rating))}</p>
          <p class="mb-1"><strong>Duration:</strong> ${course.duration}</p>
          <p class="mb-3"><span class="badge bg-secondary">${course.level}</span></p>
          <a href="course-details.html?id=${course.id}" class="btn btn-outline-warning">Enroll Now</a>
        </div>
      </div>
    </div>
  `).join('');
}

function renderCategories(categories) {
  const container = document.getElementById('categories-row');
  if (!container) return;

  container.innerHTML = categories.map(category => `
    <div class="col-md-4 col-sm-6">
      <div class="card category-card h-100 shadow-sm text-center p-4">
        <div class="mb-3 fs-1">${category.icon}</div>
        <h5>${category.name}</h5>
        <p>${category.courseCount} Courses</p>
      </div>
    </div>
  `).join('');
}