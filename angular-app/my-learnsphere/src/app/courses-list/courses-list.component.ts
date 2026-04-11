// Import Angular tools, Course interface, and service
import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  // Store all courses and filtered courses
  courses: Course[] = [];
  filteredCourses: Course[] = [];

  // Store enrolled courses locally
  enrolledCourses: Course[] = [];

  // Search and filter values
  searchTerm: string = '';
  selectedCategory: string = 'All';

  // Full required category buttons
  categories: string[] = [
    'All',
    'Web Development',
    'Data Science',
    'Design',
    'Cybersecurity',
    'Mobile Dev',
    'DevOps'
  ];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    // Load all courses
    this.courses = this.coursesService.getCourses();
    this.filteredCourses = [...this.courses];

    // Listen for enrolled courses changes
    this.coursesService.enrolledCourses$.subscribe(courses => {
      this.enrolledCourses = courses;
    });
  }

  // Filter courses by category and search term
  filterCourses(): void {
    let result = this.coursesService.getCoursesByCategory(this.selectedCategory);

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();

      result = result.filter(course =>
        course.title.toLowerCase().includes(term) ||
        course.instructor.toLowerCase().includes(term)
      );
    }

    this.filteredCourses = result;
  }

  // Select a category button
  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterCourses();
  }

  // Handle enroll event from child component
  onEnroll(course: Course): void {
    this.coursesService.enrollCourse(course);
  }

  // Check if course already enrolled
  isCourseEnrolled(courseId: number): boolean {
    return this.enrolledCourses.some(course => course.id === courseId);
  }
}