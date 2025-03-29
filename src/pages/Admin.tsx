
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { useAdminPermissions } from "@/admin/hooks/useAdminPermissions";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { motion } from "framer-motion";
import { AdminFeatureSection } from "@/components/admin/dashboard/AdminFeatureSection";
import { ActivityFeed } from "@/components/admin/dashboard/ActivityFeed";
import { Stats } from "@/components/admin/dashboard/Stats";
import { BuildApprovalWidget } from "@/components/admin/dashboard/BuildApprovalWidget";
import { ContentManagementWidget } from "@/components/admin/dashboard/ContentManagementWidget";
import { UserManagementWidget } from "@/components/admin/dashboard/UserManagementWidget";

export default function Admin() {
  const { status } = useAuthStore();
  const { toast } = useToast();
  const { hasAccess, isLoading } = useAdminPermissions();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load the Impulse admin theme
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/admin-theme.css';
    document.head.appendChild(link);
    
    // Clean up when unmounting
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  // Loading state
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen impulse-admin-root flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-[var(--impulse-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--impulse-text-secondary)]">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Verify admin access
  if (!hasAccess) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin section",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary>
      <AdminLayout title="Admin Dashboard">
        <div className="space-y-6">
          {/* Admin stats overview */}
          <Stats />
          
          {/* Admin feature cards */}
          <AdminFeatureSection />
          
          {/* Management widgets grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <BuildApprovalWidget />
            <ContentManagementWidget />
            <UserManagementWidget />
          </div>
          
          {/* Recent activity feed */}
          <ActivityFeed />
        </div>
      </AdminLayout>
    </ErrorBoundary>
  );
}
