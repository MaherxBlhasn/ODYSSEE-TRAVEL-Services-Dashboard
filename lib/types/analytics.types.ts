export interface CountryAnalytics {
  country: string;
  users: number;
}

export interface AnalyticsData {
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  engagementRate: string; // e.g., "75.4%"
  averageSessionDuration: string; // e.g., "00:03:45"
  pageViews: number;
  topCountries: CountryAnalytics[];
}

export interface AnalyticsResponseSuccess {
  success: true;
  data: AnalyticsData;
}

export interface AnalyticsResponseError {
  success: false;
  error: string;
  details?: string;
}

export type AnalyticsResponse = AnalyticsResponseSuccess | AnalyticsResponseError;
