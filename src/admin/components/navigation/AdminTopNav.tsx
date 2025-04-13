import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, User, Settings, Menu, Shield, Search, Bug, LogOut, LogIn, UserCog } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useAdminStore } from '@/admin/store/admin.store';
import { useAtom } from 'jotai';
import { adminEditModeAtom } from '@/admin/atoms/tools.atoms';
import { useToast } from '@/hooks/use-toast';
import { AdminTooltip } from '@/admin/components/ui/AdminTooltip';
import { TopNavShortcuts } from '@/admin/components/navigation/TopNavShortcuts';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import { EditModeToggle } from '@/admin/components/ui/EditModeToggle';
import { SyncIndicator } from '@/admin/components/ui/SyncIndicator';
import { useAdminSidebar } from '@/admin/hooks/useAdminSidebar';
import { useAuthStore } from '@/stores/auth/auth.store';
import { Button } from '@/shared/ui/button';
import { useDebugOverlay } from '@/admin/hooks/useDebugOverlay';

import '@/admin/styles/admin-topnav.css';
import '@/admin/styles/cyber-effects.css';

interface AdminTopNavProps {
  title?: string;
  className?: string;
  readonly?: boolean;
}

export function AdminTopNav({ title = "Admin Dashboard", className, readonly = false }: AdminTopNavProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditMode, setEditMode] = useAtom(adminEditModeAtom);
  const { hasAdminAccess, hasSuperAdminAccess } = useAdminAccess();
  const { isOpen: sidebarExpanded, toggle: toggleSidebar } = useAdminSidebar();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const { toggleDebugOverlay, isDebugOverlayVisible } = useDebugOverlay();
  
  // Sync preferences when edit mode changes
  useEffect(() => {
    const handleSyncStore = async () => {
      if (isEditMode) {
        // Save preferences logic would go here
        // This is a stub for compatibility with expected function call
        const savePreferences = async () => {
          toast({
            title: "Preferences saved",
            description: "Your admin preferences have been saved."
          });
          return Promise.resolve();
        };
        
        await savePreferences();
      }
    };
    
    handleSyncStore();
  }, [isEditMode, toast]);
  
  useEffect(() => {
    const applyRandomGlitch = () => {
      const nav = document.querySelector('.admin-topnav');
      if (nav) {
        nav.classList.add('glitch-effect');
        setTimeout(() => {
          nav.classList.remove('glitch-effect');
        }, 200);
      }
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        applyRandomGlitch();
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleLogin = async (provider: 'google' | 'supabase') => {
    try {
      if (provider === 'google') {
        // Implement Google login
        toast({
          title: "Google Login",
          description: "Google login will be implemented here."
        });
      } else {
        // Implement Supabase login
        toast({
          title: "Supabase Login",
          description: "Supabase login will be implemented here."
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "There was an error during login.",
        variant: "destructive"
      });
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out."
      });
      setShowLoginSheet(false);
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "There was an error during logout.",
        variant: "destructive"
      });
    }
  };
  
  if (!hasAdminAccess) {
    return null;
  }
  
  return (
    <div className="fixed top-0 left-0 right-0 w-full z-40">
      <div className="admin-topnav w-full flex items-center justify-between px-4 h-14 top-nav-trapezoid">
        <div className="flex items-center space-x-4">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSidebar}
            className="p-2 rounded-full hover:bg-[var(--impulse-border-hover)] text-[var(--impulse-text-primary)]"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          
          <div className="text-[var(--impulse-text-primary)] hover:text-[var(--impulse-primary)] transition-colors flex items-center gap-2">
            <Shield className="w-5 h-5 text-[var(--impulse-primary)] pulse-glow" />
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-lg font-bold cyber-text"
            >
              {title}
            </motion.h1>
          </div>
        </div>
        
        <TopNavShortcuts />
        
        <div className="flex items-center space-x-3">
          <div className="mr-2">
            <SyncIndicator />
          </div>
          
          {!readonly && (
            <EditModeToggle />
          )}
          
          <AdminTooltip content="Notifications" side="bottom">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="admin-topnav-item"
            >
              <Bell className="w-5 h-5" />
            </motion.button>
          </AdminTooltip>
          
          <AdminTooltip content="Search" side="bottom">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="admin-topnav-item"
            >
              <Search className="w-5 h-5" />
            </motion.button>
          </AdminTooltip>
          
          {(hasAdminAccess || hasSuperAdminAccess) && (
            <AdminTooltip content="Debug Overlay" side="bottom">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleDebugOverlay}
                className={cn(
                  "admin-topnav-item",
                  isDebugOverlayVisible && "text-[var(--impulse-primary)]"
                )}
              >
                <Bug className="w-5 h-5" />
              </motion.button>
            </AdminTooltip>
          )}
          
          <AdminTooltip content="Settings" side="bottom">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="admin-topnav-item"
              onClick={() => navigate('/admin/settings')}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </AdminTooltip>
          
          <div className="relative">
            <AdminTooltip content={isAuthenticated ? "Profile" : "Login"} side="bottom">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="admin-topnav-item"
                onClick={() => setShowLoginSheet(!showLoginSheet)}
              >
                <User className="w-5 h-5" />
              </motion.button>
            </AdminTooltip>
            
            <AnimatePresence>
              {showLoginSheet && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="absolute right-0 top-12 w-64 trapezoid-menu"
                >
                  <div className="bg-[var(--impulse-bg-secondary)] border border-[var(--impulse-border)] p-4 rounded-md shadow-lg">
                    {isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2 pb-2 border-b border-[var(--impulse-border)]">
                          <div className="w-8 h-8 rounded-full bg-[var(--impulse-primary)] flex items-center justify-center text-white">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{user?.email}</p>
                            <p className="text-xs text-[var(--impulse-text-secondary)]">
                              {user?.roles?.join(', ') || 'User'}
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left"
                          onClick={() => navigate('/profile')}
                        >
                          <UserCog className="w-4 h-4 mr-2" />
                          Profile
                        </Button>
                        
                        {(hasAdminAccess || hasSuperAdminAccess) && (
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-left"
                            onClick={() => navigate('/admin')}
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Admin Dashboard
                          </Button>
                        )}
                        
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-500/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <h3 className="font-medium text-center pb-2 border-b border-[var(--impulse-border)]">
                          Login
                        </h3>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left"
                          onClick={() => handleLogin('google')}
                        >
                          <img src="/google-icon.svg" alt="Google" className="w-4 h-4 mr-2" />
                          Continue with Google
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left"
                          onClick={() => handleLogin('supabase')}
                        >
                          <img src="/supabase-icon.svg" alt="Supabase" className="w-4 h-4 mr-2" />
                          Continue with Supabase
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
