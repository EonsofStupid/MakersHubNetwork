
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function FeaturedProjects() {
  // Hardcoded featured projects data
  const projects = [
    {
      id: 1,
      title: "Modular Desktop Organizer",
      image: "https://placehold.co/600x400/464646/FFFFFF/png?text=Desktop+Organizer",
      description: "A customizable organizer for all your desktop items",
      author: "MakerPro"
    },
    {
      id: 2,
      title: "Arduino Robot Frame",
      image: "https://placehold.co/600x400/464646/FFFFFF/png?text=Robot+Frame",
      description: "Build your own programmable robot with this frame",
      author: "TechCreator"
    },
    {
      id: 3,
      title: "Plant Self-Watering System",
      image: "https://placehold.co/600x400/464646/FFFFFF/png?text=Self-Watering+System",
      description: "Keep your plants hydrated with this smart system",
      author: "GreenThumb3D"
    }
  ];

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>by {project.author}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>{project.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Details</Button>
                <Button>Download</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const Button = ({ children, variant = "default" }: { children: React.ReactNode, variant?: "default" | "outline" }) => {
  return (
    <button 
      className={`px-4 py-2 rounded-md ${variant === "outline" 
        ? "border border-primary text-primary hover:bg-primary/10" 
        : "bg-primary text-primary-foreground hover:bg-primary/90"}`}
    >
      {children}
    </button>
  );
};
