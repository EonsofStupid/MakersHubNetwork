
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
// Note: Assuming OverviewDashboard is a default export
import OverviewDashboard from './panels/overview/OverviewDashboard';
export { OverviewDashboard as AdminDashboard };

// Export routes
export { AdminRoutes } from './routes';

// Export components
import { AdminLayout } from './panels/layout/AdminLayout';
import { AdminSidebar } from './panels/layout/AdminSidebar';
import { AdminHeader } from './panels/layout/AdminHeader';
import { useAdminAuth } from './panels/auth/useAdminAuth';
import { useAdminRoles } from './panels/auth/useAdminRoles';
import { AdminAuthGuard } from './panels/auth/AdminAuthGuard';
import ChatManagement from './panels/chat/ChatManagement';
import React from 'react';

// Export admin UI components
export { AdminLayout };
export { AdminSidebar };
export { AdminHeader };
export { AdminAuthGuard };
export { ChatManagement };

// Export admin hooks
export { useAdminAuth };
export { useAdminRoles };
