let allCourses = [];
let selectedCategory = 'All';

document.addEventListener('DOMContentLoaded', async function () {
  try {
    const response = await fetch('./assets/data.json');
    const data = await response.json();
    allCourses = data.courses;

    renderCategoryButtons(data.categories);
    renderCourses(allCourses);
    bindFilters();
  } catch (error) {
    console.error('Error loading courses:', error);
  }
});