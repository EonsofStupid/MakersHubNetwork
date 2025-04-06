
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function FeaturedProjects() {
  const projects = [
    {
      id: 1,
      title: "Modular Desk Organizer",
      description: "A customizable organizer system for your workspace",
      author: "MakerJane",
      image: "https://placehold.co/300x200/005/fff?text=Desk+Organizer"
    },
    {
      id: 2,
      title: "Mechanical Keyboard Case",
      description: "Custom case for 60% mechanical keyboards",
      author: "KeyMaster",
      image: "https://placehold.co/300x200/500/fff?text=Keyboard+Case"
    },
    {
      id: 3,
      title: "Plant Watering System",
      description: "Automated watering system for house plants",
      author: "GreenThumb",
      image: "https://placehold.co/300x200/050/fff?text=Plant+System"
    }
  ];

  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {projects.map(project => (
            <div key={project.id} className="bg-background rounded-lg overflow-hidden shadow-md border border-muted">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">{project.title}</h3>
                <p className="text-muted-foreground mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">by {project.author}</span>
                  <Link to={`/projects/${project.id}`}>
                    <Button variant="outline" size="sm">View Details</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/projects">
            <Button>View All Projects</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
