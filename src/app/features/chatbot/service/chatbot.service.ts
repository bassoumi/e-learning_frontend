import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { UserMessage, BotMessage } from 'src/app/core/models/chatbot.model';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = 'http://localhost:8080/api/chat/message';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  sendMessage(message: UserMessage): Observable<BotMessage[]> {
    return this.http.post<BotMessage[]>(this.apiUrl, message, {
      headers: this.getAuthHeaders()
    });
  }



}
