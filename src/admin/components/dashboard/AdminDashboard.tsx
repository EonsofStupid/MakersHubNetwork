
import React from "react";
import { DashboardShortcuts } from './DashboardShortcuts';
import { AdminLayout } from '@/admin/components/AdminLayout';
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { adminEditModeAtom } from "@/admin/atoms/tools.atoms";
import { cn } from "@/lib/utils";
import { BarChart3, Users, Activity, Zap, Clock } from "lucide-react";

export function AdminDashboard() {
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  return (
    <AdminLayout title="Admin Dashboard">
      <motion.div 
        className="space-y-6"
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard 
            title="Total Users" 
            value="1,234"
            icon={Users}
            trend={12.5}
            delay={0}
          />
          <StatsCard 
            title="Active Now" 
            value="56"
            icon={Activity}
            trend={-3.2}
            delay={1}
          />
          <StatsCard 
            title="Builds This Week" 
            value="87"
            icon={BarChart3}
            trend={24.8}
            delay={2}
          />
          <StatsCard 
            title="System Status" 
            value="Operational"
            icon={Zap}
            trend={0}
            delay={3}
          />
        </div>
        
        {/* Performance Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className={cn(
              "glassmorphism p-6 rounded-lg border border-[var(--impulse-border-normal)]",
              "cyber-effect-1 hover-glow transition-all duration-300",
              isEditMode && "border-dashed"
            )}>
              <h2 className="font-medium text-lg mb-3 cyber-text">Performance Metrics</h2>
              <div className="h-[240px] flex items-center justify-center text-[var(--impulse-text-secondary)]">
                Graph coming soon
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className={cn(
              "glassmorphism p-6 rounded-lg border border-[var(--impulse-border-normal)]",
              "cyber-effect-2 hover-glow transition-all duration-300",
              isEditMode && "border-dashed"
            )}>
              <h2 className="font-medium text-lg mb-3 cyber-text">System Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--impulse-text-accent)]" />
                    <span className="text-[var(--impulse-text-secondary)]">CPU Usage</span>
                  </div>
                  <span className="text-[var(--impulse-text-primary)]">28%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[var(--impulse-text-accent)]" />
                    <span className="text-[var(--impulse-text-secondary)]">Memory</span>
                  </div>
                  <span className="text-[var(--impulse-text-primary)]">1.2 GB</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[var(--impulse-text-accent)]" />
                    <span className="text-[var(--impulse-text-secondary)]">Uptime</span>
                  </div>
                  <span className="text-[var(--impulse-text-primary)]">99.8%</span>
                </div>
              </div>
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
    </AdminLayout>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  delay?: number;
}

const StatsCard = ({ title, value, icon: Icon, trend = 0, delay = 0 }: StatsCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.1, duration: 0.5 }}
  >
    <div className={cn(
      "glassmorphism p-5 rounded-lg border border-[var(--impulse-border-normal)]",
      "hover-glow transition-all duration-300 h-32"
    )}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[var(--impulse-text-secondary)]">{title}</h3>
        <Icon className="w-5 h-5 text-[var(--impulse-text-accent)]" />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold text-[var(--impulse-text-primary)]">{value}</p>
        {trend !== 0 && (
          <div className="flex items-center mt-1">
            <span 
              className={
                trend > 0 
                  ? "text-emerald-400" 
                  : "text-red-400"
              }
            >
              {trend > 0 ? '+' : ''}{trend}%
            </span>
            <span className="text-xs ml-1 text-[var(--impulse-text-secondary)]">vs last month</span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);
