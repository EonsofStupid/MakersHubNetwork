
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogLevel } from '../constants/log-level';
import { renderUnknownAsNode } from '@/shared/utils/render';

// Define indicator variants
export type LogIndicatorVariant = 'debug' | 'info' | 'warning' | 'error' | 'critical';

interface InlineLogIndicatorProps {
  message: string | React.ReactNode;
  level?: LogLevel;
  variant?: LogIndicatorVariant;
  onClick?: () => void;
  className?: string;
  showIcon?: boolean;
  children?: React.ReactNode;
}

/**
 * A small inline indicator that can be used to show log-related information
 * directly in the UI next to relevant components
 */
export const InlineLogIndicator: React.FC<InlineLogIndicatorProps> = ({
  message,
  level,
  variant = 'info',
  onClick,
  className,
  showIcon = true,
  children
}) => {
  // Map LogLevel to variant if provided
  if (level !== undefined) {
    switch (level) {
      case LogLevel.DEBUG:
        variant = 'debug';
        break;
      case LogLevel.INFO:
        variant = 'info';
        break;
      case LogLevel.WARN:
        variant = 'warning';
        break;
      case LogLevel.ERROR:
        variant = 'error';
        break;
      case LogLevel.CRITICAL:
        variant = 'critical';
        break;
    }
  }
  
  // Determine icon and styles based on variant
  const getVariantProps = (variant: LogIndicatorVariant) => {
    switch (variant) {
      case 'debug':
        return {
          Icon: Info,
          colorClass: 'text-gray-400 border-gray-400/30 bg-gray-400/10',
          hoverClass: 'hover:bg-gray-400/20'
        };
      case 'info':
        return {
          Icon: Info,
          colorClass: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
          hoverClass: 'hover:bg-blue-400/20'
        };
      case 'warning':
        return {
          Icon: AlertTriangle,
          colorClass: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
          hoverClass: 'hover:bg-yellow-400/20'
        };
      case 'error':
        return {
          Icon: AlertCircle,
          colorClass: 'text-red-400 border-red-400/30 bg-red-400/10',
          hoverClass: 'hover:bg-red-400/20'
        };
      case 'critical':
        return {
          Icon: AlertCircle,
          colorClass: 'text-red-600 border-red-600/30 bg-red-600/10',
          hoverClass: 'hover:bg-red-600/20'
        };
    }
  };
  
  const { Icon, colorClass, hoverClass } = getVariantProps(variant);
  
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 text-xs border rounded-md',
        onClick && 'cursor-pointer',
        colorClass,
        onClick && hoverClass,
        'transition-all duration-150 backdrop-blur-sm',
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{typeof message === 'string' ? message : renderUnknownAsNode(message)}</span>
      {children}
    </motion.div>
  );
};
