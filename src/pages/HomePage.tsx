
import React, { useEffect } from 'react';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BuildShowcase } from '@/components/landing/BuildShowcase';
import { Footer } from '@/components/Footer';
import { MainNav } from '@/components/MainNav';
import { ThemeInitializer } from '@/components/theme/ThemeInitializer';
import { SiteThemeProvider } from '@/components/theme/SiteThemeProvider';

export function HomePage() {
  return (
    <ThemeInitializer>
      <SiteThemeProvider>
        <div className="flex flex-col min-h-screen bg-background">
          <MainNav />
          <main className="flex-grow">
            <div className="container mx-auto">
              {/* Hero section would go here */}
              <FeaturesSection />
              <BuildShowcase />
            </div>
          </main>
          <Footer />
        </div>
      </SiteThemeProvider>
    </ThemeInitializer>
  );
}
