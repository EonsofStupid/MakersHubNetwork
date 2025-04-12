
import React, { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  path: string;
  colorClass?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  path,
  colorClass = "bg-primary/10 text-primary border-primary/20"
}: FeatureCardProps) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "p-4 rounded-md border border-primary/10 hover:border-primary/30 cursor-pointer",
        "transition-colors bg-card/50 hover:bg-card/70"
      )}
      onClick={() => navigate(path)}
    >
      <div className="flex flex-col h-full">
        <div className={cn(
          "w-8 h-8 rounded-md flex items-center justify-center mb-3",
          colorClass
        )}>
          {icon}
        </div>
        
        <h3 className="font-medium text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground flex-grow">{description}</p>
        
        <div className="mt-3 text-xs flex justify-end">
          <span className="text-primary hover:underline">Access</span>
        </div>
      </div>
    </motion.div>
  );
}
