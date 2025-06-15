import { Component } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { InstructorService } from '../../instructors/services/instructor.service';
import { forkJoin } from 'rxjs';
import { Instructor } from 'src/app/core/models/instructor';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userRole: string | null = null;
  instructors: Instructor[] = [];

  userProfile: any = null;   // ou un type plus précis si vous avez une interface
  errorMessage: string | null = null;
  isLoading = false;


  constructor(private profileService: ProfileService,
    private authService:AuthService,
    private instructorService:InstructorService
  ) { }

  ngOnInit(): void {
    this.loadUserProfile();
    this.userRole = this.authService.getUserRole(); 

  }



 private loadUserProfile(): void {
  this.isLoading = true;
  this.profileService.getProfile().subscribe({
    next: (profile) => {
      this.userProfile = profile;
      console.log('Profil utilisateur récupéré avec succès :', this.userProfile);

      if (this.userProfile.instructorIds && this.userProfile.instructorIds.length > 0) {
        // Appelle getInstructorById pour chaque ID et rassemble les résultats
        const observables = this.userProfile.instructorIds.map((id: number) =>
          this.instructorService.getInstructorById(id)
        );

        forkJoin<Instructor[]>(observables).subscribe({
          next: (instructors: Instructor[]) => {
            this.instructors = instructors;
            console.log('Instructeurs récupérés avec succès :', this.instructors);
            this.isLoading = false;  // Ne pas oublier de stopper le loading ici
          },
          error: (err) => {
            console.error('Erreur lors de la récupération des instructeurs :', err);
            this.isLoading = false;
          }
        });
      } else {
        this.instructors = [];
        this.isLoading = false;
      }
    },
    error: (err) => {
      console.error('Erreur lors de la récupération du profil :', err);
      this.errorMessage = err.message || 'Une erreur est survenue';
      this.isLoading = false;
    }
  });
}



}
