
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
          Welcome to 3D Printer Hub
        </h1>
        <p className="text-xl md:max-w-2xl mx-auto mb-8 text-muted-foreground">
          Join our community of 3D printing enthusiasts, share your builds, find inspiration, and learn from others.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/projects">
            <Button size="lg">Browse Projects</Button>
          </Link>
          <Link to="/join">
            <Button size="lg" variant="outline">Join Community</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
