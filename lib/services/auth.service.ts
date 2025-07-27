import { AuthResponse, LoginCredentials} from '../types/auth.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try{
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        console.log('Login response:', response);
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Login failed:', errorData);
            throw new Error(errorData.message || 'Login failed');
        }
        return await response.json();
    }   catch (error) {
        throw new Error('Login failed1:'+ error);
    }
 },

 async logout(): Promise<void> {
     try {
        const response =await fetch(`${API_BASE_URL}/auth/logout`, {
           method: 'POST',
           credentials: 'include', 
        });
        console.log('Logout response:', response);
     }  catch (error) {
        throw new Error('Logout failed');
    }
 } ,

   async checkAuth(): Promise<{ authenticated: boolean; userId?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include' // For cookie-based auth
      });
      console.log('Auth check response:', response);
      if (!response.ok) {
        return { authenticated: false };
      }

      return await response.json();
    } catch (error) {
      console.error('Auth check error:', error);
      return { authenticated: false };
    }
  },




};