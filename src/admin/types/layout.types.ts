
/**
 * Layout Type Definitions - Single Source of Truth
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
    version: data.version || 1,
    meta: data.meta
  };
}

/**
 * Create a default layout skeleton for initialization
 */
export function createDefaultLayoutSkeleton(type: string, scope: string): Partial<LayoutSkeleton> {
  return {
    name: `Default ${type} Layout`,
    type,
    scope,
    is_active: true,
    is_locked: false,
    layout_json: {
      components: [],
      version: 1
    },
    version: 1
  };
}

/**
 * Create a default layout for initialization
 */
export function createDefaultLayout(type: string, scope: string): Partial<Layout> {
  const now = new Date().toISOString();
  return {
    name: `Default ${type} Layout`,
    type,
    scope,
    components: [],
    version: 1,
    created_at: now,
    updated_at: now,
    is_active: true,
    is_locked: false
  };
}
