
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileText, Settings, Package } from "lucide-react";

export default function Admin() {
  const { status } = useAuthStore();
  const { toast } = useToast();
  const { hasAdminAccess } = useAdminAccess();
  
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
  if (status === "loading") {
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
      <AdminLayout title="Admin Dashboard">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Admin stats cards */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="cyber-card p-6">
              <h2 className="font-medium text-lg mb-3 text-[var(--impulse-text-accent)]">Platform Overview</h2>
              <div className="space-y-2">
                <p>Users: <span className="text-[var(--impulse-primary)] font-bold">1,245</span></p>
                <p>Builds: <span className="text-[var(--impulse-primary)] font-bold">386</span></p>
                <p>Active makers: <span className="text-[var(--impulse-primary)] font-bold">89</span></p>
              </div>
            </Card>
          </motion.div>
          
          {/* Quick actions */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="cyber-card p-6">
              <h2 className="font-medium text-lg mb-3 text-[var(--impulse-text-accent)]">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <button className="impulse-quick-action">
                  <span className="flex flex-col items-center gap-2">
                    <LayoutDashboard className="w-5 h-5 text-[var(--impulse-primary)]" />
                    <span className="text-xs">Dashboard</span>
                  </span>
                </button>
                
                <button className="impulse-quick-action">
                  <span className="flex flex-col items-center gap-2">
                    <Users className="w-5 h-5 text-[var(--impulse-primary)]" />
                    <span className="text-xs">Users</span>
                  </span>
                </button>
                
                <button className="impulse-quick-action">
                  <span className="flex flex-col items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--impulse-primary)]" />
                    <span className="text-xs">Content</span>
                  </span>
                </button>
                
                <button className="impulse-quick-action">
                  <span className="flex flex-col items-center gap-2">
                    <Package className="w-5 h-5 text-[var(--impulse-primary)]" />
                    <span className="text-xs">Builds</span>
                  </span>
                </button>
                
                <button className="impulse-quick-action">
                  <span className="flex flex-col items-center gap-2">
                    <Settings className="w-5 h-5 text-[var(--impulse-primary)]" />
                    <span className="text-xs">Settings</span>
                  </span>
                </button>
              </div>
            </Card>
          </motion.div>
        </div>
        
        {/* Recent activity section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="cyber-card p-6">
            <h2 className="font-medium text-lg mb-3 text-[var(--impulse-text-accent)]">Recent Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)]">
                <Users className="w-5 h-5 text-[var(--impulse-primary)]" />
                <div>
                  <p className="text-sm font-medium">New user registered: <span className="text-[var(--impulse-primary)]">John Maker</span></p>
                  <p className="text-xs text-[var(--impulse-text-secondary)]">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)]">
                <Package className="w-5 h-5 text-[var(--impulse-primary)]" />
                <div>
                  <p className="text-sm font-medium">New build submitted: <span className="text-[var(--impulse-primary)]">Ender 3 V3 Upgrade Kit</span></p>
                  <p className="text-xs text-[var(--impulse-text-secondary)]">3 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--impulse-bg-overlay)] border border-[var(--impulse-border-normal)]">
                <FileText className="w-5 h-5 text-[var(--impulse-primary)]" />
                <div>
                  <p className="text-sm font-medium">Content updated: <span className="text-[var(--impulse-primary)]">Getting Started Guide</span></p>
                  <p className="text-xs text-[var(--impulse-text-secondary)]">5 hours ago</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AdminLayout>
    </ErrorBoundary>
  );
}
