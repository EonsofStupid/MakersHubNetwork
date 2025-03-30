
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CyberCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  glow?: boolean;
  interactive?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'destructive';
}

export function CyberCard({
  children,
  title,
  className,
  glow = false,
  interactive = false,
  variant = 'default'
}: CyberCardProps) {
  // Determine color based on variant
  const variantStyles = {
    default: 'border-[var(--impulse-border-normal)]',
    primary: 'border-[var(--impulse-primary)]',
    secondary: 'border-[var(--impulse-secondary)]',
    destructive: 'border-red-500'
  };
  
  // Determine glow effect based on variant
  const glowStyles = {
    default: 'hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]',
    primary: 'hover:shadow-[0_0_15px_rgba(0,240,255,0.5)]',
    secondary: 'hover:shadow-[0_0_15px_rgba(255,45,110,0.5)]',
    destructive: 'hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]'
  };
  
  return (
    <motion.div
      className={cn(
        'glassmorphism relative p-4 rounded-xl overflow-hidden',
        variantStyles[variant],
        glow && glowStyles[variant],
        interactive && 'cursor-pointer transform transition-all duration-300 hover:-translate-y-1',
        className
      )}
      whileHover={interactive ? { scale: 1.02 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
    >
      {/* Angle cut corner */}
      <div 
        className="absolute top-0 right-0 w-8 h-8 opacity-60"
        style={{
          clipPath: "polygon(100% 0, 100% 100%, 0 0)",
          background: variant === 'default' 
            ? "linear-gradient(135deg, var(--impulse-primary) 0%, transparent 80%)"
            : variant === 'primary' 
              ? "linear-gradient(135deg, var(--impulse-primary) 0%, transparent 80%)"
              : variant === 'secondary'
                ? "linear-gradient(135deg, var(--impulse-secondary) 0%, transparent 80%)"
                : "linear-gradient(135deg, #f43f5e 0%, transparent 80%)"
        }}
      />
      
      {/* Title if provided */}
      {title && (
        <div className="mb-3 pb-2 border-b border-[var(--impulse-border-normal)]">
          <h3 className="font-medium text-lg text-[var(--impulse-text-primary)]">{title}</h3>
        </div>
      )}
      
      {/* Card content */}
      <div>{children}</div>
      
      {/* Scan line effect */}
      {interactive && (
        <motion.div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        >
          <motion.div
            className="h-[1px] w-full"
            style={{
              background: variant === 'default' 
                ? "var(--impulse-primary)" 
                : variant === 'primary' 
                  ? "var(--impulse-primary)" 
                  : variant === 'secondary' 
                    ? "var(--impulse-secondary)" 
                    : "#f43f5e",
              opacity: 0.4
            }}
            animate={{
              top: ["0%", "100%", "0%"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            initial={{ position: "absolute", top: "0%" }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
