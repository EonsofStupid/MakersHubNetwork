
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/admin/dashboard/StatsCards";
import { TrendingParts } from "@/admin/dashboard/TrendingParts";
import { ActiveUsersList } from "@/admin/dashboard/ActiveUsersList";
import { PerformanceMetrics } from "@/admin/dashboard/PerformanceMetrics";
import { LayoutDashboard } from "lucide-react";
import { useAdminStore } from "@/stores/admin/store";
import { motion } from "framer-motion";

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

const Overview = () => {
  const { hasPermission } = useAdminStore();

  useEffect(() => {
    console.log("Overview component mounted");
  }, []);

  if (!hasPermission("admin:access")) {
    return (
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You don't have permission to view the admin dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-transparent p-4 rounded-lg"
        variants={itemVariants}
      >
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-heading cyber-text-glow">Dashboard Overview</h2>
      </motion.div>
      
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

export default Overview;
