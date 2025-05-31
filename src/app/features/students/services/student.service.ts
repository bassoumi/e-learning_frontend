import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Student, SubscriptionRequest } from 'src/app/core/models/student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:8080/api/v1/student';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getStudentById(studentId: number): Observable<Student> {
    return this.http.get<Student>(
      `${this.baseUrl}/${studentId}`,
      { headers: this.getAuthHeaders() }
    );
  }



    getSubscription(studentId: number): Observable<Student> {
      const url = `${this.baseUrl}/${studentId}/subscribe`;
      const headers = this.getAuthHeaders();
      return this.http.get<Student>(url, { headers });
    }
  
  
    subscribeToInstructor(
      studentId: number,
      instructorId: number
    ): Observable<Student> {
      const url = `${this.baseUrl}/${studentId}/subscribe/${instructorId}`;
      const headers = this.getAuthHeaders();
      // Comme le controller n’attend pas de body pour ce POST, on peut passer un objet vide
      return this.http.post<Student>(url, {}, { headers });
    }
  
  
    updateSubscription(
      studentId: number,
      newInstructorId: number
    ): Observable<Student> {
      const url = `${this.baseUrl}/${studentId}/subscribe`;
      const headers = this.getAuthHeaders();
      const body: SubscriptionRequest = { instructorId: newInstructorId };
      return this.http.put<Student>(url, body, { headers });
    }
  
  
  
  
    unsubscribe(studentId: number): Observable<void> {
      const url = `${this.baseUrl}/${studentId}/subscribe`;
      const headers = this.getAuthHeaders();
      return this.http.delete<void>(url, { headers });
    }
  


  
}
