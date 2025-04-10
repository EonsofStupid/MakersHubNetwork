
// Hook for checking admin access permissions - always grants access
export function useAdminAccess() {
  return {
    hasAdminAccess: true,
    user: { id: 'public-user' }
  };
}
