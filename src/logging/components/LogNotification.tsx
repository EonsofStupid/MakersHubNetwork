
import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Adjust AlertToastVariant to match the available variant types
export type AlertToastVariant = 'default' | 'destructive' | 'success' | 'warning';

// Convert our variant types to toast variant types
const mapVariantToToastVariant = (variant: AlertToastVariant): "default" | "destructive" | undefined => {
  switch (variant) {
    case 'destructive':
      return 'destructive';
    case 'success':
    case 'warning':
    default:
      return 'default';
  }
};

interface AlertToastProps {
  title: string;
  description?: string;
  variant?: AlertToastVariant;
  duration?: number;
}

// Enhanced toast with cyberpunk styling and animations
export const alertToast = ({ title, description, variant = 'default', duration = 5000 }: AlertToastProps) => {
  return toast({
    title,
    description,
    duration,
    variant: mapVariantToToastVariant(variant),
    // Use a custom component for the toast content
    action: <AlertToastIcon variant={variant} />,
  });
};

// Icon component for the toast notification
const AlertToastIcon: React.FC<{ variant: AlertToastVariant }> = ({ variant }) => {
  let Icon;
  let animationClass;
  let bgClass;
  
  switch (variant) {
    case 'destructive':
      Icon = AlertCircle;
      animationClass = 'animate-pulse';
      bgClass = 'bg-red-500/20';
      break;
    case 'warning':
      Icon = AlertTriangle;
      animationClass = 'animate-pulse';
      bgClass = 'bg-amber-500/20';
      break;
    case 'success':
      Icon = CheckCircle;
      animationClass = '';
      bgClass = 'bg-green-500/20';
      break;
    default:
      Icon = Info;
      animationClass = '';
      bgClass = 'bg-blue-500/20';
  }
  
  return (
    <motion.div
      className={cn(
        'w-8 h-8 rounded-full flex items-center justify-center',
        bgClass,
        'relative overflow-hidden'
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Icon className={cn('w-5 h-5', animationClass)} />
      
      {/* Cyber effect - pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-current opacity-0"
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0, 0.2, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }}
      />
      
      {/* Cyber effect - scan line */}
      <motion.div
        className="absolute h-[1px] bg-current opacity-50 left-0 right-0"
        animate={{ 
          top: ["0%", "100%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }}
      />
    </motion.div>
  );
};

// Inline Log Indicator component
export const InlineLogIndicator: React.FC<{
  message: string;
  variant?: AlertToastVariant;
  onClick?: () => void;
  className?: string;
}> = ({ message, variant = 'default', onClick, className }) => {
  let Icon;
  let colorClass;
  
  switch (variant) {
    case 'destructive':
      Icon = AlertCircle;
      colorClass = 'text-red-500 border-red-500/30 bg-red-500/10';
      break;
    case 'warning':
      Icon = AlertTriangle;
      colorClass = 'text-amber-500 border-amber-500/30 bg-amber-500/10';
      break;
    case 'success':
      Icon = CheckCircle;
      colorClass = 'text-green-500 border-green-500/30 bg-green-500/10';
      break;
    default:
      Icon = Info;
      colorClass = 'text-blue-500 border-blue-500/30 bg-blue-500/10';
  }
  
  return (
    <motion.div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 text-xs border rounded-md cursor-pointer',
        'hover:opacity-80 transition-all duration-150 backdrop-blur-sm',
        colorClass,
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Icon className="w-3 h-3" />
      <span>{message}</span>
    </motion.div>
  );
};
