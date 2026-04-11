// Import Angular core, RxJS tools, and Course interface
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Course } from './course';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  // Main courses data used across the application
  private courses: Course[] = [
    {
      id: 1,
      title: 'HTML & CSS Fundamentals',
      category: 'Web Development',
      instructor: 'Sara Al-Rashidi',
      rating: 4.8,
      price: 0,
      duration: '12h 30m',
      level: 'Beginner',
      studentsCount: 3420,
      available: true,
      topics: [
        'Semantic HTML5 tags',
        'CSS Box Model and Flexbox',
        'Responsive design with media queries',
        'CSS variables and custom properties',
        'Forms and input elements'
      ]
    },
    {
      id: 2,
      title: 'Bootstrap 5 — Responsive Layouts',
      category: 'Web Development',
      instructor: 'Omar Khalil',
      rating: 4.6,
      price: 15,
      duration: '8h 45m',
      level: 'Beginner',
      studentsCount: 2185,
      available: true,
      topics: [
        'Bootstrap grid system',
        'Responsive breakpoints',
        'Bootstrap components',
        'Utility classes',
        'Bootstrap forms'
      ]
    },
    {
      id: 3,
      title: 'JavaScript ES6+ — From Zero to DOM',
      category: 'Web Development',
      instructor: 'Layla Mansour',
      rating: 4.9,
      price: 25,
      duration: '22h 00m',
      level: 'Intermediate',
      studentsCount: 5610,
      available: true,
      topics: [
        'Variables and data types',
        'Functions',
        'Array methods',
        'DOM manipulation',
        'LocalStorage'
      ]
    },
    {
      id: 4,
      title: 'TypeScript Essentials',
      category: 'Web Development',
      instructor: 'Faris Al-Siyabi',
      rating: 4.7,
      price: 20,
      duration: '10h 15m',
      level: 'Intermediate',
      studentsCount: 1870,
      available: true,
      topics: [
        'TypeScript vs JavaScript',
        'Static typing',
        'Interfaces and type aliases',
        'Classes and access modifiers',
        'Compilation with tsc'
      ]
    },
    {
      id: 5,
      title: 'Angular 16 — Complete Guide',
      category: 'Web Development',
      instructor: 'Nadia Hassan',
      rating: 4.9,
      price: 35,
      duration: '28h 00m',
      level: 'Advanced',
      studentsCount: 2940,
      available: true,
      topics: [
        'Angular CLI',
        'Data binding',
        'ngIf, ngFor, ngSwitch',
        'Services and DI',
        '@Input() and @Output()'
      ]
    },
    {
      id: 6,
      title: 'UI/UX Design Fundamentals',
      category: 'Design',
      instructor: 'Amina Qasim',
      rating: 4.5,
      price: 18,
      duration: '9h 00m',
      level: 'Beginner',
      studentsCount: 1320,
      available: true,
      topics: [
        'Design principles',
        'Colour theory',
        'Wireframing',
        'Accessibility',
        'Figma basics'
      ]
    },
    {
      id: 7,
      title: 'Python for Data Science',
      category: 'Data Science',
      instructor: 'Khalid Al-Farsi',
      rating: 4.7,
      price: 30,
      duration: '18h 30m',
      level: 'Intermediate',
      studentsCount: 2210,
      available: true,
      topics: [
        'Python basics',
        'NumPy',
        'Pandas',
        'Matplotlib',
        'Machine learning intro'
      ]
    },
    {
      id: 8,
      title: 'Ethical Hacking & Network Security',
      category: 'Cybersecurity',
      instructor: 'Yousef Al-Balushi',
      rating: 4.8,
      price: 40,
      duration: '24h 00m',
      level: 'Advanced',
      studentsCount: 980,
      available: false,
      topics: [
        'OSI model',
        'Reconnaissance',
        'Vulnerability scanning',
        'OWASP Top 10',
        'Penetration testing'
      ]
    }
  ];

  // Store enrolled courses and sync them across components
  private enrolledCourses: Course[] = [];
  private enrolledCoursesSubject = new BehaviorSubject<Course[]>([]);
  enrolledCourses$ = this.enrolledCoursesSubject.asObservable();

  constructor() {
    // Load enrolled courses from localStorage when the service starts
    const saved = localStorage.getItem('enrolledCourses');
    this.enrolledCourses = saved ? JSON.parse(saved) : [];
    this.enrolledCoursesSubject.next([...this.enrolledCourses]);
  }

  // Return all courses
  getCourses(): Course[] {
    return [...this.courses];
  }

  // Filter courses by category
  getCoursesByCategory(category: string): Course[] {
    if (category === 'All') {
      return [...this.courses];
    }
    return this.courses.filter(course => course.category === category);
  }

  // Return top rated courses
  getTopRated(n: number): Course[] {
    return [...this.courses].sort((a, b) => b.rating - a.rating).slice(0, n);
  }

  // Return enrolled courses
  getEnrolledCourses(): Course[] {
    return [...this.enrolledCourses];
  }

  // Add a course to enrolled list only if it is not already added
  enrollCourse(course: Course): void {
    const exists = this.enrolledCourses.find(c => c.id === course.id);

    if (!exists) {
      this.enrolledCourses.push(course);
      localStorage.setItem('enrolledCourses', JSON.stringify(this.enrolledCourses));
      this.enrolledCoursesSubject.next([...this.enrolledCourses]);
    }
  }

  // Check if a course is already enrolled
  isEnrolled(courseId: number): boolean {
    return this.enrolledCourses.some(course => course.id === courseId);
  }
}