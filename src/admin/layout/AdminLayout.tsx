
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AdminTopNav } from "./AdminTopNav";
import { AdminSidebar } from "../components/AdminSidebar";
import { useAdminStore } from "../store/admin.store";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "../styles/admin-core.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { setScrollY, sidebarExpanded, setActiveSection, loadPermissions } = useAdminStore();

  useEffect(() => {
    // Load permissions on mount
    loadPermissions();
    
    // Simple scroll handler
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Extract the current section from the location path
    const path = location.pathname.split('/');
    const section = path[path.length - 1] || 'overview';
    setActiveSection(section);
    
    console.log("AdminLayout mounted, setting active section:", section);
    
    // Add the admin theme class
    document.body.classList.add('impulse-admin-root');
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Remove the admin theme class when unmounting
      document.body.classList.remove('impulse-admin-root');
    };
  }, [location, setActiveSection, setScrollY, loadPermissions]);

  return (
    <div className="admin-theme min-h-screen">
      <AdminTopNav />
      <div className="flex">
        <AdminSidebar />
        <main 
          className={`flex-1 p-6 transition-all duration-300 pt-20 ${
            sidebarExpanded ? 'ml-64' : 'ml-[4.5rem]'
          }`}
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
};
