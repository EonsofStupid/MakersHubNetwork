
import { useState } from "react";
import { cn } from "@/shared/utils/cn";
import { ThemeEffectType } from "@/shared/types/shared.types";

const features = [
  {
    title: "Build Showcase",
    description: "Share your 3D printing projects with the community and get feedback from fellow enthusiasts.",
    icon: "🖨️",
  },
  {
    title: "Model Library",
    description: "Access thousands of 3D models contributed by our community members and partners.",
    icon: "📚",
  },
  {
    title: "Tech Support",
    description: "Get help with your printer issues from experienced makers through our support forums.",
    icon: "🛠️",
  },
  {
    title: "Learning Resources",
    description: "Access tutorials, guides, and courses to improve your 3D printing skills.",
    icon: "📝",
  },
  {
    title: "Materials Database",
    description: "Comprehensive information on filaments, resins, and other printing materials.",
    icon: "🧪",
  },
  {
    title: "Live Events",
    description: "Join virtual meetups, conferences, and competitions with the 3D printing community.",
    icon: "🎭",
  },
];

export function FeaturesSection() {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section className="py-16 px-4 bg-black/30 relative overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3 cyber-text">Community Features</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Join our global community of 3D printing enthusiasts and access these amazing features
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
          {/* Features list */}
          <div className="lg:col-span-1 space-y-4">
            {features.map((feature, index) => (
              <button
                key={index}
                className={cn(
                  "text-left p-4 w-full rounded-lg transition-all duration-300",
                  "hover:bg-primary/10 border border-transparent",
                  activeFeature === index
                    ? "bg-primary/20 border-primary/30 cyber-glow"
                    : "hover:border-primary/10"
                )}
                onClick={() => setActiveFeature(index)}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <h3 className="font-medium text-primary">{feature.title}</h3>
                </div>
              </button>
            ))}
          </div>

          {/* Feature showcase */}
          <div className="lg:col-span-2 bg-black/20 p-6 rounded-xl border border-primary/20 relative overflow-hidden min-h-[400px] flex items-center justify-center">
            {/* Animated background */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent z-0"></div>
              <div className="absolute w-full h-1 bottom-0 left-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
              <div className="absolute w-1 h-full top-0 right-0 bg-gradient-to-b from-transparent via-primary/30 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center p-8 max-w-md mx-auto">
              <span className="text-5xl mb-4 block">{features[activeFeature].icon}</span>
              <h3 className="text-2xl font-bold mb-4 cyber-text">{features[activeFeature].title}</h3>
              <p className="text-muted-foreground">{features[activeFeature].description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full bg-primary/10 blur-xl"></div>
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-secondary/10 blur-xl"></div>
    </section>
  );
}
