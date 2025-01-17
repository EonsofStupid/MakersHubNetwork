import { MainNav } from "@/components/MainNav";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, Users, Building } from "lucide-react";
import { CSSProperties } from "react";

// Define custom CSS properties interface
interface CustomCSSProperties extends CSSProperties {
  '--stream-duration': string;
}

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden pb-[400px]">
      {/* Enhanced Background System */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient with animation */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#0F0A2E] via-[#094B51] to-[#1A1F2C] bg-[length:400%_400%] animate-gradient"
        />
        
        {/* Animated grid overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(transparent_1px,_transparent_1px),_linear-gradient(to_right,_transparent_1px,_transparent_1px)] bg-[size:4rem_4rem] [background-position:center] opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(#00F0FF20 1px, transparent 1px),
              linear-gradient(to right, #00F0FF20 1px, transparent 1px)
            `,
          }}
        />

        {/* Digital Rain Effect - Horizontal Streams */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <div
              key={`h-stream-${i}`}
              className="absolute left-0 right-0 h-px bg-primary/30 animate-stream-horizontal"
              style={{
                top: `${Math.random() * 100}%`,
                '--stream-duration': `${15 + Math.random() * 10}s`,
                animationDelay: `-${Math.random() * 15}s`,
              } as CustomCSSProperties}
            >
              <div className="absolute inset-0 blur-sm bg-primary/50" />
            </div>
          ))}
        </div>

        {/* Digital Rain Effect - Vertical Streams */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(2)].map((_, colIndex) => (
            <div
              key={`col-${colIndex}`}
              className="absolute top-0 bottom-0 w-px"
              style={{ left: `${33 + colIndex * 33}%` }}
            >
              {[...Array(5)].map((_, i) => (
                <div
                  key={`v-stream-${colIndex}-${i}`}
                  className="absolute top-0 w-px h-32 bg-primary/30 animate-stream-vertical"
                  style={{
                    left: `${Math.random() * 200 - 100}px`,
                    '--stream-duration': `${8 + Math.random() * 7}s`,
                    animationDelay: `-${Math.random() * 8}s`,
                  } as CustomCSSProperties}
                >
                  <div className="absolute inset-0 blur-sm bg-primary/50" />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-24 h-24 opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${10 + i * 2}s ease-in-out infinite`,
                transform: `rotate(${45 * i}deg)`,
                background: `linear-gradient(45deg, ${i % 2 ? '#00F0FF' : '#FF2D6E'}, transparent)`,
                filter: 'blur(2px)',
                clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
              }}
            />
          ))}
        </div>

        {/* Vignette effect */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%)'
          }}
        />
      </div>

      <MainNav />
      
      <div className="container px-4 py-24 mx-auto relative">
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
              className="p-6 rounded-lg bg-card/50 backdrop-blur-sm animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

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

export default Index;
