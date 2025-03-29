
import { ReactNode } from "react";

// Admin permission types
export type AdminPermission = 
  | 'admin:access' 
  | 'admin:view' 
  | 'admin:edit'
  | 'admin:super'
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

// Admin roles with associated permissions
export interface AdminRole {
  id: string;
  name: string;
  permissions: AdminPermission[];
}

// Frozen zone definition
export interface FrozenZone {
  id: string;
  isLocked: boolean;
}

// Admin overlay configuration
export interface AdminOverlayConfig {
  id: string;
  type: 'frozenZone' | 'aiAssistant' | 'effectsPalette' | 'rolePreset' | 'customFlow';
  title: string;
  isVisible: boolean;
  position: {
    x: number;
    y: number;
  };
}

// Admin tool configuration
export interface AdminToolConfig {
  id: string;
  icon: ReactNode;
  title: string;
  description: string;
  permission: AdminPermission;
  overlayType?: string;
}

// Admin dashboard widget
export interface AdminDashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'activity' | 'quickActions';
  size: 'small' | 'medium' | 'large';
  position: number;
  permission: AdminPermission;
}

// Admin inspector
export interface AdminInspectorConfig {
  enabled: boolean;
  highlight: boolean;
  showComponentTree: boolean;
  showState: boolean;
}

// Admin theme variant
export interface AdminThemeVariant {
  id: string;
  name: string;
  isPrimary: boolean;
  colors: Record<string, string>;
}

// Admin build review item
export interface AdminBuildReview {
  id: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'needsChanges';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

// Admin preferences
export interface AdminPreferences {
  sidebarExpanded: boolean;
  dashboardLayout: AdminDashboardWidget[];
  pinnedTools: string[];
  theme: string;
  activeSection: string;
}
