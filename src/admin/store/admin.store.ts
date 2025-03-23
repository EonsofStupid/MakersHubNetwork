
import { create } from "zustand";
import { UserRole } from "@/types/auth.types";
import { 
  AdminPermission, 
  AdminState, 
  AdminAccessLevel,
  AdminError
} from "@/admin/types/admin.types";
import { useAuthStore } from "@/stores/auth/store";

interface AdminStore extends AdminState {
  // Setters
  setPermissions: (permissions: AdminPermission[]) => void;
  setLoadingPermissions: (isLoading: boolean) => void;
  setCurrentSection: (section: string | null) => void;
  
  // Actions
  loadPermissions: () => Promise<void>;
  hasPermission: (permission: AdminPermission | string) => boolean;
  
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
      const { roles } = authState;
      const { accessLevels } = get();
      
      // Determine user roles from auth store
      const userRoles = roles || [];
      
      // Find the highest access level the user has based on roles
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
    const permissionStr = permission as string;
    
    // If no permission specified or permissions not loaded yet, default to false
    if (!permissionStr || get().permissions.length === 0) {
      return false;
    }
    
    // Special case: if user has admin:access permission, give access to basic admin areas
    if (permissionStr === "admin:access" && get().permissions.includes("admin:access")) {
      return true;
    }
    
    return get().permissions.includes(permissionStr as AdminPermission);
  },
  
  // Error handling
  addError: (error) => set(state => ({ 
    errors: [...state.errors, error] 
  })),
  
  clearErrors: () => set({ errors: [] })
}));
