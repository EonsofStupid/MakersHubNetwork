
import { ReactNode } from 'react';

export type LayoutComponentType = 'page' | 'section' | 'widget';
export type LayoutScope = 'site' | 'admin' | 'feature';

export interface LayoutComponentProps {
  id: string;
  title: string;
  icon?: ReactNode;
  position: number;
  children?: ReactNode;
  requiresAuth?: boolean;
  requiredRole?: string;
}

export interface LayoutComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface Layout {
  id: string;
  name: string;
  description?: string;
  type: LayoutComponentType;
  components: Record<string, LayoutComponent>;
  layout: Array<{
    id: string;
    parentId?: string;
    position: number;
    componentId: string;
  }>;
  meta?: Record<string, any>;
  scope: LayoutScope;
}

export interface LayoutSkeleton {
  id: string;
  name: string;
  description?: string;
  type: string;
  scope: string;
  layout_json: any;
  is_locked: boolean;
  version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
}

// Export Component type for backward compatibility
export type Component = LayoutComponent;
