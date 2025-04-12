
import { Build, BuildPart, BuildMod, BuildStatus } from '@/shared/types/shared.types';

export interface BuildFilters {
  status?: BuildStatus;
  userId?: string;
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  sortBy?: string;
}

export interface BuildPagination {
  page: number;
  perPage: number;
  total?: number;
}

export interface BuildAdminStore {
  builds: Build[];
  selectedBuild: Build | null;
  isLoading: boolean;
  error: string | null;
  filters: BuildFilters;
  pagination: BuildPagination;
  
  // Actions
  fetchBuilds: () => Promise<void>;
  fetchBuildById: (id: string) => Promise<void>;
  approveBuild: (id: string, note?: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  requestRevision: (id: string, feedback: string) => Promise<void>;
  updateFilters: (filters: Partial<BuildFilters>) => void;
  updatePagination: (pagination: Partial<BuildPagination>) => void;
  clearError: () => void;
}

export interface BuildActionResult {
  success: boolean;
  message: string;
}
