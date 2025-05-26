import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-list-courses',
  templateUrl: './list-courses.component.html',
  styleUrls: ['./list-courses.component.scss']
})
export class ListCoursesComponent implements OnInit {
  courses: Course[] = [];

  constructor(private coursesService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        console.log('Courses loaded:', data); // ✅ Check the data here
        this.courses = data;
      },
      error: (err) => {
        console.error('Failed to load courses:', err); // ❌ Check if there's an error
      }
    });
  }
  

}
