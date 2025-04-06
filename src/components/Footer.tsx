
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  
  return (
    <footer className="border-t border-[var(--impulse-border-normal)] bg-[var(--impulse-bg-card)] backdrop-blur-md">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-xl font-bold cyber-gradient-text">
              Impulsivity
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              A modern cyberpunk theme system
            </p>
          </div>
          
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium mb-2">Product</h3>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium mb-2">Resources</h3>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
            
            <div className="flex flex-col space-y-2">
              <h3 className="font-medium mb-2">Company</h3>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              
              {hasAdminAccess && (
                <Link 
                  to="/admin" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Admin Portal
                </Link>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-[var(--impulse-border-normal)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Impulsivity Theme. All rights reserved.
          </p>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
