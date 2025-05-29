import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [
    CategoriesListComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ReactiveFormsModule,
       MatIconModule,
    
    
  ]
})
export class CategoriesModule { }
