// src/app/models/agenda-entry.model.ts

export interface AgendaEntry {
    id: number;
    studyDate: string;               // format "YYYY-MM-DD"
    startedAt: string;               // ISO string date‐heure
    lastProgressionUpdate: string;   // ISO string date‐heure
    eventType: 'START' | 'UPDATE';
    studentId: number;
    courseId: number;
    instructorName: string;
    courseTitle: string;
    coursImage: string; 

  }
  