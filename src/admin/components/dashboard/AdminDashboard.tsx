
import React from "react";
import { DashboardShortcuts } from './DashboardShortcuts';
import { ImpulseAdminLayout } from '../layout/ImpulseAdminLayout';
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { adminEditModeAtom } from "@/admin/atoms/tools.atoms";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  return (
    <ImpulseAdminLayout>
      <motion.div 
        className="space-y-6 p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div className="flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold"
            layoutId="dashboard-title"
          >
            Admin Dashboard
          </motion.h1>
          
          {isEditMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-3 py-1.5 bg-primary/20 rounded-full text-sm font-medium text-primary flex items-center gap-1"
            >
              <span>Drag & Drop Mode</span>
            </motion.div>
          )}
        </motion.div>
        
        {/* Dashboard Shortcuts - Draggable area */}
        <DashboardShortcuts />
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className={cn(
              "glassmorphism p-6 rounded-lg border border-[var(--impulse-border-normal)]",
              "cyber-effect-1 hover-glow transition-all duration-300",
              isEditMode && "border-dashed"
            )}
          >
            <h2 className="font-medium text-lg mb-3 cyber-text">Platform Overview</h2>
            <div className="space-y-2">
              <p>Users: <span className="text-[var(--impulse-primary)] font-bold">1,245</span></p>
              <p>Builds: <span className="text-[var(--impulse-primary)] font-bold">386</span></p>
              <p>Active makers: <span className="text-[var(--impulse-primary)] font-bold">89</span></p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className={cn(
              "glassmorphism p-6 rounded-lg border border-[var(--impulse-border-normal)]",
              "cyber-effect-2 hover-glow transition-all duration-300",
              isEditMode && "border-dashed"
            )}
          >
            <h2 className="font-medium text-lg mb-3 cyber-text">Recent Activity</h2>
            <div className="space-y-2">
              <p>New users today: <span className="text-[var(--impulse-primary)] font-bold">24</span></p>
              <p>New builds today: <span className="text-[var(--impulse-primary)] font-bold">8</span></p>
              <p>Reviews pending: <span className="text-[var(--impulse-primary)] font-bold">12</span></p>
            </div>
          </motion.div>
        </div>
        
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-sm text-muted-foreground my-8 p-4 border border-dashed border-primary/20 rounded-lg bg-primary/5"
          >
            <p>
              You're in edit mode. Drag items from the sidebar to add shortcuts to your dashboard or top navigation.
              Click the edit button again to save your changes.
            </p>
          </motion.div>
        )}
      </motion.div>
    </ImpulseAdminLayout>
  );
}
