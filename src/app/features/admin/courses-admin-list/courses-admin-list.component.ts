import { Component } from '@angular/core';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from '../../courses/services/course.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from '../service/admin.service';
import { DashboardService } from '../../dashboard/dashboard/service/dashboard.service';

@Component({
  selector: 'app-courses-admin-list',
  templateUrl: './courses-admin-list.component.html',
  styleUrls: ['./courses-admin-list.component.scss']
})
export class CoursesAdminListComponent {
  courses: Course[] = [];
    searchTitle: string | null = null;
    isListView = false; // Control variable
    categoryName = '';
    categoryTags: string[] = [];
    instructorNumber: number = 0; // Initialize instructorNumber
  
    constructor(
      private coursesService: CourseService,
      private adminService: AdminService, // Assuming you have a service for admin operations
      private route: ActivatedRoute,
      private router: Router,
      private dahsboardService: DashboardService // Assuming you have a service for dashboard operations
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
      this.getinstructorsCount(); // Load instructor count on init
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


    viewCourseInfo(courseId: number): void {
      this.router.navigate(['/courses/course-detail/', courseId]);
    }

    deleteCourseById(id: number): void {
      if (confirm('Voulez-vous vraiment supprimer ce cours ?')) {
        this.adminService.deleteCourse(id).subscribe({
          next: () => {
            this.courses = this.courses.filter(course => course.id !== id);
            alert('Cours supprimé avec succès.');
          },
          error: (err) => {
            console.error('Erreur lors de la suppression du cours :', err);
            alert('Impossible de supprimer ce cours. Vérifiez les dépendances.');
          }
        });
      }
    }

    getinstructorsCount(): void {
      this.dahsboardService.getInstructorCount().subscribe({
        next: (count: number) => {
          console.log('Nombre d\'instructeurs récupéré:', count);
          this.instructorNumber = count;  
          console.log('Nombre d\'instructeurs:', count);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération du nombre d\'instructeurs:', err);
        }
      });
    }
    

}
