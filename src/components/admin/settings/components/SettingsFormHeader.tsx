import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SettingsFormHeaderProps {
  onResetClick: () => void;
  isSaving: boolean;
}

export const SettingsFormHeader: React.FC<SettingsFormHeaderProps> = ({
  onResetClick,
  isSaving,
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-heading font-bold text-white"
      >
        Site Settings
      </motion.h2>
      <Button 
        variant="destructive"
        onClick={onResetClick}
        className="bg-secondary hover:bg-secondary/80 transition-colors"
      >
        Reset to Default
      </Button>
    </div>
  );
};