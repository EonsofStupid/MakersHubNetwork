
import React from 'react';
import { cn } from '@/shared/utils/cn';

interface HeroBannerProps {
  className?: string;
}

export function HeroBanner({ className }: HeroBannerProps) {
  return (
    <section className={cn(
      "py-20 px-4 relative overflow-hidden",
      "bg-gradient-to-b from-background via-background/80 to-background",
      className
    )}>
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold mb-6",
            "cyber-text gradient-text"
          )}>
            The Ultimate 3D Printing Community
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">
            Connect with fellow makers, showcase your builds, and elevate your 3D printing experience
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="/builds/explore" 
              className={cn(
                "px-8 py-3 rounded-md bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors cyber-glow"
              )}
            >
              Explore Builds
            </a>
            <a 
              href="/auth" 
              className={cn(
                "px-8 py-3 rounded-md bg-secondary/10 text-primary",
                "border border-primary/30 hover:bg-primary/10 transition-colors"
              )}
            >
              Join Community
            </a>
          </div>
        </div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 rounded-full bg-primary/5 blur-3xl -top-20 -left-20" />
        <div className="absolute w-96 h-96 rounded-full bg-secondary/5 blur-3xl -bottom-40 -right-20" />
      </div>
    </section>
  );
}
