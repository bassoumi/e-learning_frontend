import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from '../../categories/services/category.service';

@Component({
  selector: 'app-category-private-list',
  templateUrl: './category-private-list.component.html',
  styleUrls: ['./category-private-list.component.scss']
})
export class CategoryPrivateListComponent {
 category: Category[] = [];
  isListView = false;
  categoryName = '';
  categoryTags: string[] = [];



  constructor(
    private categorieService: CategoryService,
  ) {}

  ngOnInit(): void {

        this.loadCoursesByCategory();
      }


  private loadCoursesByCategory(): void {
    this.categorieService.getCategories().subscribe({
      next: category => {
        this.category = category;
        console.log('Category data:', this.category);
      },
      error: err => console.error(err),
    });
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categorieService.deleteCategory(id).subscribe({
        next: () => {
          this.category = this.category.filter(cat => cat.id !== id);
          console.log('Category deleted');
        },
        error: err => console.error('Delete failed', err)
      });
    }
  }

  
  encodeImageUrl(fileName: string | null): string {
    return fileName ? encodeURIComponent(fileName) : '';
  }
  

}
