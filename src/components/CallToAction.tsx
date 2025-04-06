
import React from 'react';
import { Link } from 'react-router-dom';

export function CallToAction() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary/20 to-secondary/20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to start creating?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto text-muted-foreground">
          Join our community today and get access to thousands of 3D printing projects, tutorials, and resources.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/signup" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-md font-medium">
            Sign Up Free
          </Link>
          <Link to="/projects" className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-md font-medium">
            Browse Projects
          </Link>
        </div>
      </div>
    </section>
  );
}
