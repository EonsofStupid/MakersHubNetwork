
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Admin() {
  const { status } = useAuthStore();
  const { toast } = useToast();
  const { hasAdminAccess } = useAdminAccess();
  
  useEffect(() => {
    // Add the admin theme class
    document.body.classList.add('admin-container');
    
    // Clean up when unmounting
    return () => {
      document.body.classList.remove('admin-container');
    };
  }, []);
  
  // Loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#121218] flex items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="w-8 h-8 border-4 border-[#00F0FF] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white/70">Loading admin panel...</p>
        </div>
      </div>
    );
  }
  
  // Verify admin access
  if (!hasAdminAccess) {
    toast({
      title: "Access Denied",
      description: "You don't have permission to access the admin section",
      variant: "destructive"
    });
    return <Navigate to="/" replace />;
  }

  return (
    <ErrorBoundary>
      <AdminLayout>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admin stats cards */}
          <div className="bg-card/30 backdrop-blur-md p-6 rounded-lg border border-border/20">
            <h2 className="font-medium text-lg mb-3">Platform Overview</h2>
            <div className="space-y-2">
              <p>Users: <span className="text-primary font-bold">1,245</span></p>
              <p>Builds: <span className="text-primary font-bold">386</span></p>
              <p>Active makers: <span className="text-primary font-bold">89</span></p>
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="bg-card/30 backdrop-blur-md p-6 rounded-lg border border-border/20">
            <h2 className="font-medium text-lg mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <button className="bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-md text-sm">
                Review Builds
              </button>
              <button className="bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-md text-sm">
                Manage Users
              </button>
              <button className="bg-primary/20 hover:bg-primary/30 px-4 py-2 rounded-md text-sm">
                Edit Content
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    </ErrorBoundary>
  );
}
