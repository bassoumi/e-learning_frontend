import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../services/course.service';
import { Course } from 'src/app/core/models/course.model';

@Component({
  selector: 'app-course-detail',
  templateUrl: './course-detail.component.html',
  styleUrls: ['./course-detail.component.scss']
})
export class CourseDetailComponent implements OnInit {


  course!: Course;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router :Router

  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
  
    this.courseService.getCourseById(id).subscribe({
      next: (data) => {
        this.course = Array.isArray(data) ? data[0] : data;
        console.log('Course details:', this.course);
  
        // OPTION A: safe-guard with an 'if'
        if (this.course.contents && this.course.contents.length) {
          this.course.contents = this.course.contents
            .sort((a, b) => a.orderContent - b.orderContent);
        }
  
        // OPTION B: non-null assertion (if you really know it's always an array)
        // this.course.contents = this.course.contents!
        //   .sort((a, b) => a.orderContent - b.orderContent);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du cours :', err);
      }
    });
  }
  



  startCourse(courseId: number) {
    this.router.navigate(['courses/course-play', courseId]);
  }

}
