import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorListComponent } from './instructor-list/instructor-list.component';
import { CoursesPrivateListComponent } from './courses-private-list/courses-private-list.component';

const routes: Routes = [
  {path:':instructorId',component: InstructorListComponent},
  {path:'',component: CoursesPrivateListComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorsRoutingModule { }
