
export interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  totalFiles: number;
  activeSessions: number;
  totalPrinters: number;
}

export interface Activity {
  id: string;
  type: 'user_registration' | 'login' | 'content_create' | 'content_update' | 'other';
  description: string;
  userId?: string;
  userName?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChartData {
  label: string;
  value: number;
}

export interface DashboardMetrics {
  dailyActiveUsers: ChartData[];
  weeklyActiveUsers: ChartData[];
  monthlyActiveUsers: ChartData[];
  contentCreation: ChartData[];
}

export interface TrendingModel {
  id: string;
  name: string;
  creator: string;
  views: number;
  downloads: number;
  rating: number;
  thumbnailUrl?: string;
}
