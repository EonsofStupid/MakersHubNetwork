
import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

// Lazy load components to improve initial load time
const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const OverviewPage = lazy(() => import("./overview/OverviewPage"));
const UsersPage = lazy(() => import("./users/UsersPage"));
const BuildsPage = lazy(() => import("./builds/BuildsPage"));
const BuildDetailPage = lazy(() => import("./builds/BuildDetailPage"));
const ContentPage = lazy(() => import("./content/ContentPage"));
const SettingsPage = lazy(() => import("./settings/SettingsPage"));
const ThemesPage = lazy(() => import("./themes/ThemesPage"));
const DataMaestroPage = lazy(() => import("./data/DataMaestroPage"));
const AnalyticsPage = lazy(() => import("./analytics/AnalyticsPage"));
const LayoutsPage = lazy(() => import("./layouts/LayoutsPage"));
const UnauthorizedPage = lazy(() => import("./unauthorized/UnauthorizedPage"));
const ReviewsPage = lazy(() => import("./reviews/ReviewsPage"));
const LogsPage = lazy(() => import("./logs/LogsPage"));

// Loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
  </div>
);

export function AdminRoutes() {
  console.log("AdminRoutes component rendered");
  
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/overview" element={<OverviewPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/builds" element={<BuildsPage />} />
        <Route path="/builds/:id" element={<BuildDetailPage />} />
        <Route path="/content" element={<ContentPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/themes" element={<ThemesPage />} />
        <Route path="/data" element={<DataMaestroPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/layouts" element={<LayoutsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/logs" element={<LogsPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<OverviewPage />} />
      </Routes>
    </Suspense>
  );
}
