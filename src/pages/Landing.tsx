
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useImpulsivityTheme } from '@/hooks/useImpulsivityTheme';
import { Link } from 'react-router-dom';

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
          Impulsivity Theme
        </h1>
        
        <p className="text-xl md:text-2xl max-w-3xl mb-8 text-muted-foreground">
          A fully reactive cyberpunk experience with modern design elements
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
      
      <section className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Reactive Design",
              description: "Smooth animations and responsive layouts for all devices"
            },
            {
              title: "Theme Engine",
              description: "Powerful customization with automatic CSS variable generation"
            },
            {
              title: "Component Library",
              description: "Ready-to-use UI components with cyberpunk styling"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 site-card site-border-glow hover:site-glow transition-all"
            >
              <h3 className="text-xl font-bold mb-3 cyber-gradient-text">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
