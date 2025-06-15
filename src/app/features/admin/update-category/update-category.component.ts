import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/core/models/category.model';
import { CategoryService } from '../../categories/services/category.service';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent {
  categoryForm!: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  private categoryId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    // 1. Récupérer l'ID de la catégorie depuis l'URL
    this.categoryId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Category ID from route:', this.categoryId);

    // 2. Construire le FormGroup
    this.categoryForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      coverImage: [null]    // pas de validator obligatoire ici
    });

    // 3. Charger la catégorie et pré-remplir le formulaire
    this.categoryService.getCategoryById(this.categoryId)
      .subscribe((cat: Category) => {
        this.categoryForm.patchValue({
          nom: cat.nom,
          description: cat.description
        });
        console.log('Category data:', cat);
        // Aperçu de l'image existante
        this.imagePreview = `http://localhost:8080/uploads/images/${cat.cover_categoryimage}`;
      });
      console.log('Category ID:', this.categoryId);
      console.log('Category Form:', this.categoryForm.value);
  }

  // 4. Gérer la sélection du fichier
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    if (!file) return;

    this.categoryForm.patchValue({ coverImage: file });
    this.categoryForm.get('coverImage')!.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result;
    reader.readAsDataURL(file);
  }

  // 5. Soumettre la mise à jour
  onSubmit(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    // Construction du FormData DANS le composant
    const formData = new FormData();
    formData.append('nom', this.categoryForm.get('nom')!.value);
    formData.append('description', this.categoryForm.get('description')!.value);

    const selectedFile = this.categoryForm.get('coverImage')!.value;
    if (selectedFile) {
      // le nom du champ doit correspondre à celui attendu côté backend
      formData.append('cover_categoryimage', selectedFile);
    }

    // Appel PUT vers le service (service inchangé)
    this.categoryService.updateCategory(this.categoryId, formData)
      .subscribe({
        next: () => this.router.navigate(['admin/categories-private-list']),
        error: err => console.error('Erreur mise à jour catégorie', err)
      });
  }

}
