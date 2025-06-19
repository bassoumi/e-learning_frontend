import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Content, Course, Quiz } from 'src/app/core/models/course.model';
import { Student } from 'src/app/core/models/student.model';
import { VideoSummary } from 'src/app/core/models/videoSummary.model';

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


  getCourseById(id: number): Observable<Course> {
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<Course>(`${this.apiUrl}/${id}`, { headers });
  }


  deleteCourse(id: number): Observable<void> {
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers });
  }
  
  

  
  addCourseWithFile(formData: FormData): Observable<Course> {
    const token = this.authService.getToken();
  
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.post<Course>(this.apiUrl, formData, { headers });
  }

  updateCourseWithFile(id: number, formData: FormData): Observable<Course> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put<Course>(`${this.apiUrl}/${id}`, formData, { headers });
  }


  getCoursesByCategory(categoryId: number): Observable<Course[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Course[]>(`${this.apiUrl}/category/${categoryId}`, { headers });
  }


  getCoursesByInstructor(instructorId: number): Observable<Course[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    return this.http.get<Course[]>(`${this.apiUrl}/instructor/${instructorId}`, { headers });
  }
  
  


  addContent(courseId: number, content: Content): Observable<Content> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Content>(`${this.apiUrl}/${courseId}/contents`, content, { headers });
  }


  addQuiz(courseId: number, quiz: Quiz): Observable<Quiz> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Quiz>(`${this.apiUrl}/${courseId}/quizzes`, quiz, { headers });
  }


getCoursesByTitle(title: string): Observable<Course[]> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  const params = new HttpParams().set('title', title);
  return this.http.get<Course[]>(`${this.apiUrl}/title`, { headers, params });
}


summarizeContent(contentId: number): Observable<VideoSummary> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.post<VideoSummary>(
    `http://localhost:8080/api/v1/content/${contentId}/summarize`,
    {}, { headers }
  );
}

getSummary(contentId: number): Observable<VideoSummary> {
  const token = this.authService.getToken();
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  return this.http.get<VideoSummary>(
    `http://localhost:8080/api/v1/content/${contentId}/summary`,
    { headers }
  );
}

  
}
