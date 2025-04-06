
import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-6">Welcome to Impulsivity</h1>
      <p className="text-xl mb-8">Your next-generation platform for digital innovation</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 rounded-lg border border-border bg-card hover:shadow-md transition-all">
          <h2 className="text-2xl font-semibold mb-3">Feature One</h2>
          <p>Experience the power of our platform with our amazing features.</p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card hover:shadow-md transition-all">
          <h2 className="text-2xl font-semibold mb-3">Feature Two</h2>
          <p>Discover new possibilities with our advanced tools and capabilities.</p>
        </div>
        <div className="p-6 rounded-lg border border-border bg-card hover:shadow-md transition-all">
          <h2 className="text-2xl font-semibold mb-3">Feature Three</h2>
          <p>Unlock your potential with our comprehensive solutions.</p>
        </div>
      </div>
    </div>
  );
}
