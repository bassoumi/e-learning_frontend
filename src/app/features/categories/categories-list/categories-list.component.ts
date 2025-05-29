import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from '../../courses/services/course.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';


@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
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
export class CategoriesListComponent {
  
  courses: Course[] = [];
  isListView = false;
  categoryName = '';
  categoryTags: string[] = [];



  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const categoryId = Number(params.get('categoryId'));
      console.log('Category ID from route:', categoryId);
      if (categoryId) {
        this.loadCoursesByCategory(categoryId);
      }
    });
  }


  private loadCoursesByCategory(categoryId: number): void {
    this.courseService.getCoursesByCategory(categoryId).subscribe({
      next: courses => {
        this.courses = courses;
        // assume every Course has `categoryName` and `tags: string[]`
        if (courses.length) {
          this.categoryName = courses[0].categoryName;
          // if your Course model has a `tags` array on the category
          this.categoryTags = courses[0].courseMetaData?.tags || [];
          console.log('Category name:', this.categoryTags);
        }
      },
      error: err => console.error(err),
    });
  }


  goToCourse(courseId: number): void {
    this.router.navigate(['courses/course-detail', courseId]);
  }
}
