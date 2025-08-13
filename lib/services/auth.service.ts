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
          'Cache-Control': 'no-store',
          'Accept': 'application/json'
        },
        body: JSON.stringify(credentials),
      });

      // First check for network errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      // Debugging headers
      console.log('Auth headers:', {
        'set-cookie': response.headers.get('set-cookie'),
        'access-control-expose-headers': response.headers.get('access-control-expose-headers')
      });

      return await response.json();
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        throw new Error(error.message || 'Login failed');
      } else {
        throw new Error('Login failed');
      }
    }
  },

  async logout(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-store'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async checkAuth(): Promise<{ authenticated: boolean; userId?: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/check`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-store'
        },
        cache: 'no-store' // Next.js fetch option
      });

      // Special handling for 401 responses
      if (response.status === 401) {
        return { authenticated: false };
      }

      if (!response.ok) {
        console.warn('[checkAuth] Server error:', response.status);
        return { authenticated: false };
      }

      return await response.json();
    } catch (error) {
      console.error('[checkAuth] Network error:', error);
      return { authenticated: false };
    }
  },

  async me(): Promise<{ user: UserData }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-store'
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Failed to fetch user');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  }
};