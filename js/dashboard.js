function loadDashboard() {
  const enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];
  const container = document.getElementById('dashboard-courses');
  const statsContainer = document.getElementById('dashboard-stats');

  if (!enrolled.length) {
    statsContainer.innerHTML = '';
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-state">
          <h3>You haven't enrolled in any courses yet.</h3>
          <a href="courses.html" class="btn btn-warning mt-3">Browse Courses</a>
        </div>
      </div>
    `;
    return;
  }

  let totalCompleted = 0;
  let totalScore = 0;

  container.innerHTML = enrolled.map(course => {
    const score = Number(localStorage.getItem(`quiz-score-${course.id}`)) || 0;
    const percent = score * 20;
    totalScore += score;
    if (score === 5) totalCompleted++;

    let progressClass = 'bg-danger';
    if (percent >= 80) progressClass = 'bg-success';
    else if (percent >= 40) progressClass = 'bg-warning';

    return `
      <div class="col-lg-4 col-md-6">
        <div class="card p-4 h-100">
          <h5>${course.title}</h5>
          <p class="mb-1"><strong>Category:</strong> ${course.category}</p>
          <p class="mb-1"><strong>Instructor:</strong> ${course.instructor}</p>
          <p class="mb-3"><strong>Level:</strong> ${course.level}</p>

          <div class="progress mb-3">
            <div class="progress-bar ${progressClass}" role="progressbar" style="width: ${percent}%"></div>
          </div>
          <p class="mb-3">Quiz Score: ${score} / 5</p>

          <button class="btn btn-outline-danger btn-sm unenroll-btn" data-id="${course.id}">
            Unenroll
          </button>
        </div>
      </div>
    `;
  }).join('');

  const averageScore = (totalScore / enrolled.length).toFixed(1);

  statsContainer.innerHTML = `
    <div class="col-md-4">
      <div class="stat-card card h-100">
        <i class="fa-solid fa-book-open"></i>
        <h3>${enrolled.length}</h3>
        <p class="mb-0">Total Enrolled</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card card h-100">
        <i class="fa-solid fa-circle-check"></i>
        <h3>${totalCompleted}</h3>
        <p class="mb-0">Completed</p>
      </div>
    </div>
    <div class="col-md-4">
      <div class="stat-card card h-100">
        <i class="fa-solid fa-chart-simple"></i>
        <h3>${averageScore}</h3>
        <p class="mb-0">Average Score</p>
      </div>
    </div>
  `;

  bindUnenrollButtons();
}

function bindUnenrollButtons() {
  document.querySelectorAll('.unenroll-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      let enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];
      enrolled = enrolled.filter(course => course.id !== id);
      localStorage.setItem('enrolled', JSON.stringify(enrolled));
      updateEnrollmentBadge();
      loadDashboard();
    });
  });
}

document.addEventListener('DOMContentLoaded', loadDashboard);