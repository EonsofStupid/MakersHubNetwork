
/**
 * Build types for the application
 */

import { User } from './shared.types';

// Build status enum
export enum BuildStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  NEEDS_REVISION = 'needs_revision',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

// Build part interface
export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
  build_id: string;
  created_at: string;
}

// Build mod interface
export interface BuildMod {
  id: string;
  name: string;
  description: string;
  status?: BuildStatus;
  build_id: string;
  created_at: string;
  reviewed_at?: string;
}

// Build filters
export interface BuildFilters {
  status?: BuildStatus | null;
  search?: string;
  category?: string | string[];
  dateRange?: {
    from?: Date;
    to?: Date;
  };
  approved?: boolean;
  sortBy?: 'newest' | 'oldest' | 'alphabetical';
}

// Build pagination
export interface BuildPagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Build interface
export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  creator_id: string;
  created_at: string;
  updated_at: string;
  category?: string[];
  approved?: boolean;
  reviewed_by?: string;
  reviewed_at?: string;
  parts?: BuildPart[];
  mods?: BuildMod[];
  user?: User;
  image_urls?: string[];
  tags?: string[];
  featured?: boolean;
  views?: number;
  likes?: number;
}

// Build admin store interface
export interface BuildAdminStore {
  builds: Build[];
  selectedBuild: Build | null;
  filters: BuildFilters;
  pagination: BuildPagination;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<Build | null>;
  approveBuild: (id: string, comment?: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  requestRevision: (id: string, feedback: string) => Promise<void>;
  updateFilters: (filters: Partial<BuildFilters>) => void;
  changePage: (page: number) => void;
  changePageSize: (size: number) => void;
  searchBuilds: (term: string) => Promise<void>;
}
