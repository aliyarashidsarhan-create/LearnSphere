// Import Angular decorators and Course interface
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../course';

@Component({
  selector: 'app-course-card',
  templateUrl: './course-card.component.html',
  styleUrls: ['./course-card.component.css']
})
export class CourseCardComponent {
  // Receive a course object from parent
  @Input() course!: Course;

  // Receive current enrolled state from parent
  @Input() isEnrolled: boolean = false;

  // Emit selected course when user clicks Enroll
  @Output() enroll = new EventEmitter<Course>();

  // Send course to parent only if available and not already enrolled
  onEnroll(): void {
    if (this.course.available && !this.isEnrolled) {
      this.enroll.emit(this.course);
    }
  }
}