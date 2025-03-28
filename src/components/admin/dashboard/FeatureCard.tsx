
import React from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  colorClass?: string;
}

export function FeatureCard({ 
  title, 
  description, 
  icon, 
  path, 
  colorClass 
}: FeatureCardProps) {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(path);
  };
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "p-4 cursor-pointer hover:shadow-md transition-all duration-300",
          "border-primary/10 overflow-hidden relative h-full",
          colorClass
        )}
        onClick={handleClick}
      >
        <div className="absolute -right-4 -top-4 opacity-10 text-4xl rotate-12">
          {icon}
        </div>
        
        <div className="space-y-2">
          <div className="text-lg font-medium flex items-center gap-2">
            <span className="text-base">{icon}</span> 
            {title}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        </div>
      </Card>
    </motion.div>
  );
}
