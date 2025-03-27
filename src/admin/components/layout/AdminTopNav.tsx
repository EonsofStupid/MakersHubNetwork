
import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Bell, Settings, User, ChevronDown, ChevronUp } from "lucide-react";
import { useAtom } from "jotai";
import { secondaryNavExpandedAtom } from "@/admin/atoms/ui.atoms";
import { useAdminStore } from "@/admin/store/admin.store";
import { cn } from "@/lib/utils";

interface AdminTopNavProps {
  title?: string;
}

export function AdminTopNav({ title = "Admin Dashboard" }: AdminTopNavProps) {
  const navigate = useNavigate();
  const { toggleSidebar } = useAdminStore();
  const [secondaryNavExpanded, setSecondaryNavExpanded] = useAtom(secondaryNavExpandedAtom);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "impulse-topnav",
        "flex items-center justify-between px-4"
      )}
    >
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-primary)]"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[rgba(0,240,255,0.2)] flex items-center justify-center">
            <span className="text-[var(--impulse-primary)]">MI</span>
          </div>
          <h1 className="text-lg font-bold text-[var(--impulse-text-accent)]">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSecondaryNavExpanded(!secondaryNavExpanded)}
          className="flex items-center gap-1 px-3 py-1 text-sm rounded-md bg-[rgba(0,240,255,0.1)] hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-primary)]"
        >
          <span>Tools</span>
          {secondaryNavExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-primary)]"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-[var(--impulse-secondary)] rounded-full"></span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full hover:bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-primary)]"
          >
            <Settings className="w-5 h-5" />
          </motion.button>
          
          <div className="h-6 border-l border-[var(--impulse-border-normal)]"></div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,45,110,0.1)] hover:bg-[rgba(255,45,110,0.2)] text-sm text-[var(--impulse-secondary)]"
          >
            <X className="w-4 h-4" />
            <span>Exit Admin</span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
