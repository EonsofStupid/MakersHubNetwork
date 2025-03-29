
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AdminTopNav } from "./AdminTopNav";
import { AdminSidebar } from "./AdminSidebar";
import { useAdminUI } from "../store/admin-ui";
import "./admin-theme.css";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const { setScrollY, sidebarExpanded, setActiveSection } = useAdminUI();

  useEffect(() => {
    // Simple scroll handler
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Extract the current section from the location path
    const path = location.pathname.split('/');
    const section = path[path.length - 1] || 'dashboard';
    setActiveSection(section);
    
    console.log("AdminLayout mounted, setting active section:", section);
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location, setActiveSection, setScrollY]);

  return (
    <div className="admin-theme min-h-screen">
      <AdminTopNav />
      <div className="flex">
        <AdminSidebar />
        <main 
          className={`flex-1 p-6 transition-all duration-300 pt-20 ${
            sidebarExpanded ? 'ml-48' : 'ml-[60px]'
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
