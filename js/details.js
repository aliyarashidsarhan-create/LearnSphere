const params = new URLSearchParams(window.location.search);
const courseId = parseInt(params.get('id'));

localStorage.setItem(`quiz_${courseId}`, score);