export interface Course {
     id: number;
    title: string;
    description: string;
    shortDescription: string;
    categoryName: string;
    instructorNames: string[];
    level: string;
    language: string;
    coverImage: string;
    contents?: Content[];
    instructorAvatar?: string;
    courseMetaData?: {
      createdAt: string;
      updatedAt: string;
      duration: number; // in hours
      tags: string[];
      objectives: string[];
    };
    quiz?: Quiz;
  }

  export interface Content {
    id: number;
    courseId: string;
    title: string;
    videoUrl: string;
    description: string;
    orderContent: number;
  }

  export interface Quiz {
    id: number;
    title: string;
    questions: string[];
    answers: string[];
    options: string[][];  
    courseId: number;
  }