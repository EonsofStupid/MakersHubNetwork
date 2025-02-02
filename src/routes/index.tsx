import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { PageTransition } from "@/components/shared/transitions/PageTransition";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { AuthGuard } from "@/lib/auth/AuthGuard";
import { useAuthStore } from '@/lib/store/auth-store';
import { toast } from "sonner";
import { publicRoutes } from "./public-routes";
import { makerSpaceRoutes } from "./maker-space-routes";
import { adminRoutes } from "./admin-routes";

export const AppRoutes = () => {
  const { session, user, isLoading } = useAuthStore();
  
  console.log('AppRoutes: Session state:', { 
    userId: session?.user?.id,
    role: user?.role,
    isLoading,
    hasSession: !!session
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <PageTransition>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Routes - Always Accessible */}
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}

          {/* Protected Maker Space Routes */}
          {makerSpaceRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <AuthGuard 
                  requireAuth={true}
                  fallbackPath="/login"
                >
                  {route.element}
                </AuthGuard>
              }
            />
          ))}

          {/* Admin Routes - Restricted to admin/super_admin */}
          {adminRoutes.map((route) => (
            <Route
              key={route.path}
              path={`/admin/${route.path}`}
              element={
                <AuthGuard 
                  requireAuth={true}
                  requiredRole={["admin", "super_admin"]}
                  fallbackPath="/"
                >
                  {route.element}
                </AuthGuard>
              }
            />
          ))}

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </PageTransition>
  );
};