
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

// Export routes
export { AdminRoutes, adminRoutes } from './routes/AdminRoutes';

// Export components
import { AdminLayout } from './components/AdminLayout';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminTopNav } from './components/navigation/AdminTopNav';
import { useAdminStore } from './store/admin.store';
import { AdminThemeProvider, useAdminTheme } from './theme/AdminThemeProvider';
import { useAdminChat, useAdminChatListener } from './hooks/useAdminChat';
import { useAdminPermissions } from './hooks/useAdminPermissions';
import { DashboardShortcuts } from './components/dashboard/DashboardShortcuts';
import { DragIndicator } from './components/ui/DragIndicator';
import React from 'react';

// Export admin UI components
export { AdminLayout };
export { AdminSidebar };
export { AdminTopNav };
export { DashboardShortcuts };
export { DragIndicator };

// Export admin state and hooks
export { useAdminStore };
export { AdminThemeProvider, useAdminTheme };
export { useAdminChat, useAdminChatListener };
export { useAdminPermissions };
