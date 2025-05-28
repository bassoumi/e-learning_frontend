import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.scss'],
  animations: [
    trigger('viewAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('50ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ListCoursesComponent implements OnInit {
  courses: Course[] = [];
  isListView = false; // Control variable

  constructor(private coursesService: CourseService ,private router: Router) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (data) => {
     // ✅ Check the instructors from the response
        // ✅ Check the data here
        this.courses = data;
        console.log('Courses loaded:', this.courses);
        console.log("instructors from response", this.courses.map(course => course.instructorNames));
        console.log("short desc : " ,this.courses.map(course => course.shortDescription));
        console.log('cover image :',this.courses.map(course => course.coverImage)); // ✅ Check the short description
      },
      error: (err) => {
        console.error('Failed to load courses:', err); // ❌ Check if there's an error
      }
    });
  }
  

  goToCourse(courseId: number): void {
    this.router.navigate(['courses/course-detail', courseId]);
  }

}
