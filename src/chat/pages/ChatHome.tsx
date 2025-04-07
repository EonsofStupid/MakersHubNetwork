
import React from 'react';
import { Link } from '@tanstack/react-router';

export default function ChatHome() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Chat Home</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link 
          to="/chat/session/$sessionId"
          params={{ sessionId: "new" }}
          className="p-4 bg-card rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <h2 className="text-lg font-medium">Start New Chat</h2>
          <p className="text-muted-foreground">Begin a new conversation</p>
        </Link>
      </div>
    </div>
  );
}
