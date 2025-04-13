
/**
 * Types for layout system
 */

/**
 * Layout component props
 */
export interface LayoutComponentProps {
  [key: string]: any;
}

/**
 * Layout component
 */
export interface LayoutComponent {
  id: string;
  type: string;
  props?: LayoutComponentProps;
  children?: LayoutComponent[];
}

/**
 * Complete layout
 */
export interface Layout {
  id: string;
  name: string;
  type: string;
  scope: string;
  components: LayoutComponent[];
  meta?: Record<string, any>;
  version: number;
}

/**
 * Layout skeleton stored in the database
 */
export interface LayoutSkeleton {
  id: string;
  name: string;
  type: string;
  scope: string;
  description?: string;
  layout_json: Record<string, any>;
  is_active: boolean;
  is_locked?: boolean;
  version: number;
}
