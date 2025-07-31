export interface StatsResponse {
  success: boolean;
  error?: string;
  details?: string;
  data?: {
    stats: {
      totalOffers: number;
      availableOffers: number;
      unavailableOffers: number;
      totalMessages: number;
      totalAdmins: number;
    };
    lastMessage: {
      name: string;
      familyName: string;
      message: string;
      messageSentAt: string; // ISO string
    } | null;
    recentActivity: {
      message: string;
      date: string; // e.g. "Jul 31, 2024"
    }[];
    latestMessages: {
      name: string;
      familyName: string;
      Email: string;
      message: string;
      messageSentAt: string; // ISO string
    }[];
  };
}
