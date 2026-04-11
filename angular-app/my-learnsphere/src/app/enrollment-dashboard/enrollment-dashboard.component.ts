// Import Angular tools, Course interface, and service
import { Component, OnInit } from '@angular/core';
import { Course } from '../course';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-enrollment-dashboard',
  templateUrl: './enrollment-dashboard.component.html',
  styleUrls: ['./enrollment-dashboard.component.css']
})
export class EnrollmentDashboardComponent implements OnInit {
  // Local enrolled courses array
  enrolledCourses: Course[] = [];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    // Keep dashboard synced with enrolled courses
    this.coursesService.enrolledCourses$.subscribe(courses => {
      this.enrolledCourses = courses;
    });
  }
}