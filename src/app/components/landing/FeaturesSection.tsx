
import React from 'react';
import { CubeIcon, Share2Icon, UsersIcon, BookOpenIcon } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <CubeIcon className="w-10 h-10 text-primary" />,
      title: "3D Models Library",
      description: "Access thousands of free and premium 3D models ready to print."
    },
    {
      icon: <Share2Icon className="w-10 h-10 text-primary" />,
      title: "Share Your Creations",
      description: "Upload and share your builds with our supportive community."
    },
    {
      icon: <UsersIcon className="w-10 h-10 text-primary" />,
      title: "Community Support",
      description: "Get help, feedback, and inspiration from fellow makers."
    },
    {
      icon: <BookOpenIcon className="w-10 h-10 text-primary" />,
      title: "Tutorials & Guides",
      description: "Learn from experts with our comprehensive resources and guides."
    }
  ];

  return (
    <section className="py-16 bg-background/50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Why Join Our Community
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-lg border border-primary/30 bg-background/20 backdrop-blur-xl transition-all hover:shadow-[0_8px_32px_0_rgba(0,240,255,0.2)]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
