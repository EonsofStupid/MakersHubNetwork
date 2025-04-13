
import React from 'react';
import { Button } from '@/shared/ui/button';

const AboutPage = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">About This Application</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          This application demonstrates a modular architecture with strict domain boundaries:
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li><strong>app/</strong> - Core application components and features</li>
          <li><strong>admin/</strong> - Administrative panels and tools</li>
          <li><strong>chat/</strong> - Chat functionality</li>
          <li><strong>auth/</strong> - Authentication and user management</li>
          <li><strong>rbac/</strong> - Role-based access control</li>
          <li><strong>logging/</strong> - Logging infrastructure</li>
          <li><strong>shared/</strong> - Shared utilities and types</li>
          <li><strong>bridges/</strong> - Communication between domains</li>
        </ul>
        
        <p className="mb-6">
          The architecture emphasizes clear boundaries between domains, with
          state management using Zustand globally and Jotai for local UI state.
        </p>
        
        <Button variant="default" asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default AboutPage;
