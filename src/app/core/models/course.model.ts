export interface Course {
     id: number;
    title: string;
    description: string;
    shortDescription: string;
    categoryName: string;
    categoryId: number;
    instructorNames: string;
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
    courseId: number;
    questions: Question[];
  }
  
  export interface Question {
    text: string;
    options: string[];
    answer: string;
  }
  