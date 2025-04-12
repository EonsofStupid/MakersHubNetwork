
// Re-export types from shared module for backwards compatibility
import { 
  Build, 
  BuildStatus, 
  BuildPart, 
  BuildMod, 
  BuildFilters, 
  BuildPagination,
  BuildAdminStore
} from '@/shared/types/build.types';

// Export all shared types
export type { 
  Build, 
  BuildPart, 
  BuildMod, 
  BuildFilters, 
  BuildPagination,
  BuildAdminStore
};

// Export the enums
export { BuildStatus };

// Admin specific types
export interface BuildDetailViewProps {
  buildId: string;
  onBack?: () => void;
}

export interface BuildPartsProps {
  parts: BuildPart[];
}

export interface BuildModsProps {
  mods: BuildMod[];
}

export interface BuildStatusBadgeProps {
  status: BuildStatus;
}
