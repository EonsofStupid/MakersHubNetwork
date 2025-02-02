import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

const ERDVisualizer = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Database Schema Visualization</h3>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-[600px] flex items-center justify-center bg-gray-100/5 rounded-lg"
      >
        <p className="text-muted-foreground">ERD Visualization will be implemented here</p>
      </motion.div>
    </Card>
  );
};

export default ERDVisualizer;