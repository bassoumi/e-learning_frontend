import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoursesRoutingModule } from './courses-routing.module';
import { ListCoursesComponent } from './list-courses/list-courses.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';
import { CourseFormComponent } from './create-edit/course-form/course-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ListCoursesComponent,
    CourseDetailComponent,
    CourseFormComponent
  ],
  imports: [
    CommonModule,
    CoursesRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    
  ]
})
export class CoursesModule { }
