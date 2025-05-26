export interface Progression {
    studentId: number;
    contentId: number;
    progressionPercentage: number;
    lastAccessed: number[]; // [year, month, day, hour, minute]
    status: 'IN_PROGRESS' | 'COMPLETED' | 'NOT_STARTED';
  }
  