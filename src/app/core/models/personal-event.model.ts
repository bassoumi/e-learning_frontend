// src/app/models/personal-event.model.ts

export interface PersonalEvent {
    id: number;
    title: string;
    description?: string;
    eventDateTime: string; // ISO string, ex. "2025-06-10T14:30:00"
    studentId: number;
  }
  
  export interface PersonalEventRequest {
    title: string;
    description?: string;
    eventDateTime: string;
  }
  

  export interface PersonalEventResponse {
    id: number;
    title: string;
    description?: string;
    eventDateTime: string;
    // ajoute d'autres champs si ton backend en retourne d'autres
  }