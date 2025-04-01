
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLoggingContext } from '../context/LoggingContext';
import { motion } from 'framer-motion';

interface LogToggleButtonProps {
  className?: string;
}

export const LogToggleButton: React.FC<LogToggleButtonProps> = ({
  className
}) => {
  const { showLogConsole, setShowLogConsole } = useLoggingContext();
  
  return (
    <motion.button
      onClick={() => setShowLogConsole(!showLogConsole)}
      className={cn(
        "fixed z-40 bottom-4 right-4 p-3 rounded-full",
        "bg-[var(--impulse-bg-card)] border border-[var(--impulse-border-normal)]",
        "text-[var(--impulse-text-primary)] hover:text-[var(--impulse-primary)]",
        "hover:border-[var(--impulse-primary)] hover:shadow-[0_0_10px_var(--impulse-primary)]",
        "transition-all duration-300 backdrop-blur-md",
        showLogConsole && "text-[var(--impulse-primary)] border-[var(--impulse-primary)]",
        showLogConsole && "shadow-[0_0_10px_var(--impulse-primary)]",
        className
      )}
      title="Toggle Log Console"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AlertCircle size={20} />
    </motion.button>
  );
};
