import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AgendaEntry } from 'src/app/core/models/agenda-entry.model';
import { PersonalEvent, PersonalEventRequest } from 'src/app/core/models/personal-event.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  private apiBase = 'http://localhost:8080/api/v1/students';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /** Retourne le header avec Authorization: Bearer <token> **/
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ---------------------------------------------
  // 1) Partie PersonalEvent (CRUD minimal)
  // ---------------------------------------------

  /**
   * Liste tous les événements personnels pour l’étudiant connecté.
   */
  listPersonalEvents(studentId: number): Observable<PersonalEvent[]> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiBase}/${studentId}/events`;
    return this.http.get<PersonalEvent[]>(url, { headers });
  }

  /**
   * Crée un nouvel événement personnel pour l’étudiant.
   */
  createPersonalEvent(
    studentId: number,
    payload: PersonalEventRequest
  ): Observable<PersonalEvent> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiBase}/${studentId}/events`;
    return this.http.post<PersonalEvent>(url, payload, { headers });
  }

  /**
   * Supprime un événement personnel (vérifie dans le backend que l’étudiant est bien propriétaire).
   */
  deletePersonalEvent(studentId: number, eventId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiBase}/${studentId}/events/${eventId}`;
    return this.http.delete<void>(url, { headers });
  }

  // ---------------------------------------------
  // 2) Partie Agenda (Progression logs)
  // ---------------------------------------------

  /**
   * Liste toutes les entrées d’agenda (progression) pour l’étudiant.
   * On suppose que le backend expose un endpoint de type GET /api/v1/students/{studentId}/agenda
   * qui renvoie List<AgendaEntry>.
   */
  listAgendaEntries(studentId: number): Observable<AgendaEntry[]> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiBase}/${studentId}/agenda`;
    return this.http.get<AgendaEntry[]>(url, { headers });
  }

  /**
   * (Optionnel) Si vous voulez supprimer une entrée d’agenda (rarement nécessaire),
   * vous pourriez implémenter une méthode DELETE vers /students/{studentId}/agenda/{entryId}.
   */
  deleteAgendaEntry(studentId: number, entryId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    const url = `${this.apiBase}/${studentId}/agenda/${entryId}`;
    return this.http.delete<void>(url, { headers });
  }


addEvent(studentId: number, event: PersonalEventRequest): Observable<PersonalEvent> {
  const headers = this.getAuthHeaders();
  const url = `${this.apiBase}/${studentId}/events`;
  return this.http.post<PersonalEvent>(url, event, { headers });
}
  
  
}
