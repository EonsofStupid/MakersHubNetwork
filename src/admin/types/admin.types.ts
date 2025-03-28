
export type AdminPermission = 
  | 'admin:access'
  | 'admin:view'
  | 'admin:edit'
  | 'content:view'
  | 'content:edit'
  | 'content:delete'
  | 'users:view'
  | 'users:edit'
  | 'users:delete'
  | 'builds:view'
  | 'builds:approve'
  | 'builds:reject'
  | 'themes:view'
  | 'themes:edit'
  | 'themes:delete'
  | 'super_admin:all';

export type AdminRole = 'admin' | 'moderator' | 'super_admin' | 'content_editor';

export interface FrozenZone {
  id: string;
  selector: string;
  createdBy: string;
  createdAt: string;
  note?: string;
}

export interface AdminOverlayConfig {
  id: string;
  type: 'inspector' | 'ai' | 'effects' | 'recorder' | 'custom';
  position: { x: number; y: number };
  size: { width: number; height: number };
  isVisible: boolean;
  data?: Record<string, any>;
}

export interface AdminDashboardMetric {
  id: string;
  name: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  icon?: string;
}

export interface AdminShortcut {
  id: string;
  name: string;
  icon: string;
  path: string;
  count?: number;
  color?: string;
}

export interface AdminActionRecord {
  id: string;
  action: string;
  performedBy: string;
  performedAt: string;
  target: string;
  targetType: string;
  metadata?: Record<string, any>;
}

export interface AdminZoneConfig {
  id: string;
  name: string;
  zones: {
    id: string;
    name: string;
    isLocked: boolean;
    allowedRoles: AdminRole[];
  }[];
}
