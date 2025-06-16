import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Course } from 'src/app/core/models/course.model';
import { ProgressionService } from '../services/progression.service';
import { CourseWithLastContent } from 'src/app/core/models/progression.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-progression-list',
  templateUrl: './progression-list.component.html',
  styleUrls: ['./progression-list.component.scss']
})
export class ProgressionListComponent {
  isListView = false; // Control variable
  studentId: number | null = null; // Store the student ID

  inProgressCoursesWithLastContent: CourseWithLastContent[] = [];

  
  constructor(
    private progressionService: ProgressionService,
    private authService: AuthService,
    private router: Router
  ) {}


  
ngOnInit(): void {
   this.studentId = this.authService.getLoggedInStudentId();

  if (this.studentId) {
    this.progressionService.getInProgressCoursesWithLastViewed(this.studentId).subscribe({
      next: (courses) => {
        this.inProgressCoursesWithLastContent = courses;
        console.log('Courses with last viewed content:', courses);
      },
      error: (err) => {
        console.error('Error fetching in-progress courses:', err);
      }
    });
  } else {
    console.warn('Student ID not found. Are you logged in?');
  }



}



goToCourse(courseId: number): void {
  this.router.navigate(['courses/course-play', courseId, this.studentId]);
}

goToCategory(categoryId: number): void {
  this.router.navigate(['/categories', categoryId]);
}
goToInstructors(instructorId: number): void {
  console.log('Navigating to instructor with ID:', instructorId);
  this.router.navigate(['/instructors', instructorId]);
}

setProgressWidth() {
  this.inProgressCoursesWithLastContent = this.inProgressCoursesWithLastContent.map(c => {
    return {
      ...c,
      style: {'--progress-width': c.progressionPercentage + '%'}
    };
  });
}

}