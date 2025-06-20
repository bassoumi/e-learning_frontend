import { Component, HostBinding, OnInit } from '@angular/core';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from '../services/course.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../categories/services/category.service';
import { Category } from 'src/app/core/models/category.model';

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
  isDarkMode = false;

  constructor(
    private coursesService: CourseService,
    private route: ActivatedRoute,
    private router: Router,
    private categorieService:CategoryService
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
    this.loadCoursesByCategory();
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
    // Tri décroissant par date (du plus récent au plus ancien)
    this.courses = data.sort((a, b) => {
      const dateA = new Date(a.courseMetaData?.createdAt ?? 0).getTime();
      const dateB = new Date(b.courseMetaData?.createdAt ?? 0).getTime();
      return dateB - dateA; // du plus récent au plus ancien
    });
    
  
    console.log('Courses loaded:', this.courses);
  
    if (!this.searchTitle && this.courses.length) {
      this.categoryName = this.courses[0].categoryName;
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

  @HostBinding('class.dark-mode')
  get darkModeClass(): boolean {
    return this.isDarkMode;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    // ← ceci ajoute/enlève body.dark-mode
    document.body.classList.toggle('dark-mode', this.isDarkMode);
  }

 category: Category[] = [];

  private loadCoursesByCategory(): void {
    this.categorieService.getCategories().subscribe({
      next: category => {
        this.category = category;
        console.log('Category data:', this.category);
      },
      error: err => console.error(err),
    });

}



}