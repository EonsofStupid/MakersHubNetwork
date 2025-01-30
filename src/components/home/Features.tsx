import { Database, Users, Building } from "lucide-react";
import { useState } from "react";

const features = [
  {
    title: "Extensive Parts Database",
    description: "Access our curated database of 3D printer components with detailed specifications and compatibility information.",
    icon: Database,
  },
  {
    title: "Community Builds",
    description: "Share your builds and learn from other makers in our growing community of DIY enthusiasts.",
    icon: Users,
  },
  {
    title: "Build Guides",
    description: "Step-by-step guides and resources to help you build your custom 3D printer from scratch.",
    icon: Building,
  },
];

export const Features = () => {
  const [hoveredStates, setHoveredStates] = useState<{ [key: number]: string }>({});

  const getRandomColor = () => {
    const hoverColors = [
      '#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#1EAEDB', '#33C3F0',
    ];
    return hoverColors[Math.floor(Math.random() * hoverColors.length)];
  };

  const getRandomAnimation = (index: number) => {
    const animations = [
      'hover:animate-morph-header',
      'hover:animate-float',
      'hover:animate-pulse-slow'
    ];
    return animations[index % animations.length];
  };

  const handleMouseEnter = (index: number) => {
    setHoveredStates(prev => ({
      ...prev,
      [index]: getRandomColor()
    }));
  };

  const handleMouseLeave = (index: number) => {
    setHoveredStates(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  return (
    <div className="mt-24 grid md:grid-cols-3 gap-8">
      {features.map((feature, i) => (
        <div
          key={feature.title}
          className={`p-6 rounded-lg backdrop-blur-sm animate-fade-up transition-all duration-300 ${getRandomAnimation(i)}`}
          style={{
            animationDelay: `${i * 100}ms`,
            backgroundColor: hoveredStates[i] ? `${hoveredStates[i]}10` : 'rgba(0, 0, 0, 0.5)',
            borderColor: hoveredStates[i],
            borderWidth: hoveredStates[i] ? '1px' : '0px',
            boxShadow: hoveredStates[i] 
              ? `0 0 20px ${hoveredStates[i]}40` 
              : 'none',
          }}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={() => handleMouseLeave(i)}
        >
          <feature.icon 
            className="h-12 w-12 mb-4 transition-colors duration-300" 
            style={{ 
              color: hoveredStates[i] || 'var(--primary)' 
            }}
          />
          <h3 className="text-xl font-bold mb-2 transition-colors duration-300"
              style={{ 
                color: hoveredStates[i] || 'white' 
              }}>
            {feature.title}
          </h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};