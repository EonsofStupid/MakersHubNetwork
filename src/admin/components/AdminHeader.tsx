
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Settings, Database } from "lucide-react";
import { useThemeEffects } from "@/hooks/useThemeEffects";
import { EffectRenderer } from "@/components/theme/effects/EffectRenderer";
import { motion } from "framer-motion";

interface AdminHeaderProps {
  title: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title,
  collapsed = false
}) => {
  const navigate = useNavigate();
  const { applyRandomEffect, getEffectForElement } = useThemeEffects({
    maxActiveEffects: 2,
    debounceDelay: 100
  });

  const handleTitleClick = () => {
    applyRandomEffect('admin-title', {
      types: ['glitch', 'cyber'],
      duration: 2000
    });
  };

  const titleEffect = getEffectForElement('admin-title');

  return (
    <header className="border-b border-primary/10 backdrop-blur-md bg-background/50 sticky top-16 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <EffectRenderer effect={titleEffect}>
                <h1 
                  className="text-2xl font-heading text-primary"
                  id="admin-title"
                  onClick={handleTitleClick}
                >
                  {title}
                </h1>
              </EffectRenderer>
            </motion.div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-muted-foreground bg-primary/5 px-2 py-1 rounded border border-primary/10">
              MakersImpulse Admin
            </span>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
