
import { create } from "zustand";
import { UserRole } from "@/types/auth.types";
import { 
  AdminPermission, 
  AdminState, 
  AdminAccessLevel,
  AdminError
} from "@/admin/types/admin.types";

interface AdminStore extends AdminState {
  // Setters
  setPermissions: (permissions: AdminPermission[]) => void;
  setLoadingPermissions: (isLoading: boolean) => void;
  setCurrentSection: (section: string | null) => void;
  
  // Actions
  loadPermissions: () => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
  
  // Error handling
  errors: AdminError[];
  addError: (error: AdminError) => void;
  clearErrors: () => void;
}

/**
 * Default admin access levels configuration
 */
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

/**
 * Admin module store with zustand
 */
export const useAdminStore = create<AdminStore>((set, get) => ({
  // Initial state
  isLoadingPermissions: false,
  permissions: [],
  accessLevels: DEFAULT_ACCESS_LEVELS,
  currentSection: null,
  errors: [],
  
  // Setters
  setPermissions: (permissions) => set({ permissions }),
  setLoadingPermissions: (isLoading) => set({ isLoadingPermissions: isLoading }),
  setCurrentSection: (section) => set({ currentSection: section }),
  
  // Actions
  loadPermissions: async () => {
    try {
      set({ isLoadingPermissions: true });
      
      // Get auth store state
      const authState = useAuthStore.getState();
      const { roles, isAdmin } = authState;
      const { accessLevels } = get();
      
      // Determine user roles from auth store
      const userRoles = roles || [];
      
      // Find the highest access level the user has based on roles
      let userPermissions: AdminPermission[] = [];
      let maxLevel = -1;
      
      userRoles.forEach(userRole => {
        accessLevels.forEach(level => {
          if (level.roles.includes(userRole as UserRole) && level.level > maxLevel) {
            maxLevel = level.level;
            userPermissions = level.permissions;
          }
        });
      });
      
      // Special case: super admin check for backward compatibility
      if (isAdmin && isAdmin()) {
        const adminLevel = accessLevels.find(level => level.level === 1);
        if (adminLevel && maxLevel < 1) {
          maxLevel = 1;
          userPermissions = adminLevel.permissions;
        }
      }
      
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
  
  // Error handling
  addError: (error) => set(state => ({ 
    errors: [...state.errors, error] 
  })),
  
  clearErrors: () => set({ errors: [] })
}));

// Import here at the bottom to avoid circular dependency
import { useAuthStore } from "@/stores/auth/store";
