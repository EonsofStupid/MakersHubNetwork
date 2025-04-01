
// Import styles first to ensure proper cascade
import '@/admin/styles/admin-core.css';
import '@/admin/styles/impulse-admin.css';
import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/navigation.css';
import '@/admin/styles/sidebar-navigation.css';
import '@/admin/styles/dashboard-shortcuts.css';
import '@/admin/styles/drag-drop.css';
import '@/admin/styles/cyber-effects.css';
import '@/admin/styles/electric-effects.css';
import '@/admin/styles/text-effects.css';
import '@/admin/theme/impulse/impulse-theme.css';

// Export the AdminDashboard from its dedicated component file
export { AdminDashboard } from './components/dashboard/AdminDashboard';

// Export components
export { AdminLayout } from './components/AdminLayout';
export { AdminSidebar } from './components/AdminSidebar';
export { AdminTopNav } from './components/navigation/AdminTopNav';
export { useAdminStore } from './store/admin.store';
export { AdminThemeProvider, useAdminTheme } from './theme/AdminThemeProvider';
export { useAdminChat, useAdminChatListener } from './hooks/useAdminChat';
export { useAdminPermissions } from './hooks/useAdminPermissions';
export { DashboardShortcuts } from './components/dashboard/DashboardShortcuts';
export { DragIndicator } from './components/ui/DragIndicator';
export { ImpulseAdminLayout } from './components/layout/ImpulseAdminLayout';
export { SyncIndicator } from './components/ui/SyncIndicator';

// Export admin state and hooks
export { useAdminSync } from './hooks/useAdminSync';

// Export types
export type { AdminPermissionValue } from './constants/permissions';
