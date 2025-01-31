import { Routes, Route } from 'react-router-dom';
import { AuthGuard } from '@/components/AuthGuard';
import MobileIndexPage from '../pages/Index';
import LoginPage from '../pages/Login';
import AdminPage from '../pages/Admin';

export function MobileRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MobileIndexPage />} />
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