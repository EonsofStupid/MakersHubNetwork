import React from 'react';
import { AdminNav } from "@/components/admin/dashboard/AdminNav";
import { SettingsDashboard } from "@/components/admin/settings/SettingsDashboard";
import { motion } from "framer-motion";

const SettingsDashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Settings Dashboard</h1>
        </div>
        <SettingsDashboard />
      </motion.div>
    </div>
  );
};

export default SettingsDashboardPage;