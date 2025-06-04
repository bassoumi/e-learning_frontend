export interface InstructorsRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    bio: string;
    // La propriété profileImage sera un `File` envoyé en `FormData`.
    profileImage: File;
  }
  
  export interface Instructor {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    profileImage: string;
    bio: string;
    role: string;
    // etc. selon vos champs renvoyés par l’API
  }
  