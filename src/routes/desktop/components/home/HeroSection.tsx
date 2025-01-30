import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary animate-gradient">
            Build. Share. Innovate.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join the community of DIY enthusiasts sharing knowledge, builds, and passion for 3D printing. 
            Create, customize, and collaborate on your next printer build.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-black font-bold group"
            >
              Start Building
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-secondary text-secondary hover:bg-secondary/10"
            >
              Explore Builds
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};