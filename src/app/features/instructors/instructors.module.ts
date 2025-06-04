import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorsRoutingModule } from './instructors-routing.module';
import { InstructorListComponent } from './instructor-list/instructor-list.component';
import { InstructorDetailComponent } from './instructor-detail/instructor-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CoursesPrivateListComponent } from './courses-private-list/courses-private-list.component';


@NgModule({
  declarations: [
    InstructorListComponent,
    InstructorDetailComponent,
    CoursesPrivateListComponent
  ],
  imports: [
    CommonModule,
    InstructorsRoutingModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class InstructorsModule { }
