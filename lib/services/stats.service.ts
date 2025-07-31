import { StatsResponse } from '@/lib/types/stats.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const statsService = {
  async getStats(): Promise<StatsResponse> {
    try {
      const res = await fetch(`${API_BASE_URL}/stats`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      return data as StatsResponse;
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : String(error);
      console.error('Error fetching stats:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while fetching stats.',
        details: err
      };
    }
  }
};
