import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AuthContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const AuthContainer = ({ children, className = "" }: AuthContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black to-gray-900"
    >
      <div className="absolute inset-0 bg-cyber-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 bg-scratch-overlay opacity-30 pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className={`w-full max-w-md relative z-10 ${className}`}
      >
        <Card className="p-6 bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <div className="relative">
            {children}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/20 pointer-events-none" />
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};