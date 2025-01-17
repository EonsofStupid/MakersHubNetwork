import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
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
  );
};