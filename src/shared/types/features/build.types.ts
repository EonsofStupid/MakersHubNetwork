
/**
 * Build system types
 */
import { UserRole } from '../core/auth.types';

// Build status
export enum BuildStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_REVIEW = 'in_review'
}

// User info
export interface UserInfo {
  id: string;
  displayName?: string;
  email?: string;
  avatarUrl?: string;
}

// Build part
export interface BuildPart {
  id: string;
  part_id: string;
  build_id: string;
  quantity: number;
  notes?: string;
}

// Build mod
export interface BuildMod {
  id: string;
  name: string;
  description?: string;
  complexity?: number;
  build_id: string;
  status?: string;
}

// Build
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
  processed_at?: string;
  images?: string[];
  image_urls?: string[];
  user?: UserInfo;
  parts?: BuildPart[];
  mods?: BuildMod[];
  complexity?: number;
}

// Build review
export interface BuildReview {
  id: string;
  title: string;
  body: string;
  rating?: number;
  is_verified_purchase: boolean;
  user_id?: string;
  build_id?: string;
  updated_at: string;
  created_at?: string;
  approved?: boolean;
}

// Build filters
export interface BuildFilters {
  status?: BuildStatus | 'all';
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'complexity_high' | 'complexity_low';
  page: number;
  perPage: number;
}

// Build pagination
export interface BuildPagination {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

// Build admin store
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
