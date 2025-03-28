
import { User } from "@supabase/supabase-js";

export type BuildStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';

export interface BuildReview {
  id: string;
  reviewer_id: string;
  reviewer_name?: string;
  comments: string;
  status: BuildStatus;
  created_at: string;
  updated_at: string;
}

export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
  notes?: string;
}

export interface BuildMod {
  id: string;
  name: string;
  description?: string;
  complexity: number;
}

export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submitted_by: string;
  display_name?: string;
  avatar_url?: string;
  images: string[];
  created_at: string;
  updated_at: string;
  processed_at?: string;
  parts_count: number;
  mods_count: number;
  complexity_score: number;
  reviews?: BuildReview[];
  parts?: BuildPart[];
  mods?: BuildMod[];
}

export interface BuildReviewFormData {
  status: BuildStatus;
  comments: string;
}

export interface BuildAdminState {
  builds: Build[];
  selectedBuild: Build | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: BuildStatus | 'all';
    dateRange: [Date | null, Date | null];
    sortBy: 'newest' | 'oldest' | 'complexity';
  };
  pagination: {
    page: number;
    perPage: number;
    total: number;
  };
}

export interface BuildAdminActions {
  fetchBuilds: () => Promise<void>;
  fetchBuildById: (id: string) => Promise<void>;
  approveBuild: (id: string, comments: string) => Promise<void>;
  rejectBuild: (id: string, comments: string) => Promise<void>;
  requestRevision: (id: string, comments: string) => Promise<void>;
  updateFilters: (filters: Partial<BuildAdminState['filters']>) => void;
  updatePagination: (pagination: Partial<BuildAdminState['pagination']>) => void;
  setSelectedBuild: (build: Build | null) => void;
  clearError: () => void;
}

export type BuildAdminStore = BuildAdminState & BuildAdminActions;
