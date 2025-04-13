
import { BuildStatus, BuildPart, BuildMod, UserInfo } from './shared.types';

export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  complexity_score: number;
  parts_count: number;
  mods_count: number;
  submitted_by: string;
  created_at: string;
  updated_at: string;
  images?: string[];
  user?: UserInfo;
  parts?: BuildPart[];
  mods?: BuildMod[];
  complexity?: number;
  image_urls?: string[];
}

export interface BuildFilters {
  status?: BuildStatus | 'all';
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'complexity_high' | 'complexity_low';
  page: number;
  perPage: number;
}

export interface BuildPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface BuildAdminStore {
  builds: Build[];
  selectedBuild: Build | null;
  isLoading: boolean;
  error: string | null;
  pagination: BuildPagination;
  filters: BuildFilters;
  
  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<void>;
  approveBuild: (id: string, comment: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  requestRevision: (id: string, feedback: string) => Promise<void>;
  clearError: () => void;
}

// Re-export important types and enums
export { BuildStatus } from './shared.types';
