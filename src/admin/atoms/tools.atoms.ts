
import { atom } from 'jotai';

// Controls the admin edit mode
export const adminEditModeAtom = atom<boolean>(false);

// Controls the admin sidebar expansion state
export const adminSidebarExpandedAtom = atom<boolean>(true);

// Controls the admin toast notifications
export const adminNotificationsEnabledAtom = atom<boolean>(true);

// Controls the admin theme
export const adminThemeModeAtom = atom<'light' | 'dark' | 'system'>('dark');

// Admin UI preferences
export const adminPreferencesAtom = atom<{
  dashboardLayout: string;
  defaultView: 'grid' | 'list' | 'table';
  compactMode: boolean;
  sidebarCollapsed: boolean;
}>({
  dashboardLayout: 'default',
  defaultView: 'grid',
  compactMode: false,
  sidebarCollapsed: false
});
