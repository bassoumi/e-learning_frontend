import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgressionRoutingModule } from './progression-routing.module';
import { ProgressionListComponent } from './progression-list/progression-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    ProgressionListComponent
  ],
  imports: [
    CommonModule,
    ProgressionRoutingModule,
    ReactiveFormsModule,
    MatIconModule,
    
  ]
})
export class ProgressionModule { }
