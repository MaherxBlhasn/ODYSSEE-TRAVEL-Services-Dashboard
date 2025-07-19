export interface AuthResponse {
  success: boolean;
  token?: string;
  user: UserData;
}

export interface UserData {
  id: string;
  username: string;
  Email: string;
  phone?: string;
  createdAt: string;
}

// For login form
export interface LoginCredentials {
  Email: string;
  password: string;
}