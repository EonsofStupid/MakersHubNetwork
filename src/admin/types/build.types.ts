
// Types for build related data
export type BuildStatus = "pending" | "approved" | "rejected" | "needs_revision";

export interface BuildPart {
  id: string;
  name: string;
  quantity: number;
  type: string;
  notes?: string;
}

export interface BuildMod {
  id: string;
  name: string;
  description: string;
  build_id: string;
  complexity: number | null;
  created_at: string;
}

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
  avatar_url?: string;
  display_name?: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
  images?: string[];
  parts?: BuildPart[];
  mods?: BuildMod[];
  reviews?: any[];
}

export interface BuildFilter {
  status?: BuildStatus | 'all';
  complexity?: 'low' | 'medium' | 'high' | 'all';
  search?: string;
  sortBy?: 'newest' | 'oldest' | 'complexity' | 'title';
  creatorId?: string;
}

export interface BuildsState {
  builds: Build[];
  selectedBuild: Build | null;
  isLoading: boolean;
  error: string | null;
  filters: BuildFilter;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}
