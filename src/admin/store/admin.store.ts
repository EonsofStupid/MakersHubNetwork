
import { create } from 'zustand';
import { RBACBridge } from '@/rbac/bridge';
import { useAuthStore } from '@/auth/store/auth.store';
import { UserRole } from '@/shared/types/shared.types';
import { UserProfile } from '@/shared/types/shared.types';

interface AdminStoreState {
  // User data
  user: UserProfile | null;
  roles: UserRole[];
  
  // Admin UI state
  isDebugMode: boolean;
  isInspectorOpen: boolean;
  inspectedComponent: string | null;
  
  // Actions
  toggleDebugMode: () => void;
  setInspectedComponent: (component: string | null) => void;
  toggleInspector: () => void;
}

export const useAdminStore = create<AdminStoreState>((set, get) => ({
  // Initialize with data from auth store
  user: useAuthStore.getState().user,
  roles: RBACBridge.getRoles(),
  
  // UI state
  isDebugMode: false,
  isInspectorOpen: false,
  inspectedComponent: null,
  
  // Actions
  toggleDebugMode: () => set((state) => ({ isDebugMode: !state.isDebugMode })),
  setInspectedComponent: (component) => set({ inspectedComponent: component }),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
}));

// Subscribe to auth store changes
useAuthStore.subscribe(
  (state) => state.user,
  (user) => {
    useAdminStore.setState({ user });
    useAdminStore.setState({ roles: RBACBridge.getRoles() });
  }
);
