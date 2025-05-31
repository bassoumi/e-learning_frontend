import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProgressionListComponent } from './progression-list/progression-list.component';

const routes: Routes = [
  {path:'',component: ProgressionListComponent},
];
// 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgressionRoutingModule { }
