let currentCourse = null;
// Loading the course from query slet
async function loadCourseDetails() {
  try {
    let params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get('id'));

    let response = await fetch('./data.json');

    if (!response.ok) {
      throw new Error('Failed to load data.json');
    }

    let data = await response.json();

    // First try query string id
    currentCourse = data.courses.find(course => course.id === id);

    // Fallback: selected course from localStorage
    if (!currentCourse) {
      let savedCourse = JSON.parse(localStorage.getItem('selected-course'));
      if (savedCourse) {
        currentCourse = data.courses.find(course => course.id === savedCourse.id);
      }
    }

    if (!currentCourse) {
      showCourseNotFound();
      return;
    }
 
    renderCourseHeader(currentCourse);
    renderTopics(currentCourse.topics);
    renderInstructor(currentCourse);
    renderQuiz(currentCourse.quiz);
    bindQuizSubmission();
  } catch (error) {
    console.error('Error loading course details:', error);
    showCourseNotFound();
  }
}

function showCourseNotFound() {
  const container = document.getElementById('course-details-container');
  const topicsList = document.getElementById('topics-list');
  const instructorCard = document.getElementById('instructor-card');
  const quizForm = document.getElementById('quiz-form');
  const quizResult = document.getElementById('quiz-result');

  if (container) {
    container.innerHTML = `
      <div class="alert alert-danger">
        Course not found.
      </div>
    `;
  }

  if (topicsList) topicsList.innerHTML = '';
  if (instructorCard) instructorCard.innerHTML = '';
  if (quizForm) quizForm.innerHTML = '';
  if (quizResult) quizResult.textContent = '';
}
 //  Rendering the course header
function renderCourseHeader(course) {
  const container = document.getElementById('course-details-container');
  if (!container) return;

  const enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];
  const alreadyEnrolled = enrolled.some(item => item.id === course.id);

  const fullStars = '★'.repeat(Math.floor(course.rating));
  const emptyStars = '☆'.repeat(5 - Math.floor(course.rating));
  const ratingStars = fullStars + emptyStars;

  container.innerHTML = `
    <div class="card p-4">
      <div class="d-flex flex-wrap gap-2 mb-3">
        <span class="badge bg-warning text-dark">${course.category}</span>
        <span class="badge bg-primary">${course.level}</span>
      </div>

      <h1>${course.title}</h1>

      <p class="mb-2">
        <i class="fa-solid fa-user me-2"></i>${course.instructor}
      </p>

      <p class="mb-2">
        <span class="rating-stars">${ratingStars}</span> (${course.rating})
      </p>

      <p class="mb-2">
        <i class="fa-regular fa-clock me-2"></i>${course.duration}
      </p>

      <p class="mb-3">
        <i class="fa-solid fa-users me-2"></i>${course.studentsCount} students enrolled
      </p>

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
// Enrolling the course
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
  if (!topicsList) return;

  topicsList.innerHTML = topics.map(topic => `<li>${topic}</li>`).join('');
}

function renderInstructor(course) {
  const container = document.getElementById('instructor-card');
  if (!container) return;

  const fullStars = '★'.repeat(Math.floor(course.rating));
  const emptyStars = '☆'.repeat(5 - Math.floor(course.rating));
  const ratingStars = fullStars + emptyStars;

  container.innerHTML = `
    <h5>${course.instructor}</h5>
    <p class="text-muted">Expert instructor in ${course.category}</p>
    <p><span class="rating-stars">${ratingStars}</span> (${course.rating})</p>
    <p>Passionate about helping learners build strong practical skills through real projects.</p>
  `;
}

function renderQuiz(quiz) {
  const form = document.getElementById('quiz-form');
  if (!form) return;

  form.innerHTML = quiz.map((question, index) => {
    const validOptions = question.options.filter(option => option && option.trim() !== '');

    return `
      <div class="mb-4">
        <p class="fw-bold">${index + 1}. ${question.question}</p>
        ${validOptions.map((option, optionIndex) => `
          <div class="form-check">
            <input
              class="form-check-input"
              type="radio"
              name="question-${index}"
              id="question-${index}-option-${optionIndex}"
              value="${option}"
            >
            <label class="form-check-label" for="question-${index}-option-${optionIndex}">
              ${option}
            </label>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}

function bindQuizSubmission() {
  const submitButton = document.getElementById('submit-quiz');
  if (!submitButton) return;

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