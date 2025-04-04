
/**
 * Layout Type Definitions
 */

// Component definition
export interface Component {
  id: string;
  type: string;
  props?: Record<string, any>;
  children?: Component[];
  permissions?: string[];
  meta?: Record<string, any>;
}

// Layout JSON data for database storage
export interface LayoutJsonData {
  components: Component[];
  version: number;
  meta?: Record<string, any>;
}

// Layout structure
export interface Layout {
  id: string;
  name: string;
  type: string;
  scope: string;
  components: Component[];
  version: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_locked: boolean;
  meta?: Record<string, any>;
  description?: string;
}

// Layout skeleton from database
export interface LayoutSkeleton {
  id: string;
  name: string;
  type: string;
  scope: string;
  description?: string | null;
  is_active: boolean;
  is_locked: boolean;
  layout_json: LayoutJsonData;
  version: number;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  meta?: Record<string, any>;
  parent_id?: string;
  tags?: string[];
}

// Layout API response types
export interface CreateLayoutResponse {
  success: boolean;
  data?: LayoutSkeleton;
  error?: string;
  id?: string;
}

// Helper types
export type LayoutType = 'admin' | 'site' | 'dashboard' | 'page' | 'section';
export type LayoutScope = 'admin' | 'site' | 'public' | 'user';

/**
 * Convert a layout to JSON format for storage
 */
export function layoutToJson(data: { components: Component[], version: number }): LayoutJsonData {
  return {
    components: data.components || [],
    version: data.version || 1
  };
}
