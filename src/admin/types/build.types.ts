
export interface Build {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submittedBy: string;
  userId: string;
  userName: string;
  complexity_score: number;
  parts_count: number;
  mods_count: number;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
}

export type BuildStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';

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
  complexity?: number;
}

export interface BuildFilters {
  status?: BuildStatus;
  complexity?: [number, number];
  search?: string;
}

export interface BuildAdminStore {
  builds: Build[];
  selectedBuild: Build | null;
  filters: BuildFilters;
  pagination: BuildPagination;
  isLoading: boolean;
  error: string | null;
}

export interface BuildPagination {
  page: number;
  pageSize: number;
  total: number;
}
