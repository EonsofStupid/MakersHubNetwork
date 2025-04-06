
import { useMemo, useState, useEffect, useRef } from 'react';
import { useAuthState } from '@/auth/hooks/useAuthState';
import { useAdminStore } from '@/admin/store/admin.store';
import { PERMISSIONS } from '@/auth/permissions';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging';
import { AdminPermissionValue } from '@/admin/types/permissions';
import { mapRolesToPermissions } from '@/auth/rbac/roles';

/**
 * Hook for accessing and checking admin permissions
 * Uses both auth store (for user/roles) and admin store (for permissions)
 * Implements memoization to prevent unnecessary re-renders
 */
export function useAdminPermissions() {
  const { status, roles } = useAuthState();
  const adminStore = useAdminStore();
  const permissions = adminStore.permissions;
  const isLoadingPermissions = adminStore.isLoadingPermissions;
  
  const isLoading = status === 'loading' || isLoadingPermissions;
  const logger = useLogger('useAdminPermissions', LogCategory.ADMIN);
  const permissionsLoadedRef = useRef(false);
  const initializedRef = useRef(false);
  
  // If admin store permissions are empty but we have roles, initialize permissions
  useEffect(() => {
    // Only run this effect once and only if permissions are empty
    if (initializedRef.current || permissions.length > 0 || !roles.length || isLoading) {
      return;
    }

    initializedRef.current = true;
    
    try {
      logger.debug('Initializing permissions from roles in useAdminPermissions');
      
      // Map roles to permissions without triggering the admin store loading
      const mappedPermissions = mapRolesToPermissions(roles);
      
      // Only update if needed (avoid cycles)
      if (mappedPermissions.length > 0 && permissions.length === 0) {
        adminStore.setPermissions(mappedPermissions);
      }
    } catch (error) {
      logger.error('Failed to initialize permissions in useAdminPermissions', {
        details: { error }
      });
    }
  }, [roles, permissions.length, isLoading, adminStore, logger]);
  
  // Memoize the hasPermission function to prevent recreating on each render
  const hasPermission = useMemo(() => {
    return (permission: AdminPermissionValue): boolean => {
      // If loading, be conservative and deny access
      if (isLoading) {
        return false;
      }
      
      // Super admin permission grants access to everything
      if (permissions.includes(PERMISSIONS.SUPER_ADMIN)) {
        return true;
      }
      
      return permissions.includes(permission);
    };
  }, [permissions, isLoading]);
  
  // Log permissions calculation only once
  useEffect(() => {
    if (!permissionsLoadedRef.current && !isLoading && permissions.length > 0) {
      permissionsLoadedRef.current = true;
      
      logger.debug('Admin permissions computed', { 
        details: { 
          permissionsCount: permissions.length,
          userRoles: roles
        } 
      });
    }
  }, [isLoading, permissions, roles, logger]);

  return {
    permissions,
    hasPermission,
    isLoading
  };
}
