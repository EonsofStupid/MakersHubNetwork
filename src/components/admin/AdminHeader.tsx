
import React from "react";
import { Card } from "@/components/ui/card";
import { useAdminStore } from "@/stores/admin/store";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";

interface AdminHeaderProps {
  title?: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title = "Admin Dashboard",
  collapsed = false
}) => {
  return (
    <header className={cn(
      "w-full bg-background/50 backdrop-blur-sm py-4 border-b border-primary/10",
      collapsed && "py-2"
    )}>
      <div className="container mx-auto px-4">
        <Card className={cn(
          "cyber-card border-primary/20 px-6 py-3 backdrop-blur-xl bg-background/30",
          "transition-all duration-300 ease-in-out",
          collapsed && "py-2"
        )}>
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between"
          >
            <h1 className={cn(
              "text-2xl font-heading",
              collapsed && "text-xl"
            )}>
              <SimpleCyberText text={title} className="cyber-text-glow" />
            </h1>
          </motion.div>
        </Card>
      </div>
    </header>
  );
};
