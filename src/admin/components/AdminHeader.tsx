
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";
import { Menu, ArrowLeft, Shield, Laptop, Bell } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
}

export function AdminHeader({ title = "Admin Dashboard" }: AdminHeaderProps) {
  const navigate = useNavigate();
  const { toggleSidebar } = useAdminStore();
  
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "impulse-topnav fixed top-0 left-0 w-full z-40 h-16",
        "border-b border-[var(--impulse-border-normal)]",
        "backdrop-blur-xl bg-[var(--impulse-bg-overlay)]",
        "flex items-center justify-between px-4"
      )}
    >
      <motion.div 
        className="flex items-center gap-4"
        layoutId="admin-top-nav-left"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        <motion.div 
          className="flex items-center gap-2"
          layoutId="admin-title"
        >
          <Shield className="text-[var(--impulse-primary)] w-5 h-5" />
          <h1 className="text-lg font-bold text-[var(--impulse-text-accent)]">
            {title}
          </h1>
        </motion.div>
      </motion.div>
      
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--impulse-secondary)] rounded-full"></span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
        >
          <Laptop className="w-5 h-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg",
            "text-sm text-[var(--impulse-text-secondary)] hover:text-[var(--impulse-text-primary)]",
            "hover:bg-[var(--impulse-border-hover)] transition-colors"
          )}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </motion.button>
      </div>
    </motion.header>
  );
}
