import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorsRoutingModule } from './instructors-routing.module';
import { InstructorListComponent } from './instructor-list/instructor-list.component';
import { InstructorDetailComponent } from './instructor-detail/instructor-detail.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InstructorListComponent,
    InstructorDetailComponent
  ],
  imports: [
    CommonModule,
    InstructorsRoutingModule,
    ReactiveFormsModule
  ]
})
export class InstructorsModule { }
