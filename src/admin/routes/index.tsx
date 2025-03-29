
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { Spinner } from '@/components/ui/spinner';

// Lazy-loaded admin pages
const Overview = lazy(() => import('./overview/OverviewPage'));
const Users = lazy(() => import('./users/UsersPage'));
const Content = lazy(() => import('./content/ContentPage'));
const Builds = lazy(() => import('./builds/BuildsPage'));
const DataMaestro = lazy(() => import('./data/DataMaestroPage'));
const Analytics = lazy(() => import('./analytics/AnalyticsPage'));
const Themes = lazy(() => import('./themes/ThemesPage'));
const Permissions = lazy(() => import('./permissions/PermissionsPage'));
const Settings = lazy(() => import('./settings/SettingsPage'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[300px]">
    <Spinner />
  </div>
);

export function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <AdminLayout>
          <Suspense fallback={<PageLoader />}>
            <Overview />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/overview" element={
        <AdminLayout title="Overview" requiredPermission="admin:access">
          <Suspense fallback={<PageLoader />}>
            <Overview />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/users" element={
        <AdminLayout title="User Management" requiredPermission="users:view">
          <Suspense fallback={<PageLoader />}>
            <Users />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/content" element={
        <AdminLayout title="Content Management" requiredPermission="content:view">
          <Suspense fallback={<PageLoader />}>
            <Content />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/builds" element={
        <AdminLayout title="Builds Management" requiredPermission="builds:view">
          <Suspense fallback={<PageLoader />}>
            <Builds />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/data-maestro" element={
        <AdminLayout title="Data Maestro" requiredPermission="data:view">
          <Suspense fallback={<PageLoader />}>
            <DataMaestro />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/analytics" element={
        <AdminLayout title="Analytics" requiredPermission="admin:access">
          <Suspense fallback={<PageLoader />}>
            <Analytics />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/themes" element={
        <AdminLayout title="Themes" requiredPermission="themes:view">
          <Suspense fallback={<PageLoader />}>
            <Themes />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/permissions" element={
        <AdminLayout title="Permissions" requiredPermission="super_admin:all">
          <Suspense fallback={<PageLoader />}>
            <Permissions />
          </Suspense>
        </AdminLayout>
      } />
      
      <Route path="/settings" element={
        <AdminLayout title="Settings" requiredPermission="settings:view">
          <Suspense fallback={<PageLoader />}>
            <Settings />
          </Suspense>
        </AdminLayout>
      } />
      
      {/* Fallback route - redirects to overview */}
      <Route path="*" element={
        <AdminLayout>
          <Suspense fallback={<PageLoader />}>
            <Overview />
          </Suspense>
        </AdminLayout>
      } />
    </Routes>
  );
}

// Create placeholder pages for lazy loading
export const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-muted-foreground">This page is under construction.</p>
  </div>
);
