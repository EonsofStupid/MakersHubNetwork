
// Export admin layout components
export { AdminLayout } from './components/AdminLayout';
export { AdminTopNav } from './components/AdminTopNav';
export { AdminSidebar } from './components/AdminSidebar';

// Export admin store
export { useAdminStore } from './store/admin.store';
export { useAdminPreferences } from './store/adminPreferences.store';

// Export admin hooks
export { useAdminPermissions } from './hooks/useAdminPermissions';

// Export admin types
export * from './types/admin.types';

// Export admin routes
export { AdminRoutes } from './routes';

// Re-export the main Admin page
export { default } from '../pages/Admin';
