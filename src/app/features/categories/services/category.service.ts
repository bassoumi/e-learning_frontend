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

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.categoryUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
  
  createCategory(formData: FormData): Observable<Category> {
    const headers = this.getAuthHeaders();
    return this.http.post<Category>(this.categoryUrl, formData, { headers });
  }

  updateCategory(id: number, formData: FormData): Observable<Category> {
    const headers = this.getAuthHeaders();
    return this.http.put<Category>(`${this.categoryUrl}/${id}`, formData, { headers });
  }

// category.service.ts
deleteCategory(id: number): Observable<string> {
  const headers = this.getAuthHeaders();
  const url = `${this.categoryUrl}/${id}`;
  return this.http.delete(url, {
    headers,
    responseType: 'text'  
  });
}

  

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }



  
}
