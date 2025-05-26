import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    StudentListComponent,
    StudentDetailComponent
  ],
  imports: [
    CommonModule,
    StudentsRoutingModule,
    ReactiveFormsModule
  ]
})
export class StudentsModule { }
