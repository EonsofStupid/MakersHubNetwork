
import React from "react";
import { motion } from "framer-motion";
import { Bell, Search } from "lucide-react";
import { useAdminStore } from "@/admin/store/admin.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  title?: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = "Admin Dashboard",
  collapsed = false
}) => {
  const navigate = useNavigate();
  const { currentSection } = useAdminStore();
  
  // Determine the display title based on props or current section
  const displayTitle = title || (currentSection 
    ? currentSection.charAt(0).toUpperCase() + currentSection.slice(1) 
    : "Admin Dashboard");

  // Animation variants
  const headerVariants = {
    expanded: { 
      height: 80,
      clipPath: "polygon(0 0, 100% 0, 98% 100%, 2% 100%)"
    },
    collapsed: { 
      height: 60,
      clipPath: "polygon(0 0, 100% 0, 99% 100%, 1% 100%)"
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="expanded"
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-40 px-4",
        "bg-gradient-to-r from-primary/20 to-secondary/20",
        "backdrop-blur-md shadow-md",
        "border-b border-primary/10",
        "flex items-center justify-between",
        "transition-all duration-300"
      )}
    >
      <div className="flex items-center">
        <SimpleCyberText 
          text={displayTitle}
          className="text-xl sm:text-2xl font-heading text-foreground"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className={cn(
          "relative hidden md:flex items-center",
          collapsed ? "w-40" : "w-64"
        )}>
          <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="pl-8 bg-background/40 border-primary/20"
          />
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full bg-background/40 border border-primary/20"
          onClick={() => navigate("/admin/notifications")}
        >
          <Bell className="h-4 w-4 text-primary" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
        </Button>
      </div>
    </motion.header>
  );
};
