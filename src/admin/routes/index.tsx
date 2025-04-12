
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AdminLayout } from '../components/layout/AdminLayout';

// Import components correctly
import DashboardPage from './dashboard/DashboardPage';
import UserManagementPage from './users/UserManagementPage';
import SettingsPage from './settings/SettingsPage';
import ContentManagementPage from './content/ContentManagementPage';
import BuildsPage from './builds/BuildsPage';
import DataMaestroPage from './data/DataMaestroPage';
import PermissionsPage from './permissions/PermissionsPage';
import ThemeEditorPage from './themes/ThemeEditorPage';
import RolesPage from './roles/RolesPage';
import { NotFoundPage } from './NotFoundPage';
import { UnauthorizedPage } from './UnauthorizedPage';

// Make sure each component can accept children
export interface AdminRouteProps {
  children?: React.ReactNode;
}

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="content" element={<ContentManagementPage />} />
        <Route path="builds" element={<BuildsPage />} />
        <Route path="data" element={<DataMaestroPage />} />
        <Route path="permissions" element={<PermissionsPage />} />
        <Route path="themes" element={<ThemeEditorPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
