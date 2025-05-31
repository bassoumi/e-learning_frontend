export interface InstructorRegister {
  firstName: string;
  lastName:  string;
  email:     string;
  profileImage: string;
  bio:       string;
  password:  string;
}

export interface StudentRegister {
  firstName: string;
  lastName:  string;
  age:       number;
  gender:    string;
  email:     string;
  phone:     string;
  address:   {
    street: string;
    city:   string;
    state:  string;
  };
  password:  string;
}
  export interface UserLogin {
    email: string;
    password: string;
  }

  export interface AuthResponse {
    token: string;
    user_id?: number;
  }
  