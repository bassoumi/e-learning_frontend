import { Component, OnInit } from '@angular/core';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';

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
  searchTitle: string | null = null;
  isListView = false; // Control variable
  categoryName = '';
  categoryTags: string[] = [];

  constructor(
    private coursesService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // subscribe to query-params for "title"
    this.route.queryParamMap.subscribe(params => {
      const title = params.get('title');
      if (title) {
        this.searchCourses(title);
      } else {
        this.loadCourses();
      }
    });
  }

  private loadCourses(): void {
    this.coursesService.getCourses().subscribe({
      next: data => this.handleCourses(data),
      error: err => console.error('Failed to load courses:', err)
    });
  }

  private searchCourses(title: string): void {
    console.log('Searching courses with title:', title);
    this.coursesService.getCoursesByTitle(title).subscribe({
      next: data => this.handleCourses(data),
    
      error: err => console.error('Search failed:', err)
    });
  }

  private handleCourses(data: Course[]): void {
    this.courses = data;
    console.log('Courses loaded:', this.courses);

    // Populate categoryName & categoryTags only when not in search mode
    if (!this.searchTitle && this.courses.length) {
      // assume all courses have same category for this listing
      this.categoryName = this.courses[0].categoryName;
      // make sure your Course model has a .tags: string[] property
      this.categoryTags = this.courses[0].courseMetaData?.tags || [];
    }
  
  }

  goToCourse(courseId: number): void {
    this.router.navigate(['courses/course-detail', courseId]);
  }

  goToCategory(categoryId: number): void {
    this.router.navigate(['/categories', categoryId]);
  }
  goToInstructors(instructorId: number): void {
    console.log('Navigating to instructor with ID:', instructorId);
    this.router.navigate(['/instructors', instructorId]);
  }


}
