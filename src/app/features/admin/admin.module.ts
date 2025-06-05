import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddInstructorComponent } from './add-instructor/add-instructor.component';
import { ListInstructorComponent } from './list-instructor/list-instructor.component';
import { InfoInstructorComponent } from './info-instructor/info-instructor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesAdminListComponent } from './courses-admin-list/courses-admin-list.component';


@NgModule({
  declarations: [
    AddInstructorComponent,
    ListInstructorComponent,
    InfoInstructorComponent,
    CoursesAdminListComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
