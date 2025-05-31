import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Course } from 'src/app/core/models/course.model';
import { CourseWithLastContent, ProgressionRequest, ProgressionResponse } from 'src/app/core/models/progression.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressionService {
  private baseUrl = 'http://localhost:8080/api/v1';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  /**
   * Create (start) a progression for a student on a content.
   */
  createProgression(
    studentId: number,
    contentId: number,
    payload: ProgressionRequest
  ): Observable<ProgressionResponse> {
    const url = `${this.baseUrl}/students/${studentId}/contents/${contentId}/progression`;
    return this.http
      .post<any>(url, payload, { headers: this.getAuthHeaders() })
      .pipe(
        map(raw => this.toProgressionResponse(raw))
      );
  }

  /**
   * Fetch the progression record for this student+content.
   */
  getProgression(
    studentId: number,
    contentId: number
  ): Observable<ProgressionResponse> {
    const url = `${this.baseUrl}/students/${studentId}/contents/${contentId}/progression`;
    return this.http
      .get<any>(url, { headers: this.getAuthHeaders() })
      .pipe(
        map(raw => this.toProgressionResponse(raw))
      );
  }

  /**
   * Update an existing progression.
   */
  updateProgression(
    studentId: number,
    contentId: number,
    payload: ProgressionRequest
  ): Observable<ProgressionResponse> {
    const url = `${this.baseUrl}/students/${studentId}/contents/${contentId}/progression`;
    return this.http
      .put<any>(url, payload, { headers: this.getAuthHeaders() })
      .pipe(
        map(raw => this.toProgressionResponse(raw))
      );
  }

  /**
   * (Optional) List all progressions for a given student.
   */
  listByStudent(
    studentId: number
  ): Observable<ProgressionResponse[]> {
    const url = `${this.baseUrl}/students/${studentId}/progressions`;
    return this.http
      .get<any[]>(url, { headers: this.getAuthHeaders() })
      .pipe(
        map(arr => arr.map(raw => this.toProgressionResponse(raw)))
      );
  }

  /**
   * Helper to convert raw JSON into ProgressionResponse
   */
  private toProgressionResponse(raw: any): ProgressionResponse {
    return {
      id: raw.id,
      studentId: raw.studentId,
      contentId: raw.contentId,
      progressionPercentage: raw.progressionPercentage,
      lastAccessed: new Date(raw.lastAccessed),
      status: raw.status
    };
  }

  
  getInProgressCoursesWithLastViewed(studentId: number): Observable<CourseWithLastContent[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<CourseWithLastContent[]>(`${this.baseUrl}/students/${studentId}/in-progress-courses`, { headers });
  }
  
  
  

}
