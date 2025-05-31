/** Sent to create / update a progression */
export interface ProgressionRequest {
  progressionPercentage: number;
  lastAccessed: string;       // ISO timestamp
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

/** Received from the server */
export interface ProgressionResponse {
  id: number;
  studentId: number;
  contentId: number;
  progressionPercentage: number;
  lastAccessed: Date;         // will be converted to Date
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}


export interface CourseWithLastContent {
  progressionPercentage: number;
  categoryName: string;
  categoryId: number;
  id: number;
  title: string;
  shortDescription: string;
  level: string;
  coverImage: string;
  lastContentTitle: string;
  lastContentId: number;
  instructorFirstName: string;
  instructorId: number;
  language: string;
}
