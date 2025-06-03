import { Component } from '@angular/core';
import { ProfileService } from '../service/profile.service';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  userRole: string | null = null;

  userProfile: any = null;   // ou un type plus précis si vous avez une interface
  errorMessage: string | null = null;
  isLoading = false;


  constructor(private profileService: ProfileService,
    private authService:AuthService
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
        console.log('ID de l\'utilisateur :', this.userProfile.instructorIds);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil :', err);
        this.errorMessage = err.message || 'Une erreur est survenue';
        this.isLoading = false;
      }
    });
  }


}
