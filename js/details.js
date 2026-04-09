// Global variable to store the currently selected course
let currentCourse = null;


// Load course details when page loads

async function loadCourseDetails() {
  try {

    // Get course ID from URL 
    let params = new URLSearchParams(window.location.search);
    let id = parseInt(params.get('id'));

    // Fetch courses data from JSON file
    let response = await fetch('./data.json');

    // Check if fetch was successful
    if (!response.ok) {
      throw new Error('Failed to load data.json');
    }

    // Convert response to JSON
    let data = await response.json();

    // Try to find course using ID from URL
    currentCourse = data.courses.find(course => course.id === id);

    // If not found → fallback to localStorage (saved course)
    if (!currentCourse) {
      let savedCourse = JSON.parse(localStorage.getItem('selected-course'));

      if (savedCourse) {
        currentCourse = data.courses.find(course => course.id === savedCourse.id);
      }
    }

    // If still not found → show error message
    if (!currentCourse) {
      showCourseNotFound();
      return;
    }

    // Render all course sections
    renderCourseHeader(currentCourse);
    renderTopics(currentCourse.topics);
    renderInstructor(currentCourse);
    renderQuiz(currentCourse.quiz);

    // Attach quiz submit logic
    bindQuizSubmission();

  } catch (error) {

    // Handle any error
    console.error('Error loading course details:', error);
    showCourseNotFound();
  }
}



// Show error if course not found

function showCourseNotFound() {

  // Get all related elements
  const container = document.getElementById('course-details-container');
  const topicsList = document.getElementById('topics-list');
  const instructorCard = document.getElementById('instructor-card');
  const quizForm = document.getElementById('quiz-form');
  const quizResult = document.getElementById('quiz-result');

  // Show error message
  if (container) {
    container.innerHTML = `
      <div class="alert alert-danger">
        Course not found.
      </div>
    `;
  }

  // Clear other sections
  if (topicsList) topicsList.innerHTML = '';
  if (instructorCard) instructorCard.innerHTML = '';
  if (quizForm) quizForm.innerHTML = '';
  if (quizResult) quizResult.textContent = '';
}



// Render course header 

function renderCourseHeader(course) {

  let container = document.getElementById('course-details-container');
  if (!container) return;

  // Get enrolled courses from localStorage
  let enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];

  // Check if user already enrolled
  let alreadyEnrolled = enrolled.some(item => item.id === course.id);

  // Create star rating display
  const fullStars = '★'.repeat(Math.floor(course.rating));
  const emptyStars = '☆'.repeat(5 - Math.floor(course.rating));
  const ratingStars = fullStars + emptyStars;

  // Render HTML content
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
          : `<button class="btn btn-warning" id="enroll-course-btn">Enroll</button>`
      }

      <div id="enroll-message" class="mt-3"></div>
    </div>
  `;

  // Add click event to enroll button
  let enrollButton = document.getElementById('enroll-course-btn');
  if (enrollButton) {
    enrollButton.addEventListener('click', enrollCurrentCourse);
  }
}



// Enroll user in current course

function enrollCurrentCourse() {

  // Get enrolled list
  let enrolled = JSON.parse(localStorage.getItem('enrolled')) || [];

  // Check if already exists
  let exists = enrolled.some(course => course.id === currentCourse.id);

  // Add course if not enrolled
  if (!exists) {
    enrolled.push(currentCourse);

    // Save to localStorage
    localStorage.setItem('enrolled', JSON.stringify(enrolled));

    // Update UI badge
    updateEnrollmentBadge();

    // Show success message
    document.getElementById('enroll-message').innerHTML =
      `<div class="alert alert-success">Course enrolled successfully!</div>`;

    // Re-render header
    renderCourseHeader(currentCourse);
  }
}



// Render topics list

function renderTopics(topics) {

  let topicsList = document.getElementById('topics-list');
  if (!topicsList) return;

  // Convert topics array into list items
  topicsList.innerHTML = topics.map(topic => `<li>${topic}</li>`).join('');
}



// Render instructor info

function renderInstructor(course) {

  const container = document.getElementById('instructor-card');
  if (!container) return;

  // Generate stars
  const fullStars = '★'.repeat(Math.floor(course.rating));
  const emptyStars = '☆'.repeat(5 - Math.floor(course.rating));
  const ratingStars = fullStars + emptyStars;

  // Render instructor card
  container.innerHTML = `
    <h5>${course.instructor}</h5>
    <p class="text-muted">Expert in ${course.category}</p>
    <p>${ratingStars} (${course.rating})</p>
  `;
}



// Render quiz questions

function renderQuiz(quiz) {

  let form = document.getElementById('quiz-form');
  if (!form) return;

  // Loop through questions
  form.innerHTML = quiz.map((question, index) => {

    // Remove empty options
    let validOptions = question.options.filter(opt => opt && opt.trim() !== '');

    return `
      <div class="mb-4">
        <p class="fw-bold">${index + 1}. ${question.question}</p>

        ${validOptions.map((option, optionIndex) => `
          <div class="form-check">
            <input 
              class="form-check-input"
              type="radio"
              name="question-${index}"
              value="${option}"
            >
            <label>${option}</label>
          </div>
        `).join('')}
      </div>
    `;
  }).join('');
}



// Handle quiz submission

function bindQuizSubmission() {

  let submitButton = document.getElementById('submit-quiz');
  if (!submitButton) return;

  submitButton.addEventListener('click', () => {

    let score = 0;

    // Check answers
    currentCourse.quiz.forEach((question, index) => {
      let selected = document.querySelector(`input[name="question-${index}"]:checked`);

      if (selected && selected.value === question.answer) {
        score++;
      }
    });

    // Save score
    localStorage.setItem(`quiz-score-${currentCourse.id}`, score);

    // Display result
    document.getElementById('quiz-result').textContent =
      `Your Score: ${score} / 5`;
  });
}



// Run when page loads

document.addEventListener('DOMContentLoaded', loadCourseDetails);