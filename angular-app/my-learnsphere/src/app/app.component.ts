// Import Angular core and shared service
import { Component, OnInit } from '@angular/core';
import { CoursesService } from './courses.service';
import { Course } from './course';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Store enrolled count for navbar
  enrolledCount: number = 0;

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    // Keep enrolled count updated across the app
    this.coursesService.enrolledCourses$.subscribe((courses: Course[]) => {
      this.enrolledCount = courses.length;
    });
  }
}