
import React from 'react';
import { Link } from 'react-router-dom';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';
import { MainNav } from '@/components/MainNav';
import { Footer } from '@/components/Footer';

export function NotFoundPage() {
  return (
    <ThemeInitializer>
      <SiteThemeProvider>
        <div className="flex flex-col min-h-screen">
          <MainNav />
          <main className="flex-grow flex items-center justify-center">
            <div className="text-center p-10">
              <h1 className="text-4xl font-bold cyber-gradient-text mb-4">404 - Page Not Found</h1>
              <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
              <Link 
                to="/" 
                className="bg-primary/10 hover:bg-primary/20 text-primary px-6 py-2 rounded-md border border-primary/30 transition-all hover:shadow-glow"
              >
                Return Home
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </SiteThemeProvider>
    </ThemeInitializer>
  );
}
