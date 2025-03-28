
// Admin system type definitions

// Admin permission types
export type AdminPermission = 
  | 'admin:access'        // General admin access
  | 'users:view'          // View users
  | 'users:manage'        // Manage users (create, update, delete)
  | 'content:view'        // View content
  | 'content:manage'      // Manage content (create, update, delete)
  | 'builds:view'         // View builds (including pending)
  | 'builds:approve'      // Approve or reject builds
  | 'settings:view'       // View settings
  | 'settings:manage'     // Manage settings
  | 'data:view'           // View data
  | 'data:manage'         // Manage data
  | 'analytics:view'      // View analytics 
  | 'themes:view'         // View themes
  | 'themes:manage';      // Manage themes

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
  loadPermissions: () => Promise<void>;
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
