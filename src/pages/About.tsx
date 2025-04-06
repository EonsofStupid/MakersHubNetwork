
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6">About Impulse</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-xl mb-8">
          Impulse is a modern, flexible administration platform designed to streamline content management and user administration.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Our Mission</h2>
        <p>
          To provide a seamless, intuitive interface for managing digital content and user experiences, empowering organizations 
          to focus on their core business without wrestling with complex administrative tools.
        </p>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Key Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Role-based access control with granular permissions</li>
          <li>Visual page builder with live preview</li>
          <li>Comprehensive user management</li>
          <li>Content publishing workflow</li>
          <li>Theme customization</li>
          <li>Extensible plugin architecture</li>
          <li>Real-time collaboration tools</li>
          <li>Advanced analytics and reporting</li>
        </ul>
        
        <div className="mt-12">
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
