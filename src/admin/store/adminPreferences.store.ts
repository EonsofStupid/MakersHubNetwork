
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Database, Users, Settings, ShoppingCart, BarChart } from 'lucide-react';

interface Shortcut {
  id: string;
  label: string;
  path: string;
  icon: JSX.Element;
}

interface AdminPreferencesState {
  shortcuts: Shortcut[];
  isIconOnly: boolean;
  isDashboardCollapsed: boolean;
  setShortcuts: (shortcuts: Shortcut[]) => void;
  toggleIconOnly: () => void;
  setDashboardCollapsed: (collapsed: boolean) => void;
  addShortcut: (shortcut: Shortcut) => void;
  removeShortcut: (id: string) => void;
  loadPreferences: () => void;
}

const defaultShortcuts: Shortcut[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/overview',
    icon: <BarChart className="h-4 w-4" />
  },
  {
    id: 'users',
    label: 'Users',
    path: '/admin/users',
    icon: <Users className="h-4 w-4" />
  },
  {
    id: 'products',
    label: 'Products',
    path: '/admin/products',
    icon: <ShoppingCart className="h-4 w-4" />
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/admin/settings',
    icon: <Settings className="h-4 w-4" />
  }
];

export const useAdminPreferences = create<AdminPreferencesState>()(
  persist(
    (set) => ({
      shortcuts: defaultShortcuts,
      isIconOnly: false,
      isDashboardCollapsed: false,
      
      setShortcuts: (shortcuts) => set({ shortcuts }),
      
      toggleIconOnly: () => set((state) => ({ isIconOnly: !state.isIconOnly })),
      
      setDashboardCollapsed: (collapsed) => set({ isDashboardCollapsed: collapsed }),
      
      addShortcut: (shortcut) => 
        set((state) => ({ 
          shortcuts: [...state.shortcuts, shortcut] 
        })),
        
      removeShortcut: (id) =>
        set((state) => ({
          shortcuts: state.shortcuts.filter((s) => s.id !== id)
        })),

      loadPreferences: () => {
        // This is just a no-op function that can be called to initialize the store
        // The actual loading is handled by the persist middleware
      }
    }),
    {
      name: 'admin-preferences'
    }
  )
);
