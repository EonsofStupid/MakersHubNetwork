import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Users, Building } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 bg-[#0F0A2E] z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0A2E] via-[#1A1242] to-[#0F0A2E] animate-gradient" />
        
        {/* Data Stream */}
        <div className="absolute inset-0 opacity-30">
          <div className="data-stream" />
        </div>
        
        {/* Dynamic Lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
      </div>

      <MainNav />
      
      {/* Content */}
      <div className="container px-4 py-24 mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-fade-up">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Build Your Dream 3D Printer
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Join the community of DIY enthusiasts sharing knowledge, builds, and passion for 3D printing
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Builds
            </Button>
          </div>
        </div>
        
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group p-6 rounded-lg bg-card/50 backdrop-blur-sm animate-fade-up hover:scale-105 transition-transform duration-300 ease-out"
              style={{ 
                animationDelay: `${i * 100}ms`,
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)'
              }}
            >
              <feature.icon 
                className={`h-12 w-12 mb-4 transition-colors duration-300 group-hover:${feature.hoverColor}`} 
              />
              <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 group-hover:${feature.textColor}`}>
                {feature.title}
              </h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    title: "Extensive Parts Database",
    description: "Access our curated database of 3D printer components with detailed specifications and compatibility information.",
    icon: Database,
    hoverColor: "text-[#FF00FF]",
    textColor: "text-[#FF1493]"
  },
  {
    title: "Community Builds",
    description: "Share your builds and learn from other makers in our growing community of DIY enthusiasts.",
    icon: Users,
    hoverColor: "text-[#00FFFF]",
    textColor: "text-[#39FF14]"
  },
  {
    title: "Build Guides",
    description: "Step-by-step guides and resources to help you build your custom 3D printer from scratch.",
    icon: Building,
    hoverColor: "text-[#9F00FF]",
    textColor: "text-[#FFFF33]"
  },
];

export default Index;