
import { Route, Routes, Navigate } from 'react-router-dom';
import DashboardPage from './dashboard/DashboardPage';
import BuildsPage from './builds/BuildsPage';
import AdminLayout from '../components/layouts/AdminLayout';
import AnalyticsPage from './analytics/AnalyticsPage';
import SettingsPage from './settings/SettingsPage';
import LayoutsPage from './layouts/LayoutsPage';
import LogsPage from '../pages/LogsPage';
import NotFoundPage from './NotFoundPage';
import UnauthorizedPage from './UnauthorizedPage';
import { Navigate } from 'react-router-dom';

// These would be imported when implemented
const UserManagementPage = () => <div>User Management Page</div>;
const ContentManagementPage = () => <div>Content Management Page</div>;
const ThemeEditorPage = () => <div>Theme Editor Page</div>;
const RolesPage = () => <div>Roles Page</div>;

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="builds/*" element={<BuildsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="content" element={<ContentManagementPage />} />
        <Route path="layouts" element={<LayoutsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="themes" element={<ThemeEditorPage />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
