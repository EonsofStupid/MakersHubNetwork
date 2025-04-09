
import React from 'react';

export function FeaturesSection() {
  const features = [
    {
      title: "Premium Quality Parts",
      description: "All our 3D printer parts are manufactured to the highest standards for reliability and performance.",
      icon: "⚙️"
    },
    {
      title: "Custom Build Support",
      description: "Get personalized assistance for your custom 3D printer build from our community of experts.",
      icon: "🛠️"
    },
    {
      title: "Worldwide Shipping",
      description: "We ship our high-quality 3D printer components to makers around the globe.",
      icon: "🌎"
    },
    {
      title: "Community Projects",
      description: "Join our community of makers and share your 3D printing projects and innovations.",
      icon: "👥"
    }
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 cyber-gradient-text">
          Powering Your 3D Printing Journey
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 rounded-lg cyber-card hover:border-glow transition-all duration-300"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
