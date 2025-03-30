
import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CyberCardProps extends HTMLMotionProps<"div"> {
  title?: string;
  glow?: boolean;
  variant?: "default" | "outline" | "elevated";
  interactive?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ title, className, glow = false, variant = "default", interactive = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "cyber-card p-4 rounded-lg", 
          glow && "shadow-[var(--impulse-glow-primary)]",
          variant === "outline" && "bg-transparent",
          variant === "elevated" && "shadow-lg",
          interactive && "hover:border-[var(--impulse-border-hover)] cursor-pointer",
          className
        )}
        whileHover={interactive ? { y: -5, scale: 1.02 } : undefined}
        {...props}
      >
        {title && (
          <div className="mb-3 pb-2 border-b border-[var(--impulse-border-normal)]">
            <h3 className="text-lg font-bold text-[var(--impulse-text-accent)]">{title}</h3>
          </div>
        )}
        {children}
      </motion.div>
    );
  }
);

CyberCard.displayName = "CyberCard";
