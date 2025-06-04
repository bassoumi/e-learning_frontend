import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Instructor } from 'src/app/core/models/instructor';
import { AuthResponse } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})


export class AdminService {

    private baseUrl = 'http://localhost:8080/api/v1';
  
    constructor(
      private http: HttpClient,
      private authService: AuthService    // pour récupérer le JWT
    ) { }
  
    /**
     * Construit les headers Authorization avec le token stocké en AuthService
     */
    private getAuthHeaders(): HttpHeaders {
      const token = this.authService.getToken();
      return new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
    }
  
    /**
     * Enregistre un instructor (POST multipart/form-data vers /auth/register-instructor)
     * en incluant le header Authorization.
     */
    registerInstructor(formData: FormData): Observable<AuthResponse> {
      const headers = this.getAuthHeaders();
      return this.http.post<AuthResponse>(
        `${this.baseUrl}/auth/register-instructor`,
        formData,
        { headers }
      );
    }
  
    /**
     * Récupère tous les instructors (GET vers /instructors)
     * en incluant le header Authorization.
     */
    getAllInstructors(): Observable<Instructor[]> {
      const headers = this.getAuthHeaders();
      return this.http.get<Instructor[]>(
        `${this.baseUrl}/instructors`,
        { headers }
      );
    }
    getInstructorsByName(name: string): Observable<Instructor[]> {
      const headers = this.getAuthHeaders();
      const params = new HttpParams().set('firstName', name);
      return this.http.get<Instructor[]>(
        `${this.baseUrl}/instructors/firstName`,
        { headers, params }
      );
    }
  
  }
