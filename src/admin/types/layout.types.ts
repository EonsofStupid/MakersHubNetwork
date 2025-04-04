
import { Json } from '@/types/json';

export interface LayoutComponent {
  id: string;
  type: string;
  props?: Record<string, any>;
  children?: LayoutComponent[];
  content?: string;
  condition?: {
    type: string;
    value: any;
  };
  styles?: Record<string, any>;
  className?: string;
  permissions?: string[]; // Added to match what's used in LayoutRenderer
}

export interface Layout {
  id: string;
  name: string;
  type: string;
  description?: string;
  components: LayoutComponent[];
  version: number;
  scope: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  is_locked: boolean;
  meta?: Record<string, any>;
}

// LayoutSkeleton represents the database schema version of a Layout
export interface LayoutSkeleton {
  id: string;
  name: string;
  type: string;
  description?: string;
  scope: string;
  version: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_active: boolean;
  is_locked: boolean;
  layout_json: Json | {
    components: LayoutComponent[];
    version: number;
  };
  meta?: Record<string, any>;
}

// Alias Component to LayoutComponent for backward compatibility
export type Component = LayoutComponent;
