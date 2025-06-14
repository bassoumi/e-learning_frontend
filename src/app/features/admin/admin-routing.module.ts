import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorListComponent } from '../instructors/instructor-list/instructor-list.component';
import { AddInstructorComponent } from './add-instructor/add-instructor.component';
import { ListInstructorComponent } from './list-instructor/list-instructor.component';
import { InfoInstructorComponent } from './info-instructor/info-instructor.component';
import { CoursesAdminListComponent } from './courses-admin-list/courses-admin-list.component';
import { CategoryPrivateListComponent } from './category-private-list/category-private-list.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';

const routes: Routes = [
  {path: 'instructor-List', component:ListInstructorComponent},
  {path: 'add-instructor', component:AddInstructorComponent},
  {path: 'info-instructor/:id', component:InfoInstructorComponent},
  {path: 'courses-list', component:CoursesAdminListComponent},
  {path: 'categories-private-list', component:CategoryPrivateListComponent},
  {path: 'new-category', component:CategoryPrivateListComponent},
  {path: 'update-category/:id', component:UpdateCategoryComponent},




];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
