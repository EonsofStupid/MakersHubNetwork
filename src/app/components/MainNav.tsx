
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';
import { useAuthStore } from '@/auth/store/auth.store';
import { RBACBridge } from '@/rbac/bridge';
import { Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useToast } from '@/shared/hooks/use-toast';
import { LogCategory, LogLevel } from '@/shared/types/shared.types';
import { logger } from '@/logging/logger.service';

export default function MainNav() {
  const { isAuthenticated, user, logout, status } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const hasAdminAccess = RBACBridge.hasAdminAccess();
  
  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/');
    } catch (error) {
      logger.log(LogLevel.ERROR, LogCategory.AUTH, 'Logout failed', { 
        error: error instanceof Error ? error.message : String(error)
      });
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was a problem logging you out.",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 border-b border-primary/30 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl cyber-text">
            IMPULSE
          </Link>
          
          <nav className="hidden md:flex items-center gap-4">
            {/* Cyberpunk styled links with hover effects */}
            <Link 
              to="/" 
              className="text-[#00F0FF] hover:text-[#FF2D6E] relative group transition-colors overflow-hidden"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            
            <Link 
              to="/features" 
              className="text-[#00F0FF] hover:text-[#FF2D6E] relative group transition-colors overflow-hidden"
            >
              <span className="relative z-10">Features</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            
            <Link 
              to="/about" 
              className="text-[#00F0FF] hover:text-[#FF2D6E] relative group transition-colors overflow-hidden"
            >
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-[#00F0FF] hover:text-[#FF2D6E] relative group transition-colors overflow-hidden"
              >
                <span className="relative z-10">Dashboard</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
            )}
            
            {isAuthenticated && hasAdminAccess && (
              <Link 
                to="/admin" 
                className="text-[#00F0FF] hover:text-[#FF2D6E] relative group transition-colors overflow-hidden flex items-center gap-1"
              >
                <Shield className="h-3.5 w-3.5" />
                <span className="relative z-10">Admin</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#00F0FF]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
              </Link>
            )}
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-[#00F0FF]">
                {user?.email}
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#00F0FF]/10 text-[#00F0FF] hover:text-[#FF2D6E]"
                  onClick={() => navigate('/profile')}
                >
                  <User size={18} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-[#00F0FF]/10 text-[#00F0FF] hover:text-[#FF2D6E]"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-[#00F0FF]/80 text-black hover:bg-[#00F0FF] hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            >
              Login
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
