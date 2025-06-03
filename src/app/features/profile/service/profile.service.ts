import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService { private baseUrl = 'http://localhost:8080/api/v1';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  /**
   * Récupère le profil de l'utilisateur connecté selon son rôle.
   * Le header Authorization contient le Bearer token renvoyé par AuthService.getToken().
   */
  getProfile(): Observable<any> {
    const userId = this.authService.getLoggedInStudentId();
    const role = this.authService.getUserRole();
    const token = this.authService.getToken();

    if (userId == null || role == null || token == null) {
      return throwError(() => new Error('Utilisateur non authentifié, rôle manquant ou token absent'));
    }

    // On prépare les headers avec le Bearer token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    let url: string;
    switch (role) {
      case 'STUDENT':
        url = `${this.baseUrl}/student/${userId}`;
        break;
      case 'ADMIN':
        url = `${this.baseUrl}/admin/${userId}`;
        break;
      case 'INSTRUCTOR':
        url = `${this.baseUrl}/instructors/${userId}/profile`;
        break;
      default:
        return throwError(() => new Error(`Rôle inconnu : ${role}`));
    }

    // On passe l'objet { headers } à la requête HTTP
    return this.http.get<any>(url, { headers });
  }

}