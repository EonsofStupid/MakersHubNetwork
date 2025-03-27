
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth/store";
import { useToast } from "@/hooks/use-toast";
import { useAdminAccess } from "@/hooks/useAdminAccess";
import AdminRouter from "@/admin/index";

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

  return <AdminRouter />;
}
