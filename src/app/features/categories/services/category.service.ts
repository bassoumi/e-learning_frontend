import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Category } from 'src/app/core/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoryUrl = 'http://localhost:8080/api/v1/categories';

  constructor(private http: HttpClient, private authService: AuthService) {}




  getCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category[]>(this.categoryUrl, { headers });
  }


  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }



  
}
