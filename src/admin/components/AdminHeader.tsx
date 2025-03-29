
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Shield, 
  Menu, 
  Bell, 
  Settings, 
  MessageSquare,
  User
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/auth/store";

interface AdminHeaderProps {
  title?: string;
  collapsed?: boolean;
}

export function AdminHeader({ 
  title = "Admin Dashboard", 
  collapsed = false 
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toggleSidebar } = useAdminStore();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position for header effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleNotificationsClick = () => {
    toast({
      title: "Admin Notifications",
      description: "This feature is coming soon"
    });
  };
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 w-full z-40",
        "transition-all duration-300 ease-in-out",
        "border-b border-[var(--impulse-border-normal)]",
        "backdrop-blur-xl bg-[var(--impulse-bg-overlay)]",
        scrollPosition > 20 ? "h-14 shadow-md" : "h-16"
      )}
    >
      <div className={cn(
        "absolute inset-0 overflow-hidden",
        "pointer-events-none z-0"
      )}>
        {/* Header animation effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--impulse-primary)] to-[var(--impulse-secondary)] opacity-10"></div>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-[var(--impulse-primary)] opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--impulse-primary)] opacity-30"></div>
        </div>
        
        {/* Data stream effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 w-[200%] h-full opacity-10"
            style={{
              backgroundImage: "linear-gradient(90deg, transparent 0%, var(--impulse-primary) 20%, var(--impulse-secondary) 40%, transparent 60%)",
              backgroundSize: "200% 100%",
              animation: "data-stream 5s linear infinite"
            }}
          />
        </div>
      </div>
      
      <div className="container mx-auto flex items-center justify-between h-full px-4 relative z-10">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-primary)]"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          
          <motion.div 
            className="flex items-center gap-2"
            layout
          >
            <Shield className="text-[var(--impulse-primary)] w-5 h-5" />
            <h1 className="text-lg font-bold text-[var(--impulse-text-accent)]">
              {title}
            </h1>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-primary)]"
            onClick={handleNotificationsClick}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--impulse-secondary)] rounded-full"></span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-primary)]"
          >
            <MessageSquare className="w-5 h-5" />
          </motion.button>
          
          <Separator orientation="vertical" className="h-6 bg-[var(--impulse-border-normal)]" />
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-[rgba(0,240,255,0.2)] flex items-center justify-center">
              <User className="w-5 h-5 text-[var(--impulse-text-primary)]" />
            </div>
            
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-[var(--impulse-text-primary)]">
                  {user?.email?.split('@')[0] || 'Admin'}
                </span>
                <span className="text-xs text-[var(--impulse-text-secondary)]">
                  Super Admin
                </span>
              </div>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg ml-2",
              "text-sm text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)]",
              "hover:bg-[rgba(0,240,255,0.2)] transition-colors"
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className={collapsed ? "sr-only" : ""}>Back to Site</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
