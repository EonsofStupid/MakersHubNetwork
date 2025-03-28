
// Admin and Moderator permission types
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
  | 'moderator:view'
  | 'moderator:edit'
  | 'moderator:ban'
  | 'moderator:warn'
  | 'super_admin:all';


// Admin component types
export interface AdminComponentProps {
  id: string;
  name: string;
  description?: string;
}

// Admin shortcut type
export interface AdminShortcut {
  id: string;
  label: string;
  icon: string;
  path: string;
  permission: AdminPermission;
  color?: string;
}

// Admin section types
export interface AdminSection {
  id: string;
  label: string;
  path: string;
  icon: string;
  permission: AdminPermission;
}

// Admin overlay config
export interface AdminOverlayConfig {
  id: string;
  position: 'top' | 'right' | 'bottom' | 'left' | 'center';
  trigger: 'hover' | 'click' | 'context';
  content: React.ReactNode;
  target: string;
}

// Frozen zone for admin tools
export interface FrozenZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content: React.ReactNode;
}

// Admin theme types
export interface AdminThemeTokens {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: {
    fontSizes: Record<string, string>;
    fontFamilies: Record<string, string>;
  };
}
