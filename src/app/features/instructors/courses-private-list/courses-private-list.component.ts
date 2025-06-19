import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Course } from 'src/app/core/models/course.model';
import { CourseService } from '../../courses/services/course.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-courses-private-list',
  templateUrl: './courses-private-list.component.html',
  styleUrls: ['./courses-private-list.component.scss']
})
export class CoursesPrivateListComponent {
  courses: Course[] = [];
  isListView = false;


  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupère l'ID de l'utilisateur (instructor) synchronously
    const instructorId = this.authService.getLoggedInStudentId();

    if (instructorId !== null) {
      // Appelle le service pour récupérer les cours rattachés à cet instructorId
      this.courseService.getCoursesByInstructor(instructorId).subscribe({
        next: (courses) => {
          this.courses = courses;
          console.log('Courses fetched successfully:', this.courses);
        },
        error: (err) => {
          console.error('Error fetching courses:', err);
        }
      });
    } else {
      console.warn('No logged-in instructor ID found.');
      // Si besoin, rediriger ou afficher un message
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

  goToUpdate(courseId: number): void {
    // Remplacez '/course-update' par le chemin exact défini dans vos routes
    this.router.navigate(['courses/course-update', courseId]);
  }



  deleteCourse(id: number): void {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe({
        next: () => {
          // Optionally refresh the course list or remove from local array
          this.courses = this.courses.filter(course => course.id !== id);
        },
        error: (err) => {
          console.error('Error deleting course:', err);
        }
      });
    }
  }
  

}
