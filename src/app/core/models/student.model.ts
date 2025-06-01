export interface Student {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    instructorIds: number[];
        address: {
      street: string;
      city: string;
      state: string;
    };
  }
  
  export interface SubscriptionRequest {
    instructorIds: number[];  }