
import { Build, BuildStatus, BuildPart, BuildMod } from '@/shared/types/shared.types';

// Build filter types
export interface BuildFilter {
  status: string;
  dateRange: [Date | null, Date | null];
  sortBy: string;
}

// Pagination types
export interface BuildPagination {
  page: number;
  perPage: number;
  total: number;
}

// Admin store interface for build management
export interface BuildAdminStore {
  // State
  builds: Build[];
  selectedBuild: Build | null;
  selectedBuildId: string | null;
  isLoading: boolean;
  error: Error | null;
  filters: BuildFilter;
  pagination: BuildPagination;
  
  // Actions
  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<void>;
  fetchBuildById: (id: string) => Promise<void>;
  selectBuild: (id: string) => void;
  approveBuild: (id: string, comment: string) => Promise<void>;
  rejectBuild: (id: string, comment: string) => Promise<void>;
  requestRevision: (id: string, comment: string) => Promise<void>;
  updateFilters: (filters: Partial<BuildFilter>) => void;
  updatePagination: (pagination: Partial<BuildPagination>) => void;
  clearError: () => void;
}
