
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
export interface Component {
  id: string;
  type: string;
  props?: LayoutComponentProps;
  children?: Component[];
  permissions?: string[];
}

/**
 * Complete layout
 */
export interface Layout {
  id: string;
  name: string;
  type: string;
  scope: string;
  components: Component[];
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
