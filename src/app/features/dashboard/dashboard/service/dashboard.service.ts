import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PopularInstructor } from 'src/app/core/models/PopularInstructor.model';

@Injectable({
  providedIn: 'root'
})export class DashboardService {

  private baseUrl = 'http://localhost:8080/api/v1/dashboard';

  constructor(
    private http: HttpClient,
    private authService: AuthService  // Injection d’AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      console.warn('⚠️ Aucun token trouvé dans AuthService');
    }
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getCourseCount(): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.baseUrl}/courses/count`, { headers });
  }

  getInstructorCount(): Observable<number> {
    const headers = this.getAuthHeaders();
    console.log('Token envoyé:', headers.get('Authorization'));
    return this.http.get<number>(`${this.baseUrl}/instructors/count`, { headers });
  }

  getUserCount(): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.baseUrl}/student/count`, { headers });
  }

  getCompletionRate(): Observable<number> {
    const headers = this.getAuthHeaders();
    return this.http.get<number>(`${this.baseUrl}/completion-rate`, { headers });
  }

  getMonthlyRegistrations(): Observable<{ [period: string]: number }> {
    const headers = this.getAuthHeaders();
    return this.http.get<{ [period: string]: number }>(`${this.baseUrl}/registrations/monthly`, { headers });
  }

  getTopInstructors(limit: number = 3): Observable<PopularInstructor[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<PopularInstructor[]>(`${this.baseUrl}/top-instructors?limit=${limit}`, { headers });
  }
}