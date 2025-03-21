
import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard } from 'lucide-react';
import { StatsCards } from "@/admin/dashboard/StatsCards";
import { TrendingParts } from "@/admin/dashboard/TrendingParts";
import { ActiveUsersList } from "@/admin/dashboard/ActiveUsersList";
import { PerformanceMetrics } from "@/admin/dashboard/PerformanceMetrics";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";

const OverviewDashboard = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-transparent p-4 rounded-lg">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading">
          <SimpleCyberText text="Dashboard Overview" />
        </h2>
      </div>
      
      <motion.div variants={itemVariants}>
        <StatsCards />
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <PerformanceMetrics />
        </motion.div>
        <div className="grid grid-cols-1 gap-6">
          <motion.div variants={itemVariants}>
            <TrendingParts />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ActiveUsersList />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default OverviewDashboard;
