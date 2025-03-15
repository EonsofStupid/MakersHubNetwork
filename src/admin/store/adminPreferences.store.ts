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
  setShortcuts: (shortcuts: Shortcut[]) => void;
  toggleIconOnly: () => void;
  addShortcut: (shortcut: Shortcut) => void;
  removeShortcut: (id: string) => void;
}

const defaultShortcuts: Shortcut[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/admin/dashboard',
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
      setShortcuts: (shortcuts) => set({ shortcuts }),
      toggleIconOnly: () => set((state) => ({ isIconOnly: !state.isIconOnly })),
      addShortcut: (shortcut) => 
        set((state) => ({ 
          shortcuts: [...state.shortcuts, shortcut] 
        })),
      removeShortcut: (id) =>
        set((state) => ({
          shortcuts: state.shortcuts.filter((s) => s.id !== id)
        }))
    }),
    {
      name: 'admin-preferences'
    }
  )
);
