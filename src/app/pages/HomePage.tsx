
import React from 'react';
import { BuildShowcase } from '@/app/components/landing/BuildShowcase';
import { FeaturesSection } from '@/app/components/landing/FeaturesSection';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      <section className="h-[70vh] flex items-center justify-center bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              3D Printing Community
            </span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Join our community of makers, share your builds, and explore the world of 3D printing
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/builds" className="px-8 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
              Explore Builds
            </a>
            <a href="/join" className="px-8 py-3 rounded-md border border-primary/30 text-primary hover:bg-primary/10">
              Join Community
            </a>
          </div>
        </div>
      </section>
      
      <FeaturesSection />
      <BuildShowcase />
    </div>
  );
};

export default HomePage;
