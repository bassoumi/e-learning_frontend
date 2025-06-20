import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AddInstructorComponent } from './add-instructor/add-instructor.component';
import { ListInstructorComponent } from './list-instructor/list-instructor.component';
import { InfoInstructorComponent } from './info-instructor/info-instructor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesAdminListComponent } from './courses-admin-list/courses-admin-list.component';
import { CategoryPrivateListComponent } from './category-private-list/category-private-list.component';
import { NewCategoryComponent } from './new-category/new-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';


@NgModule({
  declarations: [
    AddInstructorComponent,
    ListInstructorComponent,
    InfoInstructorComponent,
    CoursesAdminListComponent,
    CategoryPrivateListComponent,
    NewCategoryComponent,
    UpdateCategoryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
