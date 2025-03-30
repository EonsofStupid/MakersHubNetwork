
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { Shield, Settings, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function AdminHeader({ title, subtitle, className }: AdminHeaderProps) {
  const navigate = useNavigate();
  const [isEditMode] = useAtom(adminEditModeAtom);
  
  return (
    <header className={cn(
      "flex flex-col md:flex-row md:items-center justify-between py-4 mb-6",
      isEditMode && "edit-mode",
      className
    )}>
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-muted/80"
        >
          <Bell className="h-5 w-5" />
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-muted/80"
          onClick={() => navigate('/admin/settings')}
        >
          <Settings className="h-5 w-5" />
        </motion.button>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="p-1 rounded-full border border-border bg-background flex items-center cursor-pointer"
          onClick={() => navigate('/profile')}
        >
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-4 w-4" />
          </div>
        </motion.div>
      </div>
    </header>
  );
}
