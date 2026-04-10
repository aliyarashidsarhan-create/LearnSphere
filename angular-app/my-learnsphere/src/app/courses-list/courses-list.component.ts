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

  //  Store enrolled courses count from shared service
  enrolledCourses: Course[] = [];

  // Variables for search and selected category
  searchTerm: string = '';
  selectedCategory: string = 'All';

  //  Category buttons
  categories: string[] = ['All', 'Web Development', 'Data Science', 'Design', 'Cybersecurity'];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    //  Load all courses
    this.courses = this.coursesService.getCourses();
    this.filteredCourses = this.courses;

    //  Load enrolled courses from shared service
    this.enrolledCourses = this.coursesService.getEnrolledCourses();
  }

  filterCourses(): void {
    //  First filter by category
    let result = this.coursesService.getCoursesByCategory(this.selectedCategory);

    // Step 8: Then filter by search term
    if (this.searchTerm.trim()) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Update displayed courses
    this.filteredCourses = result;
  }

  selectCategory(category: string): void {
    //  Update selected category and re-filter
    this.selectedCategory = category;
    this.filterCourses();
  }

  onEnroll(course: Course): void {
    //Enroll the selected course using shared service
    this.coursesService.enrollCourse(course);

    // Refresh enrolled list so navbar count updates
    this.enrolledCourses = this.coursesService.getEnrolledCourses();
  }
}
