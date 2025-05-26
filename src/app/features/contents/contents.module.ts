import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsRoutingModule } from './contents-routing.module';
import { ContentListComponent } from './content-list/content-list.component';
import { ContentFormComponent } from './content-form/content-form.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    ContentListComponent,
    ContentFormComponent
  ],
  imports: [
    CommonModule,
    ContentsRoutingModule,
    ReactiveFormsModule
  ]
})
export class ContentsModule { }
