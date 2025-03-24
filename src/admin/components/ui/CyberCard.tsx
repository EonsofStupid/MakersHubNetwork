
import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface CyberCardProps extends Omit<HTMLMotionProps<"div">, "whileHover"> {
  glow?: boolean;
  variant?: "default" | "outline" | "elevated";
  interactive?: boolean;
  children: React.ReactNode;
}

export const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  ({ className, glow = false, variant = "default", interactive = false, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "impulse-panel p-4 rounded-lg", // Base impulse panel style
          "border border-[var(--impulse-border-normal)]",
          "transition-all duration-300",
          glow && "shadow-[var(--impulse-glow-primary)]",
          variant === "outline" && "bg-transparent",
          variant === "elevated" && "shadow-lg",
          interactive && "hover:border-[var(--impulse-border-hover)] hover:shadow-[var(--impulse-glow-hover)]",
          interactive && "cursor-pointer transform hover:-translate-y-1",
          className
        )}
        {...props}
        whileHover={interactive ? { y: -5 } : undefined}
      >
        {children}
      </motion.div>
    );
  }
);

CyberCard.displayName = "CyberCard";
