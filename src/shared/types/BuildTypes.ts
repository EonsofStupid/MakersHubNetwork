
// Don't import conflicting types
// import { BuildPart, BuildMod } from './shared.types';

/**
 * Build part interface
 */
export interface BuildPart {
  id: string;
  part_id: string;
  build_id: string;
  quantity: number;
  notes?: string;
}

/**
 * Build modification interface
 */
export interface BuildMod {
  id: string;
  name: string;
  description?: string;
  complexity?: number;
  build_id: string;
  status?: string;
}

/**
 * Build status enum
 */
export enum BuildStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

/**
 * Build interface
 */
export interface Build {
  id: string;
  name: string;
  description?: string;
  status: BuildStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
  parts: BuildPart[];
  mods: BuildMod[];
}
