
import React from 'react';

export const BuildShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Latest Builds
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div 
              key={item} 
              className="rounded-lg overflow-hidden border border-primary/30 bg-background/20 backdrop-blur-xl transition-all hover:shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]"
            >
              <div className="aspect-video bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  Build Image {item}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Amazing 3D Print #{item}</h3>
                <p className="text-muted-foreground text-sm">Created by Community Member</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-8">
          <a href="/builds" className="px-6 py-2 rounded-md border border-primary/30 text-primary hover:bg-primary/10">
            View All Builds
          </a>
        </div>
      </div>
    </section>
  );
};
