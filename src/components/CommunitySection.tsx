
import React from 'react';

export function CommunitySection() {
  const stats = [
    { label: "Active Members", value: "10,000+" },
    { label: "Shared Projects", value: "25,000+" },
    { label: "Downloads", value: "1M+" },
    { label: "Countries", value: "120+" }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Growing Community</h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Connect with thousands of 3D printing enthusiasts around the world and share your passion for creation.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="p-6 bg-muted/30 rounded-lg">
              <div className="text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
