
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAdminPreferences } from "@/admin/store/adminPreferences.store";
import { 
  Menu, 
  Bell, 
  Moon, 
  Sun,
  Settings,
  Users,
  Package,
  PaintBucket,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface AdminHeaderProps {
  title?: string;
  collapsed?: boolean;
}

export function AdminHeader({ title = "Admin Dashboard", collapsed = false }: AdminHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isDashboardCollapsed, setDashboardCollapsed } = useAdminPreferences();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Track scroll position for header effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleCollapsed = () => {
    setDashboardCollapsed(!isDashboardCollapsed);
  };
  
  const showNotification = () => {
    toast({
      title: "Notifications",
      description: "You have 3 pending notifications"
    });
  };

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 w-full z-40 transition-all duration-300",
        "backdrop-blur-xl bg-[var(--impulse-bg-overlay)] border-b border-[var(--impulse-border-normal)]",
        isScrolled ? "h-16" : "h-20"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleCollapsed}
            className="text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-primary)]/10"
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </Button>
          
          <div className={cn(
            "text-xl font-bold transition-all",
            "bg-gradient-to-r from-[var(--impulse-text-primary)] to-[var(--impulse-primary)] bg-clip-text text-transparent",
            isScrolled ? "tracking-normal" : "tracking-wide"
          )}>
            {title}
          </div>
          
          <div className="hidden md:flex items-center gap-2 ml-6">
            <Link to="/admin/dashboard">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-[var(--impulse-primary)]/10">
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </Button>
            </Link>
            
            <Link to="/admin/users">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-[var(--impulse-primary)]/10">
                <Users className="w-4 h-4" />
                <span className="hidden lg:inline">Users</span>
              </Button>
            </Link>
            
            <Link to="/admin/builds">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-[var(--impulse-primary)]/10">
                <Package className="w-4 h-4" />
                <span className="hidden lg:inline">Builds</span>
              </Button>
            </Link>
            
            <Link to="/admin/themes">
              <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-[var(--impulse-primary)]/10">
                <PaintBucket className="w-4 h-4" />
                <span className="hidden lg:inline">Themes</span>
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={showNotification}
            className="relative hover:bg-[var(--impulse-primary)]/10"
          >
            <Bell className="w-5 h-5 text-[var(--impulse-text-secondary)]" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--impulse-secondary)] text-[10px] text-white">
              3
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/admin/settings')}
            className="hover:bg-[var(--impulse-primary)]/10"
          >
            <Settings className="w-5 h-5 text-[var(--impulse-text-secondary)]" />
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="ml-4 border-[var(--impulse-border-normal)] text-[var(--impulse-text-primary)] hover:bg-[var(--impulse-primary)]/10"
          >
            Back to Site
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
