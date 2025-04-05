
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './components/Logo';
import { NavigationItems } from './components/NavigationItems';
import { SearchButton } from './components/SearchButton';
import { AuthSection } from './components/AuthSection';
import { useThemeStore } from '@/stores/theme/store';
import { useLogger } from '@/hooks/use-logger';
import { LogCategory } from '@/logging/types';
import { useAuth } from '@/auth/hooks/useAuth';
import { useAdminAccess } from '@/admin/hooks/useAdminAccess';
import './styles/cyber-effects.css';

export function MainNav() {
  const [scrolled, setScrolled] = useState(false);
  const { siteComponents } = useThemeStore();
  const { isAuthenticated } = useAuth();
  const { hasAdminAccess } = useAdminAccess();
  const logger = useLogger('MainNav', { category: LogCategory.UI });
  
  // Get MainNav styles from theme store
  const navStyles = siteComponents.find(c => c.component_name === 'MainNav')?.styles || {
    container: 'fixed top-0 w-full z-50 transition-all duration-300',
    header: 'bg-background/80 backdrop-blur-xl shadow-lg border-b border-primary/20',
    dataStream: 'relative overflow-hidden',
    dataStreamEffect: 'mainnav-data-stream',
    glitchParticles: 'mainnav-glitch-particles',
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`${navStyles.container} ${scrolled ? 'shadow-lg' : ''}`}>
      <div className={navStyles.dataStream}>
        <div className={navStyles.dataStreamEffect}></div>
      </div>
      <header className={navStyles.header}>
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Logo />
            <NavigationItems />
          </div>
          
          <div className="flex items-center gap-4">
            <SearchButton />
            
            {isAuthenticated && hasAdminAccess && (
              <Link 
                to="/admin" 
                className="p-2 text-primary hover:text-primary/80 transition-colors"
                title="Admin Dashboard"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-5 w-5"
                >
                  <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"></path>
                  <path d="M7 7h.01"></path>
                </svg>
              </Link>
            )}
            
            <AuthSection />
          </div>
        </div>
      </header>
    </div>
  );
}
