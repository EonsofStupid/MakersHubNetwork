
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AdminPermission } from '../types/admin.types';
import { defaultTopNavShortcuts, defaultDashboardShortcuts } from '@/admin/config/navigation.config';

// Combined admin state interface
interface AdminState {
  // UI State
  sidebarExpanded: boolean;
  pinnedTopNavItems: string[];
  pinnedDashboardItems: string[];
  scrollY: number;
  activeSection: string;
  isDarkMode: boolean;
  isDashboardCollapsed: boolean;
  
  // Admin Theme
  adminTheme: string;
  
  // Drag and drop state
  hoveredIcon: string | null;
  dragSource: string | null;
  dragTarget: string | null;
  showDragOverlay: boolean;
  
  // Frozen zones
  frozenZones: string[];
  
  // Auth/Permissions State
  isLoadingPermissions: boolean;
  permissions: AdminPermission[];
  permissionsLoaded: boolean;
  
  // Actions
  setState: (state: Partial<AdminState>) => void;
  loadPermissions: (mappedPermissions?: AdminPermission[]) => Promise<void>;
  hasPermission: (permission: AdminPermission) => boolean;
  toggleSidebar: () => void;
  setActiveSection: (section: string) => void;
  setPinnedDashboardItems: (items: string[]) => void;
  setDragSource: (source: string | null) => void;
  setDragTarget: (target: string | null) => void;
  toggleDarkMode: () => void;
}

// Create the admin store with localStorage persistence
export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Default UI state
      sidebarExpanded: true,
      pinnedTopNavItems: defaultTopNavShortcuts,
      pinnedDashboardItems: defaultDashboardShortcuts,
      scrollY: 0,
      activeSection: 'overview',
      isDarkMode: true,
      isDashboardCollapsed: false,
      
      // Default theme state
      adminTheme: 'cyberpunk',
      
      // Default drag and drop state
      hoveredIcon: null,
      dragSource: null,
      dragTarget: null,
      showDragOverlay: false,
      
      // Default frozen zones
      frozenZones: [],
      
      // Default auth state
      isLoadingPermissions: true,
      permissions: [],
      permissionsLoaded: false,
      
      // Actions
      setState: (partialState) => set(partialState),
      
      toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
      
      setActiveSection: (section) => set({ activeSection: section }),
      
      setPinnedDashboardItems: (items) => set({ pinnedDashboardItems: items }),
      
      setDragSource: (source) => set({ dragSource: source }),
      
      setDragTarget: (target) => set({ dragTarget: target }),
      
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      
      // Permission functions
      loadPermissions: async (mappedPermissions) => {
        // Skip loading if permissions are already loaded
        if (get().permissionsLoaded) {
          set({ isLoadingPermissions: false });
          return;
        }
        
        set({ isLoadingPermissions: true });
        
        try {
          // If we already have mapped permissions from the role, use those
          if (mappedPermissions && mappedPermissions.length > 0) {
            set({ 
              permissions: mappedPermissions,
              isLoadingPermissions: false,
              permissionsLoaded: true
            });
            return;
          }

          // Simulate API call to load permissions
          // In a real app, this would be an API call to fetch user permissions
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // For demo purposes, we'll grant all permissions if no specific permissions are provided
          const allPermissions: AdminPermission[] = [
            'admin:access',
            'admin:view',
            'admin:edit',
            'content:view',
            'content:edit',
            'content:delete',
            'users:view',
            'users:edit',
            'users:delete',
            'builds:view',
            'builds:approve',
            'builds:reject',
            'themes:view',
            'themes:edit',
            'themes:delete',
            'data:view',
            'settings:view',
            'settings:edit',
            'data:import',
            'super_admin:all'
          ];
          
          set({ 
            permissions: allPermissions,
            isLoadingPermissions: false,
            permissionsLoaded: true
          });
        } catch (error) {
          console.error('Failed to load admin permissions:', error);
          set({ 
            permissions: ['admin:access'], // Grant minimal permissions on error
            isLoadingPermissions: false,
            permissionsLoaded: true
          });
        }
      },
      
      hasPermission: (permission) => {
        const { permissions } = get();
        
        // Super admin has all permissions
        if (permissions.includes('super_admin:all')) {
          return true;
        }
        
        return permissions.includes(permission);
      }
    }),
    {
      name: 'admin-store',
      partialize: (state) => {
        // Only persist UI preferences to localStorage, exclude function properties and loading states
        const { permissions, isLoadingPermissions, permissionsLoaded, loadPermissions, hasPermission, setState, ...persistedState } = state;
        return persistedState;
      },
    }
  )
);

// Add subscribe method to store for sync functionality
const store = useAdminStore;
// Define the subscribe method properly
store.subscribe = (callback: (state: AdminState, prevState: AdminState) => void) => {
  let previousState = store.getState();
  return store.subscribe((state) => {
    const nextState = state;
    callback(nextState, previousState);
    previousState = nextState;
  });
};

// Fix import error in AdminTopNav.tsx
<lov-write file_path="src/admin/components/layout/AdminTopNav.tsx">
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminStore } from '../../store/admin.store';
import { SyncIndicator } from '@/components/admin/SyncIndicator';
import { Bell, User, Settings, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminTopNavProps {
  title?: string;
  className?: string;
}

export function AdminTopNav({ title = "Admin Dashboard", className }: AdminTopNavProps) {
  const { sidebarExpanded, toggleSidebar } = useAdminStore();
  
  return (
    <div className={`admin-topnav border-b border-border/20 bg-card/30 backdrop-blur-md h-14 fixed top-0 left-0 right-0 z-30 ${className}`}>
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="text-foreground hover:text-primary transition-colors"
          >
            <Menu size={20} />
          </Button>
          
          <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
            <h1 className="text-lg font-bold">{title}</h1>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="mr-4">
            <SyncIndicator />
          </div>
          
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
            <Bell size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
            <Settings size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary transition-colors">
            <User size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
