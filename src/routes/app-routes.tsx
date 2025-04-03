
import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const ThemeSettings = lazy(() => import("@/pages/ThemeSettings"));

export const appRoutes = (
  <>
    <Route 
      path="/profile" 
      element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/settings" 
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/theme-settings" 
      element={
        <ProtectedRoute>
          <ThemeSettings />
        </ProtectedRoute>
      } 
    />
  </>
);
