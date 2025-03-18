
import React from "react";
import { StatsCards } from "@/admin/dashboard/StatsCards";
import { TrendingParts } from "@/admin/dashboard/TrendingParts";
import { ActiveUsersList } from "@/admin/dashboard/ActiveUsersList";
import { PerformanceMetrics } from "@/admin/dashboard/PerformanceMetrics";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { LayoutDashboard, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 }
  }
};

const DashboardHeader = () => {
  return (
    <motion.div 
      className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-transparent p-4 rounded-lg cyber-card cyber-animated-bg"
      variants={itemVariants}
    >
      <div className="mr-2 p-2 bg-primary/10 rounded-md border border-primary/30 cyber-glow-effect">
        <LayoutDashboard className="h-6 w-6 text-primary" />
      </div>
      <div>
        <h2 className="text-2xl font-heading flex items-center">
          <SimpleCyberText text="Dashboard Overview" variant="mad-scientist" className="mr-2" />
          <Zap className="h-4 w-4 text-secondary animate-pulse" />
        </h2>
        <p className="text-muted-foreground text-sm">
          Real-time monitoring and analytics
        </p>
      </div>
      
      <div className="ml-auto flex items-center space-x-1 bg-background/30 px-3 py-1 rounded-full border border-primary/20">
        <Activity className="h-3 w-3 text-primary animate-pulse" />
        <span className="text-xs font-mono text-primary">LIVE</span>
      </div>
    </motion.div>
  );
};

const DashboardContent = () => {
  return (
    <>
      <motion.div 
        variants={itemVariants}
        className="cyber-card p-0.5"
      >
        <div className="cyber-scanlines w-full">
          <StatsCards />
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="cyber-card p-0.5">
          <div className="mad-scientist-glow w-full">
            <PerformanceMetrics />
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 gap-6">
          <motion.div variants={itemVariants} className="cyber-card p-0.5">
            <div className="cyber-scanlines w-full">
              <TrendingParts />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="cyber-card p-0.5">
            <div className="mad-scientist-glow w-full">
              <ActiveUsersList />
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

/**
 * The Overview tab component for the admin dashboard.
 * Displays a summary of system performance and key metrics.
 */
const OverviewTab = () => {
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <DashboardHeader />
      <DashboardContent />
    </motion.div>
  );
};

// Use consistent export patterns for maximum compatibility
export { OverviewTab };
export default OverviewTab;
