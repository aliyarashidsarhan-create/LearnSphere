import { Component } from '@angular/core';
import { Course } from '../course';
import { CoursesService } from '../courses.service';

@Component({
  selector: 'app-enrollment-dashboard',
  templateUrl: './enrollment-dashboard.component.html',
  styleUrls: ['./enrollment-dashboard.component.css']
})
export class EnrollmentDashboardComponent {
  enrolledCourses: Course[] = [];

  constructor(private coursesService: CoursesService) {
    this.enrolledCourses = this.coursesService.getTopRated(3);
  }
}
