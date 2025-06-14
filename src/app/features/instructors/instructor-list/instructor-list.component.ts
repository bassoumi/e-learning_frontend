import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../courses/services/course.service';
import { Course } from 'src/app/core/models/course.model';
import { InstructorService } from '../services/instructor.service';
import { Instructor } from 'src/app/core/models/instructor';

@Component({
  selector: 'app-instructor-list',
  templateUrl: './instructor-list.component.html',
  styleUrls: ['./instructor-list.component.scss']
})
export class InstructorListComponent {

  courses: Course[] = [];
  instructor: Instructor | null = null;

  instructorEmail = '';     
  instructorBio = '';      
  instructorImage = ''; 

  isListView = false;
  instructorNames = '';
  categoryTags: string[] = [];
  isSubscribed = false;
  subscriptionChecked = false;
  subscriberCount: number | null = null;
  instructorId!: number;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private instructorService: InstructorService,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.instructorId = Number(params.get('instructorId'));
      console.log('ID de l’instructeur depuis la route :', this.instructorId);
  
      if (this.instructorId) {
        this.loadCoursesByInstructorId(this.instructorId);
        this.loadInstructorById(this.instructorId);
  
        // Appelle le service ici, une fois que l'instructorId est bien défini
        this.instructorService.getSubscriberCount(this.instructorId).subscribe({
          next: count => this.subscriberCount = count,
          error: err => {
            console.error('Erreur en récupérant le nombre d\'abonnés', err);
            this.subscriberCount = 0;
          }
        });
      }
    });
  }

  private loadCoursesByInstructorId(instructorId: number): void {
    this.courseService.getCoursesByInstructor(instructorId).subscribe({
      next: courses => {
        this.courses = courses;
        console.log('Cours chargés pour l’instructeur :', this.courses);
      },
      error: err => console.error('Échec du chargement des cours :', err)
    });
  }

  private loadInstructorById(instructorId: number): void {
    this.instructorService.getInstructorById(instructorId).subscribe({
      next: instructor => {
        this.instructor = instructor;

        this.instructorNames = `${instructor.firstName} ${instructor.lastName}`;
        this.instructorEmail = instructor.email;
        this.instructorBio = instructor.bio;
        this.instructorImage = instructor.profileImage;
        console.log('Instructeur chargé :', this.instructor);
      },
      error: err => console.error('Échec du chargement de l’instructeur :', err)
    });
  }


  goToCourse(courseId: number): void {
    this.router.navigate(['courses', 'course-detail', courseId]);
  }





}
