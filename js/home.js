// take data from date.jason
async function loadHomeData() {
  try {
    let response = await fetch('./data.json');
    let data = await response.json();

    renderStats(data.stats);
    // take first 3 element
    renderFeaturedCourses(data.courses.slice(0, 3));
    renderCategories(data.categories);
  } catch (error) {
    console.error('Error loading home data:', error);
  }
}
// card that have state (total corse, Students Enrolled ,Instructors)
function renderStats(stats) {
  let container = document.getElementById('stats-container');
  if (!container) return;

  container.innerHTML = `
    <div class="col-md-4">
      <div class="stat-card card h-100">
        <i class="fa-solid fa-book"></i>
        <h3>${stats.totalCourses}</h3>
        <p class="mb-0">Total Courses</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card card h-100">
        <i class="fa-solid fa-users"></i>
        <h3>${stats.studentsEnrolled}</h3>
        <p class="mb-0">Students Enrolled</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card card h-100">
        <i class="fa-solid fa-chalkboard-user"></i>
        <h3>${stats.instructors}</h3>
        <p class="mb-0">Instructors</p>
      </div>
    </div>
  `;
}
// Featured Courses section
function renderFeaturedCourses(courses) {
  const container = document.getElementById('featured-courses-container');
  if (!container) return;

  container.innerHTML = courses.map(course => `
    <div class="col-lg-4 col-md-6">
      <div class="card course-card h-100">
        <div class="course-placeholder" style="background: linear-gradient(135deg, #6f42c1, #9b6bff);">
          <i class="fa-solid fa-laptop-code"></i>
        </div>
        <div class="card-body">
          <span class="badge bg-warning text-dark mb-2">${course.category}</span>
          <h5 class="card-title">${course.title}</h5>
          <p class="text-muted mb-2"><i class="fa-solid fa-user me-2"></i>${course.instructor}</p>
          <p class="rating-stars mb-2">${'★'.repeat(Math.floor(course.rating))}</p>
          <p class="mb-2"><i class="fa-regular fa-clock me-2"></i>${course.duration}</p>
          <span class="badge bg-primary">${course.level}</span>
        </div>
        <div class="card-footer bg-transparent border-0 pb-4">
          <a href="course-details.html?id=${course.id}" class="btn btn-warning w-100">Enroll Now</a>
        </div>
      </div>
    </div>
  `).join('');
}
//   Categories section ------------------
function renderCategories(categories) {
  let iconMap = {
    'Web Development': 'fa-solid fa-code',
    'Data Science': 'fa-solid fa-chart-line',
    'Design': 'fa-solid fa-pen-ruler',
    'Cybersecurity': 'fa-solid fa-shield-halved',
    'Mobile Dev': 'fa-solid fa-mobile-screen-button',
    'DevOps': 'fa-solid fa-gears'
  };

  let container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = categories.map(category => `
    <div class="col-lg-4 col-md-6">
      <div class="card category-card h-100 text-center p-4">
        <div class="category-icon">
          <i class="${iconMap[category.name] || 'fa-solid fa-folder'}"></i>
        </div>
        <h5>${category.name}</h5>
        <p class="mb-0 text-muted">${category.courseCount} Courses</p>
      </div>
    </div>
  `).join('');
}
// loadHomeData
document.addEventListener('DOMContentLoaded', loadHomeData);