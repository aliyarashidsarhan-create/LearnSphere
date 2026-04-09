import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.css']
})
export class CoursesListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  enrolledCourses: Course[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'All';

  categories: string[] = ['All', 'Web Development', 'Data Science', 'Design', 'Cybersecurity'];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.courses = this.coursesService.getCourses();
    this.filteredCourses = this.courses;
  }

  filterCourses(): void {
    let result = this.coursesService.getCoursesByCategory(this.selectedCategory);

    if (this.searchTerm.trim()) {
      result = result.filter(course =>
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredCourses = result;
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.filterCourses();
  }

  onEnroll(course: Course): void {
    const exists = this.enrolledCourses.find(c => c.id === course.id);
    if (!exists) {
      this.enrolledCourses.push(course);
    }
  }
}
