// src/app/models/notification-dto.ts
export interface NotificationDto {
    id: number;               // ID de la notification
    courseId: number;         // ID du cours
    courseTitle: string;      // Titre du cours
    shortDescription: string; // Description courte du cours
    level: string;            // Niveau du cours
    language: string;         // Langue du cours
    instructorNames: string;  // Nom complet de l'instructeur
    instructorId: number;     // ID de l'instructeur
    categoryName: string;     // Nom de la catégorie
    categoryId: number;       // ID de la catégorie
    coverImage: string;       // Nom de l'image de couverture
    duration: number;         // Durée du cours (en minutes)
    createdAt: string;  
    instructorProfileImages:String      // Date de création (format ISO)
  }
  