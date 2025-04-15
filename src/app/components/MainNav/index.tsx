
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginSheet } from '../auth/LoginSheet';
import { UserMenu } from '../auth/UserMenu';
import { useAuthStore } from '@/auth/store/auth.store';
import { NavigationItems } from './components/NavigationItems';

export function MainNav() {
  const navigate = useNavigate();
  const { isAuthenticated, status } = useAuthStore();
  const isLoading = status === 'LOADING';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 border-b border-primary/30 backdrop-blur-md">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/')} 
            className="font-bold text-xl cyber-text"
          >
            IMPULSE
          </button>
          
          <NavigationItems />
        </div>
        
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="h-8 w-8 rounded-full bg-primary/20 animate-pulse" />
          ) : isAuthenticated ? (
            <UserMenu />
          ) : (
            <LoginSheet />
          )}
        </div>
      </div>
    </header>
  );
}
