import { ROLES } from '@/shared/types/shared.types';
import type { FC } from 'react';

// Import the panel components
import UserPanel from './panels/users/UsersManagement';
import SettingsPanel from './panels/settings/SettingsManager';
import ImportPanel from './panels/import/ImportManager';

export interface AdminPanelEntry {
  label: string;
  component: FC;
  requiredRole: string;
  description?: string;
}

export const adminRegistry: Record<string, AdminPanelEntry> = {
  users: {
    label: 'Users',
    component: UserPanel,
    requiredRole: ROLES.ADMIN,
    description: 'Manage user accounts and permissions'
  },
  settings: {
    label: 'Settings',
    component: SettingsPanel,
    requiredRole: ROLES.ADMIN,
    description: 'Configure system settings'
  },
  import: {
    label: 'Import',
    component: ImportPanel,
    requiredRole: ROLES.ADMIN,
    description: 'Import and manage data'
  }
};

// Helper to get role-filtered panels
export const getAccessiblePanels = (userRoles: string[]): Record<string, AdminPanelEntry> => {
  return Object.entries(adminRegistry).reduce((acc, [key, entry]) => {
    if (userRoles.includes(entry.requiredRole)) {
      acc[key] = entry;
    }
    return acc;
  }, {} as Record<string, AdminPanelEntry>);
}; 