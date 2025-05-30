import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Instructor } from 'src/app/core/models/instructor.model';

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


  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

}
