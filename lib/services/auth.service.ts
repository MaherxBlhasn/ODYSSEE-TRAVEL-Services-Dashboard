import { AuthResponse, LoginCredentials, UserData } from '../types/auth.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;


export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // If response is not ok, throw an error with the backend message
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      // Re-throw the error to be caught by the calling function
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      console.log('Logout response:', response);
    } catch {
      throw new Error('Logout failed:',);
    }
  },

  async checkAuth(): Promise<{ authenticated: boolean; userId?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include' // For cookie-based auth
      });
      if (!response.ok) {
        return { authenticated: false };
      }

      return await response.json();
    } catch (error) {
      return { authenticated: false };
    }
  },

  async me(): Promise<{ user: UserData }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch current user');
      }

      return await response.json();
    } catch (error) {
      console.error('Fetch current user failed:', error);
      throw error;
    }
  }
};