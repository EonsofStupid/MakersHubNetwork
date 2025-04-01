
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Users, Box, Settings, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';

export function TopNavShortcuts() {
  const navigate = useNavigate();
  
  const shortcuts = [
    { icon: <FileText className="w-5 h-5" />, label: 'Content', path: '/admin/content' },
    { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
    { icon: <Box className="w-5 h-5" />, label: 'Builds', path: '/admin/builds' },
    { icon: <Palette className="w-5 h-5" />, label: 'Themes', path: '/admin/themes' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
  ];
  
  return (
    <div className="hidden md:flex items-center space-x-1">
      {shortcuts.map((shortcut) => (
        <AdminTooltip key={shortcut.path} content={shortcut.label} side="bottom">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(shortcut.path)}
            className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
          >
            {shortcut.icon}
          </motion.button>
        </AdminTooltip>
      ))}
    </div>
  );
}

