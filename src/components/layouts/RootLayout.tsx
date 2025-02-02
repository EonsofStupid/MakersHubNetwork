import React, { useEffect } from 'react';
import { Navigation } from '../shared/ui/Navigation';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/components/theme/ThemeContext';
import { motion } from 'framer-motion';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    console.log('RootLayout mounted, theme:', theme?.site_title);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      console.log('RootLayout unmounted');
    };
  }, [theme]);

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Navigation />
      <main className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </main>
      <Toaster />
    </motion.div>
  );
};