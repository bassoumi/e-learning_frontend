export interface CommentRequest {
    contentId: number;
    userId: number;
    texte: string;
  }
  
  export interface CommentResponse {
    id: number;
    contentId: number;
    userId: number;
    texte: string;
    dateCreation: string;
    studentName: string;
  }
  
  export interface LikeRequest {
    contentId: number;
    userId: number;
  }
  
  export interface LikeResponse {
    id: number;
    contentId: number;
    userId: number;
    createdAt: string;
  }