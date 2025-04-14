
/**
 * Build system types
 */
import { BaseEntity } from '../core/common.types';
import { UserProfile } from '../core/auth.types';

export enum BuildStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IN_REVIEW = 'in_review'
}

export interface BuildPart extends BaseEntity {
  part_id: string;
  build_id: string;
  quantity: number;
  notes?: string;
}

export interface BuildMod extends BaseEntity {
  name: string;
  description?: string;
  complexity?: number;
  build_id: string;
  status?: string;
}

export interface BuildProfile extends BaseEntity {
  title: string;
  description: string;
  status: string;
  images?: string[];
  submitted_by: string;
  complexity_score?: number;
  parts_count?: number;
  mods_count?: number;
  processed_at?: string;
  display_name?: string;
  avatar_url?: string;
}

export interface BuildWithRelations extends BuildProfile {
  parts: BuildPart[];
  mods: BuildMod[];
  submitter?: UserProfile;
}

export interface BuildFilter {
  status?: BuildStatus;
  searchTerm?: string;
  submittedBy?: string;
  sortBy?: 'date' | 'complexity' | 'parts';
  sortOrder?: 'asc' | 'desc';
}
