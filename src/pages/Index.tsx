import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="container px-4 py-24 mx-auto">
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
              className="p-6 rounded-lg bg-card animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
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