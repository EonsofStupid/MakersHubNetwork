import { BuildStatus, UserRole } from './shared.types';

export interface Build {
  id: string;
  title: string;
  description: string;
  image_urls: string[]; 
  status: BuildStatus;
  submitted_by?: string;
  complexity_score?: number;
  parts_count?: number;
  mods_count?: number;
  created_at?: string;
  updated_at?: string;
  processed_at?: string;
}

export interface BuildPart {
  id: string;
  part_id: string;
  build_id: string;
  quantity: number;
  notes?: string;
}

export interface BuildMod {
  id: string;
  name: string;
  description?: string;
  complexity?: number;
  build_id: string;
  status?: string;
}

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
