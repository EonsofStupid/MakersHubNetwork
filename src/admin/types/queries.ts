import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { DashboardStats, Activity, DashboardMetrics } from './dashboard';
import { ContentItem, ContentStats } from './content';
import { ImportResult } from './import';

/**
 * Query keys factory for admin module
 */
export const adminKeys = {
  all: ['admin'] as const,
  
  // Dashboard related keys
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  stats: () => [...adminKeys.dashboard(), 'stats'] as const,
  activities: () => [...adminKeys.dashboard(), 'activities'] as const,
  metrics: () => [...adminKeys.dashboard(), 'metrics'] as const,
  activeUsers: () => [...adminKeys.dashboard(), 'activeUsers'] as const,
  
  // Parts & content related keys
  parts: () => [...adminKeys.all, 'parts'] as const,
  partsCount: () => [...adminKeys.parts(), 'count'] as const,
  trendingParts: () => [...adminKeys.parts(), 'trending'] as const,
  
  // User related keys
  users: () => [...adminKeys.all, 'users'] as const,
  totalUsersCount: () => [...adminKeys.users(), 'count'] as const,
  
  // Review related keys
  reviews: () => [...adminKeys.all, 'reviews'] as const,
  
  // Content related keys
  content: () => [...adminKeys.all, 'content'] as const
};

/**
 * Admin module query types
 */

// Dashboard related types
export interface ActiveUser {
  id: string;
  display_name?: string;
  avatar_url?: string;
  last_seen?: string;
  status: 'Active' | 'Inactive' | 'Away';
}

export interface TrendingPart {
  id?: string;
  name: string;
  community_score?: number;
  review_count?: number;
  views?: number;
  downloads?: number;
}

// Query option types
export type GetDashboardStatsOptions = UseQueryOptions<DashboardStats, Error, DashboardStats, ['admin', 'dashboard', 'stats']>;
export type GetRecentActivitiesOptions = UseQueryOptions<Activity[], Error, Activity[], ['admin', 'dashboard', 'activities']>;
export type GetDashboardMetricsOptions = UseQueryOptions<DashboardMetrics, Error, DashboardMetrics, ['admin', 'dashboard', 'metrics']>;

/**
 * Content Query Types
 */
export type GetContentItemsOptions = UseQueryOptions<ContentItem[], Error, ContentItem[], ['admin', 'content', 'items']>;
export type GetContentStatsOptions = UseQueryOptions<ContentStats, Error, ContentStats, ['admin', 'content', 'stats']>;
export type DeleteContentItemOptions = UseMutationOptions<unknown, Error, string, unknown>;
export type UpdateContentItemOptions = UseMutationOptions<ContentItem, Error, Partial<ContentItem>, unknown>;

/**
 * Import Query Types
 */
export type GetImportResultsOptions = UseQueryOptions<ImportResult[], Error, ImportResult[], ['admin', 'import', 'results']>;
export type StartImportOptions = UseMutationOptions<ImportResult, Error, FormData, unknown>;
export type CancelImportOptions = UseMutationOptions<unknown, Error, string, unknown>;

/**
 * User Query Types
 */
export type GetUsersOptions = UseQueryOptions<any[], Error, any[], ['admin', 'users']>;
export type UpdateUserOptions = UseMutationOptions<any, Error, {id: string; data: any}, unknown>;
export type DeleteUserOptions = UseMutationOptions<unknown, Error, string, unknown>;
