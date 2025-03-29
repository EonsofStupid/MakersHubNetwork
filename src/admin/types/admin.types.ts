
// Admin system type definitions

// Admin permission types - expanded with all needed permissions
export type AdminPermission = 
  | 'admin:access'        // General admin access
  | 'admin:view'          // View admin dashboard
  | 'admin:edit'          // Edit admin settings
  | 'users:view'          // View users
  | 'users:manage'        // Manage users (create, update)
  | 'users:edit'          // Edit users
  | 'users:delete'        // Delete users
  | 'content:view'        // View content
  | 'content:manage'      // Manage content
  | 'content:edit'        // Edit content
  | 'content:delete'      // Delete content
  | 'builds:view'         // View builds (including pending)
  | 'builds:approve'      // Approve builds
  | 'builds:reject'       // Reject builds
  | 'builds:manage'       // Manage builds
  | 'settings:view'       // View settings
  | 'settings:manage'     // Manage settings
  | 'data:view'           // View data
  | 'data:manage'         // Manage data
  | 'analytics:view'      // View analytics 
  | 'themes:view'         // View themes
  | 'themes:manage'       // Manage themes
  | 'themes:edit'         // Edit themes
  | 'themes:delete'       // Delete themes
  | 'super_admin:all';    // Super admin permission

// Admin navigation section
export interface AdminSection {
  id: string;
  label: string;
  path: string;
  icon: string;
  permission: AdminPermission;
  children?: AdminSection[];
}

// Admin dashboard stats
export interface DashboardStats {
  usersCount: number;
  activeUsersCount: number;
  totalBuildsCount: number;
  pendingBuildsCount: number;
  recentBuildsCount: number;
}

// Admin activity
export interface Activity {
  id: string;
  action: string;
  userId?: string;
  userName?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Admin Shortcut type
export interface AdminShortcut {
  id: string;
  name: string;
  icon: string;
  path: string;
  color?: string;
  permission: AdminPermission;
}

// Admin Overlay Configuration
export interface AdminOverlayConfig {
  id: string;
  type: 'info' | 'warning' | 'error';
  message: string;
  target: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

// Frozen Zone for UI inspections
export interface FrozenZone {
  id: string;
  selector: string;
  label: string;
  color: string;
}

// State for the admin store
export interface AdminState {
  // Auth & permissions
  isLoadingPermissions: boolean;
  permissions: AdminPermission[];
  
  // UI state
  sidebarExpanded: boolean;
  activeSection: string;
  
  // Error state
  error: string | null;
}

// Actions for the admin store
export interface AdminActions {
  // Permission actions
  loadPermissions: (mappedPermissions?: AdminPermission[]) => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
  
  // UI actions
  toggleSidebar: () => void;
  setSidebar: (expanded: boolean) => void;
  setActiveSection: (section: string) => void;
  
  // Error handling
  setError: (error: string | null) => void;
}

// Combined admin store type
export type AdminStore = AdminState & AdminActions;
