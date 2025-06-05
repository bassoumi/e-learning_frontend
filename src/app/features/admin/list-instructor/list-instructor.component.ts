import { Component } from '@angular/core';
import { AdminService } from '../service/admin.service';
import { Instructor } from 'src/app/core/models/instructor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-instructor',
  templateUrl: './list-instructor.component.html',
  styleUrls: ['./list-instructor.component.scss']
})
export class ListInstructorComponent {
  instructors: Instructor[] = [];
  searchName: string = '';
  instructorNotFound: boolean = false;

  constructor(private adminService: AdminService,private router: Router) { }

  ngOnInit(): void {
    this.loadInstructorList();
  }

  private loadInstructorList(): void {
    this.adminService.getAllInstructors().subscribe({
      next: (data: Instructor[]) => {
        this.instructors = data;
        console.log('Liste des instructors :', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des instructors :', err);
      }
    });
  }


  openInfoModal(instructor: { id: number }): void {
    this.router.navigate(['admin/info-instructor', instructor.id]);
  }

  addInstructor(): void {
    this.router.navigate(['admin/add-instructor']);
  }


  deleteInstructorById(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet instructeur ?')) {
      this.adminService.deleteInstructor(id).subscribe({
        next: () => {
          // Supprimer l'instructeur de la liste sans refaire un appel
          this.instructors = this.instructors.filter(i => i.id !== id);
          alert('Instructeur supprimé avec succès.');
        },
        error: (err) => {
          console.error('Erreur lors de la suppression', err);
          alert('Erreur : impossible de supprimer cet instructeur.');
        }
      });
    }
  }

  searchInstructorByName(): void {
    const name = this.searchName.trim();
    if (!name) return;
  
    this.adminService.getInstructorsByName(name).subscribe({
      next: (data) => {
        this.instructors = data;
        this.instructorNotFound = data.length === 0;
      },
      error: (err) => {
        console.error('Erreur lors de la recherche :', err);
        this.instructors = [];
        this.instructorNotFound = true;
      }
    });
  }
  
}
