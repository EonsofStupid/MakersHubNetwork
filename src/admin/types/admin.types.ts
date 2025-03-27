
// Admin permission types
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

// Admin component types
export interface AdminComponentProps {
  id: string;
  name: string;
  description?: string;
}

// Admin section types
export interface AdminSection {
  id: string;
  label: string;
  path: string;
  icon: string;
  permission: AdminPermission;
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
