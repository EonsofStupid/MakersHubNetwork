
import { Json } from '@/types/json';
import { toSafeJson } from '@/utils/jsonUtils';

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
  permissions?: string[];
}

// Making LayoutComponent serializable as Json
export type JsonSafeLayoutComponent = Omit<LayoutComponent, 'children'> & {
  children?: JsonSafeLayoutComponent[];
};

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
  layout_json: Json;
  meta?: Record<string, any>;
}

// Alias Component to LayoutComponent for backward compatibility
export type Component = LayoutComponent;

/**
 * Convert a layout object to a safe JSON representation for database storage
 */
export function layoutToJson(layout: Partial<Layout>): Json {
  const { components, version } = layout;
  const jsonSafeComponents = components ? makeComponentsJsonSafe(components) : [];
  return toSafeJson({
    components: jsonSafeComponents,
    version: version || 1
  });
}

/**
 * Create a basic layout with required fields initialized
 */
export function createEmptyLayout(partial: Partial<Layout> = {}): Layout {
  const now = new Date().toISOString();
  return {
    id: partial.id || crypto.randomUUID(),
    name: partial.name || 'New Layout',
    type: partial.type || 'page',
    description: partial.description,
    components: partial.components || [],
    version: partial.version || 1,
    scope: partial.scope || 'global',
    created_at: partial.created_at || now,
    updated_at: partial.updated_at || now,
    created_by: partial.created_by,
    is_active: partial.is_active !== undefined ? partial.is_active : true,
    is_locked: partial.is_locked !== undefined ? partial.is_locked : false,
    meta: partial.meta || {}
  };
}

/**
 * Convert a raw component to a safe JSON representation
 * This ensures all components can be safely stored in the database
 */
export function componentToJson(component: LayoutComponent): Json {
  const jsonSafeComponent = makeComponentJsonSafe(component);
  return toSafeJson(jsonSafeComponent);
}

/**
 * Convert components array to safe JSON
 */
export function componentsToJson(components: LayoutComponent[]): Json {
  const jsonSafeComponents = makeComponentsJsonSafe(components);
  return toSafeJson(jsonSafeComponents);
}

/**
 * Helper function to make a component JSON-safe recursively
 */
function makeComponentJsonSafe(component: LayoutComponent): JsonSafeLayoutComponent {
  const { children, ...rest } = component;
  
  if (!children || children.length === 0) {
    return rest;
  }
  
  return {
    ...rest,
    children: children.map(makeComponentJsonSafe)
  };
}

/**
 * Helper function to make an array of components JSON-safe
 */
function makeComponentsJsonSafe(components: LayoutComponent[]): JsonSafeLayoutComponent[] {
  return components.map(makeComponentJsonSafe);
}
