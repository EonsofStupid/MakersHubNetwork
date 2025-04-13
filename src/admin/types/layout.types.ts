
import { ReactNode } from 'react';
import type { AdminPermissionValue } from '@/admin/constants/permissions';

export interface Component {
  id: string;
  type: string;
  props?: Record<string, any>;
  children?: Component[];
  permissions?: string[]; // Permission IDs required to view this component
}

export interface Layout {
  id: string;
  name: string;
  type: string;
  scope: string;
  components: Component[];
  meta?: Record<string, any>;
  version: number;
}

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

export interface LayoutRendererProps {
  layout: Layout | null;
  isLoading?: boolean;
  fallback?: ReactNode;
  error?: Error | null;
}

export interface LayoutEditorProps {
  layout: Layout | null;
  onSave?: (layout: Layout) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}
