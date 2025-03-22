
import { UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { DashboardStats, Activity, DashboardMetrics } from './dashboard';
import { ContentItem, ContentStats } from './content';
import { ImportResult } from './import';

/**
 * Dashboard Query Types
 */
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
