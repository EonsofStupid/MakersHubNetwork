
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./layout/AdminLayout";
import { lazy, Suspense } from "react";

// Lazy load admin pages
const Dashboard = lazy(() => import("./routes/dashboard/Dashboard"));
const Users = lazy(() => import("./routes/users/Users"));
const Settings = lazy(() => import("./routes/settings/Settings"));
const Themes = lazy(() => import("./routes/themes/Themes"));
const Content = lazy(() => import("./routes/content/Content"));
const Analytics = lazy(() => import("./routes/analytics/Analytics"));

// Loading fallback
const AdminLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="animate-pulse text-[var(--admin-accent)]">
      Loading...
    </div>
  </div>
);

export const AdminRouter = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="themes" element={<Themes />} />
          <Route path="content" element={<Content />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminRouter;
