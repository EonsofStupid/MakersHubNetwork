
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/ui/button';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useThemeStore } from '@/stores/theme/store';

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const { currentTheme } = useThemeStore();
  const isImpulsivity = currentTheme?.name?.toLowerCase().includes('impulsivity');
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={cn(
      "py-8 border-t mt-auto bg-background/80 backdrop-blur-sm",
      isImpulsivity && "border-t-primary/20 bg-gradient-to-t from-primary/5 to-transparent",
      className
    )}>
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="text-lg font-bold">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="inline-flex items-center"
              >
                PrinterHub
              </motion.span>
            </Link>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Your 3D printing community and resource hub.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Resources</h4>
              <div className="flex flex-col gap-1">
                <FooterLink href="/guides">Guides</FooterLink>
                <FooterLink href="/faq">FAQ</FooterLink>
                <FooterLink href="/blog">Blog</FooterLink>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Community</h4>
              <div className="flex flex-col gap-1">
                <FooterLink href="/forum">Forum</FooterLink>
                <FooterLink href="/showcase">Showcase</FooterLink>
                <FooterLink href="/events">Events</FooterLink>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Legal</h4>
              <div className="flex flex-col gap-1">
                <FooterLink href="/privacy">Privacy</FooterLink>
                <FooterLink href="/terms">Terms</FooterLink>
                <FooterLink href="/cookies">Cookies</FooterLink>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-2">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                <span className="sr-only">Facebook</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                <span className="sr-only">Twitter</span>
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                <span className="sr-only">Instagram</span>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              © {currentYear} PrinterHub. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ href, children }) => {
  return (
    <a 
      href={href} 
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </a>
  );
};
