import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Instructor } from 'src/app/core/models/instructor';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {
  private instructorUrl = 'http://localhost:8080/api/v1/instructors';

  constructor(private http: HttpClient, private authService: AuthService) {}




  getInstructors(): Observable<Instructor[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Instructor[]>(this.instructorUrl, { headers });
  }



  getInstructorById(instructorId: number): Observable<Instructor> {
    const headers = this.getAuthHeaders();
    return this.http.get<Instructor>(`${this.instructorUrl}/${instructorId}/profile`, { headers });
  }




  getSubscriberCount(instructorId: number): Observable<number> {
    const url = `${this.instructorUrl}/${instructorId}/subscribers/count`;
    const headers = this.getAuthHeaders();
    return this.http.get<number>(url, { headers });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }


}
