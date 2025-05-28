import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { ListCoursesComponent } from './list-courses/list-courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseFormComponent } from './create-edit/course-form/course-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { StartCourseComponent } from './start-course/start-course.component';
import { QuizCourseComponent } from './quiz-course/quiz-course.component';


@NgModule({
  declarations: [
    ListCoursesComponent,
    CourseDetailComponent,
    CourseFormComponent,
    StartCourseComponent,
    QuizCourseComponent,

  ],
  imports: [
    CommonModule,
    HttpClientModule,
    CoursesRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    SharedModule
    
  ]
})
export class CoursesModule { }
