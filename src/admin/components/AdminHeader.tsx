
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Settings, User, Shield } from "lucide-react";
import { useThemeEffects } from "@/hooks/useThemeEffects";
import { EffectRenderer } from "@/components/theme/effects/EffectRenderer";
import { motion } from "framer-motion";
import { SimpleCyberText } from "@/components/theme/SimpleCyberText";
import { useAuthStore } from "@/stores/auth/store";

interface AdminHeaderProps {
  title: string;
  collapsed?: boolean;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title,
  collapsed = false
}) => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
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
              className="hover:bg-primary/10 cyber-glow"
            >
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
            
            <EffectRenderer effect={titleEffect}>
              <motion.h1 
                className="text-2xl font-heading text-primary cursor-pointer"
                id="admin-title"
                onClick={handleTitleClick}
                whileHover={{ scale: 1.02 }}
              >
                <SimpleCyberText text={title} />
              </motion.h1>
            </EffectRenderer>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4 text-primary/60" />
              <span>Admin Panel</span>
            </div>
            
            <motion.div 
              className="ml-4 flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 relative group">
                <Bell className="h-5 w-5 text-primary" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-secondary rounded-full text-[10px] text-white">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
              
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Settings className="h-5 w-5 text-primary" />
                <span className="sr-only">Settings</span>
              </Button>
              
              <div className="hidden md:flex items-center space-x-2 pl-2 border-l border-primary/10">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium truncate w-24">{user?.email?.split('@')[0] || 'Admin'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
};
