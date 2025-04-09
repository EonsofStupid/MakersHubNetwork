
export function useAdminPermissions() {
  // Always grant all permissions
  return {
    permissions: ['*'],
    hasPermission: () => true,
    isLoading: false
  };
}
