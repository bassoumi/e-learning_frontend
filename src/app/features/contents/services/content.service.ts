import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { CommentRequest, CommentResponse, LikeRequest, LikeResponse } from 'src/app/core/models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class ContentService {


  private baseUrl: string = 'http://localhost:8080/api/v1/feedback';


 constructor(
    private http: HttpClient,
    private authService: AuthService  // Assurez-vous d’avoir AuthService implémenté
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  addComment(request: CommentRequest): Observable<CommentResponse> {
    const url = `${this.baseUrl}/comments`;
    return this.http.post<CommentResponse>(
      url,
      request,
      { headers: this.getAuthHeaders() }
    );
  }

  getComments(contentId: number): Observable<CommentResponse[]> {
    const url = `${this.baseUrl}/comments/${contentId}`;
    return this.http.get<CommentResponse[]>(
      url,
      { headers: this.getAuthHeaders() }
    );
  }


  countComments(contentId: number): Observable<number> {
    const url = `${this.baseUrl}/comments/count/${contentId}`;
    return this.http.get<number>(
      url,
      { headers: this.getAuthHeaders() }
    );
  }


  addLike(request: LikeRequest): Observable<LikeResponse> {
    const url = `${this.baseUrl}/likes`;
    return this.http.post<LikeResponse>(
      url,
      request,
      { headers: this.getAuthHeaders() }
    );
  }
  removeLike(request: LikeRequest): Observable<void> {
    const url = `${this.baseUrl}/likes`;
    return this.http.request<void>(
      'delete',
      url,
      {
        headers: this.getAuthHeaders(),
        body: request
      }
    );
  }

  countLikes(contentId: number): Observable<number> {
    const url = `${this.baseUrl}/likes/count/${contentId}`;
    return this.http.get<number>(
      url,
      { headers: this.getAuthHeaders() }
    );
  }
}
