
/**
 * Core admin type definitions
 */

// Admin permissions
export type AdminPermission = 
  | 'admin:access'
  | 'admin:view'
  | 'admin:edit'
  | 'super_admin:all'
  | 'content:view'
  | 'content:edit'
  | 'content:delete'
  | 'users:view'
  | 'users:edit'
  | 'users:delete'
  | 'themes:view'
  | 'themes:edit'
  | 'builds:view'
  | 'builds:approve'
  | 'builds:reject'
  | 'admin:users:read'
  | 'admin:content:read'
  | 'admin:settings:read'
  | 'admin:data:import'
  | string; // Allow string values for dynamic permissions

// Admin shortcuts for dashboard
export interface AdminShortcut {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission?: AdminPermission;
  color?: string;
}

// QuickAction for the floating toolbar
export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  permission?: AdminPermission;
}

// Admin section configuration
export interface AdminSectionConfig {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission?: AdminPermission;
  subsections?: AdminSectionConfig[];
}

// Admin UI element state
export interface AdminUIState {
  isVisible: boolean;
  isActive: boolean;
  isExpanded: boolean;
  isHovered: boolean;
  isDragging: boolean;
}

// Frozen zone configuration
export interface FrozenZone {
  id: string;
  label: string;
  selector: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
}

// Admin panel overlay configuration
export interface AdminOverlayConfig {
  id: string;
  type: 'inspector' | 'ai' | 'effects' | 'roles' | 'recorder';
  position: 'left' | 'right' | 'bottom' | 'float';
  isVisible: boolean;
  isExpanded: boolean;
  width: number;
  height: number;
}
