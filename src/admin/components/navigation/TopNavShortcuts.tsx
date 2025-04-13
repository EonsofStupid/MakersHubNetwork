import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminAccess } from '../hooks/useAdminAccess';
import { cn } from '@/shared/utils/cn';

export function TopNavShortcuts() {
  const { hasAdminAccess } = useAdminAccess();
  
  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contract', path: '/contract' },
  ];
  
  return (
    <div className="hidden md:flex items-center space-x-2">
      {navItems.map((item) => (
        <motion.div
          key={item.label}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to={item.path}
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300",
              "bg-[#00a8a8] text-white shadow-[0_0_10px_rgba(0,168,168,0.5)]",
              "hover:bg-[#ff69b4] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]",
              "relative overflow-hidden group"
            )}
          >
            <span className="relative z-10">{item.label}</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#00a8a8] to-[#ff69b4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </Link>
        </motion.div>
      ))}
      
      {hasAdminAccess && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/admin"
            className={cn(
              "px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300",
              "bg-[#00a8a8] text-white shadow-[0_0_10px_rgba(0,168,168,0.5)]",
              "hover:bg-[#ff69b4] hover:shadow-[0_0_15px_rgba(255,105,180,0.7)]",
              "relative overflow-hidden group"
            )}
          >
            <span className="relative z-10">Admin</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-[#00a8a8] to-[#ff69b4] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                repeat: Infinity, 
                duration: 2,
                ease: "easeInOut"
              }}
            />
          </Link>
        </motion.div>
      )}
    </div>
  );
}
