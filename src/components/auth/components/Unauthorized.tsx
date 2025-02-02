import React from "react";
import { motion } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black to-gray-900"
    >
      <div className="absolute inset-0 bg-cyber-grid opacity-50 pointer-events-none" />
      
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="max-w-md w-full p-8 bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-lg shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-orange-500/50" />
        
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-6"
        >
          <div className="relative">
            <Shield className="h-16 w-16 text-red-500/80" />
            <AlertTriangle className="h-8 w-8 text-white absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-white text-center mb-4"
        >
          Access Denied
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white/70 text-center mb-8"
        >
          You don't have permission to access this page. Please sign in with an authorized account.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col gap-4"
        >
          <Button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-[#41f0db] to-[#8000ff] hover:opacity-90 transition-opacity"
          >
            Sign In
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full text-white/70 hover:text-white hover:bg-white/10"
          >
            Return Home
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};