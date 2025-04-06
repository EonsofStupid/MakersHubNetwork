import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { Link } from 'react-router-dom';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { BuildShowcase } from '@/components/landing/BuildShowcase';

export default function LandingPage() {
  const { applyImmediateStyles } = useImpulsivityTheme();
  
  // Apply theme styles immediately on load
  useEffect(() => {
    applyImmediateStyles();
  }, [applyImmediateStyles]);
  
  return (
    <div className="container mx-auto px-4">
      <section className="flex flex-col items-center justify-center min-h-[70vh] py-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold cyber-gradient-text mb-6">
          3D Printer Hub
        </h1>
        
        <p className="text-xl md:text-2xl max-w-3xl mb-8 text-muted-foreground">
          A community platform for 3D printing enthusiasts with modern design elements
          and powerful customization options.
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button size="lg" className="cyber-border">
            Get Started
          </Button>
          
          <Link to="/login">
            <Button variant="outline" size="lg" className="site-border-glow">
              Login
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Original FeaturesSection component */}
      <FeaturesSection />
      
      {/* Original BuildShowcase component */}
      <BuildShowcase />
    </div>
  );
}
