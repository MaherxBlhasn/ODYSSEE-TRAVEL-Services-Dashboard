import { AnalyticsResponse } from '@/lib/types/analytics.types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const analyticsService = {
  async getAnalytics(days: number = 30): Promise<AnalyticsResponse> {
    try {
        const res = await fetch(`${API_BASE_URL}/analytics?days=${days}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
      });

      const data = await res.json();
      return data as AnalyticsResponse;
    } catch (error: unknown ) {
      const err = error instanceof Error ? error.message : String(error);
      console.error('Error fetching analytics:', err);
      return {
        success: false,
        error: 'An unexpected error occurred while fetching analytics.',
        details: err
      };
    }
  }
};
