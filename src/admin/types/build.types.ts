
// Types for the build system in admin

export type BuildStatus = 'pending' | 'approved' | 'rejected' | 'needs_revision';

export type Build = {
  id: string;
  title: string;
  description: string;
  status: BuildStatus;
  submittedBy: string;
  userId: string;
  userName: string;
  imageUrl?: string;
  complexity?: number;
  parts: BuildPart[];
  mods: BuildMod[];
  reviews: BuildReview[];
  createdAt: string;
  updatedAt: string;
};

export type BuildPart = {
  id: string;
  name: string;
  type: string;
  quantity: number;
  price?: number;
  link?: string;
};

export type BuildMod = {
  id: string;
  name: string;
  description: string;
  complexity: number;
  imageUrl?: string;
};

export type BuildReview = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

export interface BuildAdminStore {
  builds: Build[];
  selectedBuildId: string | null;
  isLoading: boolean;
  error: Error | null;
  
  fetchBuilds: () => Promise<void>;
  fetchBuild: (id: string) => Promise<void>;
  approveBuild: (id: string, comment?: string) => Promise<void>;
  rejectBuild: (id: string, reason: string) => Promise<void>;
  requestRevision: (id: string, feedback: string) => Promise<void>;
  selectBuild: (id: string | null) => void;
}
