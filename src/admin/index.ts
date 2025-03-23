
// Main admin router
export { AdminRouter } from './index.tsx'; 
export { default } from './index.tsx';

// Export admin types
export * from './types/admin.types';
export * from './types/content';
export * from './types/dashboard';
export * from './types/data-maestro';
export * from './types/import';
export * from './types/queries';

// Export feature components
export { default as ImportManager } from './features/import/ImportManager';
export { default as UsersManagement } from './features/users/UsersManagement';
export { default as SettingsManager } from './features/settings/SettingsManager';
export { default as ChatManagement } from './features/chat/ChatManagement';
export { default as OverviewDashboard } from './features/overview/OverviewDashboard';

// Export admin layout components
export { AdminLayout } from './components/AdminLayout';
export { AdminHeader } from './components/AdminHeader';
export { AdminSidebar } from './components/AdminSidebar';

// Export dashboard components
export * from './dashboard';

// Export admin stores
export { useAdminStore } from './store/admin.store';
export { useAdminPreferences } from './store/adminPreferences.store';
