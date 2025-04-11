
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/ui/core/button';
import { SimpleCyberText } from '@/ui/theme/SimpleCyberText';
import { ThemeInfoPopup } from '@/ui/theme/info/ThemeInfoPopup';

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-1 md:items-start md:gap-2"
        >
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
            <SimpleCyberText text="IMPULSE" />
          </Link>
          <p className="text-xs text-muted-foreground md:text-sm">
            &copy; {year} Impulse Labs. All rights reserved.
          </p>
        </motion.div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a href="https://github.com" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </a>
          </Button>
          <ThemeInfoPopup />
        </div>
      </div>
    </footer>
  );
}
