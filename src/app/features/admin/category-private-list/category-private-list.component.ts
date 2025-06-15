import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from '../../categories/services/category.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  categoryForm!: FormGroup;


  constructor(
    private categorieService: CategoryService,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      cover_categoryimage: [null, Validators.required]
    });
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
  errorMessage: string = '';

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categorieService.deleteCategory(id).subscribe({
        next: () => {
          this.category = this.category.filter(cat => cat.id !== id);
          console.log('Category deleted');
          this.errorMessage = ''; // réinitialiser en cas de succès
        },
        error: err => {
          console.error('Delete failed', err);
          this.errorMessage = err.error?.message || 'Échec de la suppression de la catégorie.';
        }
      });
    }
  }
  


  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.categoryForm.patchValue({ cover_categoryimage: input.files[0] });
    }
  }



  onSubmit(): void {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formData = new FormData();
    formData.append('nom', this.categoryForm.get('nom')!.value);
    formData.append('description', this.categoryForm.get('description')!.value);
    formData.append('cover_categoryimage', this.categoryForm.get('cover_categoryimage')!.value);

    this.categorieService.createCategory(formData).subscribe({
      next: newCat => {
        console.log('Nouvelle catégorie créée', newCat);
        // rafraîchir la liste ou rediriger
        this.category.push(newCat);
        this.isListView = true;
      },
      error: err => console.error('Create failed', err)
    });
  }


}
