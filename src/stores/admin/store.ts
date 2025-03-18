
import { create } from "zustand";
import { UserRole } from "@/types/auth.types";
import { AdminPermission, AdminAccessLevel, AdminError } from "@/admin/types/admin.types";
import { useAuthStore } from "@/stores/auth/store";

interface AdminState {
  // UI State
  isDashboardCollapsed: boolean;
  currentSection: string | null;
  
  // Permissions
  isLoadingPermissions: boolean;
  permissions: AdminPermission[];
  accessLevels: AdminAccessLevel[];
  
  // Errors
  errors: AdminError[];
}

interface AdminActions {
  // UI Actions
  setDashboardCollapsed: (collapsed: boolean) => void;
  setCurrentSection: (section: string | null) => void;
  
  // Permission Actions
  setPermissions: (permissions: AdminPermission[]) => void;
  loadPermissions: () => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
  
  // Error Handling
  addError: (error: AdminError) => void;
  clearErrors: () => void;
}

// Default access levels
const DEFAULT_ACCESS_LEVELS: AdminAccessLevel[] = [
  {
    level: 0,
    name: "No Access",
    description: "No administrative access",
    roles: ["builder"],
    permissions: []
  },
  {
    level: 1,
    name: "Admin",
    description: "Basic administrative access",
    roles: ["admin"],
    permissions: [
      "admin:access",
      "admin:users:read",
      "admin:content:read",
      "admin:content:write",
      "admin:settings:read",
      "admin:data:import"
    ]
  },
  {
    level: 2,
    name: "Super Admin",
    description: "Full administrative access",
    roles: ["super_admin"],
    permissions: [
      "admin:access",
      "admin:users:read",
      "admin:users:write",
      "admin:users:delete",
      "admin:users:roles",
      "admin:content:read",
      "admin:content:write",
      "admin:content:delete",
      "admin:content:publish",
      "admin:settings:read",
      "admin:settings:write",
      "admin:data:import",
      "admin:data:export"
    ]
  }
];

export const useAdminStore = create<AdminState & AdminActions>((set, get) => ({
  // Initial state
  isDashboardCollapsed: false,
  currentSection: null,
  isLoadingPermissions: false,
  permissions: [],
  accessLevels: DEFAULT_ACCESS_LEVELS,
  errors: [],
  
  // UI Actions
  setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
  setCurrentSection: (section) => set({ currentSection: section }),
  
  // Permission Actions
  setPermissions: (permissions) => set({ permissions }),
  
  loadPermissions: async () => {
    try {
      set({ isLoadingPermissions: true });
      
      const authState = useAuthStore.getState();
      const { roles, isAdmin } = authState;
      const { accessLevels } = get();
      
      const userRoles = roles || [];
      let userPermissions: AdminPermission[] = [];
      let maxLevel = -1;
      
      console.log("Current user roles:", userRoles);
      
      userRoles.forEach(userRole => {
        accessLevels.forEach(level => {
          if (level.roles.includes(userRole as UserRole) && level.level > maxLevel) {
            maxLevel = level.level;
            userPermissions = level.permissions;
          }
        });
      });
      
      // Special case for backward compatibility
      if (isAdmin && isAdmin()) {
        const adminLevel = accessLevels.find(level => level.level === 1);
        if (adminLevel && maxLevel < 1) {
          maxLevel = 1;
          userPermissions = adminLevel.permissions;
        }
      }
      
      console.log("Loaded permissions:", userPermissions);
      set({ permissions: userPermissions });
    } catch (error) {
      console.error("Error loading admin permissions:", error);
      get().addError({
        code: "PERMISSION_LOAD_ERROR",
        message: "Failed to load admin permissions",
        context: { error },
        timestamp: new Date()
      });
    } finally {
      set({ isLoadingPermissions: false });
    }
  },
  
  hasPermission: (permission) => {
    return get().permissions.includes(permission);
  },
  
  // Error Handling
  addError: (error) => set(state => ({ 
    errors: [...state.errors, error] 
  })),
  
  clearErrors: () => set({ errors: [] })
}));
