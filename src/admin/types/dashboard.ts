
import { ReactNode } from 'react';

export interface StatCard {
  title: string;
  value: number | string | null;
  description: string;
  loading: boolean;
  icon: ReactNode;
  color: string;
}

export interface DashboardMetric {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}

export interface PerformanceData {
  name: string;
  visitors: number;
  newUsers: number;
  avgTime: number;
}

export interface ActiveUserMetric {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  last_seen: string | null;
  status: string | null;
}
