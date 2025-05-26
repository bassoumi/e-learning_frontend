import { Injectable } from '@angular/core';
import { AuthResponse, InstructorRegister, StudentRegister, UserLogin, } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(user: UserLogin): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/authenticate`,
      user
    );
  }

  registerInstructor(data: InstructorRegister): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/register-instructor`,
      data
    );
  }
  
  
  registerStudent(data: StudentRegister): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/register-student`,
      data
    );
  }

  storeToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
