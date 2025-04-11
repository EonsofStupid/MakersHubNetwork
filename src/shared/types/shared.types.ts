
/**
 * Common shared types used across the application
 */

/**
 * A generic status type used throughout the application
 */
export type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * A generic sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * A generic pagination state
 */
export interface PaginationState {
  page: number;
  perPage: number;
  total: number;
}

/**
 * A generic API response
 */
export interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
}
