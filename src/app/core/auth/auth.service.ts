import { Injectable } from '@angular/core';
import { AuthResponse, InstructorRegister, StudentRegister, UserLogin, } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedInStudentId: number | null = null;
    private baseUrl = 'http://localhost:8080/api/v1/auth';

  constructor(private http: HttpClient) {}

  login(user: UserLogin): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/authenticate`, user)
      .pipe(
        tap((response: AuthResponse) => {
          this.storeToken(response.token);
          if (response.user_id != null && response.role) {
            this.setLoggedInStudentId(response.user_id, response.role);
          }
        })
      );
  }

  /**
   * Enregistre l'ID et le rôle de l'utilisateur
   * dans la variable interne + localStorage
   */
  setLoggedInStudentId(id: number, role: string): void {
    this.loggedInStudentId = id;
    localStorage.setItem('user_id', id.toString());
    localStorage.setItem('role', role);
  }

  /**
   * Récupère l'ID stocké (en mémoire ou dans localStorage)
   */
  getLoggedInStudentId(): number | null {
    if (this.loggedInStudentId !== null) {
      return this.loggedInStudentId;
    }
    const storedId = localStorage.getItem('user_id');
    return storedId ? Number(storedId) : null;
  }



  registerInstructor(data: InstructorRegister): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/register-instructor`,
      data
    );
  }
  getUserRole(): string | null {
    return localStorage.getItem('role');
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
