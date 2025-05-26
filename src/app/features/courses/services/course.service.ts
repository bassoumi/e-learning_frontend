import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Course } from 'src/app/core/models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = 'http://localhost:8080/api/v1/courses';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCourses(): Observable<Course[]> {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Course[]>(this.apiUrl, { headers });
  }



}
