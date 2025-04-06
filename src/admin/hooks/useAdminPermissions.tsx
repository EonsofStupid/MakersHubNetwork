
import { useState, useEffect } from 'react';
import { useAdminStore } from '../store/admin.store';
import { PermissionValue } from '@/auth/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';

/**
 * Hook for checking admin permissions
 */
export function useAdminPermissions() {
  const { permissions } = useAdminStore();
  const logger = useLogger('useAdminPermissions', LogCategory.ADMIN);

  const hasPermission = (permission: PermissionValue): boolean => {
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: PermissionValue[]): boolean => {
    return requiredPermissions.some(p => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: PermissionValue[]): boolean => {
    return requiredPermissions.every(p => permissions.includes(p));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}
