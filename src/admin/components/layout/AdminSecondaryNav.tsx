
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/admin/store/admin.store";
import { FileText, Users, Package, Palette, BarChart, Database } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the secondary nav items
const navItems = [
  { id: 'content', label: 'Content', icon: FileText, path: '/admin/content' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  { id: 'builds', label: 'Builds', icon: Package, path: '/admin/builds' },
  { id: 'themes', label: 'Themes', icon: Palette, path: '/admin/themes' },
  { id: 'analytics', label: 'Analytics', icon: BarChart, path: '/admin/analytics' },
  { id: 'data-maestro', label: 'Data Maestro', icon: Database, path: '/admin/data-maestro' },
];

export function AdminSecondaryNav() {
  const navigate = useNavigate();
  const { activeSection } = useAdminStore();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="impulse-secondary-nav"
    >
      <div className="flex items-center gap-2 px-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all",
              "hover:bg-[rgba(0,240,255,0.2)]",
              activeSection === item.id 
                ? "bg-[rgba(0,240,255,0.2)] text-[var(--impulse-text-accent)]" 
                : "text-[var(--impulse-text-secondary)]"
            )}
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
            
            {activeSection === item.id && (
              <motion.div 
                layoutId="secondaryNavIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--impulse-primary)]" 
              />
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
