let currentCourse = null;

async function loadCourseDetails() {
  try {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'));

    const response = await fetch('./data.json');
    const data = await response.json();

    currentCourse = data.courses.find(course => course.id === id);

    if (!currentCourse) return;

    renderCourseHeader(currentCourse);
    renderTopics(currentCourse.topics);
    renderInstructor(currentCourse);
    renderQuiz(currentCourse.quiz);
    bindQuizSubmission();
  } catch (error) {
    console.error('Error loading course details:', error);
  }
}

function renderCourseHeader(course) {
  const container = document.getElementById('course-details-container');
  const enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];
  const alreadyEnrolled = enrolled.some(item => item.id === course.id);

  container.innerHTML = `
    <div class="card p-4">
      <span class="badge bg-warning text-dark mb-3 w-auto">${course.category}</span>
      <h1>${course.title}</h1>
      <p class="mb-2"><i class="fa-solid fa-user me-2"></i>${course.instructor}</p>
      <p class="mb-2"><span class="rating-stars">${'★'.repeat(Math.floor(course.rating))}</span> (${course.rating})</p>
      <p class="mb-2"><i class="fa-regular fa-clock me-2"></i>${course.duration}</p>
      <p class="mb-3"><i class="fa-solid fa-users me-2"></i>${course.studentsCount} students enrolled</p>
      ${
        alreadyEnrolled
          ? '<span class="text-success fw-bold">You are enrolled ✓</span>'
          : `<button class="btn btn-warning w-auto" id="enroll-course-btn">Enroll in This Course</button>`
      }
      <div id="enroll-message" class="mt-3"></div>
    </div>
  `;

  const enrollButton = document.getElementById('enroll-course-btn');
  if (enrollButton) {
    enrollButton.addEventListener('click', enrollCurrentCourse);
  }
}

function enrollCurrentCourse() {
  let enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];
  const exists = enrolled.some(course => course.id === currentCourse.id);

  if (!exists) {
    enrolled.push(currentCourse);
    localStorage.setItem('enrolled', JSON.stringify(enrolled));
    updateEnrollmentBadge();
    document.getElementById('enroll-message').innerHTML =
      `<div class="alert alert-success">Course enrolled successfully!</div>`;
    renderCourseHeader(currentCourse);
  }
}

function renderTopics(topics) {
  const topicsList = document.getElementById('topics-list');
  topicsList.innerHTML = topics.map(topic => `<li>${topic}</li>`).join('');
}

function renderInstructor(course) {
  const container = document.getElementById('instructor-card');
  container.innerHTML = `
    <h5>${course.instructor}</h5>
    <p class="text-muted">Expert instructor in ${course.category}</p>
    <p><span class="rating-stars">${'★'.repeat(Math.floor(course.rating))}</span> (${course.rating})</p>
    <p>Passionate about helping learners build strong practical skills through real projects.</p>
  `;
}

function renderQuiz(quiz) {
  const form = document.getElementById('quiz-form');

  form.innerHTML = quiz.map((question, index) => `
    <div class="mb-4">
      <p class="fw-bold">${index + 1}. ${question.question}</p>
      ${question.options.map(option => `
        <div class="form-check">
          <input class="form-check-input" type="radio" name="question-${index}" value="${option}">
          <label class="form-check-label">${option}</label>
        </div>
      `).join('')}
    </div>
  `).join('');
}

function bindQuizSubmission() {
  const submitButton = document.getElementById('submit-quiz');
  submitButton.addEventListener('click', () => {
    let score = 0;

    currentCourse.quiz.forEach((question, index) => {
      const selected = document.querySelector(`input[name="question-${index}"]:checked`);
      if (selected && selected.value === question.answer) {
        score++;
      }
    });

    localStorage.setItem(`quiz-score-${currentCourse.id}`, score);
    document.getElementById('quiz-result').textContent = `Your Score: ${score} / 5`;
  });
}

document.addEventListener('DOMContentLoaded', loadCourseDetails);