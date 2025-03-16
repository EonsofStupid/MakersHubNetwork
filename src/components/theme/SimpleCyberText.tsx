
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SimpleCyberTextProps {
  text: string;
  className?: string;
  variant?: 'default' | 'glitch' | 'pulse' | 'mad-scientist';
  animate?: boolean;
  glitchInterval?: number;
}

export const SimpleCyberText: React.FC<SimpleCyberTextProps> = ({ 
  text, 
  className,
  variant = 'default',
  animate = false,
  glitchInterval = 5000
}) => {
  // Default cyber text styling
  if (variant === 'default') {
    return (
      <span 
        className={cn(
          "inline-block cyber-text-glow", 
          animate && "animate-pulse", 
          className
        )}
      >
        {text}
      </span>
    );
  }
  
  // Glitch effect styling
  if (variant === 'glitch') {
    const glitchAnim = {
      normal: { x: 0 },
      glitch: {
        x: [0, -2, 3, -1, 0],
        opacity: [1, 0.9, 0.8, 0.9, 1],
        transition: { 
          duration: 0.3,
          repeat: animate ? Infinity : 0,
          repeatType: "mirror" as const,
          repeatDelay: animate ? glitchInterval / 1000 : 0
        }
      }
    };
    
    return (
      <motion.span
        data-text={text}
        className={cn(
          "inline-block relative cyber-glitch-text", 
          className
        )}
        initial="normal"
        animate={animate ? "glitch" : "normal"}
        whileHover="glitch"
        variants={glitchAnim}
      >
        {text}
      </motion.span>
    );
  }
  
  // Pulse effect styling
  if (variant === 'pulse') {
    const pulseAnim = {
      normal: { 
        textShadow: "0 0 8px rgba(0, 240, 255, 0.4)" 
      },
      pulse: {
        textShadow: [
          "0 0 8px rgba(0, 240, 255, 0.4)",
          "0 0 15px rgba(0, 240, 255, 0.7)",
          "0 0 8px rgba(0, 240, 255, 0.4)"
        ],
        transition: {
          duration: 2,
          repeat: animate ? Infinity : 0,
          repeatType: "mirror" as const
        }
      }
    };
    
    return (
      <motion.span
        className={cn("inline-block text-primary", className)}
        initial="normal"
        animate={animate ? "pulse" : "normal"}
        whileHover="pulse"
        variants={pulseAnim}
      >
        {text}
      </motion.span>
    );
  }
  
  // Mad scientist effect
  if (variant === 'mad-scientist') {
    const madScientistAnim = {
      normal: { 
        color: "#00F0FF",
        textShadow: "0 0 8px rgba(0, 240, 255, 0.5)" 
      },
      active: {
        color: ["#00F0FF", "#FF2D6E", "#00F0FF"],
        textShadow: [
          "0 0 8px rgba(0, 240, 255, 0.5)", 
          "0 0 15px rgba(255, 45, 110, 0.7)", 
          "0 0 8px rgba(0, 240, 255, 0.5)"
        ],
        transition: {
          duration: 4,
          repeat: animate ? Infinity : 0,
          repeatType: "mirror" as const
        }
      }
    };
    
    return (
      <motion.span
        className={cn("inline-block font-bold", className)}
        initial="normal"
        animate={animate ? "active" : "normal"}
        whileHover="active"
        variants={madScientistAnim}
      >
        {text}
      </motion.span>
    );
  }
  
  // Fallback to regular text
  return <span className={className}>{text}</span>;
};
