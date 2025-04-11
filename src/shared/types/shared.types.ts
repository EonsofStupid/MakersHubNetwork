
/**
 * Common shared types used across the application
 */

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Paginated<T> {
  data: T[];
  meta: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  }
}

export type SortDirection = 'asc' | 'desc';
export type SortOptions = Record<string, SortDirection>;

export type UserMetadata = {
  full_name?: string;
  name?: string;
  avatarUrl?: string;
  [key: string]: any;
};
