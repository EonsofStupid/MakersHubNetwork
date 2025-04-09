
import React from 'react';
import { PlaceholderImage } from '@/components/PlaceholderImage';

export function BuildShowcase() {
  const builds = [
    {
      title: "Voron 2.4 350mm",
      description: "Core XY printer with linear rails on all axes and a moving bed.",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
      author: "Michael Chen"
    },
    {
      title: "Prusa i3 MK3S+",
      description: "Ultimate tool for all makers featuring improved frame rigidity.",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
      author: "Sarah Johnson"
    },
    {
      title: "RatRig V-Core 3",
      description: "Open source CoreXY 3D printer with heavy focus on customization.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475",
      author: "David Miller"
    }
  ];

  return (
    <section className="py-16 px-4 bg-card relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="mainnav-data-stream animate-data-stream"></div>
        <div className="mainnav-glitch-particles animate-pulse-slow"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 cyber-gradient-text">
          Community Builds
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {builds.map((build, index) => (
            <div 
              key={index} 
              className="rounded-lg overflow-hidden border border-primary/20 bg-background/40 backdrop-blur-xl hover:border-primary/40 transition-all hover:shadow-glow"
            >
              <div className="h-48 overflow-hidden">
                <PlaceholderImage 
                  src={build.image} 
                  alt={build.title}
                  className="w-full h-full object-cover"
                  fallbackText={build.title.charAt(0)}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-2">{build.title}</h3>
                <p className="text-muted-foreground mb-4">{build.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">By {build.author}</span>
                  <button className="text-primary text-sm hover:underline">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="px-6 py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-md transition-all hover:shadow-glow">
            Explore More Builds
          </button>
        </div>
      </div>
    </section>
  );
}
