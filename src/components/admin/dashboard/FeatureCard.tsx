
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
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
  colorClass = "bg-primary/10 text-primary border-primary/20"
}: FeatureCardProps) {
  const navigate = useNavigate();
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        onClick={() => navigate(path)}
        className={cn(
          "relative h-full p-6 overflow-hidden backdrop-blur-md cursor-pointer transition-colors",
          "hover:bg-card/90 border-[1px]",
          colorClass
        )}
      >
        <div className="absolute right-2 top-2 opacity-30">
          {icon}
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-30 bg-gradient-to-r from-transparent via-current to-transparent" />
      </Card>
    </motion.div>
  );
}
