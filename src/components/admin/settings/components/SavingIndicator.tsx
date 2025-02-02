import React from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface SavingIndicatorProps {
  isSaving: boolean;
}

export const SavingIndicator: React.FC<SavingIndicatorProps> = ({ isSaving }) => {
  if (!isSaving) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-lg p-3 flex items-center gap-2 z-50"
    >
      <Loader2 className="w-4 h-4 animate-spin text-primary" />
      <span className="text-sm text-primary">Saving changes...</span>
    </motion.div>
  );
};