
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../components/AdminLayout';

// Import admin pages
import { DashboardPage } from './dashboard/DashboardPage';
import { UserManagementPage } from './users/UserManagementPage';
import { SettingsPage } from './settings/SettingsPage';
import { ContentManagementPage } from './content/ContentManagementPage';
import { LogsPage } from '../pages/LogsPage';
import { DataMaestroPage } from './data/DataMaestroPage';
import { PermissionsPage } from './permissions/PermissionsPage';
import { ThemeEditorPage } from './themes/ThemeEditorPage';
import { RolesPage } from './roles/RolesPage';

/**
 * Admin routes configuration
 * 
 * All admin routes are wrapped with the AdminLayout component
 * Some routes require specific permissions which are defined at the component level
 */
export function AdminRoutes() {
  return (
    <Routes>
      {/* Wrap all admin routes in the AdminLayout */}
      <Route path="/" element={<AdminLayout><DashboardPage /></AdminLayout>} />
      <Route path="/dashboard" element={<AdminLayout><DashboardPage /></AdminLayout>} />
      <Route path="/users" element={<AdminLayout><UserManagementPage /></AdminLayout>} />
      <Route path="/content" element={<AdminLayout><ContentManagementPage /></AdminLayout>} />
      <Route path="/settings" element={<AdminLayout><SettingsPage /></AdminLayout>} />
      <Route path="/logs" element={<AdminLayout><LogsPage /></AdminLayout>} />
      <Route path="/data" element={<AdminLayout><DataMaestroPage /></AdminLayout>} />
      <Route path="/permissions" element={<AdminLayout><PermissionsPage /></AdminLayout>} />
      <Route path="/themes" element={<AdminLayout><ThemeEditorPage /></AdminLayout>} />
      <Route path="/roles" element={<AdminLayout><RolesPage /></AdminLayout>} />
    </Routes>
  );
}
