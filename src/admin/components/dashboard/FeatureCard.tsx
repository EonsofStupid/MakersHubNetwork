
import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
  colorClass = "bg-primary/10 text-primary border-primary/20"
}: FeatureCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(path)}
      className={cn(
        "cursor-pointer p-4 rounded-lg border group relative",
        "hover:shadow-md transition-all duration-200",
        colorClass
      )}
    >
      <div className="flex items-start space-x-3">
        <div className={cn("rounded-md p-2 bg-background/50")}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm opacity-80">{description}</p>
        </div>
        <div className="hidden group-hover:flex items-center justify-center">
          <ChevronRight className="h-4 w-4 opacity-60" />
        </div>
      </div>
    </motion.div>
  );
}
