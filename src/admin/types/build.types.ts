
import { PostgrestError } from "@supabase/supabase-js";

export type BuildStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';

export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
  notes?: string | null;
}

export interface BuildMod {
  id: string;
  name: string;
  description?: string | null;
  complexity?: number | null;
  build_id: string;
  created_at: string;
}

export interface BuildReview {
  id: string;
  build_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  status: BuildStatus;
  comments: string;
  created_at: string;
}

export interface Build {
  id: string;
  title: string;
  description: string;
  images?: string[];
  status: BuildStatus;
  created_at: string;
  updated_at: string;
  processed_at?: string | null;
  complexity_score: number;
  parts_count: number;
  mods_count: number;
  submitted_by: string;
  display_name?: string | null;
  avatar_url?: string | null;
  parts: BuildPart[];
  mods: BuildMod[];
  reviews: BuildReview[];
}

export interface BuildFilters {
  status: 'all' | BuildStatus;
  dateRange: [Date | null, Date | null];
  sortBy: 'newest' | 'oldest' | 'complexity';
}

export interface BuildPagination {
  page: number;
  perPage: number;
  total: number;
}

export interface BuildAdminState {
  builds: Build[];
  selectedBuild: Build | null;
  isLoading: boolean;
  error: string | null;
  filters: BuildFilters;
  pagination: BuildPagination;
}

export interface BuildAdminActions {
  fetchBuilds: () => Promise<void>;
  fetchBuildById: (id: string) => Promise<void>;
  approveBuild: (id: string, comments: string) => Promise<void>;
  rejectBuild: (id: string, comments: string) => Promise<void>;
  requestRevision: (id: string, comments: string) => Promise<void>;
  updateFilters: (filters: Partial<BuildFilters>) => void;
  updatePagination: (pagination: Partial<BuildPagination>) => void;
  setSelectedBuild: (build: Build | null) => void;
  clearError: () => void;
}

export type BuildAdminStore = BuildAdminState & BuildAdminActions;
