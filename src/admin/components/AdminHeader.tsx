
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Settings, Database, Search, Moon, Sun } from "lucide-react";
import { useThemeEffects } from "@/hooks/useThemeEffects";
import { EffectRenderer } from "@/components/theme/effects/EffectRenderer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CyberText } from "@/components/theme/CyberText";

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
    maxActiveEffects: 3,
    debounceDelay: 100
  });

  const handleTitleClick = () => {
    applyRandomEffect('admin-title', {
      types: ['glitch', 'cyber'],
      colors: ['#00F0FF', '#FF2D6E', '#8B5CF6'],
      duration: 2000
    });
  };

  const titleEffect = getEffectForElement('admin-title');
  
  // Header Animation variants
  const headerVariants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <header className="border-b border-primary/10 backdrop-blur-md bg-background/50 sticky top-16 z-10">
      <motion.div 
        className="container mx-auto px-4 py-3"
        initial="initial"
        animate="animate"
        exit="exit"
        variants={headerVariants}
      >
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
                  className="text-2xl font-heading text-primary cursor-pointer select-none"
                  id="admin-title"
                  onClick={handleTitleClick}
                >
                  {title}
                </h1>
              </EffectRenderer>
            </motion.div>
          </div>
          
          {!collapsed && (
            <div className="hidden md:flex items-center max-w-sm w-full mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search admin..."
                  className="pl-10 bg-background/80 border-primary/20 focus-visible:ring-primary/30"
                />
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-primary/5 border-primary/20 text-xs">
              <CyberText variant="glow">MakersImpulse Admin</CyberText>
            </Badge>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Database className="h-5 w-5 text-primary" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary/10 relative">
              <Bell className="h-5 w-5 text-primary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full"></span>
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </Button>
            
            <Button variant="ghost" size="icon" className="hover:bg-primary/10">
              <Moon className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>
      </motion.div>
    </header>
  );
};
