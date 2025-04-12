
// Re-export types from shared module for backwards compatibility
import { 
  BuildStatus
} from './shared.types';

export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  created_at: string;
  updated_at?: string;
  submitted_by: string;
  complexity?: number;
  parts?: BuildPart[];
  mods?: BuildMod[];
  images?: string[];
  user?: {
    displayName?: string;
    avatarUrl?: string;
  };
}

export interface BuildPart {
  id: string;
  build_id: string;
  part_id: string;
  quantity: number;
  notes?: string;
  name?: string;
}

export interface BuildMod {
  id: string;
  build_id: string;
  name: string;
  description?: string;
  complexity?: number;
}

export interface BuildFilters {
  status?: BuildStatus | 'all';
  userId?: string;
  search?: string;
  complexity?: 'low' | 'medium' | 'high' | 'all';
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
  filters: BuildFilters;
  pagination: BuildPagination;
  
  fetchBuilds: () => Promise<void>;
  fetchBuildById: (id: string) => Promise<void>;
  updateFilters: (filters: Partial<BuildFilters>) => void;
  updatePagination: (pagination: Partial<BuildPagination>) => void;
  approveBuild: (id: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  requestRevisions: (id: string, feedback: string) => Promise<void>;
}

// Re-export the status enum
export { BuildStatus };
