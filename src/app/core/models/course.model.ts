export interface Course {
    title: string;
    description: string;
    shortDescription: string;
    categoryName: string;
    instructorNames: string[];
    level: string;
    language: string;
    coverImage: string;
    metadata: {
      createdAt: string;
      updatedAt: string;
      duration: number; // in hours
      tags: string[];
      objectives: string[];
    };
  }