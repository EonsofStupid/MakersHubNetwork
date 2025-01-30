import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';

// Pages
import IndexPage from '../pages/Index';
import AdminPage from '../pages/Admin';
import LoginPage from '../pages/Login';

export function DesktopRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<IndexPage />} />
      <Route path="/login" element={<LoginPage />} />
      
      {/* Protected routes */}
      <Route
        path="/admin"
        element={
          <AuthGuard requiredRoles={["admin"]}>
            <AdminPage />
          </AuthGuard>
        }
      />
    </Routes>
  );
} 