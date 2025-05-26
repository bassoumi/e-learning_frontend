import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnrollmentsRoutingModule } from './enrollments-routing.module';
import { EnrollmentListComponent } from './enrollment-list/enrollment-list.component';
import { EnrollmentFormComponent } from './enrollment-form/enrollment-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    EnrollmentListComponent,
    EnrollmentFormComponent
  ],
  imports: [
    CommonModule,
    EnrollmentsRoutingModule,
    ReactiveFormsModule
  ]
})
export class EnrollmentsModule { }
