
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAdminStore } from "@/admin/store/admin.store";
import { Button } from "@/components/ui/button";
import { 
  Menu, ChevronLeft, Settings, 
  Home, Command, Bell, Activity,
  Monitor, Palette, ChevronsRight
} from "lucide-react";
import { useAdminTheme } from "../theme/AdminThemeProvider";
import { useAuthStore } from "@/stores/auth/store";

interface AdminHeaderProps {
  title?: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title = "Admin Dashboard",
  collapsed = false
}) => {
  const navigate = useNavigate();
  const { toggleSidebar } = useAdminStore();
  const { currentTheme } = useAdminTheme();
  const { user } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const quickActions = [
    { icon: <Home size={18} />, label: "Dashboard", onClick: () => navigate("/admin/overview") },
    { icon: <Activity size={18} />, label: "Content", onClick: () => navigate("/admin/content") },
    { icon: <Monitor size={18} />, label: "Data", onClick: () => navigate("/admin/data-maestro") },
    { icon: <Palette size={18} />, label: "Themes", onClick: () => navigate("/admin/settings/theme") },
  ];

  return (
    <>
      <motion.header
        className={cn(
          "impulse-admin-top-nav",
          scrolled && "h-12 shadow-md",
          scrolled ? "impulse-clip-trapezoid" : ""
        )}
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleSidebar}
              className="hover:bg-[var(--impulse-border-normal)] transition-colors"
            >
              <Menu className="h-5 w-5 text-[var(--impulse-text-primary)]" />
            </Button>
            
            <div className="flex items-center gap-2">
              <motion.h1 
                className={cn(
                  "text-xl font-bold",
                  "impulse-neon-text"
                )}
                layout
              >
                {title}
              </motion.h1>
              
              {currentTheme && (
                <div className="hidden md:flex text-xs px-2 py-1 rounded-full bg-[var(--impulse-border-normal)] text-[var(--impulse-text-secondary)]">
                  {currentTheme.name}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Quick Actions Toggle */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowQuickActions(!showQuickActions)}
                className={cn(
                  "text-[var(--impulse-text-secondary)]", 
                  "hover:text-[var(--impulse-text-primary)]",
                  "relative"
                )}
              >
                <Command size={20} />
                {/* Notification indicator */}
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--impulse-accent)] rounded-full" />
              </Button>
              
              {/* Quick Action Panel */}
              <AnimatePresence>
                {showQuickActions && (
                  <motion.div 
                    className={cn(
                      "absolute right-0 mt-2 p-2 z-50 min-w-48",
                      "rounded-lg shadow-lg impulse-glass"
                    )}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="grid grid-cols-2 gap-2">
                      {quickActions.map((action, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            action.onClick();
                            setShowQuickActions(false);
                          }}
                          className="impulse-quick-action flex-col h-auto py-3"
                        >
                          <span className="text-[var(--impulse-text-accent)]">{action.icon}</span>
                          <span className="text-xs mt-1">{action.label}</span>
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)] relative"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--impulse-accent)] text-[10px] text-white">3</span>
            </Button>
            
            {/* Theme Settings */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/settings/theme")}
              className={cn(
                "text-[var(--impulse-text-secondary)]", 
                "hover:text-[var(--impulse-text-primary)]",
                "hidden sm:flex"
              )}
            >
              <Settings className="h-4 w-4 mr-2" />
              Theme
            </Button>
            
            {/* Back to Site */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className={cn(
                "text-[var(--impulse-text-secondary)]", 
                "hover:text-[var(--impulse-text-primary)]",
                "hidden sm:flex"
              )}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Site
            </Button>
            
            {/* User Indicator */}
            <div 
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                "impulse-neon-border text-[var(--impulse-text-primary)]",
                "cursor-pointer"
              )}
              title={user?.email || "Admin User"}
            >
              {user?.email?.charAt(0).toUpperCase() || "A"}
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Mobile Menu Button (appears when scrolled down on small screens) */}
      <AnimatePresence>
        {(scrolled && window.innerWidth < 640) && (
          <motion.button
            className={cn(
              "fixed bottom-6 right-6 z-50 rounded-full p-3",
              "bg-[var(--impulse-primary)] text-white",
              "shadow-lg impulse-pulse"
            )}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronsRight className="w-5 h-5 rotate-90" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};
