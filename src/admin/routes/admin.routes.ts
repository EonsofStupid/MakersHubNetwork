
import { lazy } from 'react';

// Lazy load tab components
const OverviewTab = lazy(() => import('@/admin/components/tabs/OverviewTab'));
const UsersTab = lazy(() => import('@/admin/components/tabs/UsersTab'));
const ContentTab = lazy(() => import('@/admin/components/tabs/ContentTab'));
const DataMaestroTab = lazy(() => import('@/admin/components/tabs/DataMaestroTab'));
const SettingsTab = lazy(() => import('@/admin/components/tabs/SettingsTab'));

export const adminRoutes = {
  overview: OverviewTab,
  users: UsersTab,
  content: ContentTab,
  dataMaestro: DataMaestroTab,
  settings: SettingsTab
} as const;

export type AdminTabKey = keyof typeof adminRoutes;
